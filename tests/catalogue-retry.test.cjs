/* eslint-disable @typescript-eslint/no-require-imports */
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')

function load(globals = {}) {
  const exports = {}
  const delays = [], logs = []
  vm.runInNewContext(ts.transpile(fs.readFileSync(path.join(__dirname, '../src/lib/data/read-with-retry.ts'), 'utf8'), {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
  }), { exports, setTimeout: (fn, ms) => { delays.push(ms); fn() }, console: { error: (...args) => logs.push(args) }, ...globals })
  return { ...exports, delays, logs }
}

test('transient failures retry with increasing backoff and recover without caching empty data', async () => {
  const { readWithRetry, delays, logs } = load()
  let attempts = 0
  const result = await readWithRetry(async () => {
    if (++attempts < 3) throw { message: 'TypeError: fetch failed', details: 'ENOTFOUND' }
    return ['fantasy']
  }, 'categories')
  assert.deepEqual(result, ['fantasy'])
  assert.deepEqual(delays, [500, 1500])
  assert.equal(logs.length, 0)
})

test('exhausted SDK errors expose network code and operation without logging URLs or credentials', async () => {
  const { readWithRetry, logs } = load()
  const failure = { message: 'TypeError: fetch failed', details: 'GET https://private.example?token=secret ETIMEDOUT' }
  await assert.rejects(readWithRetry(async () => { throw failure }, 'categories'), (error) => {
    assert.match(error.message, /ETIMEDOUT/)
    assert.equal(error.cause, failure)
    return true
  })
  assert.equal(logs[0][1].attempts, 3)
  assert.equal(logs[0][1].operation, 'categories')
  assert.doesNotMatch(JSON.stringify(logs), /private.example|secret/)
})

test('database permission failures are not retried and retain the original cause', async () => {
  const { readWithRetry, delays } = load()
  const failure = { message: 'permission denied', code: '42501' }
  await assert.rejects(readWithRetry(async () => { throw failure }), (error) => error.cause === failure)
  assert.equal(delays.length, 0)
})

test('transport wrapper retains nested connection codes before SDK serialization', async () => {
  const original = new TypeError('fetch failed', { cause: new AggregateError([
    Object.assign(new Error('connect failed'), { code: 'ETIMEDOUT' }),
    Object.assign(new Error('connect failed'), { code: 'ENETUNREACH' }),
  ]) })
  const { fetchCatalogue } = load({ fetch: async () => { throw original } })
  await assert.rejects(fetchCatalogue('https://example.com'), (error) => {
    assert.match(error.message, /ETIMEDOUT, ENETUNREACH/)
    assert.equal(error.cause, original)
    return true
  })
})

test('transport wrapper forwards request options and returns successful responses unchanged', async () => {
  const response = { status: 200 }, options = { headers: { apikey: 'test' } }
  const { fetchCatalogue } = load({ fetch: async (url, init) => {
    assert.equal(url, 'https://example.com')
    assert.equal(init, options)
    return response
  } })
  assert.equal(await fetchCatalogue('https://example.com', options), response)
})

test('error-page retry refreshes server data and resets the boundary in a transition', () => {
  const calls = [], exports = {}
  const js = ts.transpile(fs.readFileSync(path.join(__dirname, '../src/components/ui/CatalogueError.tsx'), 'utf8'), {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX,
  })
  vm.runInNewContext(js, { exports, require: (name) => name === 'react'
    ? { useTransition: () => [false, (fn) => { calls.push('transition'); fn() }] }
    : name === 'next/navigation' ? { useRouter: () => ({ refresh: () => calls.push('refresh') }) } : require(name) })
  const node = exports.default({ reset: () => calls.push('reset') })
  const button = node.props.children.find(child => child.type === 'button')
  button.props.onClick()
  assert.deepEqual(calls, ['transition', 'refresh', 'reset'])
})
