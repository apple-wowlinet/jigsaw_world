/* eslint-disable @typescript-eslint/no-require-imports */
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
const root = path.resolve(__dirname, '..')
const src = 'https://img.spotdiffs.com/dogs.jpg?version=2&name=a%20b'
const origin = 'https://images.example.com'

function load(file, globals = {}, imports = {}) {
  const exports = {}
  vm.runInNewContext(ts.transpile(fs.readFileSync(path.join(root, file), 'utf8'), {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020,
  }), {
    exports, process: { env: {} }, URL, URLSearchParams, Response, AbortSignal, Buffer,
    require: (name) => imports[name] ?? require(name), ...globals,
  })
  return exports
}
const urls = load('src/lib/images/urls.ts')

test('Cloudflare URLs preserve source queries, use stable dimensions and bypass local assets', () => {
  const transformed = urls.getResizedImageUrl({ src, width: 640 }, origin)
  assert.equal(transformed, `${origin}/cdn-cgi/image/width=640,quality=75,fit=scale-down,format=auto/${src}`)
  assert.match(urls.getResizedImageUrl({ src, width: 9999, quality: 101 }, origin), /width=3840,quality=100/)
  for (const value of ['/logo.png', 'data:image/png;base64,AAA', 'blob:local', 'https://unlisted.example/image.jpg']) {
    assert.equal(urls.getResizedImageUrl({ src: value, width: 640 }, origin), value)
  }
  assert.equal(urls.getResizedImageUrl({ src, width: 640 }), src, 'no configuration must not use Vercel')
  for (const value of ['http://images.example.com', origin + '/path', origin + '?x=1', 'https://user:pass@images.example.com']) {
    assert.throws(() => urls.getResizedImageUrl({ src, width: 640 }, value), /HTTPS origin/)
  }
  assert.equal(new URL(urls.getCanvasImageUrl(src), 'https://app.example').searchParams.get('url'), src)
})

test('global Next image loader uses exactly 960px for every display size and pixel density', () => {
  const configModule = { exports: {} }
  vm.runInNewContext(fs.readFileSync(path.join(root, 'next.config.js'), 'utf8'), {
    module: configModule, process: { env: { NEXT_PUBLIC_CLOUDFLARE_IMAGE_ORIGIN: origin } },
  })
  const config = configModule.exports.images
  assert.equal(config.unoptimized, false)
  assert.equal(config.loader, 'custom')
  const loader = load(config.loaderFile, {}, { './urls': { getResizedImageUrl: (props) => urls.getResizedImageUrl(props, origin) } }).default
  const { getImgProps } = require('next/dist/shared/lib/get-img-props')
  const { imageConfigDefault } = require('next/dist/shared/lib/image-config')
  for (const sizes of ['25vw', '100vw', '132px', '(max-width: 1024px) 100vw, 58vw']) {
    const { props } = getImgProps({ src, alt: 'Dogs', fill: true, sizes }, {
      defaultLoader: loader,
      imgConf: { ...imageConfigDefault, ...config },
    })
    assert.equal(props.srcSet, `${urls.getResizedImageUrl({ src, width: 960 }, origin)} 960w`)
    assert.equal(props.src, urls.getResizedImageUrl({ src, width: 960 }, origin))
    assert.doesNotMatch(props.srcSet, /\/_next\/image/)
  }
})

function route(fetch) {
  return load('src/app/api/puzzle-image/route.ts', { fetch }, {
    '@/lib/images/urls': {
      ...urls,
    },
  }).GET
}
const request = (value = src) => new Request('https://app.example/api/puzzle-image?' + new URLSearchParams({ url: value }))
const image = () => new Response(new Uint8Array([1, 2, 3]), { headers: { 'Content-Type': 'image/webp' } })

test('canvas proxy returns original image bytes without resizing or recompression', async () => {
  let target
  const GET = route(async (url, options) => {
    target = url
    assert.equal(options.redirect, 'error')
    assert.ok(options.signal)
    return image()
  })
  const response = await GET(request())
  assert.equal(target, src)
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('Content-Type'), 'image/webp')
  assert.match(response.headers.get('Cache-Control'), /s-maxage=86400/)
  assert.deepEqual([...new Uint8Array(await response.arrayBuffer())], [1, 2, 3])
})

test('canvas proxy reports source failures without trying image transformations', async () => {
  for (const failure of ['http', 'network']) {
    const calls = []
    const GET = route(async (url) => {
      calls.push(url)
      if (failure === 'network') throw new Error('offline')
      return new Response('error', { status: 404 })
    })
    const response = await GET(request())
    assert.equal(response.status, 502)
    assert.equal(response.headers.get('Cache-Control'), 'no-store')
    assert.deepEqual(calls, [src])
  }
})

test('canvas proxy rejects unsupported sources and never caches failed or non-image responses', async () => {
  const GET = route(async () => { throw new Error('must not fetch') })
  for (const value of ['https://localhost/image.jpg', 'http://img.spotdiffs.com/image.jpg', 'https://img.spotdiffs.com.evil.example/x', 'https://user:pass@img.spotdiffs.com/x', 'https://img.spotdiffs.com:999/x', '/image.jpg']) {
    assert.equal((await GET(request(value))).status, 400)
  }
  for (const content of ['text/html', 'image/svg+xml']) {
    const failure = await route(async () => new Response('bad', { headers: { 'Content-Type': content } }))(request())
    assert.equal(failure.status, 502)
    assert.equal(failure.headers.get('Cache-Control'), 'no-store')
  }
})

test('Next globally bypasses the custom loader when Cloudflare is not configured', () => {
  const configModule = { exports: {} }
  vm.runInNewContext(fs.readFileSync(path.join(root, 'next.config.js'), 'utf8'), {
    module: configModule, process: { env: {} },
  })
  const { getImgProps } = require('next/dist/shared/lib/get-img-props')
  const { imageConfigDefault } = require('next/dist/shared/lib/image-config')
  let loaderCalled = false
  const { props } = getImgProps({ src, alt: 'Kittens', fill: true }, {
    defaultLoader: () => { loaderCalled = true; return src },
    imgConf: { ...imageConfigDefault, ...configModule.exports.images },
  })
  assert.equal(props.src, src)
  assert.equal(props.srcSet, undefined)
  assert.equal(loaderCalled, false)
})
