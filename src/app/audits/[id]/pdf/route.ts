import { NextRequest, NextResponse } from 'next/server'
import { generatePdf } from '@/lib/pdf'

export async function POST(request: NextRequest) {
  try {
    const audit = await request.json()
    const pdfBuffer = await generatePdf(audit)

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="audit-${audit.id}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('PDF generation failed:', error)
    return NextResponse.json(
      { error: 'PDF generation failed' },
      { status: 500 }
    )
  }
}
