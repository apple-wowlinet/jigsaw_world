import { supabase } from '@/lib/supabase'

export interface StartGameSessionInput {
  puzzleId: string
  pieceCount: number
  rotationEnabled: boolean
  dailyChallengeId?: string | null
}

export interface CompletedGameResult {
  session_id: string
  completion_time: number
  moves: number
  stars: number
  ranked: boolean
  daily_completed: boolean
}

export async function startGameSession({
  puzzleId,
  pieceCount,
  rotationEnabled,
  dailyChallengeId = null,
}: StartGameSessionInput): Promise<string> {
  const { data, error } = await supabase.rpc('start_game_session', {
    p_puzzle_id: puzzleId,
    p_piece_count: pieceCount,
    p_rotation_enabled: rotationEnabled,
    p_daily_challenge_id: dailyChallengeId,
  })

  if (error) throw error
  if (typeof data !== 'string' || !data) {
    throw new Error('The server did not create a game session.')
  }

  return data
}

export async function checkpointGameSession(
  sessionId: string,
  progressPercent: number
): Promise<void> {
  const progress = Math.min(99, Math.max(0, Math.round(progressPercent)))
  const { error } = await supabase.rpc('checkpoint_game_session', {
    p_session_id: sessionId,
    p_progress_percent: progress,
  })

  if (error) throw error
}

export async function completeGameSession(
  sessionId: string,
  moves: number
): Promise<CompletedGameResult> {
  const { data, error } = await supabase.rpc('complete_game_session', {
    p_session_id: sessionId,
    p_moves: Math.max(0, Math.round(moves)),
  })

  if (error) throw error
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('The server returned an invalid completion result.')
  }

  const result = data as unknown as CompletedGameResult
  if (
    typeof result.session_id !== 'string' ||
    typeof result.completion_time !== 'number' ||
    typeof result.moves !== 'number' ||
    typeof result.stars !== 'number' ||
    typeof result.ranked !== 'boolean' ||
    typeof result.daily_completed !== 'boolean'
  ) {
    throw new Error('The server returned an invalid completion result.')
  }

  return result
}

export async function abandonGameSession(sessionId: string): Promise<void> {
  const { error } = await supabase.rpc('abandon_game_session', {
    p_session_id: sessionId,
  })

  if (error) throw error
}
