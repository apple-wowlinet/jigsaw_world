import type { Metadata } from 'next'
import { fetchCategories } from '@/lib/data/public'
import { mergeCategoryCatalogue } from '@/lib/data/category-catalogue'
import { categoryDescription, toMetaDescription } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const remoteCategories = await fetchCategories()
  const categories = mergeCategoryCatalogue(remoteCategories)
  const catalogueSlugs = new Set(categories.map((item) => item.slug))
  const category = categories.find((item) => item.slug === slug)
    ?? remoteCategories.find((item) => !catalogueSlugs.has(item.slug) && item.slug === slug)
  const canonical = `/category/${encodeURIComponent(slug)}`

  if (!category) {
    return {
      title: 'Category Not Found',
      robots: { index: false, follow: false },
    }
  }

  const title = category.seo_title?.trim() || `${category.name} Jigsaw Puzzles Online`
  const description = category.seo_description
    ? toMetaDescription(
        category.seo_description,
        categoryDescription(category.name, category.description)
      )
    : categoryDescription(category.name, category.description)
  const socialImage = category.og_image_url || category.image_url

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | JigsawWorld`,
      description,
      url: canonical,
      type: 'website',
      images: socialImage
        ? [{ url: socialImage, alt: `${category.name} jigsaw puzzles` }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | JigsawWorld`,
      description,
      images: socialImage ? [socialImage] : undefined,
    },
  }
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return children
}
