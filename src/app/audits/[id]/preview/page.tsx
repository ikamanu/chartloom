'use client'

import { use, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getAudit } from '@/lib/db'
import type { AuditRecord } from '@/lib/schemas'
import { AuditPreviewDocument } from '@/components/audit/audit-preview-document'
import { DocumentShell } from '@/components/audit/document-shell'

export default function PreviewAuditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const isPrintMode = searchParams.get('print') === '1'
  const [audit, setAudit] = useState<AuditRecord | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const data = getAudit(id)
    setAudit(data)
  }, [id])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading...</div>
      </div>
    )
  }

  if (!audit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Audit not found</h2>
          <button
            onClick={() => router.push('/')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Return to dashboard
          </button>
        </div>
      </div>
    )
  }

  if (isPrintMode) {
    return (
      <div className="bg-white min-h-screen">
        <AuditPreviewDocument audit={audit} forPdf />
      </div>
    )
  }

  return (
    <>
      {/* Action bar */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm no-print">
        <div className="max-w-[8.5in] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              &larr; Dashboard
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-sm font-semibold text-slate-700">Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/audits/${id}/edit`)}
              className="px-4 py-1.5 text-sm font-medium text-slate-700 border border-slate-300 rounded-md
                hover:bg-slate-50 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md
                hover:bg-blue-700 transition-colors"
            >
              Print as PDF
            </button>
          </div>
        </div>
      </div>
      <DocumentShell>
        <AuditPreviewDocument audit={audit} />
      </DocumentShell>
    </>
  )
}
