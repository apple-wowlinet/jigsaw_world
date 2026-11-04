import { isAllowedImageSource } from '@/lib/images/urls'

const MAX_BYTES = 20 * 1024 * 1024
const RASTER_IMAGE = /^image\/(jpeg|png|webp|avif|gif)(;|$)/i

export async function GET(request: Request) {
  const src = new URL(request.url).searchParams.get('url') ?? ''
  if (!isAllowedImageSource(src)) {
    return Response.json({ error: 'Unsupported image source' }, { status: 400 })
  }

  try {
    // Fetch the original bytes without resizing or recompression. The same-origin
    // response allows canvas access even when the source omits CORS headers.
    const upstream = await fetch(src, {
      headers: { Accept: 'image/*' },
      redirect: 'error',
      signal: AbortSignal.timeout(15_000),
    })
    const contentType = upstream?.headers.get('content-type') ?? ''
    if (!upstream?.ok || !RASTER_IMAGE.test(contentType) || !upstream.body) {
      await upstream?.body?.cancel()
      throw new Error('Image source did not return a supported image')
    }
    const reader = upstream.body.getReader()
    const chunks: Uint8Array[] = []
    let size = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > MAX_BYTES) {
        await reader.cancel()
        throw new Error('Image is too large')
      }
      chunks.push(value)
    }
    return new Response(Buffer.concat(chunks), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return Response.json({ error: 'Unable to load puzzle image' }, {
      status: 502, headers: { 'Cache-Control': 'no-store' },
    })
  }
}
