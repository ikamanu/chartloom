'use client'

import type { AuditOption } from '@/lib/audit-template'
import { cn } from '@/lib/utils'

type EditProps = {
  mode: 'edit'
  value: AuditOption | null
  onChange: (value: AuditOption) => void
  name: string
}

type PrintProps = {
  mode: 'print'
  value: AuditOption | null
}

type Props = EditProps | PrintProps

const OPTIONS: { value: AuditOption; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'na', label: 'N/A' },
]

export function AuditOptionsDisplay(props: Props) {
  if (props.mode === 'print') {
    return (
      <div className="flex flex-col gap-1">
        {OPTIONS.map((opt) => {
          const selected = props.value === opt.value
          return (
            <div key={opt.value} className="flex items-center gap-2">
              <span
                className={cn(
                  'inline-flex items-center justify-center w-[14px] h-[14px] border text-[10px] leading-none flex-shrink-0',
                  selected
                    ? 'border-slate-800 bg-slate-800 text-white font-bold'
                    : 'border-slate-400 bg-white'
                )}
                aria-hidden="true"
              >
                {selected ? '✓' : ''}
              </span>
              <span
                className={cn(
                  'text-sm',
                  selected ? 'font-semibold text-slate-900' : 'text-slate-600'
                )}
              >
                {opt.label}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5" role="radiogroup" aria-label="Option selection">
      {OPTIONS.map((opt) => {
        const selected = props.value === opt.value
        return (
          <label
            key={opt.value}
            className={cn(
              'flex items-center gap-2.5 px-3 py-1.5 rounded-md cursor-pointer transition-all text-sm border',
              selected
                ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold shadow-sm'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            )}
          >
            <input
              type="radio"
              name={props.name}
              value={opt.value}
              checked={selected}
              onChange={() => props.onChange(opt.value)}
              className="sr-only"
            />
            <span
              className={cn(
                'inline-flex items-center justify-center w-4 h-4 border-2 rounded-sm text-[10px] leading-none flex-shrink-0',
                selected
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-400 bg-white'
              )}
              aria-hidden="true"
            >
              {selected ? '✓' : ''}
            </span>
            {opt.label}
          </label>
        )
      })}
    </div>
  )
}
