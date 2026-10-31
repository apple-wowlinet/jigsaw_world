// Run with: node --test scripts/verify-contact.mjs
// Mock Supabase: no real database writes.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const nativeRequire = createRequire(import.meta.url)
const scriptDir = path.dirname(fileURLToPath(import.meta.url))

function load(file, overrides = {}, globals = {}) {
  const compiledModule = { exports: {} }
  const code = ts.transpileModule(fs.readFileSync(path.join(scriptDir, '..', file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  vm.runInNewContext(code, {
    module: compiledModule, exports: compiledModule.exports, Buffer, AbortSignal, Date, URL, console: { error() {} },
    process: { env: { SUPABASE_SERVICE_ROLE_KEY: 'test-key' } },
    require: name => name in overrides ? overrides[name] : nativeRequire(name), ...globals,
  }, { filename: file })
  return compiledModule.exports
}
const contact = load('src/lib/contact.ts')
const valid = { id: '5e11c930-64a2-4527-b632-6d34d5e3f2ba', name: ' Alice ', email: 'ALICE@example.com', message: ' Help please ' }
const next = { NextResponse: { json: (body, options = {}) => ({ body, status: options.status || 200, headers: options.headers || {} }) } }
function request(body, headers = {}) {
  const req = new Request('https://example.com/api/contact', { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body), headers: { host: 'example.com', ...headers } })
  req.nextUrl = new URL(req.url)
  return req
}
function route(result, reject = false) {
  let calls = 0
  const api = load('src/app/api/contact/route.ts', {
    'next/server': next, '@/lib/contact': contact,
    '@/lib/supabase-admin': { createSupabaseAdminClient: () => ({ rpc: async () => { calls++; return { data: result, error: reject ? new Error('offline') : null } } }) },
  })
  return { ...api, calls: () => calls }
}

test('normalizes input and rejects malformed, blank, oversized and invalid-email submissions', () => {
  const input = contact.parseContactInput(valid)
  assert.equal(input.name, 'Alice')
  assert.equal(input.email, 'alice@example.com')
  assert.equal(input.message, 'Help please')
  for (const payload of [null, [], {}, { ...valid, name: '  ' }, { ...valid, message: ' ' }, { ...valid, email: 'a@b' }, { ...valid, id: 'bad' }, { ...valid, message: 'x'.repeat(5001) }]) {
    assert.throws(() => contact.parseContactInput(payload))
  }
})
test('does not save cross-origin, invalid JSON, or oversized streamed body', async () => {
  const api = route('accepted')
  assert.equal((await api.POST(request(valid, { origin: 'https://evil.example' }))).status, 403)
  assert.equal((await api.POST(request('{'))).status, 400)
  assert.equal((await api.POST(request('x'.repeat(40001)))).status, 413)
  assert.equal(api.calls(), 0)
})
test('same-origin requests work even if Next normalizes its internal URL hostname', async () => {
  const req = request(valid, { origin: 'https://example.com' })
  req.nextUrl = new URL('http://localhost:3000/api/contact')
  assert.equal((await route('accepted').POST(req)).status, 201)
})
test('database save alone determines success, without mail configuration', async () => {
  for (const [result, status] of [['rate_limited', 429], ['conflict', 409], ['unexpected', 503]]) {
    const response = await route(result).POST(request(valid))
    assert.equal(response.status, status)
    if (status === 429) assert.equal(response.headers['Retry-After'], '600')
  }
  assert.equal((await route(null, true).POST(request(valid))).status, 503)
  const response = await route('accepted').POST(request(valid))
  assert.equal(response.status, 201)
  assert.equal(response.body.id, valid.id)
})
