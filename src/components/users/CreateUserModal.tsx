"use client";

import { trpc } from "@/lib/trpc-client";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormikInput } from "@/components/ui/FormikInput";
import { FormikSelect } from "@/components/ui/FormikSelect";
import { User, Mail, Lock, Shield } from "lucide-react";

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const createUserSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: Yup.string()
    .oneOf(["USER", "ADMIN", "SUPER_ADMIN"])
    .required("Role is required"),
});

interface CreateUserForm {
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
}

const roleOptions = [
  { value: "USER", label: "User" },
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

export function CreateUserModal({
  open,
  onClose,
  onSuccess,
}: CreateUserModalProps) {
  const createUser = trpc.user.createUser.useMutation({
    onSuccess: () => {
      onSuccess();
    },
  });

  const initialValues: CreateUserForm = {
    name: "",
    email: "",
    password: "",
    role: "USER",
  };

  const handleSubmit = async (
    values: CreateUserForm,
    { setSubmitting, setFieldError }: any
  ) => {
    try {
      await createUser.mutateAsync(values);
    } catch (error: any) {
      setFieldError("email", error.message || "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create New User"
      description="Add a new user to your workspace"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={createUserSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, errors }) => (
          <Form className="space-y-4">
            {createUser.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {createUser.error?.message || "Failed to create user"}
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
              <FormikInput
                name="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                icon={<Lock className="h-4 w-4" />}
                disabled={isSubmitting}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Minimum 6 characters
              </p>
            </div>

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
              <Button
                type="submit"
                loading={isSubmitting}
                className="flex-1"
              >
                Create User
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
