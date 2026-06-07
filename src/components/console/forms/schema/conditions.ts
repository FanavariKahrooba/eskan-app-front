export function evaluateCondition(
    condition: any,
    values: any
) {
    if (!condition) return true

    const value = values[condition.field]

    if (condition.equals !== undefined) {
        return value === condition.equals
    }

    if (condition.notEquals !== undefined) {
        return value !== condition.notEquals
    }

    if (condition.in) {
        return condition.in.includes(value)
    }

    return true
}
