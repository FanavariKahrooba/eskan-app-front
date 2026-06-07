"use client"

import { useRef } from "react"
import SignatureCanvas from "react-signature-canvas"
import { motion } from "framer-motion"

export function SignaturePad({ label, onChange, width = 500, height = 200 }: any) {
  const ref = useRef<any>(null)

  const clear = () => {
    ref.current.clear()
    onChange?.(null)
  }

  const save = () => {
    const data = ref.current.getTrimmedCanvas().toDataURL("image/png")

    onChange?.(data)
  }

  const undo = () => {
    const data = ref.current.toData()

    if (!data.length) return

    data.pop()
    ref.current.fromData(data)
  }

  return (
    <div className="w-full">
      {label && <label className="text-sm font-medium mb-2 block">{label}</label>}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="
          border rounded-xl overflow-hidden
          bg-white
        "
      >
        <SignatureCanvas
          ref={ref}
          penColor="black"
          canvasProps={{
            width,
            height,
            className: "w-full",
          }}
        />
      </motion.div>

      <div className="flex gap-2 mt-3">
        <button type="button" onClick={undo} className="px-3 py-1 text-sm border rounded">
          Undo
        </button>

        <button type="button" onClick={clear} className="px-3 py-1 text-sm border rounded">
          Clear
        </button>

        <button type="button" onClick={save} className="px-3 py-1 text-sm bg-primary text-white rounded">
          ذخیره امضا
        </button>
      </div>
    </div>
  )
}



// <SignaturePad
//   label="امضای کاربر"
//   onChange={(value) => setSignature(value)}
// />