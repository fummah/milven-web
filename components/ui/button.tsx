import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 ease-premium disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-gold-400 to-gold-500 text-navy-900 shadow-gold hover:from-gold-300 hover:to-gold-400 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_-16px_rgba(200,154,69,0.75)]",
        navy:
          "bg-navy-800 text-white hover:bg-navy-700 hover:-translate-y-0.5 shadow-premium",
        outline:
          "border border-navy-200 bg-transparent text-navy-800 hover:border-navy-800 hover:bg-navy-900 hover:text-white",
        goldOutline:
          "border border-gold-500 bg-white text-navy-900 hover:bg-gold-500 hover:text-navy-900 hover:-translate-y-0.5 hover:shadow-gold",
        ghost:
          "text-navy-800 hover:bg-navy-50",
        light:
          "border border-white/25 bg-white/5 text-white backdrop-blur hover:bg-white/15",
        link:
          "text-gold-600 underline-offset-4 hover:underline rounded-none px-0"
      },
      size: {
        sm: "h-9 px-4 text-[0.8rem]",
        default: "h-11 px-6",
        lg: "h-14 px-9 text-base",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default"
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
