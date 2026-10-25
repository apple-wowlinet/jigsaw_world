/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS harness runs with Node directly and compiles the TypeScript modules under test. */
// Run: node --test tests/leaderboard.test.cjs
// For SQL tests, install @electric-sql/pglite separately and set PGLITE_MODULE_PATH
// to its absolute package path. No project runtime dependency is required.
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
const root = path.resolve(__dirname, '..')

function loadTs(file, imports) {
  const exports = {}
  const js = ts.transpile(fs.readFileSync(path.join(root, file), 'utf8'), {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX,
  })
  vm.runInNewContext(js, { exports, require: (name) => imports[name] ?? require(name) })
  return exports
}
const response = {
  period: 'daily', periodStart: '2026-10-25T00:00:00Z', periodEnd: '2026-10-26T00:00:00Z', totalPlayers: 1,
  entries: [{ rank: 1, userId: 'user', username: 'Jack Qin', avatarUrl: null, totalPieces: 72, completedPuzzles: 2, totalTimeSeconds: 293 }],
}

test('queries the chosen period and top 50; propagates RPC errors', async () => {
  let error = null
  let args
  const { fetchLeaderboard } = loadTs('src/lib/leaderboard.ts', {
    '@/lib/supabase': { supabase: { rpc: async (name, params) => { args = { name, params }; return { data: response, error } } } },
  })
  assert.equal((await fetchLeaderboard('daily')).entries[0].totalPieces, 72)
  assert.equal(args.name, 'get_global_leaderboard')
  assert.equal(args.params.p_period, 'daily')
  assert.equal(args.params.p_limit, 50)
  error = new Error('offline')
  await assert.rejects(fetchLeaderboard('daily'), /offline/)
})

test('accepts a genuine empty board but rejects malformed or mismatched results', async () => {
  let data = { ...response, entries: [], totalPlayers: 0 }
  const { fetchLeaderboard } = loadTs('src/lib/leaderboard.ts', {
    '@/lib/supabase': { supabase: { rpc: async () => ({ data, error: null }) } },
  })
  assert.equal((await fetchLeaderboard('daily')).entries.length, 0)
  for (const invalid of [null, {}, { ...response, period: 'weekly' }, { ...response, periodStart: 'invalid' }, { ...response, periodEnd: response.periodStart }, { ...response, entries: [{ ...response.entries[0], totalPieces: -1 }] }]) {
    data = invalid
    await assert.rejects(fetchLeaderboard('daily'), /Invalid leaderboard response/)
  }
  data = { ...response, period: 'all', periodStart: null, periodEnd: null }
  assert.equal((await fetchLeaderboard('all')).entries.length, 1)
})

test('avatars show the picture first, fall back on error or missing URL, and retry a new URL', () => {
  let failed = null
  const { UserAvatar } = loadTs('src/components/ui/UserAvatar.tsx', {
    react: { useState: () => [failed, (value) => { failed = value }] },
    '@/lib/utils': { cn: (...values) => values.filter(Boolean).join(' ') },
  })
  const findImg = (node) => !node || typeof node !== 'object' ? null
    : node.type === 'img' ? node : [node.props?.children].flat(Infinity).map(findImg).find(Boolean)
  const props = { name: 'Jack Qin', avatarUrl: 'https://example.com/avatar.png' }
  const image = findImg(UserAvatar(props))
  assert.equal(image.props.src, props.avatarUrl)
  image.props.onError()
  assert.equal(UserAvatar(props).props.children, 'JQ')
  assert.equal(UserAvatar({ ...props, avatarUrl: null }).props.children, 'JQ')
  assert.equal(findImg(UserAvatar({ ...props, avatarUrl: 'https://example.com/new.png' })).props.src, 'https://example.com/new.png')
})

