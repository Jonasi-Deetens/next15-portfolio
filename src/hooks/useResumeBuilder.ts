import { useState, useRef, useCallback, useMemo } from "react";
import { ResumeElement } from "@/types/resume";
import { getDefaultContent } from "@/constants/resume";
import { trpc } from "@/lib/trpc-client";

export function useResumeBuilder(currentResume?: any) {
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

  const createResumeMutation = trpc.resume.create.useMutation();
  const updateResumeMutation = trpc.resume.update.useMutation();

  useMemo(() => {
    if (currentResume?.elements) {
      try {
        const resumeElements = Array.isArray(currentResume.elements)
          ? currentResume.elements
          : [];
        setElements(resumeElements as unknown as ResumeElement[]);
      } catch (error) {
        setElements([]);
      }
    } else {
      setElements([]);
    }
  }, [currentResume]);

  const handleSidebarMouseDown = (e: React.MouseEvent, elementType: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingFromSidebar({
      elementType,
      startPosition: { x: e.clientX, y: e.clientY },
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const updateElement = (id: string, updates: Partial<ResumeElement>) => {
    setElements(
      elements.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id));
    setEditingElement(null);
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
    setElements(
      elements.map((el) =>
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

        const constrainedX = Math.max(
          0,
          Math.min(newX, rect.width - draggedElement.size.width)
        );
        const constrainedY = Math.max(
          0,
          Math.min(newY, rect.height - draggedElement.size.height)
        );

        currentPositionRef.current = { x: constrainedX, y: constrainedY };
        setElements((prevElements) =>
          prevElements.map((el) =>
            el.id === draggedElement.id
              ? { ...el, position: { x: constrainedX, y: constrainedY } }
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
              type: draggingFromSidebar.elementType as any,
              content: getDefaultContent(draggingFromSidebar.elementType),
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
      setElements(
        elements.map((el) =>
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
            type: draggingFromSidebar.elementType as any,
            content: getDefaultContent(draggingFromSidebar.elementType),
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
          type: elementType as any,
          content: getDefaultContent(elementType),
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
  };
}
