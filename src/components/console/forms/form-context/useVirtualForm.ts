// useVirtualForm.ts
//--------------------------------------------
// Connects VirtualizedList with Schema & FormStore
//--------------------------------------------

"use client"

import { useMemo } from "react"
import { useFormContext } from "./FormContext"


export function useVirtualForm() {
    const { schema } = useFormContext()

    const flatFields = useMemo(() => {
        // flatten nested groups, conditional fields, repeatable sets
        const flatten = (arr: any[]): any[] => {
            const result: any[] = []
            arr.forEach((f) => {
                if (f.type === "group") {
                    result.push(...flatten(f.children))
                } else {
                    result.push(f)
                }
            })
            return result
        }

        return flatten(schema)
    }, [schema])

    return {
        fields: flatFields,
        count: flatFields.length,
    }
}
