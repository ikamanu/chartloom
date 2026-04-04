import type { AuditRecord } from '@/lib/schemas'
import { AUDIT_TEMPLATE } from '@/lib/audit-template'
import { AuditQuestionRowPrint } from './audit-question-row-print'
import type { AuditOption } from '@/lib/audit-template'
import { formatDate } from '@/lib/utils'

type Props = {
  audit: AuditRecord
  forPdf?: boolean
}

function HeaderBlock({ audit }: { audit: AuditRecord }) {
  return (
    <div className="mb-4">
      <h1 className="text-center text-xl font-bold italic text-slate-900 mb-4 tracking-tight">
        NCTR Peer Review Chart Audit Form
      </h1>
      <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
        <div className="flex gap-2">
          <span className="font-bold italic text-slate-800">Chart #:</span>
          <span className="border-b border-slate-400 flex-1 pb-0.5 text-slate-900 min-w-0">
            {audit.header.chartNumber}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="font-bold italic text-slate-800">Site:</span>
          <span className="border-b border-slate-400 flex-1 pb-0.5 text-slate-900 min-w-0">
            {audit.header.site}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="font-bold italic text-slate-800">Audit date:</span>
          <span className="border-b border-slate-400 flex-1 pb-0.5 text-slate-900 min-w-0">
            {formatDate(audit.header.auditDate)}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="font-bold italic text-slate-800">Reviewer:</span>
          <span className="border-b border-slate-400 flex-1 pb-0.5 text-slate-900 min-w-0">
            {audit.header.reviewer}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="font-bold italic text-slate-800">Last visit date:</span>
          <span className="border-b border-slate-400 flex-1 pb-0.5 text-slate-900 min-w-0">
            {formatDate(audit.header.lastVisitDate)}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="font-bold italic text-slate-800">Clinician(s):</span>
          <span className="border-b border-slate-400 flex-1 pb-0.5 text-slate-900 min-w-0">
            {audit.header.clinicians}
          </span>
        </div>
      </div>
    </div>
  )
}

export function AuditPreviewDocument({ audit, forPdf }: Props) {
  const responseMap = new Map(
    audit.responses.map((r) => [r.questionId, r])
  )

  return (
    <div
      className={
        forPdf
          ? 'bg-white text-slate-900 font-sans'
          : 'bg-white text-slate-900 font-sans max-w-[8.5in] mx-auto shadow-lg rounded-sm'
      }
      style={forPdf ? { width: '100%' } : undefined}
    >
      <div className={forPdf ? 'p-0' : 'p-8'}>
        <HeaderBlock audit={audit} />

        <table className="w-full border-collapse border border-slate-400 text-left">
          <thead style={{ display: 'table-header-group' }}>
            <tr className="bg-white">
              <th className="py-2 px-3 text-sm font-bold text-slate-900 border border-slate-400 w-[60%]">
                Parameters
              </th>
              <th className="py-2 px-3 text-sm font-bold text-slate-900 border border-slate-400 w-[16%]">
                Options
              </th>
              <th className="py-2 px-3 text-sm font-bold text-slate-900 border border-slate-400 w-[24%]">
                Comments
              </th>
            </tr>
          </thead>
          <tbody>
            {AUDIT_TEMPLATE.map((question) => {
              const response = responseMap.get(question.id)
              return (
                <AuditQuestionRowPrint
                  key={question.id}
                  question={question}
                  selectedOption={(response?.selectedOption as AuditOption) ?? null}
                  comment={response?.comment ?? ''}
                />
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
