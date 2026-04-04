export type AuditOption = 'yes' | 'no' | 'na'

export type AuditTemplateQuestion = {
  id: string
  order: number
  prompt: string
  guidance?: string
  requiresComment?: boolean
}

export const AUDIT_TEMPLATE: AuditTemplateQuestion[] = [
  {
    id: 'history-documented',
    order: 1,
    prompt: 'Was the history adequately documented, including pertinent past medical history, social history, family, and review of symptoms?',
    guidance:
      'The provider must document sufficient history of present illness for the reviewer to clearly understand the patient\'s medical problem.\n-The provider must document important PMI, SH, FH, and ROS.',
  },
  {
    id: 'physical-exam-appropriate',
    order: 2,
    prompt: 'Was the physical examination appropriate for the problem or diagnosis?',
    guidance:
      'The provider must document necessary elements of the physical examination to evaluate the problem and support the diagnosis.',
  },
  {
    id: 'assessment-diagnosis-appropriate',
    order: 3,
    prompt: 'Was the assessment/diagnosis appropriate?',
    guidance:
      'The provider\'s diagnosis is sufficiently supported by the information obtained during the visit.\nProvider may use symptoms or abnormal findings as a diagnosis.',
  },
  {
    id: 'diagnostic-tests-labs-ordered',
    order: 4,
    prompt: 'Were appropriate diagnostic tests and labs ordered?',
    guidance:
      'The provider should order appropriate diagnostic tests and laboratory studies to investigate the patient\'s problem.',
  },
  {
    id: 'medication-dosage-duration',
    order: 5,
    prompt: 'Were appropriate medication, dosage, and duration used?',
    guidance:
      'The provider did not order medication to which the patient was allergic or was contraindicated due to a medical condition or drug interaction.',
  },
  {
    id: 'non-pharmacological-treatment',
    order: 6,
    prompt: 'Were appropriate non-pharmacological treatment procedures ordered.',
    guidance:
      'The provider ordered appropriate non-pharmacological treatments (exercise, warm compress).',
  },
  {
    id: 'chart-entry-legible',
    order: 7,
    prompt: 'Was the chart entry legible?',
  },
  {
    id: 'periodic-health-maintenance',
    order: 8,
    prompt: 'Was periodic health maintenance attempted at each visit?',
    guidance:
      'The provider documents that appropriate preventive health measures were recommended.',
  },
  {
    id: 'consultations-referrals',
    order: 9,
    prompt: 'Were appropriate consultations and referrals used.',
    guidance:
      'The provider must seek appropriate consultation or refer the patient to care when not available within the internal system.',
  },
  {
    id: 'patient-education',
    order: 10,
    prompt: 'Was appropriate patient education provided:',
    guidance:
      'The provider must document that verbal or written education as given to patient about medical problem and treatments ordered.',
  },
  {
    id: 'medications-on-list-accurate',
    order: 11,
    prompt: 'Are all ordered medications on the medication list, and accurate?',
  },
  {
    id: 'diagnostic-tests-treatments-accomplished',
    order: 12,
    prompt: 'Have all diagnostic tests and treatments been accomplished?',
    guidance:
      'Documentation shows that ordered diagnostic tests and treatments that were ordered by the provider have been accomplished.\nIf tests and treatments were not completed, there is documentation for lack of completion.',
  },
  {
    id: 'followup-abnormal-findings',
    order: 13,
    prompt: 'Was follow up of abnormal findings, lab, or other studies adequate, complete, and documented?',
    guidance:
      'Follow up of abnormalities on history, physical exam, lab studies, or other diagnostic studies should be thorough and complete.\nProviders should document that follow up of abnormalities have been accomplished.',
  },
  {
    id: 'chronic-problems-followup',
    order: 14,
    prompt: 'Are chronic problems followed up at appropriate intervals?',
    guidance:
      'Documentation shows that the patient with chronic medical problems is being followed with the appropriate frequency.',
  },
  {
    id: 'patient-tracked-appropriately',
    order: 15,
    prompt: 'Was the patient tracked appropriately?',
    guidance:
      'Documentation shows that the patient follow-up was conducted to assess significant problems.',
  },
  {
    id: 'lab-xray-referral-signed',
    order: 16,
    prompt: 'Was lab, x-ray and referral data signed by a clinician?',
    guidance:
      'All lab report, and referral reports must be signed and dated by a provider before filing in the chart.',
  },
  {
    id: 'avoids-unapproved-abbreviations',
    order: 17,
    prompt: 'Avoids using unapproved abbreviations.',
  },
]
