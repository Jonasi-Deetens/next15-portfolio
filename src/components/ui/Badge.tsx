import { HTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "secondary";
  icon?: ReactNode;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", icon, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
          {
            "bg-gray-100 text-gray-800": variant === "default",
            "bg-green-100 text-green-800": variant === "success",
            "bg-yellow-100 text-yellow-800": variant === "warning",
            "bg-red-100 text-red-800": variant === "danger",
            "bg-blue-100 text-blue-800": variant === "info",
            "bg-purple-100 text-purple-800": variant === "secondary",
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </div>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
