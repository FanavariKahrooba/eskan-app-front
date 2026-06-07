// useFormContext.ts
//-------------------------------------------
//  Form Hooks for Enterprise Form Engine
//-------------------------------------------

"use client"

import { useCallback } from "react"
import { useSyncExternalStore } from "react"
import { useFormContext } from "./FormContext"
import { getIn } from "./createFormStore"

/* ---------------------------------------------
   Base Form Access
--------------------------------------------- */

export function useForm() {
  return useFormContext()
}

/* ---------------------------------------------
   Subscribe to whole form state
--------------------------------------------- */

export function useFormState() {
  const { store }: any = useFormContext()

  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot
  )
}

/* ---------------------------------------------
   Field Value Hook
--------------------------------------------- */

export function useField(path: string) {
  const { store } = useFormContext()

  const state: any = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot
  )

  const value = getIn(state.values, path)
  const error = getIn(state.errors, path)
  const touched = getIn(state.touched, path)
  const dirty = getIn(state.dirty, path)

  const setValue = useCallback(
    (v: any) => {
      store.setValue(path, v)
    },
    [store, path]
  )

  return {
    value,
    setValue,
    error,
    touched,
    dirty,
  }
}

/* ---------------------------------------------
   Error Only Hook
--------------------------------------------- */

export function useFieldError(path: string) {
  const { store } = useFormContext()

  const state: any = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot
  )

  return getIn(state.errors, path)
}

/* ---------------------------------------------
   Submit Hook
--------------------------------------------- */

export function useSubmit() {
  const { handleSubmit } = useFormContext()
  return handleSubmit
}

/* ---------------------------------------------
   Validation Hook
--------------------------------------------- */

export function useValidate() {
  const { validate } = useFormContext()
  return validate
}
