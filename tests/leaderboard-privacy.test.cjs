/* eslint-disable @typescript-eslint/no-require-imports */
// PGLITE_MODULE_PATH=/absolute/path/to/@electric-sql/pglite node --test tests/leaderboard-privacy.test.cjs
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
let PGlite
try { ({ PGlite } = require(process.env.PGLITE_MODULE_PATH || '@electric-sql/pglite')) } catch { /* optional test runtime */ }
const vm = require('node:vm')
const ts = require('typescript')
const directory = path.join(__dirname, '../supabase/migrations')

test('puzzle leaderboard uses the bounded RPC and propagates errors', async () => {
  const exports = {}
  let result = { data: [{ rank: 1, user_id: 'player-id', username: 'Alias', avatar_url: null, score_value: 60 }], error: null }
  let call
  const supabase = { rpc: async (name, args) => { call = { name, args }; return result } }
  const js = ts.transpile(fs.readFileSync(path.join(__dirname, '../src/lib/data/public.ts'), 'utf8'), {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020,
  })
  vm.runInNewContext(js, { exports, require: () => ({ supabase }), console })
  const entries = await exports.fetchPuzzleLeaderboard('puzzle-id', 24, 5)
  assert.equal(call.name, 'get_puzzle_leaderboard')
  assert.equal(call.args.p_puzzle_id, 'puzzle-id')
  assert.equal(call.args.p_piece_count, 24)
  assert.equal(call.args.p_limit, 5)
  assert.equal(entries[0].username, 'Alias')
  assert.equal(entries[0].timeSeconds, 60)
  result = { data: [], error: null }
  assert.equal((await exports.fetchPuzzleLeaderboard('puzzle-id', 24)).length, 0)
  result = { data: null, error: new Error('denied') }
  await assert.rejects(exports.fetchPuzzleLeaderboard('puzzle-id', 24), /denied/)
})

const user = '10000000-0000-0000-0000-000000000001'
const other = '20000000-0000-0000-0000-000000000002'
const puzzle = '30000000-0000-0000-0000-000000000003'

