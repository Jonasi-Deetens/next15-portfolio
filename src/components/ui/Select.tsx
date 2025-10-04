import { SelectHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  icon?: ReactNode;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, label, icon, options, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <select
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              icon ? "pl-10 pr-8" : "px-3 pr-8",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            ref={ref}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
