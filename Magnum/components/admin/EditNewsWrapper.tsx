'use client'

import EditNewsForm from '@/app/admin/edit-news/[id]/components/EditNewsForm'

type Props = {
  id: string;
  initialData?: {
    title: string;
    content: string;
  };
}

export default function EditNewsWrapper({ id, initialData }: Props) {
  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 border-b border-gold-500 pb-6">
          <h1 className="text-4xl font-bold text-gold-500 mb-2">Magnum News</h1>
          <p className="text-lg text-gray-300">
            Your source for the latest happenings inside and outside the college. Stay informed, stay connected.
          </p>
        </div>
        <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gold-500/20">
          <h2 className="text-2xl font-semibold text-gold-500 mb-6">Edit News Post</h2>
          <EditNewsForm id={id} initialData={initialData} />
        </div>
      </div>
    </div>
  )
}
