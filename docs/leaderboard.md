# Global leaderboard

Apply `supabase/migrations/015_global_leaderboard.sql` in Supabase after the
existing game-session migrations, then apply `016_leaderboard_privacy.sql` and
`017_restore_leaderboard_identity.sql` before
deploying the matching frontend. See [security deployment notes](security-auth-users-exposed.md). The page calls `get_global_leaderboard` via
Supabase RPC; it does not read other users' session rows directly.

## Rules

- Source: completed `game_sessions` for active, published puzzles with rotation
  disabled, 100% progress, a supported piece count, and valid completion times.
- Group by user. Within the requested period, count each puzzle + piece-count
  combination once, using its fastest finish. A different piece count counts
  separately; a new period can count the same combination again.
- Rank by total pieces descending, counted completions descending, then summed
  fastest completion times ascending. Equal metrics share a rank (1, 2, 2, 4).
  User ID only stabilizes display order for tied players; it does not break ties.
- All-time includes every eligible session. Daily starts at 00:00 UTC, weekly
  starts Monday at 00:00 UTC, monthly starts on day 1 at 00:00 UTC. Windows are
  inclusive at the start and exclusive at the next boundary. Select by
  `completed_at`, including games started before the period but finished in it.
- Aggregate at query time. Existing sessions are immediately eligible after the
  migration; no replay, backfill, scheduled reset, or counter writes are needed.
  Refreshing, changing tabs, or returning to the visible page fetches current data.
- The page shows the first 50 users and the total eligible player count.
- Names fall back through username, full_name, name, display_name, then Player
  plus the first 8 user-ID characters. Avatars use avatar_url, then picture;
  absent or broken images show name initials.
- An unpublished/inactive puzzle's sessions do not count while it is hidden.
  Guests, custom puzzles, and local resumed games still do not create ranked
  sessions under the existing game flow.

## Verification

Run the client contract and avatar tests:

```sh
node --test tests/leaderboard*.test.cjs
npx tsc --noEmit
```

The same test file includes an isolated PostgreSQL integration test for the
actual migration SQL. To run it without changing project dependencies, install
`@electric-sql/pglite` into a temporary directory and supply its package path:

```sh
npm install --prefix /tmp/jigsaw-sql-tests --no-package-lock --ignore-scripts @electric-sql/pglite
PGLITE_MODULE_PATH=/tmp/jigsaw-sql-tests/node_modules/@electric-sql/pglite node --test tests/leaderboard*.test.cjs
```

It builds an in-memory schema; it never connects to the development or production
Supabase database. It verifies per-period deduplication, count/time tie breakers,
shared ranks, UTC boundaries in a non-UTC database session, publication and
rotation filters, metadata fallbacks, result limits, anonymous RPC access and
invalid arguments. Without that optional runtime the SQL test is reported as
skipped rather than passed.
