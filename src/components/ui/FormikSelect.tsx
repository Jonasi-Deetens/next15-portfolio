import { useField } from "formik";
import { SelectHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FormikSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "name"> {
  name: string;
  label?: string;
  icon?: ReactNode;
  options: { value: string; label: string }[];
}

export function FormikSelect({
  name,
  label,
  icon,
  options,
  className,
  ...props
}: FormikSelectProps) {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
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
          id={name}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            icon ? "pl-10 pr-8" : "px-3 pr-8",
            hasError && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...field}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {hasError && <p className="text-sm text-destructive">{meta.error}</p>}
    </div>
  );
}
