export type FieldType =
    | "input"
    | "textarea"
    | "select"
    | "checkbox"
    | "switch"
    | "date"
    | "date-range"
    | "number"
    | "file-upload"
    | "signature"

export type Condition = {
    field: string
    equals?: any
    notEquals?: any
    in?: any[]
}

export interface FieldSchema {
    type: string
    name: string
    label?: string
    placeholder?: string
    options?: { label: string; value: string }[]
    required?: boolean
    showIf?: Condition
}

export interface RepeatableSchema {
    type: "repeatable"
    name: string
    label?: string
    itemTitle?: (item: any, index: number) => string
    fields: FieldSchema[]
    minItems?: number
    maxItems?: number
}