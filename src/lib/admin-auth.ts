import 'server-only'

import { timingSafeEqual } from 'node:crypto'

function getConfiguredAdminToken() {
  return process.env.ADMIN_TOKEN ?? process.env.admin_token ?? ''
}

export function isAdminTokenConfigured() {
  return getConfiguredAdminToken().length > 0
}

export function isAdminTokenValid(candidate: string | null | undefined) {
  const expected = getConfiguredAdminToken()
  if (!candidate || !expected) return false

  const candidateBuffer = Buffer.from(candidate)
  const expectedBuffer = Buffer.from(expected)
  if (candidateBuffer.length !== expectedBuffer.length) return false

  return timingSafeEqual(candidateBuffer, expectedBuffer)
}
