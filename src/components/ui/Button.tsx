import { cn } from "@/lib/utils";
import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? "span" : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-heading font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-50 rounded-xl",
          {
            // Primary - Navy
            "bg-primary text-white shadow-navy hover:bg-primary-hover hover:shadow-lg hover:-translate-y-0.5":
              variant === "primary",
            // Secondary - White with border
            "bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white":
              variant === "secondary",
            // Accent - Orange gradient
            "gradient-accent text-white shadow-accent hover:shadow-lg hover:-translate-y-0.5":
              variant === "accent",
            // Ghost - Transparent
            "bg-transparent text-primary hover:bg-primary-light":
              variant === "ghost",
            // Sizes
            "h-10 px-5 text-sm": size === "default",
            "h-9 px-4 text-xs": size === "sm",
            "h-12 px-8 text-base": size === "lg",
            "h-10 w-10 p-0": size === "icon",
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
