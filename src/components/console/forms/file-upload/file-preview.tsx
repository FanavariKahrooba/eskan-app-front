"use client"

import { motion } from "framer-motion"

export function FilePreview({
  item,
  index,
  onRemove
}: {
  item: any
  index: number
  onRemove: (i: number) => void
}) {

  const isImage = item.file.type.startsWith("image")
  const isVideo = item.file.type.startsWith("video")
  const isPdf = item.file.type === "application/pdf"

  return (
    <motion.div
      initial={{ scale: .9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: .9, opacity: 0 }}
      className="
        relative border rounded-lg overflow-hidden
        group bg-white shadow-sm
      "
    >
      {/* Preview */}
      {isImage && (
        <img
          src={item.preview}
          className="h-32 w-full object-cover"
          alt={item.file.name}
        />
      )}

      {isVideo && (
        <video
          src={item.preview}
          className="h-32 w-full object-cover"
          controls={false}
          muted
        />
      )}

      {isPdf && (
        <div className="h-32 flex items-center justify-center bg-red-50 text-red-600">
          PDF
        </div>
      )}

      {!isImage && !isVideo && !isPdf && (
        <div className="h-32 flex items-center justify-center text-sm bg-gray-50">
          {item.file.name.split(".").pop()?.toUpperCase()}
        </div>
      )}

      {/* Remove button */}
      <button
        onClick={() => onRemove(index)}
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

      {/* Filename */}
      <div className="text-xs p-2 truncate">
        {item.file.name}
      </div>

      {/* Progress Bar (if uploading) */}
      {item.progress !== undefined && item.progress < 100 && (
        <div className="w-full h-1 bg-gray-200">
          <div
            className="h-1 bg-primary transition-all"
            style={{ width: `${item.progress}%` }}
          />
        </div>
      )}
    </motion.div>
  )
}
