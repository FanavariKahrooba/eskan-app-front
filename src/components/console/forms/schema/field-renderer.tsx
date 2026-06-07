"use client"

import { Input } from "../../ui/inputs/input"
import { Select } from "../../ui/inputs/select"
import { Textarea } from "../../ui/inputs/textarea"
import { FileUpload } from "../file-upload/file-upload"
import { SignaturePad } from "../signature/signature-pad"
import { RepeatableField } from "./repeatable-field"

export function FieldRenderer({ field, value, onChange, error }: any) {
  switch (field.type) {
    case "input":
      return <Input label={field.label} value={value} placeholder={field.placeholder} onChange={(e: any) => onChange(e.target.value)} />

    case "textarea":
      return <Textarea label={field.label} value={value} onChange={(e: any) => onChange(e.target.value)} />

    case "select":
      return <Select label={field.label} options={field.options} value={value} onChange={onChange} />

    case "file-upload":
      return <FileUpload label={field.label} onChange={onChange} />

    case "signature":
      return <SignaturePad label={field.label} onChange={onChange} />
    case "repeatable":
      return <RepeatableField field={field} value={value} onChange={onChange} errors={error} />

    default:
      return null
  }
}
