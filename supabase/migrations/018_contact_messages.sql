-- Contact messages: storage only, managed directly in the Supabase dashboard.
BEGIN;
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 5000),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'resolved')),
  sender_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX contact_messages_created_idx ON public.contact_messages (created_at DESC);
CREATE INDEX contact_messages_sender_idx ON public.contact_messages (sender_hash, created_at DESC);
CREATE INDEX contact_messages_email_idx ON public.contact_messages (email, created_at DESC);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.contact_messages FROM PUBLIC, anon, authenticated;
-- The submission RPC only reads and inserts; handling is done in the dashboard.
REVOKE ALL ON public.contact_messages FROM service_role;
GRANT SELECT, INSERT ON public.contact_messages TO service_role;

-- Serialize each sender to enforce limits even across serverless instances.
CREATE FUNCTION public.submit_contact_message(
  p_id uuid, p_name text, p_email text, p_message text, p_sender_hash text
) RETURNS text LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE existing public.contact_messages;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtextextended(p_sender_hash, 0));
  PERFORM pg_advisory_xact_lock(hashtextextended(p_email, 1));
  SELECT * INTO existing FROM public.contact_messages WHERE id = p_id;
  IF FOUND THEN
    IF existing.email = p_email AND existing.name = p_name AND existing.message = p_message THEN
      RETURN 'accepted';
    END IF;
    RETURN 'conflict';
  END IF;
  IF (SELECT count(*) FROM public.contact_messages
      WHERE sender_hash = p_sender_hash AND created_at > now() - interval '10 minutes') >= 3
    OR (SELECT count(*) FROM public.contact_messages
      WHERE email = p_email AND created_at > now() - interval '10 minutes') >= 3 THEN
    RETURN 'rate_limited';
  END IF;
  INSERT INTO public.contact_messages (id, name, email, message, sender_hash)
  VALUES (p_id, p_name, p_email, p_message, p_sender_hash);
  RETURN 'accepted';
END;
$$;
REVOKE ALL ON FUNCTION public.submit_contact_message(uuid, text, text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_contact_message(uuid, text, text, text, text) TO service_role;
COMMIT;
