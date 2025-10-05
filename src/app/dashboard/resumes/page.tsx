"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { trpc } from "@/lib/trpc-client";
import { Plus, FileText, Calendar, Edit, Trash2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { resumeTemplates } from "@/constants/resume-templates";

export default function ResumesPage() {
  const [showTemplates, setShowTemplates] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    resumeId: string | null;
    resumeTitle: string;
  }>({
    isOpen: false,
    resumeId: null,
    resumeTitle: "",
  });

  const {
    data: resumes,
    isLoading,
    refetch,
  } = trpc.resume.getMyResumes.useQuery();
  const deleteResumeMutation = trpc.resume.delete.useMutation();
  const createResumeMutation = trpc.resume.create.useMutation();

  const handleDeleteClick = (resume: { id: string; title: string }) => {
    setDeleteModal({
      isOpen: true,
      resumeId: resume.id,
      resumeTitle: resume.title,
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.resumeId) {
      try {
        await deleteResumeMutation.mutateAsync({ id: deleteModal.resumeId });
        refetch();
        setDeleteModal({ isOpen: false, resumeId: null, resumeTitle: "" });
      } catch (error) {
        console.error("Failed to delete resume:", error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, resumeId: null, resumeTitle: "" });
  };

  const handleCreateFromTemplate = async (template: {
    name: string;
    elements: unknown[];
  }) => {
    try {
      const newResume = await createResumeMutation.mutateAsync({
        title: template.name,
        elements: template.elements,
      });
      window.location.href = `/dashboard/resumes/resume-builder?id=${newResume.id}`;
    } catch (error) {
      console.error("Failed to create resume from template:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
            <p className="mt-2 text-gray-600">Manage your resume collection</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
          <p className="mt-2 text-gray-600">Manage your resume collection</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowTemplates(!showTemplates)}
            variant="outline"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Link href="/dashboard/resumes/resume-builder">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New Resume
            </Button>
          </Link>
        </div>
      </div>

      {showTemplates && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Resume Templates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumeTemplates.map((template) => (
              <Card
                key={template.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-gray-600">
                    {template.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleCreateFromTemplate(template)}
                    className="w-full"
                    variant="outline"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {resumes && resumes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map(
            (resume: {
              id: string;
              title: string;
              createdAt: string;
              updatedAt: string;
              elements: unknown[];
            }) => (
              <Card
                key={resume.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <CardTitle className="text-lg">{resume.title}</CardTitle>
                    </div>
                    <div className="flex space-x-1">
                      <Link
                        href={`/dashboard/resumes/resume-builder?id=${resume.id}`}
                      >
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteClick(resume)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Created: {new Date(resume.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Updated: {new Date(resume.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      Elements:{" "}
                      {Array.isArray(resume.elements)
                        ? resume.elements.length
                        : 0}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No resumes yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first resume to get started
            </p>
            <Link href="/dashboard/resumes/resume-builder">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Resume
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Resume"
        message={`Are you sure you want to delete "${deleteModal.resumeTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteResumeMutation.isPending}
      />
    </div>
  );
}
