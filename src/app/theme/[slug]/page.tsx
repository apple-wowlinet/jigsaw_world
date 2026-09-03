import type { Metadata } from 'next'
import { ThemeDetail } from '@/components/themes/ThemeDetail'
import { themeCatalogue } from '@/lib/data/theme-catalogue'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const theme = themeCatalogue.find((item) => item.slug === slug)

  if (!theme) {
    return {
      title: 'Theme Not Found | JigsawWorld',
    }
  }

  return {
    title: `${theme.name} Jigsaw Puzzles | JigsawWorld`,
    description: theme.description,
  }
}

export default function ThemePage() {
  return <ThemeDetail />
}
