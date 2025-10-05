"use client";

import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { ElementsPanel } from "@/components/resume/ElementsPanel";
import { ResumeCanvas } from "@/components/resume/ResumeCanvas";
import { ElementEditor } from "@/components/resume/ElementEditor";
import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import { draggableElements } from "@/constants/resume";
import { Eye, Save, FileText } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc-client";

export default function ResumeBuilderPage() {
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);

  const { data: myResumes } = trpc.resume.getMyResumes.useQuery();
  const { data: currentResume } = trpc.resume.getById.useQuery(
    { id: currentResumeId! },
    { enabled: !!currentResumeId }
  );

  const {
    elements,
    editingElement,
    isPreview,
    canvasRef,
    handleDrop,
    updateElement,
    deleteElement,
    editElement,
    closeEditor,
    togglePreview,
    handleElementMouseDown,
    handleElementMouseMove,
    handleElementMouseUp,
    handleSidebarMouseDown,
    handleSidebarDragOver,
    handleSidebarDragLeave,
    draggingFromSidebar,
    saveResume,
    isLoading,
  } = useResumeBuilder(currentResume);

  const handleSave = async () => {
    try {
      setSaveMessage("Saving...");
      await saveResume();
      setSaveMessage("Resume saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      setSaveMessage("Failed to save resume");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
          <p className="mt-2 text-gray-600">
            Drag and drop elements to build your resume
          </p>
          {myResumes && myResumes.length > 0 && (
            <div className="mt-3">
              <Select
                label="Load Resume:"
                value={currentResumeId || ""}
                onChange={(e) => {
                  if (e.target.value) {
                    setCurrentResumeId(e.target.value);
                  } else {
                    setCurrentResumeId(null);
                  }
                }}
                options={[
                  { value: "", label: "New Resume" },
                  ...myResumes.map((resume) => ({
                    value: resume.id,
                    label: resume.title,
                  })),
                ]}
              />
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            onClick={togglePreview}
            variant={isPreview ? "default" : "outline"}
          >
            <Eye className="w-4 h-4 mr-2" />
            {isPreview ? "Edit" : "Preview"}
          </Button>
          <Link href="/dashboard/resumes">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Resumes
            </Button>
          </Link>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save Resume"}
          </Button>
        </div>
      </div>

      {saveMessage && (
        <div
          className={`p-3 rounded-md ${
            saveMessage.includes("successfully")
              ? "bg-green-100 text-green-800 border border-green-200"
              : saveMessage.includes("Failed")
              ? "bg-red-100 text-red-800 border border-red-200"
              : "bg-blue-100 text-blue-800 border border-blue-200"
          }`}
        >
          {saveMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {!isPreview && (
          <div className="lg:col-span-1">
            <ElementsPanel
              elements={draggableElements}
              onMouseDown={handleSidebarMouseDown}
            />
          </div>
        )}

        <div className={`${isPreview ? "lg:col-span-4" : "lg:col-span-3"}`}>
          <ResumeCanvas
            elements={elements}
            isPreview={isPreview}
            canvasRef={canvasRef}
            onDrop={handleDrop}
            onEditElement={editElement}
            onDeleteElement={deleteElement}
            onElementMouseDown={handleElementMouseDown}
            onElementMouseMove={handleElementMouseMove}
            onElementMouseUp={handleElementMouseUp}
            onSidebarDragOver={handleSidebarDragOver}
            onSidebarDragLeave={handleSidebarDragLeave}
            draggingFromSidebar={draggingFromSidebar}
          />
        </div>
      </div>

      <ElementEditor
        element={editingElement}
        onClose={closeEditor}
        onUpdate={updateElement}
        onDelete={deleteElement}
      />
    </div>
  );
}
