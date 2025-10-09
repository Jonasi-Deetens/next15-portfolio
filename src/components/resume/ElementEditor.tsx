import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FormikInput } from "@/components/ui/FormikInput";
import { FormikTextarea } from "@/components/ui/FormikTextarea";
import {
  ResumeElement,
  ResumeElementContent,
  ProjectsData,
  CertificationsData,
  LanguagesData,
  ReferencesData,
} from "@/types/resume";
import { Save, Trash2 } from "lucide-react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormikSelect, FormikCheckbox } from "../ui";

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
        color: Yup.string(),
        textAlign: Yup.string().oneOf(["left", "center", "right"]),
        fontFamily: Yup.string(),
        lineHeight: Yup.number().min(0.5).max(3),
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
        linkedin: Yup.string().url("Invalid URL"),
        github: Yup.string().url("Invalid URL"),
        portfolio: Yup.string().url("Invalid URL"),
      });
    case "skill":
      return Yup.object({
        skills: Yup.array()
          .of(Yup.string())
          .min(1, "At least one skill is required"),
        categories: Yup.array().of(Yup.string()),
        levels: Yup.object(),
      });
    case "image":
      return Yup.object({
        src: Yup.string().url("Invalid URL").required("Image URL is required"),
        alt: Yup.string().required("Alt text is required"),
        rounded: Yup.boolean(),
        opacity: Yup.number().min(0).max(1),
        borderColor: Yup.string(),
        borderWidth: Yup.number().min(0).max(10),
      });
    case "shape":
      return Yup.object({
        type: Yup.string()
          .oneOf(["triangle", "circle", "square", "diamond", "star"])
          .required(),
        color: Yup.string().required(),
        rotation: Yup.number().min(0).max(360).required(),
        opacity: Yup.number().min(0).max(1),
        borderColor: Yup.string(),
        borderWidth: Yup.number().min(0).max(10),
      });
    case "line":
      return Yup.object({
        style: Yup.string().oneOf(["solid", "dashed", "dotted"]).required(),
        color: Yup.string().required(),
        thickness: Yup.number().min(1).max(20).required(),
        angle: Yup.number().min(0).max(360).required(),
      });
    case "header":
      return Yup.object({
        name: Yup.string().required("Name is required"),
        title: Yup.string().required("Title is required"),
        fontSize: Yup.number().min(8).max(72).required(),
        fontWeight: Yup.string().oneOf(["normal", "bold"]).required(),
      });
    case "summary":
      return Yup.object({
        text: Yup.string().required("Summary text is required"),
        fontSize: Yup.number().min(8).max(72).required(),
        fontWeight: Yup.string().oneOf(["normal", "bold"]).required(),
      });
    case "projects":
      return Yup.object({
        projects: Yup.array()
          .of(
            Yup.object({
              name: Yup.string().required("Project name is required"),
              description: Yup.string().required(
                "Project description is required"
              ),
              technologies: Yup.array().of(Yup.string()),
            })
          )
          .min(1, "At least one project is required"),
      });
    case "certifications":
      return Yup.object({
        certifications: Yup.array()
          .of(
            Yup.object({
              name: Yup.string().required("Certification name is required"),
              issuer: Yup.string().required("Issuer is required"),
              date: Yup.string().required("Date is required"),
            })
          )
          .min(1, "At least one certification is required"),
      });
    case "languages":
      return Yup.object({
        languages: Yup.array()
          .of(
            Yup.object({
              name: Yup.string().required("Language name is required"),
              proficiency: Yup.string()
                .oneOf(["beginner", "intermediate", "advanced", "native"])
                .required(),
            })
          )
          .min(1, "At least one language is required"),
      });
    case "references":
      return Yup.object({
        references: Yup.array()
          .of(
            Yup.object({
              name: Yup.string().required("Reference name is required"),
              title: Yup.string().required("Title is required"),
              company: Yup.string().required("Company is required"),
            })
          )
          .min(1, "At least one reference is required"),
      });
    case "divider":
      return Yup.object({
        style: Yup.string()
          .oneOf(["line", "dots", "dashes", "thick"])
          .required(),
        color: Yup.string().required(),
        thickness: Yup.number().min(1).max(20).required(),
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
    onUpdate(element.id, {
      content: values as unknown as ResumeElementContent,
    });
    onClose();
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
          initialValues={content as unknown as Record<string, unknown>}
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
                  />
                </div>
                <FormikInput name="color" label="Color" placeholder="#374151" />
                <FormikSelect
                  name="textAlign"
                  label="Text Alignment"
                  options={[
                    { value: "left", label: "Left" },
                    { value: "center", label: "Center" },
                    { value: "right", label: "Right" },
                  ]}
                />
                <FormikInput
                  name="fontFamily"
                  label="Font Family"
                  placeholder="Arial, sans-serif"
                />
                <FormikInput
                  name="lineHeight"
                  label="Line Height"
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="3"
                />
              </>
            )}

            {type === "image" && (
              <>
                <FormikInput name="src" label="Image URL" />
                <FormikInput name="alt" label="Alt Text" />
                <FormikCheckbox name="rounded" label="Rounded corners" />
                <FormikInput
                  name="opacity"
                  label="Opacity (0-1)"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                />
                <FormikInput
                  name="borderColor"
                  label="Border Color"
                  placeholder="#10b981"
                />
                <FormikInput
                  name="borderWidth"
                  label="Border Width (px)"
                  type="number"
                  min="0"
                  max="10"
                />
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
                <FormikCheckbox name="current" label="Currently working here" />
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
                <FormikInput name="linkedin" label="LinkedIn URL" />
                <FormikInput name="github" label="GitHub URL" />
                <FormikInput name="portfolio" label="Portfolio URL" />
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
                <FormikInput
                  name="rotation"
                  label="Rotation (degrees)"
                  type="number"
                />
                <FormikInput
                  name="opacity"
                  label="Opacity (0-1)"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                />
                <FormikInput
                  name="borderColor"
                  label="Border Color"
                  placeholder="#10b981"
                />
                <FormikInput
                  name="borderWidth"
                  label="Border Width (px)"
                  type="number"
                  min="0"
                  max="10"
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
                <FormikInput
                  name="angle"
                  label="Angle (degrees)"
                  type="number"
                />
              </>
            )}

            {type === "header" && (
              <>
                <FormikInput name="name" label="Name" />
                <FormikInput name="title" label="Title" />
                <FormikInput name="subtitle" label="Subtitle (optional)" />
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
                  />
                </div>
                <FormikInput name="color" label="Color" placeholder="#1f2937" />
                <FormikSelect
                  name="textAlign"
                  label="Text Alignment"
                  options={[
                    { value: "left", label: "Left" },
                    { value: "center", label: "Center" },
                    { value: "right", label: "Right" },
                  ]}
                />
              </>
            )}

            {type === "summary" && (
              <>
                <FormikTextarea name="text" label="Summary Text" rows={4} />
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
                  />
                </div>
                <FormikInput name="color" label="Color" placeholder="#374151" />
                <FormikSelect
                  name="textAlign"
                  label="Text Alignment"
                  options={[
                    { value: "left", label: "Left" },
                    { value: "center", label: "Center" },
                    { value: "right", label: "Right" },
                  ]}
                />
                <FormikInput
                  name="lineHeight"
                  label="Line Height"
                  type="number"
                  step="0.1"
                />
              </>
            )}

            {type === "projects" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Projects
                </label>
                <div className="space-y-3">
                  {(content as ProjectsData).projects?.map(
                    (project, index: number) => (
                      <div
                        key={index}
                        className="border rounded p-3 bg-gray-50"
                      >
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <FormikInput
                            name={`projects.${index}.name`}
                            label="Project Name"
                          />
                          <FormikInput
                            name={`projects.${index}.startDate`}
                            label="Start Date"
                          />
                        </div>
                        <FormikTextarea
                          name={`projects.${index}.description`}
                          label="Description"
                          rows={2}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <FormikInput
                            name={`projects.${index}.url`}
                            label="Project URL"
                          />
                          <FormikInput
                            name={`projects.${index}.github`}
                            label="GitHub URL"
                          />
                        </div>
                        <FormikInput
                          name={`projects.${index}.technologies`}
                          label="Technologies (comma-separated)"
                          placeholder="React, TypeScript, Node.js"
                        />
                      </div>
                    )
                  )}
                </div>
                <div className="mt-2">
                  <FormikCheckbox name="showDates" label="Show dates" />
                  <FormikCheckbox
                    name="showTechnologies"
                    label="Show technologies"
                  />
                </div>
              </div>
            )}

            {type === "certifications" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certifications
                </label>
                <div className="space-y-3">
                  {(content as CertificationsData).certifications?.map(
                    (cert, index: number) => (
                      <div
                        key={index}
                        className="border rounded p-3 bg-gray-50"
                      >
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <FormikInput
                            name={`certifications.${index}.name`}
                            label="Certification Name"
                          />
                          <FormikInput
                            name={`certifications.${index}.issuer`}
                            label="Issuing Organization"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <FormikInput
                            name={`certifications.${index}.date`}
                            label="Date"
                          />
                          <FormikInput
                            name={`certifications.${index}.credentialId`}
                            label="Credential ID"
                          />
                        </div>
                        <FormikInput
                          name={`certifications.${index}.url`}
                          label="Certificate URL"
                        />
                      </div>
                    )
                  )}
                </div>
                <div className="mt-2">
                  <FormikCheckbox name="showDates" label="Show dates" />
                  <FormikCheckbox
                    name="showCredentialIds"
                    label="Show credential IDs"
                  />
                </div>
              </div>
            )}

            {type === "languages" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages
                </label>
                <div className="space-y-3">
                  {(content as LanguagesData).languages?.map(
                    (lang, index: number) => (
                      <div
                        key={index}
                        className="border rounded p-3 bg-gray-50"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          <FormikInput
                            name={`languages.${index}.name`}
                            label="Language"
                          />
                          <FormikSelect
                            name={`languages.${index}.proficiency`}
                            label="Proficiency"
                            options={[
                              { value: "beginner", label: "Beginner" },
                              { value: "intermediate", label: "Intermediate" },
                              { value: "advanced", label: "Advanced" },
                              { value: "native", label: "Native" },
                            ]}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="mt-2">
                  <FormikCheckbox
                    name="showProficiency"
                    label="Show proficiency levels"
                  />
                </div>
              </div>
            )}

            {type === "references" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  References
                </label>
                <div className="space-y-3">
                  {(content as ReferencesData).references?.map(
                    (ref, index: number) => (
                      <div
                        key={index}
                        className="border rounded p-3 bg-gray-50"
                      >
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <FormikInput
                            name={`references.${index}.name`}
                            label="Name"
                          />
                          <FormikInput
                            name={`references.${index}.title`}
                            label="Title"
                          />
                        </div>
                        <FormikInput
                          name={`references.${index}.company`}
                          label="Company"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <FormikInput
                            name={`references.${index}.phone`}
                            label="Phone"
                          />
                          <FormikInput
                            name={`references.${index}.email`}
                            label="Email"
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="mt-2">
                  <FormikCheckbox
                    name="showContact"
                    label="Show contact information"
                  />
                </div>
              </div>
            )}

            {type === "divider" && (
              <>
                <FormikSelect
                  name="style"
                  label="Divider Style"
                  options={[
                    { value: "line", label: "Line" },
                    { value: "dots", label: "Dots" },
                    { value: "dashes", label: "Dashes" },
                    { value: "thick", label: "Thick Line" },
                  ]}
                />
                <FormikInput name="color" label="Color" placeholder="#d1d5db" />
                <FormikInput
                  name="thickness"
                  label="Thickness (px)"
                  type="number"
                />
                <FormikInput
                  name="opacity"
                  label="Opacity (0-1)"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                />
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
