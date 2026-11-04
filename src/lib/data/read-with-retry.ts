const NETWORK_CODE = /\b(?:ECONNRESET|ECONNREFUSED|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|ENETUNREACH|EHOSTUNREACH|UND_ERR_[A-Z_]+)\b/g

function errorText(error: unknown, seen = new Set<object>()): string {
  if (!error || typeof error !== 'object') return ''
  if (seen.has(error)) return ''
  seen.add(error)
  const { message, details, code, cause, errors } = error as {
    message?: unknown
    details?: unknown
    code?: unknown
    cause?: unknown
    errors?: unknown[]
  }
  return [message, details, code, errorText(cause, seen),
    ...(Array.isArray(errors) ? errors.map((value) => errorText(value, seen)) : []),
  ].filter((value) => typeof value === 'string').join(' ')
}

function isTransientNetworkError(error: unknown): boolean {
  return /fetch failed|ECONNRESET|ECONNREFUSED|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|ENETUNREACH|EHOSTUNREACH|UND_ERR_(CONNECT_TIMEOUT|SOCKET)/i.test(errorText(error))
}

// Preserve AggregateError child codes before Supabase converts a fetch error
// into a plain object and discards the nested transport errors.
export async function fetchCatalogue(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(input, init)
  } catch (error) {
    if (!isTransientNetworkError(error)) throw error
    const codes = [...new Set(errorText(error).match(NETWORK_CODE) ?? [])]
    const diagnostic = codes.length ? ` [${codes.join(', ')}]` : ''
    throw new Error(`Catalogue fetch failed${diagnostic}`, { cause: error })
  }
}

// Retry inside the cache callback: failed reads still reject and are never
// stored as an empty catalogue for the cache's full revalidation interval.
export async function readWithRetry<T>(read: () => Promise<T>, operation = 'catalogue'): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await read()
    } catch (error) {
      if (attempt < 2 && isTransientNetworkError(error)) {
        await new Promise((resolve) => setTimeout(resolve, attempt === 0 ? 500 : 1500))
        continue
      }

      const message = error && typeof error === 'object' && 'message' in error
        ? String(error.message)
        : 'Unknown data source error'
      const networkCodes = [...new Set(errorText(error).match(NETWORK_CODE) ?? [])]
      // SDK network failures are plain objects; Next otherwise prints only
      // "[cause]: [Object]". Log codes without request URLs or auth headers.
      console.error('Catalogue read failed', {
        operation, attempts: attempt + 1, networkCodes,
      })
      const diagnostic = networkCodes.length ? ` [${networkCodes.join(', ')}]` : ''
      throw new Error(`Unable to load puzzle catalogue: ${message}${diagnostic}`, { cause: error })
    }
  }
}
