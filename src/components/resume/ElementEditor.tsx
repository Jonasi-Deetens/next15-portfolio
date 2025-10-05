import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FormikInput } from "@/components/ui/FormikInput";
import { FormikTextarea } from "@/components/ui/FormikTextarea";
import { ResumeElement } from "@/types/resume";
import { Save, Trash2 } from "lucide-react";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";

interface ElementEditorProps {
  element: ResumeElement | null;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<ResumeElement>) => void;
  onDelete: (id: string) => void;
}

interface FormikSelectProps {
  name: string;
  label: string;
  children: React.ReactNode;
}

function FormikSelect({ name, label, children }: FormikSelectProps) {
  const [field, meta] = useField(name);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        {...field}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
          meta.touched && meta.error
            ? "border-red-300 focus:ring-red-500"
            : "border-gray-300"
        }`}
      >
        {children}
      </select>
      {meta.touched && meta.error && (
        <div className="text-red-600 text-sm mt-1">{meta.error}</div>
      )}
    </div>
  );
}

const getValidationSchema = (type: string) => {
  switch (type) {
    case "text":
      return Yup.object({
        text: Yup.string().required("Text is required"),
        fontSize: Yup.number().min(8).max(72).required(),
        fontWeight: Yup.string().oneOf(["normal", "bold"]).required(),
      });
    case "experience":
      return Yup.object({
        title: Yup.string().required("Title is required"),
        company: Yup.string().required("Company is required"),
        location: Yup.string().required("Location is required"),
        startDate: Yup.string().required("Start date is required"),
        endDate: Yup.string().when("current", {
          is: false,
          then: (schema) => schema.required("End date is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
        current: Yup.boolean(),
        description: Yup.string().required("Description is required"),
      });
    case "education":
      return Yup.object({
        degree: Yup.string().required("Degree is required"),
        school: Yup.string().required("School is required"),
        location: Yup.string().required("Location is required"),
        startDate: Yup.string().required("Start date is required"),
        endDate: Yup.string().required("End date is required"),
        description: Yup.string().required("Description is required"),
      });
    case "contact":
      return Yup.object({
        phone: Yup.string().required("Phone is required"),
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        location: Yup.string().required("Location is required"),
        website: Yup.string().url("Invalid URL"),
      });
    case "skill":
      return Yup.object({
        skills: Yup.array()
          .of(Yup.string())
          .min(1, "At least one skill is required"),
      });
    case "image":
      return Yup.object({
        src: Yup.string().url("Invalid URL").required("Image URL is required"),
        alt: Yup.string().required("Alt text is required"),
        width: Yup.number().min(50).max(500).required(),
        height: Yup.number().min(50).max(500).required(),
      });
    default:
      return Yup.object({});
  }
};

export function ElementEditor({
  element,
  onClose,
  onUpdate,
  onDelete,
}: ElementEditorProps) {
  if (!element) return null;

  const { type, content } = element;

  const handleSubmit = (values: Record<string, unknown>) => {
    onUpdate(element.id, { content: values });
    onClose(); // Close modal on save
  };

  const handleDelete = () => {
    onDelete(element.id);
    onClose();
  };

  return (
    <Modal isOpen={!!element} onClose={onClose} className="max-w-md">
      <Modal.Header title="Edit Element" onClose={onClose} />
      <Modal.Body>
        <Formik
          initialValues={content}
          validationSchema={getValidationSchema(type)}
          onSubmit={handleSubmit}
        >
          <Form id="element-form" className="space-y-4">
            {type === "text" && (
              <>
                <FormikInput name="text" label="Text" />
                <div className="grid grid-cols-2 gap-2">
                  <FormikInput
                    name="fontSize"
                    label="Font Size"
                    type="number"
                  />
                  <FormikSelect name="fontWeight" label="Font Weight">
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                  </FormikSelect>
                </div>
              </>
            )}

            {type === "image" && (
              <>
                <FormikInput name="src" label="Image URL" />
                <FormikInput name="alt" label="Alt Text" />
                <div className="grid grid-cols-2 gap-2">
                  <FormikInput name="width" label="Width" type="number" />
                  <FormikInput name="height" label="Height" type="number" />
                </div>
              </>
            )}

            {type === "experience" && (
              <>
                <FormikInput name="title" label="Job Title" />
                <FormikInput name="company" label="Company" />
                <FormikInput name="location" label="Location" />
                <div className="grid grid-cols-2 gap-2">
                  <FormikInput name="startDate" label="Start Date" />
                  <FormikInput name="endDate" label="End Date" />
                </div>
                <div className="flex items-center">
                  <FormikInput name="current" type="checkbox" />
                  <label className="ml-2 text-sm text-gray-700">
                    Currently working here
                  </label>
                </div>
                <FormikTextarea
                  name="description"
                  label="Description"
                  rows={3}
                />
              </>
            )}

            {type === "education" && (
              <>
                <FormikInput name="degree" label="Degree" />
                <FormikInput name="school" label="School" />
                <FormikInput name="location" label="Location" />
                <div className="grid grid-cols-2 gap-2">
                  <FormikInput name="startDate" label="Start Date" />
                  <FormikInput name="endDate" label="End Date" />
                </div>
                <FormikTextarea
                  name="description"
                  label="Description"
                  rows={3}
                />
              </>
            )}

            {type === "contact" && (
              <>
                <FormikInput name="phone" label="Phone" />
                <FormikInput name="email" label="Email" type="email" />
                <FormikInput name="location" label="Location" />
                <FormikInput name="website" label="Website" />
              </>
            )}

            {type === "skill" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills (comma-separated)
                </label>
                <FormikInput
                  name="skills"
                  placeholder="React, TypeScript, Node.js"
                />
              </div>
            )}
          </Form>
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" form="element-form" className="flex-1">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleDelete}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
