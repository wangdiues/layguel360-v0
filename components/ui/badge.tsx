import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1 font-medium whitespace-nowrap transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&>svg]:pointer-events-none [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary hover:bg-primary/20",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
        outline: "border border-border text-foreground hover:bg-muted",
        ghost: "hover:bg-muted hover:text-muted-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Status variants matching app use cases
        active: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
        completed: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
        pending: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
        review: "bg-purple-500/10 text-purple-600 border border-purple-500/20",
      },
      size: {
        default: "h-6 px-2.5 py-0.5 text-xs rounded-full",
        sm: "h-5 px-2 py-0 text-xs rounded-full",
        lg: "h-7 px-3 py-1 text-sm rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>,
  VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : "span"
    return (
      <Comp
        ref={ref}
        data-slot="badge"
        data-variant={variant}
        data-size={size}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }
