// AutoFieldRenderer.tsx
//---------------------------------------------
// The heart of the Schema → UI Field Renderer.
// This component takes a field definition from
// the Schema Engine and automatically renders
// the correct UI component.
//---------------------------------------------

"use client"

import React from "react"
import { useFormContext } from "./FormContext"
import { RepeatableField } from "../schema/repeatable-field"
import { Input } from "../../ui/inputs/input"
import { Checkbox } from "../../ui/inputs/checkbox"
import { Select } from "../../ui/inputs/select"
import { ComboBox } from "../../ui/inputs/combobox"
import { MultiSelect } from "../../ui/inputs/multi-select"
import { DateRangePicker } from "../date-range/date-range-picker"
import { ColorPicker } from "../../ui/inputs/color-picker"
import { RangeSlider } from "../../ui/inputs/range-slider"
import { evaluateShowIf } from "./showIfEvaluator"
import { NumberInput } from "./NumberInput"
import { AsyncSelect } from "./AsyncSelect"

// Utility: recursively evaluate "showIf"

export function AutoFieldRenderer({ field }: any) {
  const { getValue } = useFormContext()

  // 1. Conditional visibility
  if (field.showIf) {
    const visible = evaluateShowIf(field.showIf, getValue)
    if (!visible) return null
  }

  // 2. Handle grouping (fieldset, section, etc)
  if (field.type === "group") {
    return (
      <div style={{ padding: "12px 0" }}>
        {field.label && <div style={{ fontWeight: "bold", marginBottom: 8 }}>{field.label}</div>}

        {field.children?.map((child: any, idx: any) => (
          <AutoFieldRenderer key={idx} field={child} />
        ))}
      </div>
    )
  }

  // 3. Handle repeatable sections
  if (field.type === "repeatable") {
    return <RepeatableField {...field} />
  }

  // 4. Map field types → actual UI components
  switch (field.type) {
    case "text":
      return <Input name={field.name} label={field.label} {...field} />

    case "number":
      return <NumberInput name={field.name} label={field.label} {...field} />

    case "checkbox":
      return <Checkbox name={field.name} label={field.label} {...field} />

    case "select":
      return <Select name={field.name} label={field.label} options={field.options || []} {...field} />

    case "combobox":
      return <ComboBox name={field.name} label={field.label} options={field.options || []} {...field} />

    case "multiselect":
      return <MultiSelect name={field.name} label={field.label} options={field.options || []} {...field} />

    case "async-select":
      return <AsyncSelect name={field.name} label={field.label} fetcher={field.fetcher} {...field} />

    // case "date":
    //   return <DatePicker name={field.name} label={field.label} {...field} />

    case "date-range":
      return <DateRangePicker name={field.name} label={field.label} {...field} />

    case "color":
      return <ColorPicker name={field.name} label={field.label} {...field} />

    case "range":
      return <RangeSlider name={field.name} label={field.label} {...field} />

    // case "signature":
    //   return <SignaturePad name={field.name} label={field.label} {...field} />

    default:
      return <div style={{ color: "red", padding: 12 }}>Unknown field type: {field.type}</div>
  }
}
