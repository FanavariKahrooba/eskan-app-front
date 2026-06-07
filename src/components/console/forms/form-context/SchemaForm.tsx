// SchemaForm.tsx
//-------------------------------------------
//  Schema Based Form
//-------------------------------------------

"use client"

import React from "react"
import { FieldRenderer } from "./FieldRenderer"
import { useSubmit } from "./useFormContext"

interface SchemaFormProps {
  schema: any[]
}

export function SchemaForm({ schema }: SchemaFormProps) {
  const handleSubmit = useSubmit()

  return (
    <form onSubmit={handleSubmit}>
      {schema.map((field, idx) => (
        <FieldRenderer key={field.name || idx} field={field} />
      ))}

      <button type="submit">Submit</button>
    </form>
  )
}
