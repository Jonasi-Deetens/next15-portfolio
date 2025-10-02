import { useField } from "formik";
import { Input, InputProps } from "./Input";

interface FormikInputProps
  extends Omit<InputProps, "error" | "value" | "onChange" | "onBlur"> {
  name: string;
}

export function FormikInput({ name, ...props }: FormikInputProps) {
  const [field, meta] = useField(name);

  return (
    <Input
      {...field}
      {...props}
      error={meta.touched && meta.error ? meta.error : undefined}
    />
  );
}
