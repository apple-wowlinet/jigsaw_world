import type { Metadata } from 'next'
import { ThemeDetail } from '@/components/themes/ThemeDetail'
import { fetchThemes } from '@/lib/data/public'
import { mergeThemeCatalogue } from '@/lib/data/theme-catalogue'
import { themeDescription } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const themes = mergeThemeCatalogue(await fetchThemes())
  const theme = themes.find((item) => item.slug === slug)
  const canonical = `/theme/${encodeURIComponent(slug)}`

  if (!theme) {
    return {
      title: 'Theme Not Found',
      robots: { index: false, follow: false },
    }
  }

  const title = `${theme.name} Jigsaw Puzzles Online`
  const description = themeDescription(theme.name, theme.description)

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | JigsawWorld`,
      description,
      url: canonical,
      type: 'website',
      images: theme.image_url
        ? [{ url: theme.image_url, alt: `${theme.name} jigsaw puzzles` }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | JigsawWorld`,
      description,
      images: theme.image_url ? [theme.image_url] : undefined,
    },
  }
}

export default function ThemePage() {
  return <ThemeDetail />
}
