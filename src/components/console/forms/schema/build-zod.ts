import { z } from "zod"

export function buildZodSchema(schema: any[]) {

    const shape: any = {}

    for (const field of schema) {

        // Repeatable fields
        if (field.type === "repeatable") {

            const subShape = buildZodSchema(field.fields)
            shape[field.name] = z
                .array(z.object(subShape))
                .min(field.minItems ?? 0, `حداقل ${field.minItems} آیتم لازم است`)
                .max(field.maxItems ?? 999, `حداکثر ${field.maxItems} آیتم مجاز است`)

            continue
        }

        // Base field types
        let zodField: any = z.any()

        if (field.type === "input") zodField = z.string()
        if (field.type === "number") zodField = z.number()
        if (field.type === "select") zodField = z.string()
        if (field.type === "checkbox") zodField = z.boolean()
        if (field.type === "date") zodField = z.date()
        if (field.type === "signature") zodField = z.string().nullable()

        // Required
        // if (field.required) {
        //     zodField = zodField.refine(
        //         v => (v !== "" && v !== null && v !== undefined),
        //         `${field.label} الزامی است`
        //     )
        // }

        // Custom validations (email/min/max/... )
        if (field.validation) {
            if (field.validation.email) {
                zodField = zodField.email("ایمیل نامعتبر است")
            }
            if (field.validation.min) {
                zodField = zodField.min(field.validation.min)
            }
            if (field.validation.max) {
                zodField = zodField.max(field.validation.max)
            }
            if (field.validation.regex) {
                zodField = zodField.regex(
                    new RegExp(field.validation.regex.pattern),
                    field.validation.regex.message || "فرمت نامعتبر است"
                )
            }
        }

        shape[field.name] = zodField
    }

    return shape
}
