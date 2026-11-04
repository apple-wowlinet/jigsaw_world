'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function CatalogueError({ reset }: { reset: () => void }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const retry = () => startTransition(() => {
    router.refresh()
    reset()
  })

  return (
    <div role="alert" className="mx-auto flex min-h-[65vh] max-w-7xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-display text-2xl font-semibold">Unable to load puzzles</h1>
      <p className="text-sm text-muted-foreground">Please try again in a moment.</p>
      <button type="button" className="btn btn-primary btn-md" disabled={isPending} onClick={retry}>
        {isPending ? 'Retrying…' : 'Try again'}
      </button>
    </div>
  )
}
