"use client";

import { useState } from "react";
import Image from "next/image";
import { trpc } from "@/lib/trpc-client";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { ProjectSkeleton } from "@/components/ui/ProjectSkeleton";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { Plus, Edit, Trash2, ExternalLink, FileText } from "lucide-react";

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

export default function PortfolioBuilderPage() {
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    projectId: string | null;
    projectTitle: string;
  }>({
    isOpen: false,
    projectId: null,
    projectTitle: "",
  });

  // tRPC queries and mutations
  const { data: projects = [], isLoading } =
    trpc.project.getMyProjects.useQuery();
  const createProjectMutation = trpc.project.create.useMutation({
    onSuccess: () => {
      setIsAddingProject(false);
    },
  });
  const updateProjectMutation = trpc.project.update.useMutation({
    onSuccess: () => {
      setIsEditingProject(false);
      setEditingProject(null);
    },
  });
  const deleteProjectMutation = trpc.project.delete.useMutation({
    onSuccess: () => {
      // Project deleted successfully - tRPC will automatically refetch the data
    },
    onError: (error) => {
      console.error("Failed to delete project:", error);
    },
  });

  const handleFormSubmit = (values: {
    title: string;
    description: string;
    link: string;
    image: string;
    tags: string[];
  }) => {
    if (isEditingProject && editingProject) {
      updateProjectMutation.mutate({
        id: editingProject.id,
        title: values.title,
        description: values.description,
        link: values.link || "",
        image: values.image || "",
        tags: values.tags,
      });
    } else {
      createProjectMutation.mutate({
        title: values.title,
        description: values.description,
        link: values.link || "",
        image: values.image || "",
        tags: values.tags,
      });
    }
  };

  const editProject = (project: Project) => {
    setEditingProject(project);
    setIsEditingProject(true);
    setIsAddingProject(false);
  };

  const cancelForm = () => {
    setIsAddingProject(false);
    setIsEditingProject(false);
    setEditingProject(null);
  };

  const handleDeleteClick = (project: Project) => {
    setDeleteModal({
      isOpen: true,
      projectId: project.id,
      projectTitle: project.title,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.projectId) {
      deleteProjectMutation.mutate({ id: deleteModal.projectId });
      setDeleteModal({ isOpen: false, projectId: null, projectTitle: "" });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, projectId: null, projectTitle: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
          <p className="mt-2 text-gray-600">Showcase your projects and work</p>
        </div>
        <div className="flex gap-3">
          {!isEditingProject && (
            <Button
              onClick={() => setIsAddingProject(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </Button>
          )}
        </div>
      </div>

      {/* Add/Edit Project Form */}
      {(isAddingProject || isEditingProject) && (
        <ProjectForm
          project={editingProject}
          isEditing={isEditingProject}
          onSubmit={handleFormSubmit}
          onCancel={cancelForm}
          isLoading={
            createProjectMutation.isPending || updateProjectMutation.isPending
          }
          error={
            createProjectMutation.isError || updateProjectMutation.isError
              ? `Failed to ${
                  isEditingProject ? "update" : "add"
                } project. Please try again.`
              : null
          }
        />
      )}

      {/* Global Error Messages */}
      {deleteProjectMutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">
            Failed to delete project. Please try again.
          </p>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? // Show skeleton cards while loading
            Array.from({ length: 6 }).map((_, index) => (
              <ProjectSkeleton key={index} />
            ))
          : // Show actual projects
            projects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                {project.image && (
                  <div className="aspect-video bg-gray-100 relative">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {project.title}
                    </h3>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editProject(project)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(project)}
                        disabled={deleteProjectMutation.isPending}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 disabled:opacity-50"
                      >
                        {deleteProjectMutation.isPending ? (
                          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {project.description}
                  </p>
                  {project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {project.link && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        project.link && window.open(project.link, "_blank")
                      }
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Project
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Empty State */}
      {!isLoading && projects.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-500 mb-4">
              Start building your portfolio by adding your first project
            </p>
            <Button onClick={() => setIsAddingProject(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteModal.projectTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteProjectMutation.isPending}
      />
    </div>
  );
}
