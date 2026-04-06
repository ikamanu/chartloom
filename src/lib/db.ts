import type { AuditRecord, AuditHeader, AuditResponse } from './schemas'
import { AUDIT_TEMPLATE } from './audit-template'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'chartloom_audits'

function getAll(): AuditRecord[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveAll(records: AuditRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

export function listAudits(): AuditRecord[] {
  return getAll().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

export function getAudit(id: string): AuditRecord | null {
  return getAll().find((r) => r.id === id) ?? null
}

export function createAudit(header?: Partial<AuditHeader>): AuditRecord {
  const now = new Date().toISOString()
  const record: AuditRecord = {
    id: uuidv4(),
    header: {
      chartNumber: header?.chartNumber ?? '',
      site: header?.site ?? '',
      auditDate: header?.auditDate ?? new Date().toISOString().split('T')[0],
      reviewer: header?.reviewer ?? '',
      lastVisitDate: header?.lastVisitDate ?? '',
      clinicians: header?.clinicians ?? '',
    },
    responses: AUDIT_TEMPLATE.map((q) => ({
      questionId: q.id,
      selectedOption: null,
      comment: '',
    })),
    additionalNotes: '',
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  }
  const all = getAll()
  all.push(record)
  saveAll(all)
  return record
}

export function updateAudit(
  id: string,
  updates: {
    header?: Partial<AuditHeader>
    responses?: AuditResponse[]
    additionalNotes?: string
    status?: 'draft' | 'completed'
  }
): AuditRecord | null {
  const all = getAll()
  const idx = all.findIndex((r) => r.id === id)
  if (idx === -1) return null
  const record = all[idx]
  if (updates.header) {
    record.header = { ...record.header, ...updates.header }
  }
  if (updates.responses) {
    record.responses = updates.responses
  }
  if (updates.additionalNotes !== undefined) {
    record.additionalNotes = updates.additionalNotes
  }
  if (updates.status) {
    record.status = updates.status
  }
  record.updatedAt = new Date().toISOString()
  all[idx] = record
  saveAll(all)
  return record
}

export function deleteAudit(id: string): boolean {
  const all = getAll()
  const filtered = all.filter((r) => r.id !== id)
  if (filtered.length === all.length) return false
  saveAll(filtered)
  return true
}
