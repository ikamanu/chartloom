'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AUDIT_TEMPLATE } from '@/lib/audit-template'
import type { AuditOption } from '@/lib/audit-template'
import { auditHeaderSchema } from '@/lib/schemas'
import type { AuditRecord } from '@/lib/schemas'
import { createAudit, updateAudit, getAudit } from '@/lib/db'
import { AuditHeaderForm } from './audit-header-form'
import { AuditQuestionRowEditor } from './audit-question-row-editor'

const formSchema = z.object({
  header: auditHeaderSchema.partial(),
  responses: z.array(
    z.object({
      questionId: z.string(),
      selectedOption: z.string().nullable(),
      comment: z.string(),
    })
  ),
})

type FormValues = z.infer<typeof formSchema>

type Props = {
  auditId?: string
}

export function AuditForm({ auditId }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [currentId, setCurrentId] = useState<string | null>(auditId ?? null)
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const defaultResponses = AUDIT_TEMPLATE.map((q) => ({
    questionId: q.id,
    selectedOption: null as string | null,
    comment: '',
  }))

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      header: {
        chartNumber: '',
        site: '',
        auditDate: new Date().toISOString().split('T')[0],
        reviewer: '',
        lastVisitDate: '',
        clinicians: '',
      },
      responses: defaultResponses,
    },
  })

  const { register, watch, setValue, formState: { errors } } = form

  // Load existing audit
  useEffect(() => {
    if (auditId) {
      const audit = getAudit(auditId)
      if (audit) {
        form.reset({
          header: audit.header,
          responses: audit.responses,
        })
        setCurrentId(audit.id)
      }
    }
  }, [auditId, form])

  const saveAudit = useCallback(() => {
    const values = form.getValues()
    setSaving(true)

    if (currentId) {
      updateAudit(currentId, {
        header: values.header as AuditRecord['header'],
        responses: values.responses.map((r) => ({
          ...r,
          selectedOption: r.selectedOption as AuditOption | null,
        })),
      })
    } else {
      const created = createAudit(values.header)
      setCurrentId(created.id)
      updateAudit(created.id, {
        responses: values.responses.map((r) => ({
          ...r,
          selectedOption: r.selectedOption as AuditOption | null,
        })),
      })
      // Update URL without full navigation
      window.history.replaceState(null, '', `/audits/${created.id}/edit`)
    }

    setLastSaved(new Date().toLocaleTimeString())
    setSaving(false)
  }, [currentId, form])

  // Auto-save on changes
  useEffect(() => {
    const subscription = watch(() => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
      autoSaveTimer.current = setTimeout(saveAudit, 2000)
    })
    return () => {
      subscription.unsubscribe()
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    }
  }, [watch, saveAudit])

  const responses = watch('responses')

  const allAnswered = responses.every((r) => r.selectedOption !== null)

  const handleComplete = () => {
    saveAudit()
    if (currentId) {
      updateAudit(currentId, { status: 'completed' })
      router.push(`/audits/${currentId}/preview`)
    }
  }

  const handlePreview = () => {
    saveAudit()
    if (currentId) {
      router.push(`/audits/${currentId}/preview`)
    }
  }

  const handleExportPdf = async () => {
    saveAudit()
    if (!currentId) return
    const audit = getAudit(currentId)
    if (!audit) return

    const res = await fetch(`/audits/${currentId}/pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(audit),
    })
    if (!res.ok) return alert('PDF generation failed')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Sticky action bar */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm no-print">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              &larr; Dashboard
            </button>
            <span className="text-slate-300">|</span>
            <h1 className="text-sm font-semibold text-slate-700">
              {currentId ? 'Edit Audit' : 'New Audit'}
            </h1>
            {lastSaved && (
              <span className="text-xs text-slate-400">
                {saving ? 'Saving...' : `Saved ${lastSaved}`}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={saveAudit}
              className="px-4 py-1.5 text-sm font-medium text-slate-700 border border-slate-300 rounded-md
                hover:bg-slate-50 transition-colors"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={handlePreview}
              disabled={!currentId}
              className="px-4 py-1.5 text-sm font-medium text-blue-700 border border-blue-300 rounded-md
                hover:bg-blue-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Preview
            </button>
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={!currentId}
              className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md
                hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Export PDF
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold italic text-slate-900 tracking-tight">
            NCTR Peer Review Chart Audit Form
          </h2>
        </div>

        {/* Header fields */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6 shadow-sm">
          <AuditHeaderForm register={register} errors={errors} />
        </div>

        {/* Audit questions */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_160px_1fr] gap-4 py-3 px-5 bg-slate-50 border-b border-slate-300">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Parameters</span>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Options</span>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Comments</span>
          </div>

          {AUDIT_TEMPLATE.map((question, idx) => (
            <AuditQuestionRowEditor
              key={question.id}
              question={question}
              selectedOption={responses[idx]?.selectedOption as AuditOption | null}
              comment={responses[idx]?.comment ?? ''}
              onOptionChange={(value) => {
                setValue(`responses.${idx}.selectedOption`, value, { shouldDirty: true })
              }}
              onCommentChange={(value) => {
                setValue(`responses.${idx}.comment`, value, { shouldDirty: true })
              }}
            />
          ))}
        </div>

        {/* Bottom actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleComplete}
            disabled={!allAnswered}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-md
              hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed
              shadow-sm"
          >
            {allAnswered ? 'Complete Audit' : `Complete Audit (${responses.filter(r => r.selectedOption).length}/${responses.length} answered)`}
          </button>
        </div>
      </div>
    </div>
  )
}
