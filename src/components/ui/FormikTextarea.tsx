import { useField } from "formik";
import { Textarea, TextareaProps } from "./Textarea";

export interface FormikTextareaProps extends Omit<TextareaProps, "name"> {
  name: string;
}

export function FormikTextarea({ name, ...props }: FormikTextareaProps) {
  const [field, meta] = useField(name);

  return (
    <Textarea
      {...field}
      {...props}
      error={meta.touched && meta.error ? meta.error : undefined}
    />
  );
}
