/* eslint-disable @typescript-eslint/no-require-imports -- Node test harness transpiles TS without adding runtime dependencies. */
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const root = path.resolve(__dirname, '..')

function loader(overrides = {}) {
  const modules = new Map()
  function load(file) {
    const resolved = path.resolve(root, file)
    if (modules.has(resolved)) return modules.get(resolved)
    const exports = {}
    modules.set(resolved, exports)
    const code = ts.transpile(fs.readFileSync(resolved, 'utf8'), {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX,
    })
    vm.runInNewContext(code, {
      exports, process, console, URL, URLSearchParams, Response, AbortController,
      require(name) {
        if (name in overrides) return overrides[name]
        if (name.startsWith('@/') || name.startsWith('.')) {
          const base = name.startsWith('@/') ? path.join(root, 'src', name.slice(2)) : path.resolve(path.dirname(resolved), name)
          return load(fs.existsSync(`${base}.tsx`) ? `${base}.tsx` : `${base}.ts`)
        }
        return require(name)
      },
    }, { filename: resolved })
    return exports
  }
  return load
}
const puzzle = {
  id: 'forest', uuid: 'puzzle-id', slug: 'forest', title: 'Performance Forest',
  image_url: 'https://images.unsplash.com/forest.jpg', description: 'A quiet forest',
  piece_count: 100, difficulty: 'Easy', plays_count: 10, weekly_plays_count: 3,
  completions_count: 1, rating: 4.5, created_at: '2026-10-01', updated_at: '2026-10-01',
  category: 'Nature', category_slug: 'nature', challenge_id: 'daily-id',
}
const category = {
  id: 'nature', slug: 'nature', name: 'Nature', description: 'Quiet forests', image_url: puzzle.image_url,
  icon: 'trees', color: '#123456', dark_color: '#123456', puzzle_count: 60, parent_id: null,
}
const page = { puzzles: [puzzle], categoryTotal: 60, filteredTotal: 60 }
const ui = {
  '@/components/ui/SafeImage': { SafeImage: ({ src, alt }) => React.createElement('img', { src, alt }) },
  '@/components/home/ContinuePuzzleCard': { ContinuePuzzleCard: () => null },
  'next/link': { default: ({ href, children, ...props }) => React.createElement('a', { href, ...props }, children), __esModule: true },
  'next/navigation': { usePathname: () => '/category/nature', useRouter: () => ({}), useSearchParams: () => new URLSearchParams('page=2') },
  '@/lib/data/public': {},
}

test('home, category directory, category page 2, and every Explore mode render content before effects', () => {
  const load = loader(ui)
  const { HeroSection } = load('src/components/home/HeroSection.tsx')
  const hero = renderToStaticMarkup(React.createElement(HeroSection, { dailyPuzzle: puzzle }))
  assert.match(hero, /Performance Forest/)
  assert.match(hero, /forest\.jpg/)
  assert.doesNotMatch(hero, /Loading today/)
  const { CategoriesContent } = load('src/components/category/CategoriesContent.tsx')
  assert.match(renderToStaticMarkup(React.createElement(CategoriesContent, { initialCategories: [category] })), /60 puzzles/)
  const { CategoryContent } = load('src/components/category/CategoryContent.tsx')
  const html = renderToStaticMarkup(React.createElement(CategoryContent, { slug: 'nature', initialCategories: [category], initialPage: page, initialPageNumber: 2 }))
  assert.match(html, /Performance Forest/)
  assert.match(html, /aria-current="page"[^>]*>2</)
  const { ExploreListPage } = load('src/components/explore/ExploreListPage.tsx')
  for (const mode of ['weekly', 'all-time', 'trending']) {
    assert.match(renderToStaticMarkup(React.createElement(ExploreListPage, { mode, initialPuzzles: [puzzle] })), /Performance Forest/)
  }
})

