
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends VariantProps<typeof badgeVariants> {
  className?: string;
  children?: React.ReactNode;
  clickable?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
}

function Badge({ 
  className, 
  variant, 
  clickable = false, 
  children,
  onClick,
  ...props 
}: BadgeProps) {
  const classes = cn(
    badgeVariants({ variant }), 
    clickable && "cursor-pointer hover:opacity-80", 
    className
  );

  if (clickable) {
    return (
      <button 
        className={classes} 
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
        type="button"
      >
        {children}
      </button>
    );
  }

  return (
    <div 
      className={classes} 
      onClick={onClick as React.MouseEventHandler<HTMLDivElement>} 
      {...props as React.HTMLAttributes<HTMLDivElement>}
    >
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
