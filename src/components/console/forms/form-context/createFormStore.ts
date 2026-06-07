// createFormStore.ts
//----------------------------------------------------
//  Enterprise-Level Form Store using useSyncExternalStore
//----------------------------------------------------

import { useSyncExternalStore } from "react"

/* ---------------------------------------------
   Deep Utilities
--------------------------------------------- */

export function isObject(v: any) {
    return typeof v === "object" && v !== null && !Array.isArray(v)
}

export function deepClone(obj: any) {
    return JSON.parse(JSON.stringify(obj))
}

export function getIn(obj: any, path: string) {
    if (!path) return obj
    const parts = path.split(".")
    let cur = obj
    for (const p of parts) {
        if (cur == null) return undefined
        cur = cur[p]
    }
    return cur
}

export function setIn(obj: any, path: string, value: any) {
    const parts = path.split(".")
    const cloned = deepClone(obj)
    let cur: any = cloned

    parts.forEach((p, i) => {
        if (i === parts.length - 1) {
            cur[p] = value
        } else {
            if (!isObject(cur[p])) cur[p] = {}
            cur = cur[p]
        }
    })

    return cloned
}

export function unsetIn(obj: any, path: string) {
    const parts = path.split(".")
    const cloned = deepClone(obj)
    let cur: any = cloned

    parts.forEach((p, i) => {
        if (i === parts.length - 1) {
            delete cur[p]
        } else {
            if (!isObject(cur[p])) return cloned
            cur = cur[p]
        }
    })

    return cloned
}

/* ---------------------------------------------
   Create Form Store
--------------------------------------------- */

export function createFormStore({ initialValues = {}, validator }: any) {
    let state = {
        values: initialValues,
        errors: {},
        touched: {},
        dirty: {},
        isSubmitting: false,
        isValidating: false,
    }

    const listeners = new Set<() => void>()

    function notify() {
        listeners.forEach((l) => l())
    }

    /* ---------------------------------------------
        Core Store Functions
    --------------------------------------------- */

    function getSnapshot() {
        return state
    }

    function subscribe(listener: any) {
        listeners.add(listener)
        return () => listeners.delete(listener)
    }

    function setValue(path: string, value: any) {
        state = {
            ...state,
            values: setIn(state.values, path, value),
            dirty: setIn(state.dirty, path, true),
        }

        // Remove old error for field
        state.errors = unsetIn(state.errors, path)

        notify()
    }

    function getValue(path: string) {
        return getIn(state.values, path)
    }

    function setError(path: string, message: string) {
        state = {
            ...state,
            errors: setIn(state.errors, path, message),
        }
        notify()
    }

    function clearError(path: string) {
        state = {
            ...state,
            errors: unsetIn(state.errors, path),
        }
        notify()
    }

    function setErrors(errorObj: any) {
        state = {
            ...state,
            errors: errorObj,
        }
        notify()
    }

    /* ---------------------------------------------
        Validation Pipeline (Zod compatible)
    --------------------------------------------- */

    async function validate() {
        if (!validator) return true

        state = { ...state, isValidating: true }
        notify()

        try {
            const parsed = await validator.parseAsync(state.values)
            state = {
                ...state,
                errors: {},
                isValidating: false,
            }
            notify()
            return true
        } catch (err: any) {
            const formatted = err.formErrors.fieldErrors
            const flat: any = {}

            // flatten nested paths
            Object.keys(formatted).forEach((key) => {
                flat[key] = formatted[key]?.[0]
            })

            state = {
                ...state,
                errors: flat,
                isValidating: false,
            }
            notify()
            return false
        }
    }

    /* ---------------------------------------------
        Submit Pipeline
    --------------------------------------------- */

    async function submit(onSubmit: (v: any) => void) {
        const isOk = await validate()
        if (!isOk) return false

        state = { ...state, isSubmitting: true }
        notify()

        await onSubmit(state.values)

        state = { ...state, isSubmitting: false }
        notify()

        return true
    }

    /* ---------------------------------------------
        Public API
    --------------------------------------------- */

    return {
        // REACT subscription
        subscribe,
        getSnapshot,

        // State accessors
        getValue,
        setValue,
        setError,
        clearError,
        setErrors,
        validate,
        submit,
    }
}

/* ---------------------------------------------
   React Hook: useFormStore
--------------------------------------------- */

export function useFormStore(store: any) {
    return useSyncExternalStore(store.subscribe, store.getSnapshot)
}
