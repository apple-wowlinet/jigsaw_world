-- Persist resumable progress for daily challenges.
-- Kept separate so existing installations can apply this UI-specific change
-- independently from the base schema.
ALTER TABLE public.daily_challenge_participations
  ADD COLUMN IF NOT EXISTS progress_percent smallint NOT NULL DEFAULT 0;

ALTER TABLE public.daily_challenge_participations
  DROP CONSTRAINT IF EXISTS daily_challenge_participations_progress_percent_check;

ALTER TABLE public.daily_challenge_participations
  ADD CONSTRAINT daily_challenge_participations_progress_percent_check
  CHECK (progress_percent BETWEEN 0 AND 100);

CREATE INDEX IF NOT EXISTS idx_dcp_user_progress
  ON public.daily_challenge_participations (
    user_id,
    is_completed,
    progress_percent DESC
  );

COMMENT ON COLUMN public.daily_challenge_participations.progress_percent IS
  'Latest saved completion percentage for resuming a daily challenge.';
