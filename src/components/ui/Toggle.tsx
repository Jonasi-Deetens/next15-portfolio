import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, description, error, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "w-9 h-5",
      md: "w-11 h-6",
      lg: "w-14 h-7",
    };

    const thumbSizeClasses = {
      sm: "after:h-4 after:w-4",
      md: "after:h-5 after:w-5",
      lg: "after:h-6 after:w-6",
    };

    return (
      <div className="space-y-2">
        {(label || description) && (
          <div className="space-y-1">
            {label && (
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
          </div>
        )}

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            ref={ref}
            {...props}
          />
          <div
            className={cn(
              "bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:transition-all peer-checked:bg-emerald-600",
              sizeClasses[size],
              thumbSizeClasses[size],
              error && "ring-2 ring-red-500",
              className
            )}
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Toggle.displayName = "Toggle";

export { Toggle };
