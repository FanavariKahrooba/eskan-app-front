"use client"

import { cn } from "@/utils/tools"
import { useRef, useEffect } from "react"
import { tv } from "tailwind-variants"

const textareaStyles = tv({
  base: `
    w-full min-h-[80px] p-3 rounded-lg border bg-white
    text-sm transition-all duration-200 outline-none
    focus:ring-2 focus:ring-primary/30 resize-none
  `,
  variants: {
    intent: {
      default: "border-input",
      error: "border-red-500 focus:ring-red-500/30",
    },
  },
  defaultVariants: {
    intent: "default",
  },
})

export function Textarea({ intent, className, ...props }: any) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.style.height = "auto"
    ref.current.style.height = `${ref.current.scrollHeight}px`
  }, [props.value])

  return <textarea ref={ref} {...props} rows={3} className={cn(textareaStyles({ intent }), className)} />
}
