import { connection } from 'next/server'
import { getCategories } from '@/lib/data/server'
import { CategoriesContent } from '@/components/category/CategoriesContent'

export default async function CategoriesPage() {
  await connection()
  return <CategoriesContent initialCategories={await getCategories()} />
}
