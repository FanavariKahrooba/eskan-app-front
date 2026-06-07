// SignaturePad.tsx
//----------------------------------------
// Controlled Signature Pad
//----------------------------------------

"use client"

import React, { useRef } from "react"
import SignatureCanvas from "react-signature-canvas"
import { createControlledInput } from "./createControlledInput"

function BaseSignaturePad({ label, value, onChange, ...rest }: any) {
  const ref: any = useRef(null)

  const clear = () => {
    ref.current.clear()
    onChange("")
  }

  const save = () => {
    const data = ref.current.toDataURL()
    onChange(data)
  }

  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label>{label}</label>}

      <SignatureCanvas
        ref={ref}
        penColor="black"
        backgroundColor="#fff"
        onEnd={save}
        canvasProps={{
          style: {
            border: "1px solid #ddd",
            width: "100%",
            height: 200,
          },
        }}
        {...rest}
      />

      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button type="button" onClick={clear}>
          Clear
        </button>
        <button type="button" onClick={save}>
          Save
        </button>
      </div>
    </div>
  )
}

export const SignaturePad = createControlledInput(BaseSignaturePad)
