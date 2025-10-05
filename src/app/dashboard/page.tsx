"use client";

import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import {
  User,
  FileText,
  ArrowRight,
  Calendar,
  Mail,
  ExternalLink,
  Plus,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { UserSettings } from "@/types/user";

export default function DashboardPage() {
  const { data: session } = useSession();

  // Load user settings to determine what to show
  // @ts-expect-error - tRPC type issue
  const { data: userSettings } = trpc.user.getSettings.useQuery();

  // Load user's projects if portfolio builder is enabled
  const { data: projects = [] } = trpc.project.getMyProjects.useQuery(
    undefined,
    { enabled: (userSettings as UserSettings)?.portfolioBuilder === true }
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session?.user?.name || "User"}!
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your portfolio and professional presence
        </p>
      </div>

      {/* User Info Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Your Profile
          </CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <Avatar
              src={session?.user?.image}
              fallback={session?.user?.name || "U"}
              alt={session?.user?.name || "User"}
              size="xl"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {session?.user?.name || "User"}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {session?.user?.email}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Member since {new Date().getFullYear()}
                </span>
              </div>
            </div>
            <Link href="/dashboard/settings">
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Section - Only show if enabled */}
      {(userSettings as UserSettings)?.portfolioBuilder && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Portfolio Projects
                </CardTitle>
                <CardDescription>
                  Your latest portfolio projects
                </CardDescription>
              </div>
              <Link href="/dashboard/portfolio-builder">
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No projects yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Start building your portfolio by adding your first project
                </p>
                <Link href="/dashboard/portfolio-builder">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Project
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.slice(0, 3).map((project) => (
                  <div
                    key={project.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {project.image && (
                      <div className="aspect-video bg-gray-100 rounded-md mb-3 relative overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {project.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    {project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.tags.slice(0, 2).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {project.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{project.tags.length - 2} more
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="flex gap-2">
                      {project.link && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            project.link && window.open(project.link, "_blank")
                          }
                          className="flex-1"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      )}
                      <Link href="/dashboard/portfolio-builder">
                        <Button variant="outline" size="sm">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                {projects.length > 3 && (
                  <div className="border rounded-lg p-4 flex items-center justify-center hover:shadow-md transition-shadow">
                    <Link href="/dashboard/portfolio-builder">
                      <Button variant="outline" className="w-full">
                        View All Projects ({projects.length})
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Resume Section - Only show if enabled */}
      {(userSettings as UserSettings)?.resumeBuilder && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Resume
                </CardTitle>
                <CardDescription>Your professional resume</CardDescription>
              </div>
              <Link href="/dashboard/resume-builder">
                <Button variant="outline" size="sm">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Manage Resume
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Resume Builder
              </h3>
              <p className="text-gray-500 mb-4">
                Create and manage your professional resume
              </p>
              <Link href="/dashboard/resume-builder">
                <Button>
                  <FileText className="w-4 h-4 mr-2" />
                  Build Your Resume
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Section - Only show if enabled */}
      {(userSettings as UserSettings)?.analytics && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Analytics
                </CardTitle>
                <CardDescription>
                  Track your portfolio performance
                </CardDescription>
              </div>
              <Link href="/dashboard/analytics">
                <Button variant="outline" size="sm">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Analytics Dashboard
              </h3>
              <p className="text-gray-500 mb-4">
                Track views and engagement on your portfolio
              </p>
              <Link href="/dashboard/analytics">
                <Button>
                  <FileText className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Network Section - Only show if enabled */}
      {(userSettings as UserSettings)?.network && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Network
                </CardTitle>
                <CardDescription>
                  Manage your professional connections
                </CardDescription>
              </div>
              <Link href="/dashboard/network">
                <Button variant="outline" size="sm">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Manage Network
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Professional Network
              </h3>
              <p className="text-gray-500 mb-4">
                Connect with other professionals and grow your network
              </p>
              <Link href="/dashboard/network">
                <Button>
                  <User className="w-4 h-4 mr-2" />
                  Build Your Network
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
