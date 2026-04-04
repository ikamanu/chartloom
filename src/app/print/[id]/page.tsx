'use client'

import { use, useEffect, useState } from 'react'
import { getAudit } from '@/lib/db'
import type { AuditRecord } from '@/lib/schemas'
import { AUDIT_TEMPLATE } from '@/lib/audit-template'
import type { AuditOption } from '@/lib/audit-template'
import { formatDate } from '@/lib/utils'

export default function PrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [audit, setAudit] = useState<AuditRecord | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setAudit(getAudit(id))
  }, [id])

  if (!mounted || !audit) {
    return <div>Loading...</div>
  }

  const responseMap = new Map(audit.responses.map((r) => [r.questionId, r]))

  return (
    <html>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      </head>
      <body>
        {/* Header block */}
        <div className="header-block">
          <h1 className="title">NCTR Peer Review Chart Audit Form</h1>
          <div className="meta-grid">
            <div className="meta-row">
              <span className="meta-label">Chart #:</span>
              <span className="meta-value">{audit.header.chartNumber}</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">Site:</span>
              <span className="meta-value">{audit.header.site}</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">Audit date:</span>
              <span className="meta-value">{formatDate(audit.header.auditDate)}</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">Reviewer:</span>
              <span className="meta-value">{audit.header.reviewer}</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">Last visit date:</span>
              <span className="meta-value">{formatDate(audit.header.lastVisitDate)}</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">Clinician(s):</span>
              <span className="meta-value">{audit.header.clinicians}</span>
            </div>
          </div>
        </div>

        {/* Audit table */}
        <table>
          <thead>
            <tr>
              <th style={{ width: '60%' }}>Parameters</th>
              <th style={{ width: '16%' }}>Options</th>
              <th style={{ width: '24%' }}>Comments</th>
            </tr>
          </thead>
          <tbody>
            {AUDIT_TEMPLATE.map((q) => {
              const r = responseMap.get(q.id)
              const selected = (r?.selectedOption as AuditOption) ?? null
              return (
                <tr key={q.id}>
                  <td>
                    <div className="prompt">{q.prompt}</div>
                    {q.guidance && (
                      <div className="guidance">{q.guidance}</div>
                    )}
                  </td>
                  <td>
                    <div className="options">
                      {(['yes', 'no', 'na'] as const).map((opt) => (
                        <div key={opt} className="option-row">
                          <span className={`checkbox ${selected === opt ? 'checked' : ''}`}>
                            {selected === opt ? '\u2713' : ''}
                          </span>
                          <span className={selected === opt ? 'option-label selected' : 'option-label'}>
                            {opt === 'na' ? 'N/A' : opt === 'yes' ? 'Yes' : 'No'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="comment-cell">
                    {r?.comment || ''}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </body>
    </html>
  )
}

const printStyles = `
  @page {
    size: letter portrait;
    margin: 0.5in;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  body {
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    color: #1e293b;
    line-height: 1.4;
  }

  .header-block {
    margin-bottom: 12px;
  }

  .title {
    text-align: center;
    font-size: 18px;
    font-weight: 700;
    font-style: italic;
    margin-bottom: 12px;
    color: #0f172a;
  }

  .meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px 40px;
  }

  .meta-row {
    display: flex;
    gap: 6px;
    align-items: baseline;
  }

  .meta-label {
    font-weight: 700;
    font-style: italic;
    white-space: nowrap;
    font-size: 11px;
  }

  .meta-value {
    flex: 1;
    border-bottom: 1px solid #94a3b8;
    padding-bottom: 1px;
    font-size: 11px;
    min-height: 14px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #64748b;
    margin-top: 8px;
  }

  thead {
    display: table-header-group;
  }

  th {
    padding: 6px 8px;
    font-size: 11px;
    font-weight: 700;
    text-align: left;
    border: 1px solid #64748b;
    background: white;
  }

  td {
    padding: 6px 8px;
    border: 1px solid #94a3b8;
    vertical-align: top;
    font-size: 10.5px;
  }

  tr {
    break-inside: avoid;
  }

  .prompt {
    font-weight: 500;
    line-height: 1.35;
  }

  .guidance {
    font-style: italic;
    font-size: 9.5px;
    color: #475569;
    margin-top: 3px;
    line-height: 1.35;
    white-space: pre-line;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .option-row {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .checkbox {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 12px;
    height: 12px;
    border: 1.5px solid #64748b;
    font-size: 9px;
    line-height: 1;
    flex-shrink: 0;
    background: white;
  }

  .checkbox.checked {
    background: #1e293b;
    border-color: #1e293b;
    color: white;
    font-weight: 700;
  }

  .option-label {
    font-size: 10.5px;
    color: #475569;
  }

  .option-label.selected {
    font-weight: 600;
    color: #0f172a;
  }

  .comment-cell {
    white-space: pre-wrap;
    font-size: 10.5px;
  }
`
