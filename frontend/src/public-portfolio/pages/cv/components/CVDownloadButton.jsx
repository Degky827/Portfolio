import { Download, Printer, Loader2 } from 'lucide-react'
import usePDFGenerator from '../hooks/usePDFGenerator'

export default function CVDownloadButton({ targetRef, name, showDownload = true, showPrint = true }) {
  const { generating, generatePDF } = usePDFGenerator()

  const handleDownload = async () => {
    const element = targetRef?.current
    if (!element) {
      alert('CV content not ready. Please wait a moment and try again.')
      return
    }
    const filename = name ? name.replace(/\s+/g, '_') + '_CV' : 'CV'
    await generatePDF(element, filename)
  }

  const handlePrint = () => {
    const element = targetRef?.current
    if (!element) return

    const printWindow = window.open('', '_blank', 'width=1024,height=768')
    if (!printWindow) {
      alert('Pop-up blocked. Please allow pop-ups for this site.')
      return
    }

    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(s => s.outerHTML)
      .join('\n')

    printWindow.document.write(`<!DOCTYPE html>
<html><head><title>${name || 'CV'} — Print</title>${styles}
<style>
  @media print { body { margin: 0; } }
  body { margin: 0; padding: 0; background: #fff; }
  .cv-page { padding: 0 !important; min-height: auto !important; background: #fff !important; }
  .cv-actions, .no-print, nav, footer { display: none !important; }
  .cv-container { box-shadow: none !important; border: none !important; border-radius: 0 !important; max-width: 100% !important; margin: 0 !important; transform: none !important; }
</style></head><body>
<div class="cv-page">${element.outerHTML}</div>
</body></html>`)

    printWindow.document.close()

    const imgs = printWindow.document.querySelectorAll('img')
    let loaded = 0
    const total = imgs.length || 1
    const check = () => { if (++loaded >= total) setTimeout(() => { printWindow.print(); printWindow.close(); }, 300) }
    imgs.forEach(img => { if (img.complete) check(); else { img.onload = check; img.onerror = check; } })
    if (imgs.length === 0) setTimeout(() => { printWindow.print(); printWindow.close(); }, 300)
  }

  if (!showDownload && !showPrint) return null

  return (
    <div className="cv-actions no-print">
      {showDownload && (
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
      )}
      {showPrint && (
        <button
          onClick={handlePrint}
          className="cv-action-btn cv-action-btn-secondary"
          aria-label="Print CV"
        >
          <Printer size={16} />
          <span>Print</span>
        </button>
      )}
    </div>
  )
}
