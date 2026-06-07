// AsyncFieldController.ts
//-------------------------------------------
// Controller مخصوص async fields
//-------------------------------------------

"use client"

import { useController } from "./useController"
import { useAsyncOptions } from "./useAsyncOptions"

export function useAsyncField({ name, fetcher, ...config }: any) {
    const field = useController({ name })

    const asyncState = useAsyncOptions({
        fetcher,
        ...config
    })

    return {
        ...field,
        ...asyncState
    }
}
