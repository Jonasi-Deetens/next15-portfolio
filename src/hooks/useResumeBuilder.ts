import { useState, useRef, useCallback, useEffect } from "react";
import { ResumeElement, ResumeElementType } from "@/types/resume";
import { getDefaultContent } from "@/constants/resume";
import { trpc } from "@/lib/trpc-client";

export function useResumeBuilder(resumeId?: string) {
  const [elements, setElements] = useState<ResumeElement[]>([]);
  const [editingElement, setEditingElement] = useState<ResumeElement | null>(
    null
  );
  const [isPreview, setIsPreview] = useState(false);
  const [draggedElement, setDraggedElement] = useState<ResumeElement | null>(
    null
  );
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const currentPositionRef = useRef<{ x: number; y: number } | null>(null);

  const [draggingFromSidebar, setDraggingFromSidebar] = useState<{
    elementType: string;
    startPosition: { x: number; y: number };
  } | null>(null);

  const [rotatingElement, setRotatingElement] = useState<string | null>(null);
  const [rotationStartPos, setRotationStartPos] = useState({ x: 0, y: 0 });
  const [rotationStartAngle, setRotationStartAngle] = useState(0);

  const createResumeMutation = trpc.resume.create.useMutation();
  const updateResumeMutation = trpc.resume.update.useMutation();
  const { data: myResumes, isLoading } = trpc.resume.getMyResumes.useQuery();

  // Fetch the specific resume if resumeId is provided
  const { data: currentResume, isLoading: isLoadingResume } =
    trpc.resume.getById.useQuery({ id: resumeId }, { enabled: !!resumeId });

  useEffect(() => {
    console.log("useResumeBuilder: currentResume changed", currentResume);
    if (currentResume?.elements) {
      try {
        const resumeElements = Array.isArray(currentResume.elements)
          ? currentResume.elements
          : [];
        console.log("useResumeBuilder: loading elements", resumeElements);
        setElements((prevElements) => {
          // Preserve selection state when updating elements
          const newElements = resumeElements as unknown as ResumeElement[];
          return newElements.map((newEl) => {
            const existingEl = prevElements.find((el) => el.id === newEl.id);
            return existingEl
              ? { ...newEl, isSelected: existingEl.isSelected }
              : newEl;
          });
        });
      } catch (error) {
        console.error("useResumeBuilder: error loading elements", error);
        setElements([]);
      }
    } else {
      console.log("useResumeBuilder: no elements found, clearing");
      setElements([]);
    }
  }, [currentResume]);

  const updateElement = (id: string, updates: Partial<ResumeElement>) => {
    setElements((prevElements) =>
      prevElements.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  // Handle rotation mouse tracking
  useEffect(() => {
    if (!rotatingElement) return;

    const handleMouseMove = (e: MouseEvent) => {
      const element = elements.find((el) => el.id === rotatingElement);
      if (!element) return;

      // Get canvas position to convert screen coordinates to canvas coordinates
      const canvas = canvasRef.current;
      if (!canvas) return;

      const canvasRect = canvas.getBoundingClientRect();
      const currentX = e.clientX - canvasRect.left;
      const currentY = e.clientY - canvasRect.top;

      const centerX = element.position.x + element.size.width / 2;
      const centerY = element.position.y + element.size.height / 2;

      const startAngle = Math.atan2(
        rotationStartPos.y - centerY,
        rotationStartPos.x - centerX
      );
      const currentAngle = Math.atan2(currentY - centerY, currentX - centerX);

      const rotationDelta = (currentAngle - startAngle) * (180 / Math.PI);
      const newRotation = (rotationStartAngle + rotationDelta) % 360;

      updateElement(rotatingElement, { rotation: newRotation });
    };

    const handleMouseUp = () => {
      setRotatingElement(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    rotatingElement,
    rotationStartPos,
    rotationStartAngle,
    elements,
    updateElement,
  ]);

  const handleSidebarMouseDown = (e: React.MouseEvent, elementType: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingFromSidebar({
      elementType,
      startPosition: { x: e.clientX, y: e.clientY },
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const selectElement = (element: ResumeElement) => {
    setElements((prevElements) => {
      const updated = prevElements.map((el) => ({
        ...el,
        isSelected: element.id ? el.id === element.id : false,
      }));
      return updated;
    });
  };

  const deleteElement = (id: string) => {
    setElements((prevElements) => prevElements.filter((el) => el.id !== id));
    setEditingElement(null);
  };

  const bringToFront = (id: string) => {
    setElements((prevElements) => {
      const element = prevElements.find((el) => el.id === id);
      if (!element) return prevElements;

      const otherElements = prevElements.filter((el) => el.id !== id);
      return [...otherElements, element];
    });
  };

  const sendToBack = (id: string) => {
    setElements((prevElements) => {
      const element = prevElements.find((el) => el.id === id);
      if (!element) return prevElements;

      const otherElements = prevElements.filter((el) => el.id !== id);
      return [element, ...otherElements];
    });
  };

  const rotateElement = (id: string, e: React.MouseEvent) => {
    const element = elements.find((el) => el.id === id);
    if (!element) return;

    // Get canvas position to convert screen coordinates to canvas coordinates
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasRect = canvas.getBoundingClientRect();
    const startX = e.clientX - canvasRect.left;
    const startY = e.clientY - canvasRect.top;

    setRotatingElement(id);
    setRotationStartPos({ x: startX, y: startY });
    setRotationStartAngle(element.rotation || 0);
  };

  const editElement = (element: ResumeElement) => {
    setEditingElement(element);
  };

  const closeEditor = () => {
    setEditingElement(null);
  };

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  const saveResume = useCallback(async () => {
    try {
      if (currentResume?.id) {
        await updateResumeMutation.mutateAsync({
          id: currentResume.id,
          elements: elements,
        });
      } else {
        const newResume = await createResumeMutation.mutateAsync({
          title: "My Resume",
          elements: elements,
        });
        return newResume.id;
      }
    } catch (error) {
      throw error;
    }
  }, [currentResume?.id, elements, updateResumeMutation, createResumeMutation]);

  const handleElementMouseDown = (
    e: React.MouseEvent,
    element: ResumeElement
  ) => {
    if (isPreview) return;

    e.preventDefault();
    e.stopPropagation();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;

    setDragOffset({
      x: startX - element.position.x,
      y: startY - element.position.y,
    });

    setDraggedElement(element);
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === element.id ? { ...el, isDragging: true } : el
      )
    );
  };

  const handleElementMouseMove = useCallback(
    (e: MouseEvent) => {
      if (draggedElement || draggingFromSidebar) {
        e.preventDefault();
      }
      if (draggedElement && !isPreview) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const newX = e.clientX - rect.left - dragOffset.x;
        const newY = e.clientY - rect.top - dragOffset.y;

        // Allow free movement - no boundary constraints
        currentPositionRef.current = { x: newX, y: newY };
        setElements((prevElements) =>
          prevElements.map((el) =>
            el.id === draggedElement.id
              ? { ...el, position: { x: newX, y: newY } }
              : el
          )
        );
      }

      if (draggingFromSidebar) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setElements((prevElements) => {
          const hasPreview = prevElements.some((el) => el.isPreview);

          if (hasPreview) {
            return prevElements.map((el) =>
              el.isPreview ? { ...el, position: { x, y } } : el
            );
          } else {
            const previewElement: ResumeElement = {
              id: `preview-${Date.now()}`,
              type: draggingFromSidebar.elementType as ResumeElementType,
              content: getDefaultContent(
                draggingFromSidebar.elementType as ResumeElementType
              ),
              position: { x, y },
              size: { width: 200, height: 100 },
              isPreview: true,
            };
            return [...prevElements, previewElement];
          }
        });
      }
    },
    [draggedElement, dragOffset, isPreview, draggingFromSidebar]
  );

  const handleElementMouseUp = (e?: MouseEvent) => {
    if (draggedElement) {
      setElements((prevElements) =>
        prevElements.map((el) =>
          el.id === draggedElement.id ? { ...el, isDragging: false } : el
        )
      );
      setDraggedElement(null);
    }

    if (draggingFromSidebar) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect && e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const canvasLeft = rect.left;
        const canvasRight = rect.right;
        const canvasTop = rect.top;
        const canvasBottom = rect.bottom;

        const isOverCanvas =
          mouseX >= canvasLeft &&
          mouseX <= canvasRight &&
          mouseY >= canvasTop &&
          mouseY <= canvasBottom;

        const startX = draggingFromSidebar.startPosition.x;
        const startY = draggingFromSidebar.startPosition.y;
        const dragDistance = Math.sqrt(
          Math.pow(mouseX - startX, 2) + Math.pow(mouseY - startY, 2)
        );
        const minDragDistance = 10;

        if (isOverCanvas && dragDistance >= minDragDistance) {
          const x = mouseX - canvasLeft;
          const y = mouseY - canvasTop;

          const newElement: ResumeElement = {
            id: Date.now().toString(),
            type: draggingFromSidebar.elementType as ResumeElementType,
            content: getDefaultContent(
              draggingFromSidebar.elementType as ResumeElementType
            ),
            position: { x, y },
            size: { width: 200, height: 100 },
          };

          setElements((prevElements) => {
            const elementsWithoutPreview = prevElements.filter(
              (el) => !el.isPreview
            );
            return [...elementsWithoutPreview, newElement];
          });
        }
      }

      setDraggingFromSidebar(null);
    }
  };

  const handleSidebarDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const elementType = e.dataTransfer.getData("elementType");

    if (elementType) {
      setElements((prevElements) => {
        const elementsWithoutPreview = prevElements.filter(
          (el) => !el.isPreview
        );

        const previewElement: ResumeElement = {
          id: `preview-${Date.now()}`,
          type: elementType as ResumeElementType,
          content: getDefaultContent(elementType as ResumeElementType),
          position: { x, y },
          size: { width: 200, height: 100 },
          isPreview: true,
        };

        return [...elementsWithoutPreview, previewElement];
      });
    }
  }, []);

  const handleSidebarDragLeave = useCallback(() => {
    setElements((prevElements) => prevElements.filter((el) => !el.isPreview));
  }, []);

  return {
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
    myResumes,
    isLoading: isLoading || isLoadingResume,
    selectElement,
  };
}
