'use client'

import PageEditor from '@/components/admin/PageEditor'
import { useParams } from 'next/navigation'

export default function AdminPageEditor() {
  const params = useParams()
  const raw = params?.id
  const id = Array.isArray(raw) ? raw[0] : (raw ?? 'new')
  return <PageEditor id={id} />
}
