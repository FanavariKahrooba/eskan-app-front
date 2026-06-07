import * as React from "react";
import { cn } from "../../lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

const resizeClasses: Record<NonNullable<TextareaProps["resize"]>, string> = {
  none: "resize-none",
  vertical: "resize-y",
  horizontal: "resize-x",
  both: "resize",
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, error = false, resize = "vertical", disabled, ...props },
    ref,
  ) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        className={cn(
          "flex min-h-[120px] w-full rounded-2xl border bg-background px-4 py-3 text-sm text-foreground shadow-sm transition-colors",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          resizeClasses[resize],
          error
            ? "border-destructive focus-visible:ring-destructive/40"
            : "border-input focus-visible:ring-primary/40",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