test('migration closes auth views, preserves bounded boards, isolates private records and syncs aliases', { skip: !PGlite && 'Set PGLITE_MODULE_PATH to run PostgreSQL integration tests' }, async () => {
  const db = new PGlite()
  try {
    await db.exec(`
      CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
      CREATE SCHEMA auth;
      CREATE TABLE auth.users (id uuid PRIMARY KEY, raw_user_meta_data jsonb, email text);
      CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS
        $$ SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      GRANT USAGE ON SCHEMA auth TO anon, authenticated;
      GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO anon, authenticated, service_role;
    `)
    for (const file of fs.readdirSync(directory).filter(f => /^0(0[2-9]|1[0-5])_.*\.sql$/.test(f)).sort()) {
      // PGlite includes core gen_random_uuid; it does not ship pgcrypto.
      await db.exec(fs.readFileSync(path.join(directory, file), 'utf8').replace('CREATE EXTENSION IF NOT EXISTS pgcrypto;', ''))
    }
    await db.query('INSERT INTO auth.users VALUES ($1, $2, $3)', [user, JSON.stringify({ full_name: 'Private Real Name', name: 'Private Name', picture: 'https://example.com/a.png' }), 'secret@example.com'])
    await db.query('INSERT INTO public.puzzles (id, title, slug, image_url, publish_at) VALUES ($1, $2, $2, $2, now())', [puzzle, 'puzzle'])
    await db.query('INSERT INTO public.user_best_records (user_id,puzzle_id,piece_count,best_time,best_moves) VALUES ($1,$2,24,60,30)', [user,puzzle])
    await db.exec(fs.readFileSync(path.join(directory, '016_leaderboard_privacy.sql'), 'utf8'))
    assert.equal((await db.query('SELECT username FROM private.leaderboard_profiles WHERE user_id=$1', [user])).rows[0].username, null)
    await db.exec(fs.readFileSync(path.join(directory, '017_restore_leaderboard_identity.sql'), 'utf8'))
    await db.query('INSERT INTO auth.users VALUES ($1, $2, $3)', [other, JSON.stringify({ username: 'Public Alias' }), 'other@example.com'])
    await db.query('INSERT INTO public.user_best_records (user_id,puzzle_id,piece_count,best_time,best_moves) VALUES ($1,$2,24,70,40)', [other,puzzle])
    // A completed session exercises the global board without client write access.
    await db.query(`INSERT INTO public.game_sessions (user_id,puzzle_id,piece_count,difficulty,status,progress_percent,completion_time,moves,stars,completed_at,started_at)
      VALUES ($1,$2,24,'easy','completed',100,60,30,3,now(),now()-interval '60 seconds')`, [user,puzzle])
    for (const role of ['anon', 'authenticated']) {
      await db.exec(`SET ROLE ${role}`)
      for (const target of ['auth.users', 'private.leaderboard_profiles', 'public.v_leaderboard_time', 'public.v_leaderboard_moves']) {
        await assert.rejects(db.query(`SELECT * FROM ${target}`), /permission denied/)
      }
      const board = (await db.query('SELECT * FROM public.get_puzzle_leaderboard($1,24,5)', [puzzle])).rows
      assert.equal(board.length, 2)
      assert.equal(board[0].username, 'Private Real Name')
      assert.equal(board[1].username, 'Public Alias')
      assert.equal(board[0].avatar_url, 'https://example.com/a.png')
      assert.equal(board[0].score_value, 60)
      assert.equal((await db.query('SELECT * FROM public.get_puzzle_leaderboard($1,24,1)', [puzzle])).rows.length, 1)
      const global = (await db.query('SELECT public.get_global_leaderboard() AS board')).rows[0].board
      assert.equal(global.entries.length, 1)
      assert.equal(global.entries[0].username, board[0].username)
      assert.equal(global.entries[0].avatarUrl, board[0].avatar_url)
      assert.doesNotMatch(JSON.stringify({board,global}), /secret@example|other@example|full_name|raw_user_meta_data/)
      for (const limit of [0,101,null]) await assert.rejects(db.query('SELECT * FROM public.get_puzzle_leaderboard($1,24,$2)', [puzzle,limit]))
      await db.exec('RESET ROLE')
    }
    const privileges = (await db.query(`SELECT
      has_function_privilege('anon', 'public.start_game_session(uuid,integer,boolean,uuid)', 'EXECUTE') AS anon_start,
      has_function_privilege('authenticated', 'public.start_game_session(uuid,integer,boolean,uuid)', 'EXECUTE') AS auth_start,
      has_function_privilege('authenticated', 'public.refresh_weekly_plays_count()', 'EXECUTE') AS refresh`)).rows[0]
    assert.deepEqual(privileges, {anon_start:false,auth_start:true,refresh:false})
    await db.query("UPDATE auth.users SET raw_user_meta_data = '{\"display_name\":\"New Alias\"}' WHERE id=$1", [user])
    assert.equal((await db.query('SELECT * FROM public.get_puzzle_leaderboard($1,24,5)',[puzzle])).rows[0].username,'New Alias')
    // Preserve original precedence, whitespace handling, empty-state fallback
    // and avatar updates for existing accounts (including Google picture URLs).
    for (const [metadata, name, avatar] of [
      [{ username:' Alias ', full_name:'Full', name:'Name', display_name:'Display', avatar_url:' https://example.com/preferred.png ', picture:'https://example.com/google.png' }, 'Alias', 'https://example.com/preferred.png'],
      [{ username:' ', full_name:' Full ', name:'Name', display_name:'Display', avatar_url:' ', picture:' https://example.com/google.png ' }, 'Full', 'https://example.com/google.png'],
      [{ full_name:' ', name:' Name ', display_name:'Display' }, 'Name', null],
      [{ name:' ', display_name:' Display ' }, 'Display', null],
      [{}, `Player ${user.slice(0,8)}`, null],
    ]) {
      await db.query('UPDATE auth.users SET raw_user_meta_data=$1 WHERE id=$2', [JSON.stringify(metadata), user])
      const entry = (await db.query('SELECT * FROM public.get_puzzle_leaderboard($1,24,5)',[puzzle])).rows[0]
      assert.equal(entry.username, name)
      assert.equal(entry.avatar_url, avatar)
      const globalEntry = (await db.query('SELECT public.get_global_leaderboard() AS b')).rows[0].b.entries[0]
      assert.equal(globalEntry.username, name)
      assert.equal(globalEntry.avatarUrl, avatar)
    }
    // The follow-up migration is safe to reapply and repairs stale projections.
    await db.exec(fs.readFileSync(path.join(directory, '017_restore_leaderboard_identity.sql'), 'utf8'))
    await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [user])
    await db.exec('SET ROLE authenticated')
    const own = (await db.query('SELECT user_id FROM public.user_best_records')).rows
    assert.equal(own.length,1)
    assert.equal(own[0].user_id,user)
    await db.exec('RESET ROLE')
    await db.query("UPDATE public.puzzles SET publish_at=now()+interval '1 day' WHERE id=$1",[puzzle])
    assert.equal((await db.query('SELECT * FROM public.get_puzzle_leaderboard($1,24,5)',[puzzle])).rows.length,0)
    assert.equal((await db.query('SELECT public.get_global_leaderboard() AS b')).rows[0].b.entries.length,0)
    await db.query('DELETE FROM auth.users WHERE id=$1',[other])
    assert.equal((await db.query('SELECT * FROM private.leaderboard_profiles WHERE user_id=$1',[other])).rows.length,0)
  } finally { await db.close() }
})
