'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

type EditNewsFormProps = {
  id: string
}

export default function EditNewsForm({ id }: EditNewsFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Add form submission logic here
    router.push('/admin')
  }

  return (
    <div>
      <Link href="/admin">
        <ArrowLeft /> Back
      </Link>
      <form onSubmit={handleSubmit}>
        {/* Add your form fields here */}
      </form>
    </div>
  )
}
