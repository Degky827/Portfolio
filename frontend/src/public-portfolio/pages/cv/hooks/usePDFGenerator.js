import { useState, useCallback, useRef } from 'react'

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

      const clone = element.cloneNode(true)
      clone.style.position = 'fixed'
      clone.style.top = '0'
      clone.style.left = '0'
      clone.style.width = '960px'
      clone.style.zIndex = '-9999'
      clone.style.opacity = '1'
      clone.style.transform = 'none'
      clone.style.overflow = 'visible'
      clone.style.borderRadius = '0'
      clone.style.boxShadow = 'none'
      clone.style.border = 'none'
      clone.style.margin = '0'
      clone.style.background = '#ffffff'

      const sidebar = clone.querySelector('.cv-sidebar')
      if (sidebar) {
        sidebar.style.background = '#1a1f36'
        sidebar.style.color = '#ffffff'
      }

      document.body.appendChild(clone)

      await new Promise(r => setTimeout(r, 200))

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 960,
        windowWidth: 960,
      })

      document.body.removeChild(clone)

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
