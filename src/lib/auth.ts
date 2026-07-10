export function getSafeRedirectPath(path: string | null, fallback = '/') {
  if (!path || !path.startsWith('/') || path.startsWith('//') || path.includes('\\')) {
    return fallback
  }

  return path
}
