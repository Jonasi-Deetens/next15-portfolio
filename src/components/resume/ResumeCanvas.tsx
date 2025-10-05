import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { ResumeElementRenderer } from "./ResumeElementRenderer";
import { ResumeElement } from "@/types/resume";
import { Type, Edit, Trash2 } from "lucide-react";

interface ResumeCanvasProps {
  elements: ResumeElement[];
  isPreview: boolean;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onDrop: (e: React.DragEvent) => void;
  onEditElement: (element: ResumeElement) => void;
  onDeleteElement: (id: string) => void;
  onElementMouseDown: (e: React.MouseEvent, element: ResumeElement) => void;
  onElementMouseMove: (e: MouseEvent) => void;
  onElementMouseUp: (e?: MouseEvent) => void;
  onSidebarDragLeave: () => void;
  draggingFromSidebar?: {
    elementType: string;
    startPosition: { x: number; y: number };
  } | null;
}

export function ResumeCanvas({
  elements,
  isPreview,
  canvasRef,
  onDrop,
  onEditElement,
  onDeleteElement,
  onElementMouseDown,
  onElementMouseMove,
  onElementMouseUp,
  onSidebarDragLeave,
  draggingFromSidebar,
}: ResumeCanvasProps) {
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      onElementMouseMove(e);
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      onElementMouseUp(e);
    };

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [onElementMouseMove, onElementMouseUp]);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          {isPreview ? "Resume Preview" : "Resume Canvas"}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {isPreview
            ? "This is how your resume will look"
            : "Drag elements to build your resume"}
        </p>
      </div>

      <div className="flex justify-center p-6">
        <div
          ref={canvasRef}
          onDrop={isPreview ? undefined : onDrop}
          className={`relative transition-colors select-none ${
            isPreview
              ? "bg-gradient-to-br from-gray-50 to-white shadow-2xl"
              : draggingFromSidebar
              ? "border-2 border-dashed border-blue-400 bg-blue-50"
              : "border-2 border-dashed border-gray-300"
          }`}
          style={{
            width: "210mm",
            height: "297mm",
            minHeight: "297mm",
            background: isPreview
              ? "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)"
              : "white",
            boxShadow: isPreview
              ? "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)"
              : draggingFromSidebar
              ? "0 0 20px rgba(59, 130, 246, 0.3)"
              : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            userSelect: "none",
            margin: "0 auto",
            padding: "20mm",
          }}
          onDragEnter={
            isPreview
              ? undefined
              : (e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add(
                    "bg-blue-50",
                    "border-blue-400"
                  );
                  e.currentTarget.style.boxShadow =
                    "0 0 20px rgba(59, 130, 246, 0.3)";
                }
          }
          onDragLeave={
            isPreview
              ? undefined
              : (e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove(
                    "bg-blue-50",
                    "border-blue-400"
                  );
                  e.currentTarget.style.boxShadow = "";
                  onSidebarDragLeave();
                }
          }
        >
          {elements.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Type className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">
                  Start building your resume
                </p>
                <p className="text-sm">
                  Drag elements from the sidebar to get started
                </p>
              </div>
            </div>
          ) : (
            elements.map((element) => (
              <div
                key={element.id}
                className={`absolute ${
                  element.isDragging
                    ? "cursor-grabbing z-50 opacity-80 scale-105"
                    : element.isPreview
                    ? "cursor-pointer z-40 opacity-60"
                    : isPreview
                    ? "cursor-default"
                    : "cursor-pointer group"
                }`}
                style={{
                  left: element.position.x,
                  top: element.position.y,
                  width: element.size.width,
                  height: element.size.height,
                }}
                onMouseDown={
                  isPreview ? undefined : (e) => onElementMouseDown(e, element)
                }
              >
                <ResumeElementRenderer
                  element={element}
                  isPreview={isPreview}
                />
                {!isPreview && !element.isPreview && (
                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditElement(element);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteElement(element.id);
                        }}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
