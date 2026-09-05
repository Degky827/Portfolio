import { useState, useCallback, useRef } from 'react'

function buildPrintHTML(element, name) {
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map(s => s.outerHTML)
    .join('\n')

  return `<!DOCTYPE html>
<html><head><title>${name || 'CV'}</title>${styles}
<style>
  @page { margin: 0; size: A4; }
  body { margin: 0; padding: 0; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .cv-page { padding: 0 !important; min-height: auto !important; background: #fff !important; }
  .cv-actions, .no-print, nav, footer { display: none !important; }
  .cv-container { box-shadow: none !important; border: none !important; border-radius: 0 !important; max-width: 100% !important; margin: 0 !important; transform: none !important; overflow: visible !important; }
  .cv-sidebar { background: #1a1f36 !important; color: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .cv-main { background: #fff !important; }
</style></head><body>
<div class="cv-page">${element.outerHTML}</div>
</body></html>`
}

export default function usePDFGenerator() {
  const [generating, setGenerating] = useState(false)
  const busyRef = useRef(false)

  const generatePDF = useCallback(async (element, filename = 'cv') => {
    if (!element || busyRef.current) return

    busyRef.current = true
    setGenerating(true)

    try {
      const { default: html2canvas } = await import('html2canvas')
      const { jsPDF } = await import('jspdf')

      const win = window.open('', '_blank', 'width=1024,height=768')
      if (!win) throw new Error('Pop-up blocked')

      win.document.write(buildPrintHTML(element, filename))
      win.document.close()

      await new Promise(r => setTimeout(r, 500))

      const imgs = win.document.querySelectorAll('img')
      await Promise.all(Array.from(imgs).map(img =>
        img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r })
      ))

      await new Promise(r => setTimeout(r, 300))

      const target = win.document.querySelector('.cv-container') || win.document.body

      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const imgWidth = canvas.width
      const imgHeight = canvas.height

      const pdfWidth = 595.28
      const pdfHeight = 841.89
      const scale = pdfWidth / imgWidth
      const scaledHeight = imgHeight * scale

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      })

      if (scaledHeight <= pdfHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, scaledHeight)
      } else {
        const pageContentHeight = pdfHeight / scale
        let yOffset = 0
        let pageIndex = 0

        while (yOffset < imgHeight) {
          if (pageIndex > 0) pdf.addPage()

          const pageCanvas = document.createElement('canvas')
          pageCanvas.width = imgWidth
          pageCanvas.height = Math.min(pageContentHeight, imgHeight - yOffset)
          const ctx = pageCanvas.getContext('2d')
          ctx.drawImage(canvas, 0, yOffset, imgWidth, pageCanvas.height, 0, 0, imgWidth, pageCanvas.height)

          const pageImgData = pageCanvas.toDataURL('image/png')
          const pageImgHeight = pageCanvas.height * scale
          pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pageImgHeight)

          yOffset += pageContentHeight
          pageIndex++
        }
      }

      pdf.save(`${filename}.pdf`)
      win.close()
    } catch (err) {
      console.error('[PDF] Generation failed:', err)
      alert('PDF generation failed. Please try again or use the Print button.')
    } finally {
      busyRef.current = false
      setGenerating(false)
    }
  }, [])

  return { generating, generatePDF }
}
