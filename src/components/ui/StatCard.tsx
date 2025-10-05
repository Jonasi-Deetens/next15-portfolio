import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./Card";

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  variant?:
    | "default"
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "secondary";
}

const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  (
    { className, title, value, icon, trend, variant = "default", ...props },
    ref
  ) => {
    const iconVariants = {
      default: "bg-emerald-500",
      primary: "bg-emerald-500",
      success: "bg-green-500",
      warning: "bg-orange-500",
      danger: "bg-red-500",
      secondary: "bg-teal-500",
    };

    const valueVariants = {
      default: "text-emerald-600",
      primary: "text-emerald-600",
      success: "text-green-600",
      warning: "text-orange-600",
      danger: "text-red-600",
      secondary: "text-teal-600",
    };

    return (
      <Card
        ref={ref}
        className={cn("hover:shadow-lg transition-shadow", className)}
        {...props}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <div className="flex items-baseline gap-2">
                <p className={cn("text-3xl font-bold", valueVariants[variant])}>
                  {value}
                </p>
                {trend && (
                  <span
                    className={cn(
                      "text-xs font-medium",
                      trend.positive ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {trend.positive ? "↑" : "↓"} {trend.value}
                  </span>
                )}
              </div>
            </div>
            {icon && (
              <div className={cn("p-3 rounded-lg", iconVariants[variant])}>
                <div className="text-white">{icon}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

StatCard.displayName = "StatCard";

export { StatCard };
