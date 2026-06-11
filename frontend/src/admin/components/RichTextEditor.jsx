import { useRef, useCallback, useEffect } from 'react'

function wrapSelectedText(area, before, after) {
  const sel = window.getSelection()
  if (!sel.rangeCount) return
  const range = sel.getRangeAt(0)
  if (!area.contains(range.commonAncestorContainer)) return
  const selected = range.toString()
  if (!selected) return
  const span = document.createElement('span')
  span.innerHTML = before + selected + after
  range.deleteContents()
  range.insertNode(span)
  sel.removeAllRanges()
  const newRange = document.createRange()
  newRange.selectNodeContents(span)
  sel.addRange(newRange)
}

function insertLink(area) {
  const sel = window.getSelection()
  if (!sel.rangeCount) return
  const range = sel.getRangeAt(0)
  if (!area.contains(range.commonAncestorContainer)) return
  const selected = range.toString()
  const url = prompt('Enter URL:', 'https://')
  if (!url) return
  const displayText = selected || url
  const span = document.createElement('a')
  span.href = url
  span.target = '_blank'
  span.textContent = displayText
  range.deleteContents()
  range.insertNode(span)
  sel.removeAllRanges()
  const newRange = document.createRange()
  newRange.selectNodeContents(span)
  sel.addRange(newRange)
}

function exec(command, val) {
  document.execCommand(command, false, val || null)
}

export default function RichTextEditor({ value, onChange, placeholder = 'Write your content here...' }) {
  const editorRef = useRef(null)
  const isInternal = useRef(false)

  const handleInput = useCallback(() => {
    if (!editorRef.current) return
    isInternal.current = true
    onChange(editorRef.current.innerHTML)
  }, [onChange])

  useEffect(() => {
    if (!editorRef.current || isInternal.current) {
      isInternal.current = false
      return
    }
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleToolbar = useCallback((cmd, val) => (e) => {
    e.preventDefault()
    editorRef.current?.focus()
    exec(cmd, val)
    handleInput()
  }, [handleInput])

  const handleLink = useCallback((e) => {
    e.preventDefault()
    editorRef.current?.focus()
    insertLink(editorRef.current)
    handleInput()
  }, [handleInput])

  return (
    <div className="rich-text-editor border border-gray-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
      <style>{`
        .rte-editor:empty::before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
      <div className="flex flex-wrap gap-0.5 p-2 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
        {[
          ['Bold', 'bold', null],
          ['Italic', 'italic', null],
          ['Underline', 'underline', null],
          ['Strike', 'strikeThrough', null],
        ].map(([label, cmd]) => (
          <button
            key={cmd}
            type="button"
            onMouseDown={handleToolbar(cmd)}
            className="px-2.5 py-1 text-xs font-bold rounded hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition-colors"
            title={label}
          >
            {label}
          </button>
        ))}
        <span className="w-px h-5 bg-gray-300 dark:bg-slate-600 mx-1 self-center" />
        {[
          ['H1', 'formatBlock', 'h3'],
          ['H2', 'formatBlock', 'h4'],
          ['H3', 'formatBlock', 'h5'],
        ].map(([label, cmd, val]) => (
          <button
            key={label}
            type="button"
            onMouseDown={handleToolbar(cmd, val)}
            className="px-2.5 py-1 text-xs font-bold rounded hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition-colors"
            title={label}
          >
            {label}
          </button>
        ))}
        <span className="w-px h-5 bg-gray-300 dark:bg-slate-600 mx-1 self-center" />
        {[
          ['List', 'insertUnorderedList', null],
          ['Numbered', 'insertOrderedList', null],
        ].map(([label, cmd]) => (
          <button
            key={cmd}
            type="button"
            onMouseDown={handleToolbar(cmd)}
            className="px-2.5 py-1 text-xs font-bold rounded hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition-colors"
            title={label}
          >
            {label}
          </button>
        ))}
        <span className="w-px h-5 bg-gray-300 dark:bg-slate-600 mx-1 self-center" />
        <button
          type="button"
          onMouseDown={handleLink}
          className="px-2.5 py-1 text-xs font-bold rounded hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition-colors"
          title="Insert Link"
        >
          Link
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="rte-editor min-h-[200px] p-4 text-sm text-gray-900 dark:text-white focus:outline-none prose prose-sm dark:prose-invert max-w-none"
        data-placeholder={placeholder}
        style={{ whiteSpace: 'pre-wrap' }}
      />
    </div>
  )
}
