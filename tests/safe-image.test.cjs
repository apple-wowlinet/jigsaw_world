/* eslint-disable @typescript-eslint/no-require-imports */
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')

function harness(configured = true) {
  const exports = {}
  const imageUrls = {}
  vm.runInNewContext(ts.transpile(fs.readFileSync(path.join(__dirname, '../src/lib/images/urls.ts'), 'utf8'), {
    module: ts.ModuleKind.CommonJS,
  }), { exports: imageUrls, URL, process: { env: configured ? { NEXT_PUBLIC_CLOUDFLARE_IMAGE_ORIGIN: 'https://images.example.com' } : {} } })
  let failure = null
  const js = ts.transpile(fs.readFileSync(path.join(__dirname, '../src/components/ui/SafeImage.tsx'), 'utf8'), {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX,
  })
  vm.runInNewContext(js, {
    exports,
    require: (name) => name === '@/lib/images/urls' ? imageUrls : name === 'react'
      ? { useState: () => [failure, (value) => { failure = value }] }
      : name === 'next/image' ? { default: () => null, __esModule: true } : require(name),
  })
  return exports
}

test('optimizer failure retries the same puzzle image directly before showing a placeholder', () => {
  const { SafeImage } = harness()
  const fallback = { placeholder: true }
  const props = { src: 'https://img.spotdiffs.com/dogs.jpg', alt: 'Dogs', fallback }
  let image = SafeImage(props)
  assert.equal(image.props.src, props.src)
  assert.equal(image.props.unoptimized, false)
  image.props.onError({})
  image = SafeImage(props)
  assert.equal(image.props.src, props.src)
  assert.equal(image.props.unoptimized, true)
  image.props.onError({})
  assert.equal(SafeImage(props), fallback)
})

test('a new source immediately clears the previous image failure', () => {
  const { SafeImage } = harness()
  const old = { src: 'https://img.spotdiffs.com/old.jpg', fallback: 'placeholder' }
  SafeImage(old).props.onError({})
  SafeImage(old).props.onError({})
  assert.equal(SafeImage(old), 'placeholder')
  const image = SafeImage({ ...old, src: 'https://img.spotdiffs.com/new.jpg' })
  assert.equal(image.props.src, 'https://img.spotdiffs.com/new.jpg')
  assert.equal(image.props.unoptimized, false)
})

test('existing callers retain the fallback photo and stop retrying if it also fails', () => {
  const { SafeImage, IMAGE_FALLBACK_SRC } = harness()
  const props = { src: 'https://img.spotdiffs.com/missing.jpg' }
  SafeImage(props).props.onError({})
  SafeImage(props).props.onError({})
  const fallback = SafeImage(props)
  assert.equal(fallback.props.src, IMAGE_FALLBACK_SRC)
  fallback.props.onError({})
  assert.equal(SafeImage(props).props.src, IMAGE_FALLBACK_SRC)
})

test('already unoptimized images go straight to the supplied fallback on error', () => {
  const { SafeImage } = harness()
  let errors = 0
  const props = { src: 'blob:local-image', unoptimized: true, fallback: 'placeholder', onError: () => { errors++ } }
  SafeImage(props).props.onError({})
  assert.equal(SafeImage(props), 'placeholder')
  assert.equal(errors, 1)
})

test('missing Cloudflare configuration explicitly bypasses the loader and immediately uses fallback after failure', () => {
  const { SafeImage } = harness(false)
  const props = { src: 'https://img.spotdiffs.com/jigsaw/cute-kittens-2048.webp', fallback: 'placeholder' }
  const image = SafeImage(props)
  assert.equal(image.props.src, props.src)
  assert.equal(image.props.unoptimized, true)
  image.props.onError({})
  assert.equal(SafeImage(props), 'placeholder')
})

test('local assets and unsupported remote sources bypass the Cloudflare loader', () => {
  for (const src of ['/images/logo.png', 'https://other.example/photo.jpg', 'blob:upload', 'data:image/png;base64,AAA']) {
    const { SafeImage } = harness()
    assert.equal(SafeImage({ src }).props.unoptimized, true)
  }
})
