// useController.ts
//-------------------------------------------
//  Auto Field Controller Engine
//-------------------------------------------

"use client"

import { useCallback, useMemo } from "react"
import { useField, useForm } from "./useFormContext"

interface UseControllerProps {
    name: string
}

export function useController({ name }: UseControllerProps) {
    const { setValue, value, error, touched, dirty } = useField(name)
    const form = useForm()

    const onChange = useCallback(
        (v: any) => {
            setValue(v)
        },
        [setValue]
    )

    const onBlur = useCallback(() => {
        form.store.setTouched(name, true)
    }, [form.store, name])

    return useMemo(
        () => ({
            value,
            onChange,
            onBlur,
            name,
            error,
            touched,
            dirty,
        }),
        [value, onChange, onBlur, name, error, touched, dirty]
    )
}
