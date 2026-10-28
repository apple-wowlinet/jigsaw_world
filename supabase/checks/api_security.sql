-- Read-only checks: run as the database owner after 016.
-- Inspect extra API schemas too if Data API settings expose more than public.
-- 1. API-readable views, including indirect dependencies on auth.users.
WITH RECURSIVE dependencies AS (
  SELECT c.oid AS root, c.oid AS relation, ARRAY[c.oid] AS visited
  FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
  WHERE n.nspname='public' AND c.relkind IN ('v','m')
  UNION ALL
  SELECT d.root, dep.refobjid, d.visited || dep.refobjid
  FROM dependencies d
  JOIN pg_rewrite rewrite ON rewrite.ev_class=d.relation
  JOIN pg_depend dep ON dep.classid='pg_rewrite'::regclass AND dep.objid=rewrite.oid
    AND dep.refclassid='pg_class'::regclass
  WHERE NOT dep.refobjid=ANY(d.visited)
)
SELECT DISTINCT root::regclass AS exposed_auth_view, role_name
FROM dependencies CROSS JOIN (VALUES ('anon'),('authenticated')) roles(role_name)
WHERE relation='auth.users'::regclass
  AND has_table_privilege(role_name,root,'SELECT');

-- 2. Other publicly readable views that can bypass underlying RLS.
SELECT c.oid::regclass AS view_name, c.reloptions
FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='public' AND c.relkind IN ('v','m')
  AND (has_table_privilege('anon',c.oid,'SELECT') OR has_table_privilege('authenticated',c.oid,'SELECT'))
  AND (c.relkind='m' OR NOT COALESCE(c.reloptions @> ARRAY['security_invoker=true'],false));

-- 3. API-accessible tables with RLS disabled. Expected: zero rows.
SELECT c.oid::regclass AS unprotected_table
FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='public' AND c.relkind IN ('r','p') AND NOT c.relrowsecurity
  AND (has_table_privilege('anon',c.oid,'SELECT,INSERT,UPDATE,DELETE')
    OR has_table_privilege('authenticated',c.oid,'SELECT,INSERT,UPDATE,DELETE'));

-- 4. Review every elevated RPC; leaderboard RPCs are intentional public reads,
-- game lifecycle RPCs should be authenticated only, internal helpers neither.
SELECT p.oid::regprocedure AS function_name, p.proconfig,
  has_function_privilege('anon',p.oid,'EXECUTE') AS anon_execute,
  has_function_privilege('authenticated',p.oid,'EXECUTE') AS authenticated_execute
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public' AND p.prosecdef
ORDER BY 1;

-- 5. Review broad policies manually: permissive SELECT policies may be correct
-- for published content but must never appear on private user tables.
SELECT schemaname,tablename,policyname,roles,cmd,qual,with_check
FROM pg_policies WHERE schemaname='public'
ORDER BY tablename,policyname;
