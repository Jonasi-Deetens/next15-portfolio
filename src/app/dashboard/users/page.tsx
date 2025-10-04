"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import {
  UserPlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { CreateUserModal } from "@/components/users/CreateUserModal";
import { EditUserModal } from "@/components/users/EditUserModal";

export default function UsersPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: users, refetch } = trpc.user.getAllWithDetails.useQuery();
  const { data: stats } = trpc.user.getStats.useQuery();

  const deleteUser = trpc.user.deleteUser.useMutation({
    onSuccess: () => {
      refetch();
      setError(null);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const updateStatus = trpc.user.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
      setError(null);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleDelete = (userId: string, userName: string) => {
    if (
      confirm(
        `Are you sure you want to delete user "${userName}"? This action cannot be undone.`
      )
    ) {
      deleteUser.mutate({ userId });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-700 bg-green-50";
      case "INACTIVE":
        return "text-gray-700 bg-gray-50";
      case "SUSPENDED":
        return "text-red-700 bg-red-50";
      default:
        return "text-gray-700 bg-gray-50";
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "text-purple-700 bg-purple-50";
      case "ADMIN":
        return "text-blue-700 bg-blue-50";
      case "USER":
        return "text-gray-700 bg-gray-50";
      default:
        return "text-gray-700 bg-gray-50";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-gray-600">
            Manage users, roles, and permissions.
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <UserPlusIcon className="w-5 h-5 mr-2" />
          Create User
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">
              {stats?.total || 0}
            </div>
            <p className="text-sm text-gray-600">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {stats?.active || 0}
            </div>
            <p className="text-sm text-gray-600">Active Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {stats?.admins || 0}
            </div>
            <p className="text-sm text-gray-600">Administrators</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {stats?.suspended || 0}
            </div>
            <p className="text-sm text-gray-600">Suspended</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            A list of all users in your workspace including their name, email,
            role, and status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Apps
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Joined
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {user.role === "SUPER_ADMIN" ||
                        user.role === "ADMIN" ? (
                          <ShieldCheckIcon className="w-3 h-3" />
                        ) : null}
                        {user.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {user.status === "ACTIVE" ? (
                          <CheckCircleIcon className="w-3 h-3" />
                        ) : (
                          <XCircleIcon className="w-3 h-3" />
                        )}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {user.installedApps?.length || 0}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditUser(user)}
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Button>
                        {user.status === "ACTIVE" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateStatus.mutate({
                                userId: user.id,
                                status: "SUSPENDED",
                              })
                            }
                          >
                            Suspend
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateStatus.mutate({
                                userId: user.id,
                                status: "ACTIVE",
                              })
                            }
                          >
                            Activate
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleDelete(user.id, user.name || "this user")
                          }
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateUserModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          setCreateModalOpen(false);
          refetch();
        }}
      />

      {editUser && (
        <EditUserModal
          open={!!editUser}
          user={editUser}
          onClose={() => setEditUser(null)}
          onSuccess={() => {
            setEditUser(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
