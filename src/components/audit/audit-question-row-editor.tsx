'use client'

import type { AuditTemplateQuestion, AuditOption } from '@/lib/audit-template'
import { AuditOptionsDisplay } from './audit-options-display'

type Props = {
  question: AuditTemplateQuestion
  selectedOption: AuditOption | null
  comment: string
  onOptionChange: (value: AuditOption) => void
  onCommentChange: (value: string) => void
  error?: string
}

export function AuditQuestionRowEditor({
  question,
  selectedOption,
  comment,
  onOptionChange,
  onCommentChange,
  error,
}: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_160px_1fr] gap-4 py-5 px-5 border-b border-slate-200 last:border-b-0">
      {/* Parameters */}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-slate-900 leading-snug">
          <span className="text-slate-400 font-semibold mr-1.5">{question.order}.</span>
          {question.prompt}
        </p>
        {question.guidance && (
          <p className="text-xs text-slate-500 leading-relaxed mt-1 whitespace-pre-line italic">
            {question.guidance}
          </p>
        )}
      </div>

      {/* Options */}
      <div className="flex flex-col gap-1">
        <AuditOptionsDisplay
          mode="edit"
          value={selectedOption}
          onChange={onOptionChange}
          name={`option-${question.id}`}
        />
        {error && (
          <span className="text-xs text-red-600 mt-1">{error}</span>
        )}
      </div>

      {/* Comments */}
      <div>
        <textarea
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="Comments..."
          rows={2}
          className="w-full px-3 py-2 border border-slate-200 rounded-md bg-slate-50/50 text-sm text-slate-800
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
            transition-colors resize-y placeholder:text-slate-400"
          aria-label={`Comments for question ${question.order}`}
        />
      </div>
    </div>
  )
}
