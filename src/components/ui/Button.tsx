import { cn } from "@/lib/utils";
import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "action";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-outline disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-on-primary shadow-[0_16px_40px_rgba(0,0,0,0.14)] hover:bg-primary-container": variant === "primary",
            "border border-secondary/30 bg-transparent text-secondary hover:bg-secondary/5 hover:border-secondary": variant === "secondary",
            "bg-transparent text-tertiary underline decoration-tertiary/50 hover:decoration-tertiary underline-offset-4": variant === "action",
            "h-10 px-4 py-2": size === "default",
            "h-9 px-3": size === "sm",
            "h-12 px-8 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
