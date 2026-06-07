"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  viewportClassName?: string;
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, viewportClassName, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        <div
          className={cn(
            "h-full w-full overflow-auto",
            "scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent",
            "hover:scrollbar-thumb-muted-foreground/40",
            viewportClassName,
          )}
        >
          {children}
        </div>
      </div>
    );
  },
);

ScrollArea.displayName = "ScrollArea";

export { ScrollArea };
