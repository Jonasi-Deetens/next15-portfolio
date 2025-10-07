"use client";

import { Button } from "@/components/ui/Button";
import { ElementsPanel } from "@/components/resume/ElementsPanel";
import { ResumeCanvas } from "@/components/resume/ResumeCanvas";
import { ElementEditor } from "@/components/resume/ElementEditor";
import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import { draggableElements } from "@/constants/resume";
import { Eye, Save, FileText, Grid3X3, AlignLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResumeBuilderPage() {
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const searchParams = useSearchParams();
  const urlResumeId = searchParams.get("resumeId");

  useEffect(() => {
    if (urlResumeId) {
      setSelectedResumeId(urlResumeId);
    }
  }, [urlResumeId]);

  const resumeId = selectedResumeId;

  const {
    elements,
    editingElement,
    isPreview,
    canvasRef,
    handleDrop,
    updateElement,
    deleteElement,
    editElement,
    bringToFront,
    sendToBack,
    rotateElement,
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
    myResumes,
    selectedElementId,
    deselectElement,
    snapToGrid,
    toggleSnapToGrid,
    snapToElements,
    toggleSnapToElements,
  } = useResumeBuilder(resumeId || undefined);

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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Load Resume:
              </label>
              <div className="flex gap-2">
                <select
                  value={resumeId || ""}
                  onChange={(e) => {
                    setSelectedResumeId(e.target.value);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">New Resume</option>
                  {myResumes.map((resume) => (
                    <option key={resume.id} value={resume.id}>
                      {resume.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/resumes">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Resumes
            </Button>
          </Link>
          <Button
            onClick={toggleSnapToGrid}
            variant={snapToGrid ? "default" : "outline"}
            title="Toggle snap to grid"
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            Grid
          </Button>
          <Button
            onClick={toggleSnapToElements}
            variant={snapToElements ? "default" : "outline"}
            title="Toggle snap to elements"
          >
            <AlignLeft className="w-4 h-4 mr-2" />
            Align
          </Button>
          <Button
            onClick={togglePreview}
            variant={isPreview ? "default" : "outline"}
          >
            <Eye className="w-4 h-4 mr-2" />
            {isPreview ? "Edit" : "Preview"}
          </Button>
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
            onBringToFront={bringToFront}
            onSendToBack={sendToBack}
            onRotateElement={(id, e) => rotateElement(id, e)}
            onElementMouseDown={handleElementMouseDown}
            onElementMouseMove={handleElementMouseMove}
            onElementMouseUp={handleElementMouseUp}
            onSidebarDragLeave={handleSidebarDragLeave}
            onElementUpdate={updateElement}
            selectedElementId={selectedElementId}
            onDeselectElement={deselectElement}
            draggingFromSidebar={draggingFromSidebar}
            snapToGrid={snapToGrid}
            snapToElements={snapToElements}
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
