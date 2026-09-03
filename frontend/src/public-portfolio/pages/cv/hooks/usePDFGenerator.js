import { useState, useCallback } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

/**
 * Hook for generating PDF from a DOM element.
 * Uses html2canvas to capture the element, then jsPDF to create the PDF.
 */
export default function usePDFGenerator() {
  const [generating, setGenerating] = useState(false)

  const generatePDF = useCallback(async (element, filename = 'cv') => {
    if (!element || generating) return

    setGenerating(true)

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      })

      const imgData = canvas.toDataURL('image/png')
      const imgWidth = canvas.width
      const imgHeight = canvas.height

      // A4 dimensions in points
      const pdfWidth = 595.28
      const pdfHeight = 841.89

      // Scale to fit A4 width
      const scale = pdfWidth / imgWidth
      const scaledHeight = imgHeight * scale

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      })

      // If the content fits on one page
      if (scaledHeight <= pdfHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, scaledHeight)
      } else {
        // Multi-page: slice the canvas
        const pageContentHeight = pdfHeight / scale
        let yOffset = 0
        let pageIndex = 0

        while (yOffset < imgHeight) {
          if (pageIndex > 0) {
            pdf.addPage()
          }

          // Create a temporary canvas for this page slice
          const pageCanvas = document.createElement('canvas')
          pageCanvas.width = imgWidth
          pageCanvas.height = Math.min(pageContentHeight, imgHeight - yOffset)
          const ctx = pageCanvas.getContext('2d')

          ctx.drawImage(
            canvas,
            0, yOffset, imgWidth, pageCanvas.height,
            0, 0, imgWidth, pageCanvas.height
          )

          const pageImgData = pageCanvas.toDataURL('image/png')
          const pageImgHeight = pageCanvas.height * scale

          pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pageImgHeight)

          yOffset += pageContentHeight
          pageIndex++
        }
      }

      pdf.save(`${filename}.pdf`)
    } catch (err) {
      console.error('[PDF] Generation failed:', err)
    } finally {
      setGenerating(false)
    }
  }, [generating])

  return { generating, generatePDF }
}
