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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { StatCard } from "@/components/ui/StatCard";
import {
  UserPlus,
  Users,
  UserCheck,
  Shield,
  UserX,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  ShieldCheck,
} from "lucide-react";
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

  const getStatusBadgeVariant = (
    status: string
  ): "success" | "default" | "danger" => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "INACTIVE":
        return "default";
      case "SUSPENDED":
        return "danger";
      default:
        return "default";
    }
  };

  const getRoleBadgeVariant = (
    role: string
  ): "secondary" | "info" | "default" => {
    switch (role) {
      case "SUPER_ADMIN":
        return "secondary";
      case "ADMIN":
        return "info";
      default:
        return "default";
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
          <UserPlus className="w-5 h-5 mr-2" />
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
        <StatCard
          title="Total Users"
          value={stats?.total || 0}
          icon={<Users className="w-6 h-6" />}
          variant="default"
        />
        <StatCard
          title="Active Users"
          value={stats?.active || 0}
          icon={<UserCheck className="w-6 h-6" />}
          variant="success"
        />
        <StatCard
          title="Administrators"
          value={stats?.admins || 0}
          icon={<Shield className="w-6 h-6" />}
          variant="primary"
        />
        <StatCard
          title="Suspended"
          value={stats?.suspended || 0}
          icon={<UserX className="w-6 h-6" />}
          variant="danger"
        />
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Apps</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={user.image}
                        fallback={user.name || "U"}
                        alt={user.name || "User"}
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getRoleBadgeVariant(user.role)}
                      icon={
                        user.role !== "USER" ? (
                          <ShieldCheck className="w-3 h-3" />
                        ) : undefined
                      }
                    >
                      {user.role.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadgeVariant(user.status)}
                      icon={
                        user.status === "ACTIVE" ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-900">
                    {user.installedApps?.length || 0}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditUser(user)}
                      >
                        <Edit2 className="w-4 h-4" />
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
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
