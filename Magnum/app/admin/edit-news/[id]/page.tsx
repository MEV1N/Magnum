import EditNewsClient from './components/EditNewsClient'
import { Metadata } from 'next'

type PageParams = {
  id: string
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>
}): Promise<Metadata> {
  const resolvedParams = await params
  return {
    title: `Edit News - ${resolvedParams.id}`,
  }
}

export default async function EditNewsPage({
  params,
}: {
  params: Promise<PageParams>
}) {
  const resolvedParams = await params
  return <EditNewsClient id={resolvedParams.id} />
}

// Add static generation for this page
export function generateStaticParams() {
  return []
}

