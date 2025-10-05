import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FormikInput } from "@/components/ui/FormikInput";
import { FormikTextarea } from "@/components/ui/FormikTextarea";
import { ResumeElement } from "@/types/resume";
import { Save, Trash2 } from "lucide-react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormikSelect } from "../ui";

interface ElementEditorProps {
  element: ResumeElement | null;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<ResumeElement>) => void;
  onDelete: (id: string) => void;
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
    case "shape":
      return Yup.object({
        type: Yup.string()
          .oneOf(["triangle", "circle", "square", "diamond", "star"])
          .required(),
        color: Yup.string().required(),
        size: Yup.number().min(10).max(200).required(),
        rotation: Yup.number().min(0).max(360).required(),
      });
    case "line":
      return Yup.object({
        style: Yup.string().oneOf(["solid", "dashed", "dotted"]).required(),
        color: Yup.string().required(),
        thickness: Yup.number().min(1).max(20).required(),
        length: Yup.number().min(20).max(500).required(),
        angle: Yup.number().min(0).max(360).required(),
      });
    case "curve":
      return Yup.object({
        style: Yup.string()
          .oneOf(["wave", "sine", "zigzag", "spiral"])
          .required(),
        color: Yup.string().required(),
        thickness: Yup.number().min(1).max(10).required(),
        amplitude: Yup.number().min(5).max(100).required(),
        frequency: Yup.number().min(1).max(10).required(),
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
                  <FormikSelect
                    name="fontWeight"
                    label="Font Weight"
                    options={[
                      { value: "normal", label: "Normal" },
                      { value: "bold", label: "Bold" },
                    ]}
                  ></FormikSelect>
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

            {type === "shape" && (
              <>
                <FormikSelect
                  name="type"
                  label="Shape Type"
                  options={[
                    { value: "triangle", label: "Triangle" },
                    { value: "circle", label: "Circle" },
                    { value: "square", label: "Square" },
                    { value: "diamond", label: "Diamond" },
                    { value: "star", label: "Star" },
                  ]}
                />
                <FormikInput name="color" label="Color" placeholder="#10b981" />
                <FormikInput name="size" label="Size (px)" type="number" />
                <FormikInput
                  name="rotation"
                  label="Rotation (degrees)"
                  type="number"
                />
              </>
            )}

            {type === "line" && (
              <>
                <FormikSelect
                  name="style"
                  label="Line Style"
                  options={[
                    { value: "solid", label: "Solid" },
                    { value: "dashed", label: "Dashed" },
                    { value: "dotted", label: "Dotted" },
                  ]}
                />
                <FormikInput name="color" label="Color" placeholder="#10b981" />
                <FormikInput
                  name="thickness"
                  label="Thickness (px)"
                  type="number"
                />
                <FormikInput name="length" label="Length (px)" type="number" />
                <FormikInput
                  name="angle"
                  label="Angle (degrees)"
                  type="number"
                />
              </>
            )}

            {type === "curve" && (
              <>
                <FormikSelect
                  name="style"
                  label="Curve Style"
                  options={[
                    { value: "wave", label: "Wave" },
                    { value: "sine", label: "Sine" },
                    { value: "zigzag", label: "Zigzag" },
                    { value: "spiral", label: "Spiral" },
                  ]}
                />
                <FormikInput name="color" label="Color" placeholder="#10b981" />
                <FormikInput
                  name="thickness"
                  label="Thickness (px)"
                  type="number"
                />
                <FormikInput
                  name="amplitude"
                  label="Amplitude (px)"
                  type="number"
                />
                <FormikInput name="frequency" label="Frequency" type="number" />
              </>
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
