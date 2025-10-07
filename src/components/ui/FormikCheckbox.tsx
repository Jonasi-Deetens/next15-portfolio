import { useField } from "formik";

interface FormikCheckboxProps {
  name: string;
  label: string;
}

export function FormikCheckbox({ name, label }: FormikCheckboxProps) {
  const [field, meta, helpers] = useField(name);

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={Boolean(field.value)}
        onChange={(e) => helpers.setValue(e.target.checked)}
        onBlur={field.onBlur}
        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded accent-emerald-600"
        style={{
          accentColor: "#059669",
        }}
      />
      <label className="ml-2 text-sm text-gray-700">{label}</label>
      {meta.touched && meta.error && (
        <p className="text-sm text-red-600 ml-2">{meta.error}</p>
      )}
    </div>
  );
}
