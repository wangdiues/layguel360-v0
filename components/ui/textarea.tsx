import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, startIcon, endIcon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {startIcon && (
          <div className="absolute left-3 top-3 text-muted-foreground">
            {startIcon}
          </div>
        )}
        <textarea
          ref={ref}
          data-slot="textarea"
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors duration-200 outline-none placeholder:text-muted-foreground hover:border-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
            startIcon && "pl-10",
            endIcon && "pr-10",
            className
          )}
          {...props}
        />
        {endIcon && (
          <div className="absolute right-3 top-3 text-muted-foreground">
            {endIcon}
          </div>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