let PGlite
try { ({ PGlite } = require(process.env.PGLITE_MODULE_PATH || '@electric-sql/pglite')) } catch { /* optional isolated SQL runtime */ }
test('PostgreSQL aggregation, UTC boundaries, deduplication, ties and public access', { skip: !PGlite && 'Install @electric-sql/pglite and set PGLITE_MODULE_PATH to run SQL integration checks' }, async () => {
  const db = new PGlite()
  try {
    await db.exec(`
      CREATE ROLE anon; CREATE ROLE authenticated;
      CREATE SCHEMA auth;
      CREATE TABLE auth.users (id uuid PRIMARY KEY, raw_user_meta_data jsonb);
      CREATE TABLE public.puzzles (id uuid PRIMARY KEY, is_active boolean, publish_at timestamptz);
      CREATE TABLE public.game_sessions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES auth.users,
        puzzle_id uuid REFERENCES public.puzzles, piece_count integer, completion_time integer,
        completed_at timestamptz, started_at timestamptz, status text DEFAULT 'completed',
        progress_percent integer DEFAULT 100, rotation_enabled boolean DEFAULT false
      );
    `)
    await db.exec(fs.readFileSync(path.join(root, 'supabase/migrations/015_global_leaderboard.sql'), 'utf8'))
    await db.exec("BEGIN; SET LOCAL TIME ZONE 'Pacific/Honolulu';")
    const ids = [1, 2, 3, 4].map((n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`)
    const puzzles = [11, 12, 13].map((n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`)
    for (const id of ids) await db.query('INSERT INTO auth.users VALUES ($1, $2)', [id, JSON.stringify({ full_name: 'Jack Qin', picture: 'https://example.com/a.png' })])
    for (const id of puzzles) await db.query("INSERT INTO public.puzzles VALUES ($1, true, now() - interval '1 year')", [id])
    async function add(user, puzzle, pieces, time, at = 'now()', rotated = false) {
      await db.query(`INSERT INTO public.game_sessions (user_id, puzzle_id, piece_count, completion_time, completed_at, started_at, rotation_enabled)
        VALUES ($1, $2, $3, $4, ${at}, (${at}) - interval '1 hour', $5)`, [ids[user], puzzles[puzzle], pieces, time, rotated])
    }
    const get = async (period = 'all', limit = 50) => (await db.query('SELECT public.get_global_leaderboard($1,$2) AS result', [period, limit])).rows[0].result
    await add(0, 0, 24, 300); await add(0, 0, 24, 200); await add(0, 0, 48, 400)
    await add(1, 0, 24, 100); await add(2, 0, 24, 100); await add(3, 0, 24, 110)
    let board = await get()
    assert.equal(board.totalPlayers, 4)
    assert.deepEqual(board.entries.map((e) => e.rank), [1, 2, 2, 4])
    assert.equal(board.entries[0].totalPieces, 72)
    assert.equal(board.entries[0].completedPuzzles, 2)
    assert.equal(board.entries[0].totalTimeSeconds, 600)
    assert.equal(board.entries[0].username, 'Jack Qin')
    assert.equal(board.entries[0].avatarUrl, 'https://example.com/a.png')
    assert.equal((await get('all', 1)).entries.length, 1)
    assert.equal((await get('all', 1)).totalPlayers, 4)
    // Same pieces, but more distinct puzzle/tier completions wins.
    await add(1, 1, 24, 100); await add(1, 2, 24, 100)
    assert.equal((await get()).entries[0].userId, ids[1])
    await db.exec('TRUNCATE public.game_sessions')
    await add(0, 0, 24, 50, "now() - interval '100 days'")
    await add(0, 0, 24, 200)
    assert.equal((await get()).entries[0].totalTimeSeconds, 50)
    for (const period of ['daily', 'weekly', 'monthly']) {
      assert.equal((await get(period)).entries[0].totalTimeSeconds, 200)
      const unit = { daily: 'day', weekly: 'week', monthly: 'month' }[period]
      const start = `(date_trunc('${unit}', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC')`
      await db.exec('TRUNCATE public.game_sessions')
      await add(0, 0, 24, 100, start)
      await add(1, 0, 24, 100, `(${start}) - interval '1 microsecond'`)
      board = await get(period)
      assert.equal(board.totalPlayers, 1)
      assert.equal(board.entries[0].userId, ids[0])
      assert.equal(new Date(board.periodStart).getUTCHours(), 0)
      if (period === 'weekly') assert.equal(new Date(board.periodStart).getUTCDay(), 1)
      if (period === 'monthly') assert.equal(new Date(board.periodStart).getUTCDate(), 1)
      await db.exec('TRUNCATE public.game_sessions')
      await add(0, 0, 24, 50, "now() - interval '100 days'")
      await add(0, 0, 24, 200)
    }
    await db.exec('TRUNCATE public.game_sessions')
    await add(0, 0, 500, 100, 'now()', true)
    await db.query('UPDATE public.puzzles SET is_active = false WHERE id = $1', [puzzles[1]])
    await add(1, 1, 500, 100)
    await db.query("UPDATE public.puzzles SET publish_at = now() + interval '1 day' WHERE id = $1", [puzzles[2]])
    await add(2, 2, 500, 100)
    assert.equal((await get()).totalPlayers, 0)
    await add(3, 0, 24, 100)
    await db.exec('SET LOCAL ROLE anon')
    assert.equal((await get()).totalPlayers, 1)
    await db.exec('RESET ROLE')
    for (const [period, limit] of [['invalid', 50], [null, 50], ['all', 0], ['all', 101]]) {
      await db.exec('SAVEPOINT invalid_input')
      await assert.rejects(get(period, limit))
      await db.exec('ROLLBACK TO SAVEPOINT invalid_input')
    }
    await db.exec('ROLLBACK')
  } finally { await db.close() }
})
