"use client"

import { Upload, X } from "lucide-react"

export default function ImageDropzone({ file, setFile }: { file: File | null; setFile: (f: File | null) => void }) {
  function onDrop(e: any) {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f) setFile(f)
  }

  return (
    <div onDrop={onDrop} onDragOver={(e) => e.preventDefault()} className="border border-dashed rounded-xl p-4 text-sm text-gray-500 flex items-center gap-2">
      {file ? (
        <div className="flex items-center gap-2">
          <img src={URL.createObjectURL(file)} className="w-12 h-12 object-cover rounded" />
          <button onClick={() => setFile(null)}>
            <X size={16} />
          </button>
        </div>
      ) : (
        <>
          <Upload size={16} />
          تصویر را بکشید اینجا
        </>
      )}
    </div>
  )
}
