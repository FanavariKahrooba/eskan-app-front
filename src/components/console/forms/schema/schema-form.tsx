"use client"

import { useState } from "react"
import { FieldRenderer } from "./field-renderer"
import { evaluateCondition } from "./conditions"
import { buildZodSchema } from "./build-zod"
import { z } from "zod"

export function SchemaForm({ schema, onSubmit }: any) {
  const [values, setValues] = useState<any>({})
  const [errors, setErrors] = useState<any>({})

  // ساخت Zod Schema فقط یکبار
  const zodSchema = z.object(buildZodSchema(schema))

  const setValue = (name: string, value: any) => {
    setValues((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validate = async () => {
    try {
      const data = zodSchema.parse(values)
      setErrors({})
      return { valid: true, data }
    } catch (err: any) {
      const formatted: any = {}

      err.errors.forEach((e: any) => {
        const path = e.path.join(".")
        formatted[path] = e.message
      })

      setErrors(formatted)

      return { valid: false }
    }
  }

  const submit = async (e: any) => {
    e.preventDefault()
    const result = await validate()

    if (result.valid) {
      onSubmit(result.data)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="p-3 border border-red-300 bg-red-50 rounded-lg">
          <div className="text-red-600 text-sm font-medium mb-2">لطفا خطاهای زیر را اصلاح کنید:</div>
          <ul className="text-xs text-red-500 list-disc pl-5 space-y-1">
            {Object.entries(errors).map(([key, msg]) => (
              <li key={key}>{msg as string}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Render Fields */}
      {schema.map((field: any) => {
        const visible = evaluateCondition(field.showIf, values)
        if (!visible) return null

        const fieldPath = field.type === "repeatable" ? field.name : field.name

        return <FieldRenderer key={field.name} field={field} value={values[field.name]} onChange={(v: any) => setValue(field.name, v)} error={errors[field.name] || null} />
      })}

      <button type="submit" className="px-4 py-2 bg-primary text-white rounded">
        ثبت
      </button>
    </form>
  )
}

// const schema = [

//   {
//     type: "select",
//     name: "accountType",
//     label: "نوع حساب",
//     options: [
//       { label: "شخصی", value: "personal" },
//       { label: "شرکتی", value: "business" }
//     ]
//   },

//   {
//     type: "input",
//     name: "companyName",
//     label: "نام شرکت",
//     showIf: {
//       field: "accountType",
//       equals: "business"
//     }
//   },

//   {
//     type: "input",
//     name: "nationalId",
//     label: "کد ملی",
//     showIf: {
//       field: "accountType",
//       equals: "personal"
//     }
//   }

// ]
