/* eslint-disable @typescript-eslint/no-require-imports */
// PGLITE_MODULE_PATH=/absolute/path/to/@electric-sql/pglite node --test tests/game-session-clock.test.cjs
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
let PGlite
try { ({ PGlite } = require(process.env.PGLITE_MODULE_PATH || '@electric-sql/pglite')) } catch { /* optional SQL runtime */ }

test('pause RPC sends explicit pause/resume state and propagates failures', async () => {
  const exports = {}
  let error = null
  const calls = []
  const supabase = { rpc: async (name, args) => { calls.push([name, args]); return { error } } }
  const js = ts.transpile(fs.readFileSync(path.join(__dirname, '../src/lib/game-sessions.ts'), 'utf8'), { module: ts.ModuleKind.CommonJS })
  vm.runInNewContext(js, { exports, require: () => ({ supabase }) })
  await exports.setGameSessionPaused('session', true)
  await exports.setGameSessionPaused('session', false)
  assert.equal(JSON.stringify(calls), JSON.stringify([
    ['set_game_session_paused', { p_session_id: 'session', p_paused: true }],
    ['set_game_session_paused', { p_session_id: 'session', p_paused: false }],
  ]))
  error = new Error('offline')
  await assert.rejects(exports.setGameSessionPaused('session', true), /offline/)
})

// Execute the production callbacks with a controlled clock and RPCs. This keeps
// the regression focused on elapsed time and request ordering without a browser.
function clockHarness(rpc) {
  const source = fs.readFileSync(path.join(__dirname, '../src/app/play/[slug]/page.tsx'), 'utf8')
  const ast = ts.createSourceFile('page.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const names = ['currentElapsed', 'startClock', 'pauseClock', 'syncServerClock', 'submitCompletion', 'handleComplete', 'togglePause']
  const declarations = []
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && names.includes(node.name.getText(ast))) {
      declarations.push(`const ${node.getText(ast)};`)
    }
    ts.forEachChild(node, visit)
  }
  visit(ast)
  const ref = (current) => ({ current })
  const state = {
    now: 0, timer: 0, isPlaying: false, moves: 0, puzzleId: 'puzzle', result: null,
    timerStartRef: ref(0), timerLockedRef: ref(0), timerRunningRef: ref(false),
    serverSessionRef: ref(null), serverStartRef: ref(null), serverAttemptRef: ref(0),
    serverClockQueueRef: ref(Promise.resolve()), gameRef: ref(null),
    performance: { now: () => state.now }, useCallback: (fn) => fn,
    setTimer: (value) => { state.timer = value },
    setIsPlaying: (value) => { state.isPlaying = value },
    setRecordingState: (value) => { state.recordingState = value },
    setServerResult: (value) => { state.result = value },
    setMoves: () => {}, setProgress: () => {}, setIsCompleted: () => {},
    clearPuzzleSaves: () => {}, flushSave: () => {}, console,
    ...rpc,
  }
  const js = ts.transpile(declarations.join('\n') + `\nthis.callbacks = { ${names.join(',')} };`, { target: ts.ScriptTarget.ES2020 })
  vm.runInNewContext(js, state)
  return state
}

test('visible timer and completion exclude a long pause', () => {
  const state = clockHarness({})
  state.callbacks.startClock()
  state.now = 8_000
  state.callbacks.togglePause()
  assert.equal(state.timer, 8)
  state.now = 68_000
  assert.equal(state.callbacks.currentElapsed(), 8)
  state.callbacks.togglePause()
  state.now = 75_000
  state.callbacks.handleComplete()
  assert.equal(state.timer, 15)
  state.now = 100_000
  assert.equal(state.callbacks.currentElapsed(), 15)
})

test('pending start and slow pause RPC preserve pause/resume/finish order', async () => {
  let resolveStart, resolvePause
  const calls = []
  const state = clockHarness({
    setGameSessionPaused: async (id, paused) => {
      calls.push([id, paused])
      if (calls.length === 1) await new Promise((resolve) => { resolvePause = resolve })
    },
    completeGameSession: async (id) => {
      calls.push([id, 'complete'])
      return { completion_time: 15, moves: 30, ranked: true }
    },
  })
  state.serverStartRef.current = new Promise((resolve) => { resolveStart = resolve })
  state.callbacks.startClock()
  state.now = 8_000
  state.callbacks.togglePause()
  state.now = 68_000
  state.callbacks.togglePause()
  state.now = 75_000
  state.callbacks.handleComplete()
  assert.equal(calls.length, 0)
  resolveStart('session')
  await new Promise(setImmediate)
  assert.deepEqual(calls, [['session', true]])
  resolvePause()
  await new Promise(setImmediate)
  assert.deepEqual(calls, [['session', true], ['session', false], ['session', true], ['session', 'complete']])
  assert.equal(state.timer, 15)
  assert.equal(state.result.completion_time, 15)
})

