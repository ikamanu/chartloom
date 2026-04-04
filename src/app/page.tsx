'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { listAudits, createAudit, deleteAudit } from '@/lib/db'
import type { AuditRecord } from '@/lib/schemas'
import { formatDate } from '@/lib/utils'

export default function DashboardPage() {
  const router = useRouter()
  const [audits, setAudits] = useState<AuditRecord[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setAudits(listAudits())
  }, [])

  const handleNewAudit = () => {
    const audit = createAudit()
    router.push(`/audits/${audit.id}/edit`)
  }

  const handleDelete = (id: string) => {
    deleteAudit(id)
    setAudits(listAudits())
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              ChartLoom
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Clinical Chart Audit System
            </p>
          </div>
          <button
            onClick={handleNewAudit}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg
              hover:bg-blue-700 transition-colors shadow-sm"
          >
            + New Audit
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {audits.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">No audits yet</h3>
            <p className="text-sm text-slate-500 mb-6">Create your first chart audit to get started.</p>
            <button
              onClick={handleNewAudit}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg
                hover:bg-blue-700 transition-colors"
            >
              + New Audit
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Recent Audits
            </h2>
            {audits.map((audit) => (
              <div
                key={audit.id}
                className="bg-white rounded-lg border border-slate-200 p-5 hover:border-slate-300 transition-colors shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full
                          ${audit.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                      >
                        {audit.status === 'completed' ? 'Completed' : 'Draft'}
                      </span>
                      {audit.header.chartNumber && (
                        <span className="text-sm font-medium text-slate-700">
                          Chart #{audit.header.chartNumber}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      {audit.header.site && <span>Site: {audit.header.site}</span>}
                      {audit.header.reviewer && <span>Reviewer: {audit.header.reviewer}</span>}
                      {audit.header.auditDate && <span>Date: {formatDate(audit.header.auditDate)}</span>}
                      <span>
                        {audit.responses.filter((r) => r.selectedOption).length}/{audit.responses.length} answered
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 ml-4">
                    <button
                      onClick={() => router.push(`/audits/${audit.id}/edit`)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-md
                        hover:bg-slate-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => router.push(`/audits/${audit.id}/preview`)}
                      className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-md
                        hover:bg-blue-50 transition-colors"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => handleDelete(audit.id)}
                      className="px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-md
                        hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
