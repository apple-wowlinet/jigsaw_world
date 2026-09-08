import { supabase } from '@/lib/supabase'

export async function fetchFavoriteStatus(userId: string, puzzleId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select('puzzle_id')
    .eq('user_id', userId)
    .eq('puzzle_id', puzzleId)
    .maybeSingle()

  if (error) throw error
  return data !== null
}

export async function addFavorite(userId: string, puzzleId: string) {
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, puzzle_id: puzzleId })

  // A repeated click/request is already in the desired state.
  if (error && error.code !== '23505') throw error
}

export async function removeFavorite(userId: string, puzzleId: string) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('puzzle_id', puzzleId)

  if (error) throw error
}
