'use client'

import { use } from 'react'
import { AuditForm } from '@/components/audit/audit-form'

export default function EditAuditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <AuditForm auditId={id} />
}
