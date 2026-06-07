// createControlledInput.ts
//-------------------------------------------
//  Smart Controlled Input Wrapper
//  Connects ANY component to the Form Engine
//-------------------------------------------

"use client"

import React, { ComponentType, forwardRef } from "react"
import { useController } from "./useController"

type AnyProps = Record<string, any>

/*
  BaseInput:
    باید props زیر را پشتیبانی کند:
      - value
      - onChange
      - onBlur (اختیاری)
      - error (اختیاری)
*/
export function createControlledInput<P extends AnyProps>(Component: ComponentType<P>) {
  const Wrapped = forwardRef<any, P & { name: string }>((props, ref) => {
    const { name, ...rest }: any = props

    // اتصال خودکار به فرم
    const field = useController({ name })

    return (
      <Component
        {...(rest as P)}
        ref={ref}
        name={name}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        error={field.error}
        touched={field.touched}
        dirty={field.dirty}
      />
    )
  })

  Wrapped.displayName = `Controlled(${Component.displayName || "Component"})`

  return Wrapped
}
