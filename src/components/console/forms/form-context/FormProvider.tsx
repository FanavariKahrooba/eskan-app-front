// FormProvider.tsx
//-------------------------------------------
//  Enterprise-Level Form Provider
//-------------------------------------------

"use client"

import { ReactNode, useMemo, useCallback } from "react"
import { FormContext } from "./FormContext"
import { createFormStore } from "./createFormStore"

interface FormProviderProps {
  children: ReactNode
  initialValues?: Record<string, any>
  validator?: any // Zod schema (optional)
  onSubmit?: (values: any) => Promise<void> | void
}

export function FormProvider({ children, initialValues = {}, validator, onSubmit = () => {} }: FormProviderProps) {
  /* ---------------------------------------------
     Create Store (Stable, Memoized)
  --------------------------------------------- */
  const store = useMemo(() => {
    return createFormStore({
      initialValues,
      validator,
    })
  }, [])

  /* ---------------------------------------------
     Submit Handler (Used by <form> tag also)
  --------------------------------------------- */
  const handleSubmit = useCallback(
    async (e?: any) => {
      if (e?.preventDefault) e.preventDefault()
      await store.submit(onSubmit)
    },
    [store, onSubmit],
  )

  /* ---------------------------------------------
     API Exposed via Context
  --------------------------------------------- */
  const api = useMemo(() => {
    return {
      store,

      // Base values
      initialValues,

      // Submit API
      handleSubmit,
      submit: store.submit,

      // Validation API
      validate: store.validate,

      // Direct state access
      getValue: store.getValue,
      setValue: store.setValue,
      setError: store.setError,
      clearError: store.clearError,

      // State flags
      getSnapshot: store.getSnapshot,
    }
  }, [store, initialValues, handleSubmit])

  return <FormContext.Provider value={api}>{children}</FormContext.Provider>
}
