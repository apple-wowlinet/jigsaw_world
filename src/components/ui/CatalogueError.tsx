'use client'

export default function CatalogueError({ reset }: { reset: () => void }) {
  return (
    <div role="alert" className="mx-auto flex min-h-[65vh] max-w-7xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-display text-2xl font-semibold">Unable to load puzzles</h1>
      <p className="text-sm text-muted-foreground">Please try again in a moment.</p>
      <button type="button" className="btn btn-primary btn-md" onClick={reset}>Try again</button>
    </div>
  )
}
