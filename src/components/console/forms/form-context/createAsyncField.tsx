// createAsyncField.ts
//-------------------------------------------
// Wrap ANY UI component to support async options
//-------------------------------------------

"use client"

import React, { forwardRef } from "react"
import { useAsyncField } from "./AsyncFieldController"

export function createAsyncField(Component: any) {
    const Wrapped = forwardRef((props: any, ref) => {
        const { name, fetcher, ...rest } = props

        const field = useAsyncField({
            name,
            fetcher,
            ...rest
        })

        return (
            <Component
        ref= { ref }
        {...rest}
name = { name }
value = { field.value }
onChange = { field.onChange }
loading = { field.loading }
error = { field.error }
options = { field.data }
query = { field.query }
setQuery = { field.setQuery }
    />
    )
  })

Wrapped.displayName = `AsyncField(${Component.displayName || "Component"})`
return Wrapped
}
