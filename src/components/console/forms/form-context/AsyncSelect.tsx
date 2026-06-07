// AsyncSelect.tsx
//-------------------------------------------
//  A full async select / autocomplete component
//-------------------------------------------

"use client"

import React, { useState } from "react"

export function AsyncSelect({ value, onChange, loading, error, options, query, setQuery, label }: any) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ marginBottom: 24 }}>
      {label && <label>{label}</label>}

      <input value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setOpen(true)} placeholder="Search..." style={{ width: "100%" }} />

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {open && (
        <div
          style={{
            border: "1px solid #eee",
            padding: 8,
            background: "white",
            maxHeight: 200,
            overflowY: "auto",
          }}
        >
          {options.map((item: any) => (
            <div
              key={item.value}
              onClick={() => {
                onChange(item)
                setOpen(false)
              }}
              style={{
                padding: 8,
                cursor: "pointer",
                background: value?.value === item.value ? "#eee" : "transparent",
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
