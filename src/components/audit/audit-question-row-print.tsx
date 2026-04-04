import type { AuditTemplateQuestion, AuditOption } from '@/lib/audit-template'
import { AuditOptionsDisplay } from './audit-options-display'

type Props = {
  question: AuditTemplateQuestion
  selectedOption: AuditOption | null
  comment: string
}

export function AuditQuestionRowPrint({ question, selectedOption, comment }: Props) {
  return (
    <tr className="border-b border-slate-300 align-top">
      {/* Parameters */}
      <td className="py-2.5 px-3 text-sm leading-snug border-r border-slate-300">
        <span className="font-medium text-slate-900">{question.prompt}</span>
        {question.guidance && (
          <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line italic">
            {question.guidance}
          </p>
        )}
      </td>

      {/* Options */}
      <td className="py-2.5 px-3 border-r border-slate-300">
        <AuditOptionsDisplay mode="print" value={selectedOption} />
      </td>

      {/* Comments */}
      <td className="py-2.5 px-3 text-sm text-slate-800 whitespace-pre-wrap">
        {comment || ''}
      </td>
    </tr>
  )
}
