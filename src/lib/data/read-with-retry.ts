function isTransientNetworkError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false

  const { message, details, code, cause } = error as {
    message?: unknown
    details?: unknown
    code?: unknown
    cause?: unknown
  }
  const text = [message, details, code].filter((value) => typeof value === 'string').join(' ')

  return /fetch failed|ECONNRESET|ECONNREFUSED|ETIMEDOUT|EAI_AGAIN|UND_ERR_(CONNECT_TIMEOUT|SOCKET)/i.test(text)
    || isTransientNetworkError(cause)
}

// Retry inside the cache callback: failed reads still reject and are never
// stored as an empty catalogue for the cache's full revalidation interval.
export async function readWithRetry<T>(read: () => Promise<T>): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await read()
    } catch (error) {
      if (attempt < 2 && isTransientNetworkError(error)) {
        await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)))
        continue
      }

      if (error instanceof Error) throw error

      const message = error && typeof error === 'object' && 'message' in error
        ? String(error.message)
        : 'Unknown data source error'
      throw new Error(`Unable to load puzzle catalogue: ${message}`, { cause: error })
    }
  }
}
