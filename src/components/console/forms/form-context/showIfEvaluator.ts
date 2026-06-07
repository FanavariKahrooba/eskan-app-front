// showIfEvaluator.ts
//---------------------------------------------
// Evaluates conditional field visibility
//---------------------------------------------

export function evaluateShowIf(condition: any, getValue: any) {
    if (!condition) return true

    const entries = Object.entries(condition)
    return entries.every(([field, value]) => {
        const current = getValue(field)
        return current === value
    })
}
