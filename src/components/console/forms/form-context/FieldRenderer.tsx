// FieldRenderer.tsx
//-------------------------------------------
//  Auto Field Renderer
//-------------------------------------------

"use client"

import React from "react"
import { getField } from "./FieldRegistry"

interface FieldSchema {
  type: string
  name: string
  label?: string
  [key: string]: any
}

interface Props {
  field: FieldSchema
}

export function FieldRenderer({ field }: Props) {
  const Component = getField(field.type)

  if (!Component) {
    console.error(`Field type "${field.type}" is not registered`)
    return null
  }

  const { type, ...props } = field

  return <Component {...props} />
}