test('category server entry loads page 2 directly and clamps out-of-range pages', async () => {
  const offsets = []
  const load = loader({
    '@/lib/data/server': {
      getCategories: async () => [category],
      getCategoryPuzzlePage: async (options) => { offsets.push(options.offset); return page },
    },
    '@/components/category/CategoryContent': { CategoryContent: () => null },
  })
  const Page = load('src/app/category/[slug]/page.tsx').default
  const second = await Page({ params: Promise.resolve({ slug: 'nature' }), searchParams: Promise.resolve({ page: '2' }) })
  assert.equal(second.props.initialPageNumber, 2)
  assert.equal(offsets[0], 24)
  const last = await Page({ params: Promise.resolve({ slug: 'nature' }), searchParams: Promise.resolve({ page: '999' }) })
  assert.equal(last.props.initialPageNumber, 3)
  assert.equal(offsets.at(-1), 48)
})

test('cached reads use anonymous client, 30-minute lifetime and distinct date, mode and filter arguments', async () => {
  const calls = []
  const configs = []
  const client = {}
  const load = loader({
    'server-only': {},
    react: { cache: (fn) => fn },
    'next/cache': { unstable_cache: (fn, keys, config) => { configs.push(config); return fn } },
    '@supabase/supabase-js': { createClient: (url, key, options) => { assert.equal(options.auth.persistSession, false); return client } },
    './public': {
      fetchCategories: async (_, options) => { calls.push(options); return [category] },
      fetchDailyPuzzle: async (date, options) => { calls.push([date, options]); return puzzle },
      fetchPuzzles: async (options, read) => { calls.push([options, read]); return [puzzle] },
      fetchCategoryPuzzlePage: async (options, read) => { calls.push([options, read]); return page },
    },
  })
  const data = load('src/lib/data/server.ts')
  await data.getCategories()
  assert.equal(calls[0].client, client)
  assert.equal(calls[0].strict, true)
  await data.getDailyPuzzle('2026-10-29')
  await data.getDailyPuzzle('2026-10-30')
  assert.equal(calls[1][0], '2026-10-29')
  assert.equal(calls[2][0], '2026-10-30')
  for (const mode of ['weekly', 'all-time', 'trending']) await data.getExplorePuzzles(mode)
  assert.deepEqual(calls.slice(3).map(([options]) => options.orderBy), ['weekly', 'plays', 'editor'])
  assert.ok(calls.slice(3).every(([options]) => options.limit === 96))
  const filters = { categorySlug: 'nature', difficulty: 'Easy', sort: 'rating', offset: 24 }
  await data.getCategoryPuzzlePage(filters)
  assert.equal(calls.at(-1)[0], filters)
  assert.ok(configs.every((config) => config.revalidate === 1800))
})

test('strict public reads reject database failures rather than caching empty content', async () => {
  const failure = { message: 'database unavailable', code: '08006' }
  const query = new Proxy({}, { get: (_, name) => name === 'then'
    ? (resolve) => Promise.resolve({ data: null, error: failure }).then(resolve)
    : () => query })
  const client = { from: () => query, rpc: () => query }
  const load = loader({ '@/lib/supabase': { supabase: client } })
  const data = load('src/lib/data/public.ts')
  for (const run of [
    () => data.fetchCategories(undefined, { client, strict: true }),
    () => data.fetchPuzzles({}, { client, strict: true }),
    () => data.fetchDailyPuzzle('2026-10-29', { client, strict: true }),
    () => data.fetchCategoryPuzzlePage({ categorySlug: 'nature' }, { client }),
  ]) await assert.rejects(run)
})

test('category endpoint validates filters and reports failures as 503, not an empty list', async () => {
  let options
  let failed = false
  const load = loader({ '@/lib/data/server': { getCategoryPuzzlePage: async (value) => {
    options = value
    if (failed) throw new Error('offline')
    return page
  } } })
  const { GET } = load('src/app/api/catalogue/category/[slug]/route.ts')
  const context = { params: Promise.resolve({ slug: 'nature' }) }
  const request = (query) => ({ url: `https://example.com/api/catalogue/category/nature?${query}` })
  const result = await GET(request('page=2&difficulty=Easy&pieces=medium&sort=rating'), context)
  assert.equal(result.status, 200)
  assert.equal(options.offset, 24)
  assert.equal(options.minPieces, 101)
  assert.equal(options.maxPieces, 200)
  assert.equal(options.difficulty, 'Easy')
  for (const query of ['page=-1', 'page=NaN', 'sort=invalid', 'difficulty=invalid', 'pieces=invalid']) {
    assert.equal((await GET(request(query), context)).status, 400)
  }
  failed = true
  assert.equal((await GET(request(''), context)).status, 503)
})
