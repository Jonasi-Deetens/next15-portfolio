"use client";

import { trpc } from "@/lib/trpc-client";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormikInput } from "@/components/ui/FormikInput";
import { FormikSelect } from "@/components/ui/FormikSelect";
import { User, Mail, Shield, Info } from "lucide-react";

interface EditUserModalProps {
  open: boolean;
  user: any;
  onClose: () => void;
  onSuccess: () => void;
}

const editUserSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  role: Yup.string()
    .oneOf(["USER", "ADMIN", "SUPER_ADMIN"])
    .required("Role is required"),
});

interface EditUserForm {
  name: string;
  email: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
}

const roleOptions = [
  { value: "USER", label: "User" },
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

export function EditUserModal({
  open,
  user,
  onClose,
  onSuccess,
}: EditUserModalProps) {
  const updateUser = trpc.user.updateUser.useMutation();
  const updateRole = trpc.user.updateRole.useMutation();

  const initialValues: EditUserForm = {
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "USER",
  };

  const handleSubmit = async (
    values: EditUserForm,
    { setSubmitting, setFieldError }: any
  ) => {
    try {
      // Update basic info if changed
      if (values.name !== user.name || values.email !== user.email) {
        await updateUser.mutateAsync({
          userId: user.id,
          name: values.name,
          email: values.email,
        });
      }

      // Update role if changed
      if (values.role !== user.role) {
        await updateRole.mutateAsync({
          userId: user.id,
          role: values.role,
        });
      }

      onSuccess();
    } catch (error: any) {
      setFieldError("email", error.message || "Failed to update user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit User"
      description="Update user information and permissions"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={editUserSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {(updateUser.isError || updateRole.isError) && (
              <Alert variant="destructive">
                <AlertDescription>
                  {updateUser.error?.message ||
                    updateRole.error?.message ||
                    "Failed to update user"}
                </AlertDescription>
              </Alert>
            )}

            <FormikInput
              name="name"
              type="text"
              label="Name"
              placeholder="John Doe"
              icon={<User className="h-4 w-4" />}
              disabled={isSubmitting}
            />

            <FormikInput
              name="email"
              type="email"
              label="Email"
              placeholder="john@example.com"
              icon={<Mail className="h-4 w-4" />}
              disabled={isSubmitting}
            />

            <div>
              <FormikSelect
                name="role"
                label="Role"
                icon={<Shield className="h-4 w-4" />}
                options={roleOptions}
                disabled={isSubmitting}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Admins have access to user management and settings
              </p>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Current Status:</strong> {user?.status}
                <br />
                <span className="text-xs">
                  Use the status buttons on the main page to change user status
                </span>
              </AlertDescription>
            </Alert>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting} className="flex-1">
                Save Changes
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
