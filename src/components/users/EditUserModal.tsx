"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc-client";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert, AlertDescription } from "@/components/ui/Alert";

interface EditUserModalProps {
  open: boolean;
  user: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditUserModal({
  open,
  user,
  onClose,
  onSuccess,
}: EditUserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "USER" as "USER" | "ADMIN" | "SUPER_ADMIN",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "USER",
      });
    }
  }, [user]);

  const updateUser = trpc.user.updateUser.useMutation({
    onSuccess: () => {
      setError(null);
      onSuccess();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const updateRole = trpc.user.updateRole.useMutation({
    onSuccess: () => {
      setError(null);
      onSuccess();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError("Name and email are required");
      return;
    }

    // Update basic info
    updateUser.mutate({
      userId: user.id,
      name: formData.name,
      email: formData.email,
    });

    // Update role if changed
    if (formData.role !== user.role) {
      updateRole.mutate({
        userId: user.id,
        role: formData.role,
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit User"
      description="Update user information and permissions"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="john@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({
                ...formData,
                role: e.target.value as "USER" | "ADMIN" | "SUPER_ADMIN",
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Admins have access to user management and settings
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Current Status:</strong> {user?.status}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Use the status buttons on the main page to change user status
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={updateUser.isPending || updateRole.isPending}
            className="flex-1"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
