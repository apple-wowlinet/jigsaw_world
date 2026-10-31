-- Run as postgres after migration 018. All test rows are rolled back.
BEGIN;
DO $$
DECLARE
  first_id uuid := gen_random_uuid();
  email_address text := 'contact-check-' || gen_random_uuid()::text || '@example.com';
  sender text := gen_random_uuid()::text;
  result text;
BEGIN
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE oid = 'public.contact_messages'::regclass) THEN
    RAISE EXCEPTION 'RLS must be enabled';
  END IF;
  IF has_table_privilege('anon', 'public.contact_messages', 'SELECT')
    OR has_table_privilege('authenticated', 'public.contact_messages', 'SELECT')
    OR has_table_privilege('anon', 'public.contact_messages', 'INSERT')
    OR has_table_privilege('authenticated', 'public.contact_messages', 'UPDATE') THEN
    RAISE EXCEPTION 'Contact data must not be accessible to public API roles';
  END IF;
  IF has_function_privilege('anon', 'public.submit_contact_message(uuid,text,text,text,text)', 'EXECUTE')
    OR has_function_privilege('authenticated', 'public.submit_contact_message(uuid,text,text,text,text)', 'EXECUTE') THEN
    RAISE EXCEPTION 'Submission RPC must be server only';
  END IF;
  IF NOT has_function_privilege('service_role', 'public.submit_contact_message(uuid,text,text,text,text)', 'EXECUTE') THEN
    RAISE EXCEPTION 'Service role must be able to submit';
  END IF;
  IF has_table_privilege('service_role', 'public.contact_messages', 'UPDATE')
    OR has_table_privilege('service_role', 'public.contact_messages', 'DELETE') THEN
    RAISE EXCEPTION 'Submission service role must not update or delete messages';
  END IF;
  result := public.submit_contact_message(first_id, 'Test', email_address, 'Message', sender);
  IF result <> 'accepted' THEN RAISE EXCEPTION 'First submission failed'; END IF;
  result := public.submit_contact_message(first_id, 'Test', email_address, 'Message', sender);
  IF result <> 'accepted' THEN RAISE EXCEPTION 'Identical retry must succeed'; END IF;
  IF (SELECT count(*) FROM public.contact_messages WHERE email = email_address) <> 1 THEN
    RAISE EXCEPTION 'Retry inserted duplicate';
  END IF;
  result := public.submit_contact_message(first_id, 'Test', email_address, 'Changed', sender);
  IF result <> 'conflict' THEN RAISE EXCEPTION 'ID reuse with changed data must conflict'; END IF;
  PERFORM public.submit_contact_message(gen_random_uuid(), 'Test', email_address, 'Second', sender);
  PERFORM public.submit_contact_message(gen_random_uuid(), 'Test', email_address, 'Third', sender);
  result := public.submit_contact_message(gen_random_uuid(), 'Test', email_address, 'Fourth', gen_random_uuid()::text);
  IF result <> 'rate_limited' THEN RAISE EXCEPTION 'Email limit failed'; END IF;
  result := public.submit_contact_message(gen_random_uuid(), 'Test', 'other-' || email_address, 'Fourth', sender);
  IF result <> 'rate_limited' THEN RAISE EXCEPTION 'Sender limit failed'; END IF;
  RAISE NOTICE 'Contact security, idempotency and rate limit checks passed';
END;
$$;
ROLLBACK;
