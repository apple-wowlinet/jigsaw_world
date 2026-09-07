export const PIECE_COUNT_PRESETS = [
  24,
  48,
  80,
  100,
  120,
  150,
  200,
  300,
  500,
] as const

const PIECE_COUNT_RATIOS = [0.3, 0.6, 1, 2] as const

function proportionalDistance(value: number, target: number) {
  return Math.abs(Math.log(value / target))
}

function findClosestCount(
  target: number,
  candidates: readonly number[]
): number {
  return candidates.reduce((closest, candidate) => {
    const candidateDistance = proportionalDistance(candidate, target)
    const closestDistance = proportionalDistance(closest, target)
    return candidateDistance < closestDistance ||
      (candidateDistance === closestDistance && candidate < closest)
      ? candidate
      : closest
  })
}

/**
 * Return four stable, exact piece-count tiers for a catalog puzzle.
 * The database value selects the scale; the returned counts always come from
 * the shared preset pool so every entry point can expose the same choices.
 */
export function getPuzzlePieceCounts(defaultCount: number): number[] {
  const safeDefault = Number.isFinite(defaultCount) && defaultCount > 0
    ? defaultCount
    : 100
  const normalizedDefault = findClosestCount(safeDefault, PIECE_COUNT_PRESETS)
  const selected: number[] = []

  for (const ratio of PIECE_COUNT_RATIOS) {
    const remaining = PIECE_COUNT_PRESETS.filter(
      (candidate) => !selected.includes(candidate)
    )
    selected.push(findClosestCount(normalizedDefault * ratio, remaining))
  }

  return selected.sort((a, b) => a - b)
}

/** Resolve a query-string value to the closest legal tier for this puzzle. */
export function resolvePuzzlePieceCount(
  requestedCount: number | null | undefined,
  options: readonly number[],
  defaultCount: number
): number {
  const validOptions = options.filter(
    (option) => Number.isSafeInteger(option) && option > 0
  )
  const fallbackOptions = validOptions.length > 0
    ? validOptions
    : getPuzzlePieceCounts(defaultCount)
  const fallback = findClosestCount(defaultCount, fallbackOptions)

  if (
    requestedCount === null ||
    requestedCount === undefined ||
    !Number.isSafeInteger(requestedCount) ||
    requestedCount <= 0
  ) {
    return fallback
  }

  return findClosestCount(requestedCount, fallbackOptions)
}
