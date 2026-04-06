import { z } from 'zod'

export const auditOptionSchema = z.enum(['yes', 'no', 'na'])

export const auditHeaderSchema = z.object({
  chartNumber: z.string().min(1, 'Chart # is required'),
  site: z.string().min(1, 'Site is required'),
  auditDate: z.string().min(1, 'Audit date is required'),
  reviewer: z.string().min(1, 'Reviewer is required'),
  lastVisitDate: z.string().min(1, 'Last visit date is required'),
  clinicians: z.string().min(1, 'Clinician(s) is required'),
})

export const auditResponseSchema = z.object({
  questionId: z.string(),
  selectedOption: auditOptionSchema.nullable(),
  comment: z.string(),
})

export const auditRecordSchema = z.object({
  id: z.string(),
  header: auditHeaderSchema,
  responses: z.array(auditResponseSchema),
  additionalNotes: z.string().optional().default(''),
  status: z.enum(['draft', 'completed']),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const auditDraftSchema = z.object({
  header: auditHeaderSchema.partial(),
  responses: z.array(auditResponseSchema),
})

export const auditCompleteSchema = z.object({
  header: auditHeaderSchema,
  responses: z.array(
    auditResponseSchema.refine((r) => r.selectedOption !== null, {
      message: 'All questions must have a selected option',
    })
  ),
})

export type AuditOption = z.infer<typeof auditOptionSchema>
export type AuditHeader = z.infer<typeof auditHeaderSchema>
export type AuditResponse = z.infer<typeof auditResponseSchema>
export type AuditRecord = z.infer<typeof auditRecordSchema>
