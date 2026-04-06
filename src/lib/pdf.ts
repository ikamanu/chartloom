import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'
import { AUDIT_TEMPLATE } from './audit-template'
import type { AuditRecord } from './schemas'

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export function buildPrintHtml(audit: AuditRecord): string {
  const responseMap = new Map(audit.responses.map((r) => [r.questionId, r]))

  const rows = AUDIT_TEMPLATE.map((q) => {
    const r = responseMap.get(q.id)
    const selected = r?.selectedOption ?? null

    const optionsHtml = (['yes', 'no', 'na'] as const)
      .map((opt) => {
        const isSelected = selected === opt
        const label = opt === 'na' ? 'N/A' : opt === 'yes' ? 'Yes' : 'No'
        return `<div class="option-row">
          <span class="checkbox ${isSelected ? 'checked' : ''}">${isSelected ? '&#10003;' : ''}</span>
          <span class="option-label ${isSelected ? 'selected' : ''}">${label}</span>
        </div>`
      })
      .join('')

    const guidanceHtml = q.guidance
      ? `<div class="guidance">${q.guidance.replace(/\n/g, '<br/>')}</div>`
      : ''

    return `<tr>
      <td>
        <div class="prompt">${q.prompt}</div>
        ${guidanceHtml}
      </td>
      <td><div class="options">${optionsHtml}</div></td>
      <td class="comment-cell">${r?.comment ?? ''}</td>
    </tr>`
  }).join('')

  return `<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    @page { size: letter portrait; margin: 0.5in; }
    * { margin: 0; padding: 0; box-sizing: border-box; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    body { font-family: 'Outfit', sans-serif; font-size: 11px; color: #1e293b; line-height: 1.4; }
    .header-block { margin-bottom: 12px; }
    .title { text-align: center; font-size: 18px; font-weight: 700; font-style: italic; margin-bottom: 12px; color: #0f172a; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 40px; }
    .meta-row { display: flex; gap: 6px; align-items: baseline; }
    .meta-label { font-weight: 700; font-style: italic; white-space: nowrap; font-size: 11px; }
    .meta-value { flex: 1; border-bottom: 1px solid #94a3b8; padding-bottom: 1px; font-size: 11px; min-height: 14px; }
    table { width: 100%; border-collapse: collapse; border: 1px solid #64748b; margin-top: 8px; }
    thead { display: table-header-group; }
    th { padding: 6px 8px; font-size: 11px; font-weight: 700; text-align: left; border: 1px solid #64748b; background: white; }
    td { padding: 5px 6px; border: 1px solid #94a3b8; vertical-align: top; font-size: 9.5px; }
    tr { break-inside: avoid; }
    .prompt { font-weight: 500; line-height: 1.3; font-size: 9.5px; }
    .guidance { font-style: italic; font-size: 8.5px; color: #475569; margin-top: 2px; line-height: 1.3; }
    .options { display: flex; flex-direction: column; gap: 2px; }
    .option-row { display: flex; align-items: center; gap: 5px; }
    .checkbox { display: inline-flex; align-items: center; justify-content: center; width: 12px; height: 12px; border: 1.5px solid #64748b; font-size: 9px; line-height: 1; flex-shrink: 0; background: white; }
    .checkbox.checked { background: #1e293b; border-color: #1e293b; color: white; font-weight: 700; }
    .option-label { font-size: 9.5px; color: #475569; }
    .option-label.selected { font-weight: 600; color: #0f172a; }
    .comment-cell { white-space: pre-wrap; font-size: 10.5px; }
    .additional-notes { margin-top: 12px; border: 1px solid #64748b; padding: 8px 10px; }
    .additional-notes-title { font-size: 11px; font-weight: 700; margin-bottom: 4px; }
    .additional-notes-content { font-size: 10.5px; white-space: pre-wrap; line-height: 1.4; }
  </style>
</head>
<body>
  <div class="header-block">
    <h1 class="title">NCTR Peer Review Chart Audit Form</h1>
    <div class="meta-grid">
      <div class="meta-row"><span class="meta-label">Chart #:</span><span class="meta-value">${audit.header.chartNumber}</span></div>
      <div class="meta-row"><span class="meta-label">Site:</span><span class="meta-value">${audit.header.site}</span></div>
      <div class="meta-row"><span class="meta-label">Audit date:</span><span class="meta-value">${formatDate(audit.header.auditDate)}</span></div>
      <div class="meta-row"><span class="meta-label">Reviewer:</span><span class="meta-value">${audit.header.reviewer}</span></div>
      <div class="meta-row"><span class="meta-label">Last visit date:</span><span class="meta-value">${formatDate(audit.header.lastVisitDate)}</span></div>
      <div class="meta-row"><span class="meta-label">Clinician(s):</span><span class="meta-value">${audit.header.clinicians}</span></div>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width:35%">Parameters</th>
        <th style="width:13%">Options</th>
        <th style="width:52%">Comments</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  ${audit.additionalNotes ? `<div class="additional-notes">
    <h2 class="additional-notes-title">Additional Notes</h2>
    <p class="additional-notes-content">${audit.additionalNotes}</p>
  </div>` : ''}
</body>
</html>`
}

async function getBrowser() {
  const isDev = process.env.NODE_ENV === 'development'

  if (isDev) {
    return puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: { width: 1920, height: 1080 },
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: true,
    })
  }

  return puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: 1920, height: 1080 },
    executablePath: await chromium.executablePath(),
    headless: 'shell',
  })
}

export async function generatePdf(audit: AuditRecord): Promise<Buffer> {
  const html = buildPrintHtml(audit)

  const browser = await getBrowser()

  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)

  const pdf = await page.pdf({
    format: 'Letter',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
  })

  await browser.close()
  return Buffer.from(pdf)
}
