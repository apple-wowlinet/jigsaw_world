'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export function UserAvatar({
  name,
  avatarUrl,
  className,
}: {
  name: string
  avatarUrl: string | null
  className?: string
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const initials = name.trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'P'

  return (
    <span aria-hidden="true" className={cn('inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-subtle text-sm font-bold text-primary', className)}>
      {avatarUrl && avatarUrl !== failedUrl ? (
        // OAuth providers use different image hosts; load without an image proxy.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={avatarUrl}
          src={avatarUrl}
          alt=""
          width={40}
          height={40}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setFailedUrl(avatarUrl)}
        />
      ) : initials}
    </span>
  )
}
