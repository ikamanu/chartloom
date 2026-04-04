type Props = {
  children: React.ReactNode
}

export function DocumentShell({ children }: Props) {
  return (
    <div className="min-h-screen bg-stone-100 py-8 px-4 print:bg-white print:py-0 print:px-0">
      <div className="max-w-[8.5in] mx-auto">
        {children}
      </div>
    </div>
  )
}
