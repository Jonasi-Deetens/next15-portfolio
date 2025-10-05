"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FormikInput } from "@/components/ui/FormikInput";
import { FormikTextarea } from "@/components/ui/FormikTextarea";
import { Save, X } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  link: string | null;
  image: string | null;
  tags: string[];
  createdAt: string;
  userId: string;
  updatedAt: string;
}

interface ProjectFormProps {
  project?: Project | null;
  isEditing?: boolean;
  onSubmit: (values: ProjectFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}

interface ProjectFormValues {
  title: string;
  description: string;
  link: string;
  image: string;
  tags: string[];
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters")
    .required("Title is required"),
  description: Yup.string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters")
    .required("Description is required"),
  link: Yup.string().url("Must be a valid URL").nullable(),
  image: Yup.string().url("Must be a valid URL").nullable(),
  tags: Yup.array().of(Yup.string()),
});

export function ProjectForm({
  project,
  isEditing = false,
  onSubmit,
  onCancel,
  isLoading = false,
  error,
}: ProjectFormProps) {
  const initialValues: ProjectFormValues = {
    title: project?.title || "",
    description: project?.description || "",
    link: project?.link || "",
    image: project?.image || "",
    tags: project?.tags || [],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Project" : "Add New Project"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormikInput
                  name="title"
                  label="Project Title"
                  placeholder="Enter project title"
                  required
                />
                <FormikInput
                  name="link"
                  label="Project Link"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <FormikTextarea
                  name="description"
                  label="Description"
                  placeholder="Describe your project..."
                  rows={3}
                />
                <FormikInput
                  name="image"
                  label="Image URL"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {values.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newTags = values.tags.filter(
                            (_, i) => i !== index
                          );
                          setFieldValue("tags", newTags);
                        }}
                        className="ml-1 h-4 w-4 p-0 text-gray-500 hover:text-gray-700"
                      >
                        &times;
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    className="flex-1"
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const target = e.target as HTMLInputElement;
                        const newTag = target.value.trim();
                        if (newTag && !values.tags.includes(newTag)) {
                          setFieldValue("tags", [...values.tags, newTag]);
                          target.value = "";
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const input = document.querySelector(
                        'input[placeholder="Add a tag"]'
                      ) as HTMLInputElement;
                      const newTag = input.value.trim();
                      if (newTag && !values.tags.includes(newTag)) {
                        setFieldValue("tags", [...values.tags, newTag]);
                        input.value = "";
                      }
                    }}
                  >
                    Add Tag
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isLoading
                    ? isEditing
                      ? "Updating..."
                      : "Adding..."
                    : isEditing
                    ? "Update Project"
                    : "Add Project"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>

              {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}
