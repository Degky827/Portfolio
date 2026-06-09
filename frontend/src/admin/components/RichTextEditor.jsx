import { useMemo } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'blockquote', 'code', 'code-block',
  'list', 'bullet', 'indent',
  'link', 'image',
  'clean',
]

export default function RichTextEditor({ value, onChange, placeholder = 'Write your content here...' }) {
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code', 'code-block'],
      ['link'],
      ['clean'],
    ],
  }), [])

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  )
}
