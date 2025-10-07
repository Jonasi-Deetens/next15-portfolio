import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { ResumeElementRenderer } from "./ResumeElementRenderer";
import { TransformControls } from "./TransformControls";
import { AlignmentGuides } from "./AlignmentGuides";
import { ResumeElement } from "@/types/resume";
import {
  Type,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  RotateCcw,
} from "lucide-react";

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
  onElementUpdate: (id: string, updates: Partial<ResumeElement>) => void;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
  onRotateElement: (id: string, e: React.MouseEvent) => void;
  selectedElementId: string | null;
  onDeselectElement: () => void;
  draggingFromSidebar?: {
    elementType: string;
    startPosition: { x: number; y: number };
  } | null;
  snapToGrid?: boolean;
  snapToElements?: boolean;
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
  onElementUpdate,
  onBringToFront,
  onSendToBack,
  onRotateElement,
  selectedElementId,
  onDeselectElement,
  draggingFromSidebar,
  snapToGrid = false,
  snapToElements = false,
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
      <div className="flex justify-center px-6 relative">
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
            overflow: "hidden",
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
          onClick={
            isPreview
              ? undefined
              : (e) => {
                  if (e.target === e.currentTarget) {
                    onDeselectElement();
                  }
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
                    ? "cursor-grabbing z-50 opacity-80"
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
                  transform: element.rotation
                    ? `rotate(${element.rotation}deg)`
                    : undefined,
                  transformOrigin: "center",
                }}
                onMouseDown={
                  isPreview
                    ? undefined
                    : (e) => {
                        e.stopPropagation();
                        onElementMouseDown(e, element);
                      }
                }
              >
                <ResumeElementRenderer
                  element={element}
                  isPreview={isPreview}
                />
              </div>
            ))
          )}
        </div>

        {!isPreview && snapToElements && selectedElementId && (
          <AlignmentGuides
            elements={elements}
            currentElement={
              elements.find((el) => el.id === selectedElementId) || null
            }
            snapToElements={snapToElements}
          />
        )}

        {!isPreview &&
          selectedElementId &&
          elements.map((element) => {
            if (element.isPreview || element.id !== selectedElementId)
              return null;

            return (
              <div key={`controls-${element.id}`} className="group">
                <TransformControls
                  element={element}
                  onUpdate={(updates) => onElementUpdate(element.id, updates)}
                  onSelect={() => {}}
                  onElementMouseDown={onElementMouseDown}
                  snapToGrid={snapToGrid}
                  style={{
                    position: "absolute",
                    left: `calc(50% - 105mm + ${element.position.x + 1}px)`,
                    top: `calc(${element.position.y + 1}px)`,
                    zIndex: 1000,
                  }}
                />

                <div
                  className="absolute opacity-100 transition-opacity"
                  style={{
                    left: `calc(50% - 105mm + ${
                      element.position.x + element.size.width + 8
                    }px)`,
                    top: `calc(${element.position.y}px)`,
                    zIndex: 1001,
                  }}
                >
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBringToFront(element.id);
                      }}
                      className="h-6 w-6 p-0"
                      title="Bring to front"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSendToBack(element.id);
                      }}
                      className="h-6 w-6 p-0"
                      title="Send to back"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        onRotateElement(element.id, e);
                      }}
                      className="h-6 w-6 p-0 cursor-grab active:cursor-grabbing"
                      title="Rotate (hold and drag)"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </Button>
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
              </div>
            );
          })}
      </div>
    </div>
  );
}
