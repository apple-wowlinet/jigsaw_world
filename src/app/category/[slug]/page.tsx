import { getCategories, getCategoryPuzzlePage } from '@/lib/data/server'
import { CategoryContent } from '@/components/category/CategoryContent'

export default async function CategoryPage({ params, searchParams }: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string | string[] }>
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams])
  const parsed = Number.parseInt(typeof query.page === 'string' ? query.page : '1', 10)
  const requestedPage = Number.isSafeInteger(parsed) && parsed <= 100000 ? Math.max(1, parsed) : 1
  const [categories, result] = await Promise.all([
    getCategories(),
    getCategoryPuzzlePage({ categorySlug: slug, sort: 'popular', limit: 24, offset: (requestedPage - 1) * 24 }),
  ])
  const pageNumber = Math.min(requestedPage, Math.max(1, Math.ceil(result.filteredTotal / 24)))
  const page = pageNumber === requestedPage ? result : await getCategoryPuzzlePage({
    categorySlug: slug, sort: 'popular', limit: 24, offset: (pageNumber - 1) * 24,
  })
  return <CategoryContent key={slug} slug={slug} initialCategories={categories} initialPage={page} initialPageNumber={pageNumber} />
}
