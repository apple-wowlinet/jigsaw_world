-- Restore the pre-016 display-name fallback without reopening auth.users views.
-- Apply after 016. Both leaderboard RPCs already read this private projection.
BEGIN;

-- Keep the backfill and trigger replacement consistent with concurrent sign-ins
-- or metadata updates. This lock is released when the transaction commits.
LOCK TABLE auth.users IN SHARE ROW EXCLUSIVE MODE;

CREATE OR REPLACE FUNCTION private.sync_leaderboard_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO private.leaderboard_profiles (user_id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NULLIF(btrim(NEW.raw_user_meta_data->>'username'), ''),
      NULLIF(btrim(NEW.raw_user_meta_data->>'full_name'), ''),
      NULLIF(btrim(NEW.raw_user_meta_data->>'name'), ''),
      NULLIF(btrim(NEW.raw_user_meta_data->>'display_name'), '')
    ),
    COALESCE(
      NULLIF(btrim(NEW.raw_user_meta_data->>'avatar_url'), ''),
      NULLIF(btrim(NEW.raw_user_meta_data->>'picture'), '')
    )
  )
  ON CONFLICT (user_id) DO UPDATE
    SET username = EXCLUDED.username, avatar_url = EXCLUDED.avatar_url;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION private.sync_leaderboard_profile()
  FROM PUBLIC, anon, authenticated;

-- Repair existing profiles immediately; no sign-in or replay is required.
-- Copy only the chosen display name and avatar, never the complete metadata,
-- email, tokens, identities or any other authentication fields.
INSERT INTO private.leaderboard_profiles (user_id, username, avatar_url)
SELECT id,
  COALESCE(
    NULLIF(btrim(raw_user_meta_data->>'username'), ''),
    NULLIF(btrim(raw_user_meta_data->>'full_name'), ''),
    NULLIF(btrim(raw_user_meta_data->>'name'), ''),
    NULLIF(btrim(raw_user_meta_data->>'display_name'), '')
  ),
  COALESCE(
    NULLIF(btrim(raw_user_meta_data->>'avatar_url'), ''),
    NULLIF(btrim(raw_user_meta_data->>'picture'), '')
  )
FROM auth.users
ON CONFLICT (user_id) DO UPDATE
  SET username = EXCLUDED.username, avatar_url = EXCLUDED.avatar_url;

COMMIT;
