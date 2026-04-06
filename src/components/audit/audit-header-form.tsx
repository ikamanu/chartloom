'use client'

import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { AuditHeader } from '@/lib/schemas'

type FormValues = {
  header: Partial<AuditHeader>
  responses: { questionId: string; selectedOption: string | null; comment: string }[]
  additionalNotes: string
}

type Props = {
  register: UseFormRegister<FormValues>
  errors: FieldErrors<FormValues>
}

const fields: { name: keyof AuditHeader; label: string; type: string }[] = [
  { name: 'chartNumber', label: 'Chart #', type: 'text' },
  { name: 'site', label: 'Site', type: 'text' },
  { name: 'auditDate', label: 'Audit Date', type: 'date' },
  { name: 'reviewer', label: 'Reviewer', type: 'text' },
  { name: 'lastVisitDate', label: 'Last Visit Date', type: 'date' },
  { name: 'clinicians', label: 'Clinician(s)', type: 'text' },
]

export function AuditHeaderForm({ register, errors }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col gap-1.5">
          <label
            htmlFor={`header.${field.name}`}
            className="text-sm font-semibold text-slate-700 tracking-wide"
          >
            {field.label}
          </label>
          <input
            id={`header.${field.name}`}
            type={field.type}
            {...register(`header.${field.name}`)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
              transition-colors placeholder:text-slate-400"
            placeholder={field.label}
          />
          {errors.header?.[field.name] && (
            <span className="text-xs text-red-600">
              {errors.header[field.name]?.message}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
