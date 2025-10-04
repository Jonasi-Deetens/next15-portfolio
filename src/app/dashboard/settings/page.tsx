"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { User, Mail, Lock, Bell, Moon, CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account settings and preferences.
        </p>
      </div>

      {saved && (
        <Alert>
          <AlertDescription>Settings saved successfully!</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar
                src={session?.user?.image}
                fallback={session?.user?.name || "U"}
                alt={session?.user?.name || "User"}
                size="xl"
              />
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account profile information
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                type="text"
                label="Name"
                defaultValue={session?.user?.name || ""}
                placeholder="Your name"
                icon={<User className="h-4 w-4" />}
              />

              <div>
                <Input
                  type="email"
                  label="Email"
                  defaultValue={session?.user?.email || ""}
                  placeholder="your@email.com"
                  icon={<Mail className="h-4 w-4" />}
                  disabled
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              <Button type="submit">
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Settings */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Lock className="w-5 h-5 inline mr-2" />
              Password
            </CardTitle>
            <CardDescription>Change your password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                type="password"
                label="Current Password"
                placeholder="••••••••"
                icon={<Lock className="h-4 w-4" />}
              />

              <Input
                type="password"
                label="New Password"
                placeholder="••••••••"
                icon={<Lock className="h-4 w-4" />}
              />

              <Input
                type="password"
                label="Confirm New Password"
                placeholder="••••••••"
                icon={<Lock className="h-4 w-4" />}
              />

              <Button type="submit">
                <CheckCircle className="w-4 h-4 mr-2" />
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Manage your application preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Email Notifications
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your account
                  </p>
                </div>
              </div>
              <Badge variant="success">Enabled</Badge>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100">
                  <Moon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Use dark theme for the interface
                  </p>
                </div>
              </div>
              <Badge variant="default">Coming Soon</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
