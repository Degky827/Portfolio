import { useRef } from 'react'
import { Download, Printer, Loader2 } from 'lucide-react'
import usePDFGenerator from '../hooks/usePDFGenerator'

export default function CVDownloadButton({ targetRef, name }) {
  const { generating, generatePDF } = usePDFGenerator()

  const handleDownload = async () => {
    const element = targetRef?.current
    if (!element) return
    const filename = name ? name.replace(/\s+/g, '_') + '_CV' : 'CV'
    await generatePDF(element, filename)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="cv-actions no-print">
      <button
        onClick={handleDownload}
        disabled={generating}
        className="cv-action-btn cv-action-btn-primary"
        aria-label="Download CV as PDF"
      >
        {generating ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Download size={16} />
        )}
        <span>{generating ? 'Generating...' : 'Download PDF'}</span>
      </button>
      <button
        onClick={handlePrint}
        className="cv-action-btn cv-action-btn-secondary"
        aria-label="Print CV"
      >
        <Printer size={16} />
        <span>Print</span>
      </button>
    </div>
  )
}
