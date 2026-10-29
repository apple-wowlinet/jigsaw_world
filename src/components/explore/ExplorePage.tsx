import { connection } from 'next/server'
import { getExplorePuzzles, type ExploreMode } from '@/lib/data/server'
import { ExploreListPage } from './ExploreListPage'

export async function ExplorePage({ mode }: { mode: ExploreMode }) {
  await connection()
  return <ExploreListPage key={mode} mode={mode} initialPuzzles={await getExplorePuzzles(mode)} />
}
