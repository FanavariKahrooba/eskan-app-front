"use client"

import { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function FileUpload({ label, multiple = true, accept = "image/*", maxSize = 5 * 1024 * 1024, onChange }: any) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<any[]>([])

  const handleFiles = (fileList: FileList) => {
    const list = Array.from(fileList)

    const valid = list.filter((file) => file.size <= maxSize)

    const mapped = valid.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
    }))

    const newFiles = [...files, ...mapped]

    setFiles(newFiles)
    onChange?.(newFiles.map((f) => f.file))
  }

  const remove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onChange?.(newFiles.map((f) => f.file))
  }

  const openFileDialog = () => inputRef.current?.click()

  const onDrop = (e: any) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="w-full">
      {label && <label className="text-sm font-medium mb-2 block">{label}</label>}

      {/* Dropzone */}

      <div
        onClick={openFileDialog}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="
          border-2 border-dashed rounded-xl
          p-6 text-center cursor-pointer
          hover:border-primary transition-colors
        "
      >
        <p className="text-sm text-muted-foreground">فایل را بکشید و رها کنید یا کلیک کنید</p>

        <p className="text-xs text-muted-foreground mt-1">حداکثر {Math.round(maxSize / 1024 / 1024)}MB</p>

        <input ref={inputRef} type="file" multiple={multiple} accept={accept} hidden onChange={(e) => handleFiles(e.target.files!)} />
      </div>

      {/* Files */}

      <AnimatePresence>
        {files.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            {files.map((item, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="
                  relative border rounded-lg overflow-hidden
                  group
                "
              >
                {item.file.type.startsWith("image") ? (
                  <img src={item.preview} className="h-32 w-full object-cover" />
                ) : (
                  <div className="h-32 flex items-center justify-center text-sm">{item.file.name}</div>
                )}

                <button
                  onClick={() => remove(i)}
                  className="
                    absolute top-1 right-1
                    bg-black/60 text-white
                    rounded px-2 py-1 text-xs
                    opacity-0 group-hover:opacity-100
                    transition
                  "
                >
                  حذف
                </button>

                <div className="text-xs p-2 truncate">{item.file.name}</div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}


{/* <FileUpload
  label="آپلود تصاویر محصول"
  multiple
  maxSize={5 * 1024 * 1024}
  onChange={(files) => console.log(files)}
/> */}