test('server excludes multiple pauses and finalization wait from completion, stars and records', {
  skip: !PGlite && 'Set PGLITE_MODULE_PATH to run PostgreSQL integration tests',
}, async () => {
  const db = new PGlite()
  const user = '10000000-0000-0000-0000-000000000001'
  const puzzle = '20000000-0000-0000-0000-000000000002'
  try {
    await db.exec(`
      CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
      CREATE SCHEMA auth;
      CREATE TABLE auth.users (id uuid PRIMARY KEY, raw_user_meta_data jsonb, email text);
      CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS
        $$ SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      GRANT USAGE ON SCHEMA auth TO anon, authenticated;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO anon, authenticated, service_role;
    `)
    const directory = path.join(__dirname, '../supabase/migrations')
    for (const file of fs.readdirSync(directory).filter(f => /^0\d\d_.*\.sql$/.test(f)).sort()) {
      await db.exec(fs.readFileSync(path.join(directory, file), 'utf8').replace('CREATE EXTENSION IF NOT EXISTS pgcrypto;', ''))
    }
    await db.query('INSERT INTO auth.users VALUES ($1, $2, $3)', [user, '{}', 'test@example.com'])
    await db.query('INSERT INTO public.puzzles (id,title,slug,image_url,publish_at) VALUES ($1,$2,$2,$2,now())', [puzzle, 'clock-test'])
    await db.query("SELECT set_config('request.jwt.claim.sub', $1, false)", [user])
    const start = async () => (await db.query('SELECT public.start_game_session($1,24,false,null) AS id', [puzzle])).rows[0].id
    const pause = (id, value) => db.query('SELECT public.set_game_session_paused($1,$2)', [id, value])
    const row = async (id) => (await db.query('SELECT * FROM public.game_sessions WHERE id=$1', [id])).rows[0]
    const complete = async (id) => (await db.query('SELECT public.complete_game_session($1,30) AS result', [id])).rows[0].result
    const id = await start()
    await pause(id, true)
    const firstPause = (await row(id)).paused_at
    await pause(id, true)
    assert.equal((await row(id)).paused_at.toISOString(), firstPause.toISOString(), 'duplicate pause must not restart the pause')
    // Advance a minute of paused time without a real wait.
    await db.query("UPDATE public.game_sessions SET started_at=clock_timestamp()-interval '70 seconds', paused_at=clock_timestamp()-interval '60 seconds' WHERE id=$1", [id])
    await pause(id, false)
    const duration = (await row(id)).paused_duration
    await pause(id, false)
    assert.deepEqual((await row(id)).paused_duration, duration, 'duplicate resume must not double-count')
    await pause(id, true)
    // Simulate a second pause and delayed completion request: 500 wall seconds,
    // 60 in earlier pauses, 30 in the final pause => 410 active seconds.
    await db.query("UPDATE public.game_sessions SET started_at=clock_timestamp()-interval '500 seconds', paused_duration=interval '60 seconds', paused_at=clock_timestamp()-interval '30 seconds' WHERE id=$1", [id])
    await db.exec('SET ROLE authenticated')
    const result = await complete(id)
    assert.equal(result.completion_time, 410)
    assert.deepEqual(await complete(id), result, 'completion retry must return the saved result')
    await assert.rejects(pause(id, false), /Active game session was not found/)
    await db.exec('RESET ROLE')
    const stats = (await db.query('SELECT total_time_seconds,total_completions FROM public.user_stats WHERE user_id=$1', [user])).rows[0]
    assert.equal(Number(stats.total_time_seconds), 410)
    assert.equal(stats.total_completions, 1)
    assert.equal((await db.query('SELECT best_time FROM public.user_best_records WHERE user_id=$1', [user])).rows[0].best_time, 410)
    assert.equal(result.stars, (await db.query('SELECT public.calculate_game_stars(410,30,24) AS stars')).rows[0].stars)
    // A session completed while running still uses wall time minus prior pauses.
    const running = await start()
    await db.query("UPDATE public.game_sessions SET started_at=clock_timestamp()-interval '100 seconds', paused_duration=interval '60 seconds' WHERE id=$1", [running])
    assert.ok(Math.abs((await complete(running)).completion_time - 40) <= 1)
    const unpaused = await start()
    await db.query("UPDATE public.game_sessions SET started_at=clock_timestamp()-interval '100 seconds' WHERE id=$1", [unpaused])
    assert.ok(Math.abs((await complete(unpaused)).completion_time - 100) <= 1)
    const unauthorized = await start()
    await db.query("SELECT set_config('request.jwt.claim.sub', '30000000-0000-0000-0000-000000000003', false)")
    await assert.rejects(pause(unauthorized, true), /Active game session was not found/)
    await db.exec('SET ROLE anon')
    await assert.rejects(pause(unauthorized, true), /permission denied/)
  } finally {
    await db.close()
  }
})
