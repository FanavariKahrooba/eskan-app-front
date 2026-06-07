// NumberInput.tsx
//----------------------------------------
// Controlled Number Input
//----------------------------------------

"use client"

import React from "react"
import { createControlledInput } from "./createControlledInput"

function BaseNumberInput({ label, value, onChange, min, max, step = 1, ...rest }: any) {
  const handleInput = (e: any) => {
    const val = e.target.value
    if (val === "") return onChange(null)
    const num = Number(val)
    if (isNaN(num)) return
    onChange(num)
  }

  const inc = () => {
    const next = (value || 0) + step
    if (max != null && next > max) return
    onChange(next)
  }

  const dec = () => {
    const next = (value || 0) - step
    if (min != null && next < min) return
    onChange(next)
  }

  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label>{label}</label>}

      <div style={{ display: "flex", gap: 4 }}>
        <button type="button" onClick={dec}>
          -
        </button>
        <input {...rest} type="number" value={value ?? ""} onChange={handleInput} style={{ flex: 1 }} />
        <button type="button" onClick={inc}>
          +
        </button>
      </div>
    </div>
  )
}

export const NumberInput = createControlledInput(BaseNumberInput)
