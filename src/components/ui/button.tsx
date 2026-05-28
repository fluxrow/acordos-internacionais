import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--accent-ink)] text-[var(--paper)] shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-ink-soft)] hover:shadow-[var(--shadow-gold-glow)]",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-[var(--accent-ink)] bg-transparent text-[var(--accent-ink)] transition-all hover:-translate-y-0.5 hover:bg-[color-mix(in_oklab,var(--accent-ink)_12%,transparent)] hover:shadow-[var(--shadow-gold-glow)]",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-[color-mix(in_oklab,var(--accent-ink)_10%,var(--secondary))]",
        ghost: "hover:bg-[color-mix(in_oklab,var(--accent-ink)_12%,transparent)] hover:text-[var(--accent-ink)]",
        link: "text-[var(--accent-ink)] underline-offset-4 hover:underline",
      },

      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
