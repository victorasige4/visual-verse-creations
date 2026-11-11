import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** shadcn/ui-style button primitive for future Visual Verse React sections. */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vv-aqua disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-vv-navy text-white hover:bg-vv-ink",
        secondary: "bg-vv-aqua text-vv-navy hover:bg-vv-mist",
        outline: "border border-vv-navy/20 bg-white text-vv-navy hover:bg-vv-mist",
        ghost: "bg-transparent text-vv-navy hover:bg-vv-mist",
      },
      size: { default: "h-11 px-6 py-2", sm: "h-9 px-4", lg: "h-12 px-8", icon: "size-10" },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
export { Button, buttonVariants };
