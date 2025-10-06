import React, { useState, useCallback } from "react";
import { ResumeElement } from "@/types/resume";

interface TransformControlsProps {
  element: ResumeElement;
  onUpdate: (updates: Partial<ResumeElement>) => void;
  onSelect: () => void;
  onElementMouseDown: (e: React.MouseEvent, element: ResumeElement) => void;
}

export function TransformControls({
  element,
  onUpdate,
  onSelect,
  onElementMouseDown,
}: TransformControlsProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [startMousePos, setStartMousePos] = useState({ x: 0, y: 0 });
  const [startElementData, setStartElementData] = useState({
    position: { x: 0, y: 0 },
    size: { width: 0, height: 0 },
    rotation: 0,
  });

  // Detect what type of interaction based on mouse position
  const getInteractionType = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    const threshold = 6; // 6px threshold for corners and edges

    // Check if we're in corner areas (with 5px offset)
    const isInCorner =
      (x < threshold && y < threshold) || // top-left
      (x > width - threshold && y < threshold) || // top-right
      (x < threshold && y > height - threshold) || // bottom-left
      (x > width - threshold && y > height - threshold); // bottom-right

    // Check if we're on edges
    const isOnEdge =
      x < threshold || // left edge
      x > width - threshold || // right edge
      y < threshold || // top edge
      y > height - threshold; // bottom edge

    if (isInCorner) {
      // Determine which corner
      if (x < threshold && y < threshold)
        return { type: "corner", handle: "nw" };
      if (x > width - threshold && y < threshold)
        return { type: "corner", handle: "ne" };
      if (x < threshold && y > height - threshold)
        return { type: "corner", handle: "sw" };
      if (x > width - threshold && y > height - threshold)
        return { type: "corner", handle: "se" };
    }

    if (isOnEdge) {
      // Determine which edge
      if (x < threshold) return { type: "edge", handle: "w" };
      if (x > width - threshold) return { type: "edge", handle: "e" };
      if (y < threshold) return { type: "edge", handle: "n" };
      if (y > height - threshold) return { type: "edge", handle: "s" };
    }

    return { type: "move", handle: null };
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const interaction = getInteractionType(e);

      if (interaction.type === "corner") {
        const shouldRotate = e.altKey || e.metaKey; // Alt/Cmd for rotation

        if (shouldRotate) {
          setIsRotating(true);
        } else {
          setResizeHandle(interaction.handle);
          setIsResizing(true);
        }
      } else if (interaction.type === "edge") {
        setResizeHandle(interaction.handle);
        setIsResizing(true);
      } else if (interaction.type === "move") {
        // Handle dragging - call the parent's drag handler
        onElementMouseDown(e, element);
        return; // Let the parent handle the dragging
      }

      setStartMousePos({ x: e.clientX, y: e.clientY });
      setStartElementData({
        position: { ...element.position },
        size: { ...element.size },
        rotation: element.rotation || 0,
      });
    },
    [element, getInteractionType, onElementMouseDown]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isResizing && resizeHandle) {
        const deltaX = e.clientX - startMousePos.x;
        const deltaY = e.clientY - startMousePos.y;

        let newSize = { ...startElementData.size };
        let newPosition = { ...startElementData.position };

        // Check if this is a corner or edge resize
        const isCorner = ["nw", "ne", "sw", "se"].includes(resizeHandle);
        const isEdge = ["n", "s", "e", "w"].includes(resizeHandle);

        if (isCorner) {
          // For corners, use simple delta calculations but maintain aspect ratio
          let scaleX = 1;
          let scaleY = 1;

          switch (resizeHandle) {
            case "se": // Southeast - resize from northwest corner
              scaleX =
                (startElementData.size.width + deltaX) /
                startElementData.size.width;
              scaleY =
                (startElementData.size.height + deltaY) /
                startElementData.size.height;
              break;
            case "sw": // Southwest - resize from northeast corner
              scaleX =
                (startElementData.size.width - deltaX) /
                startElementData.size.width;
              scaleY =
                (startElementData.size.height + deltaY) /
                startElementData.size.height;
              break;
            case "ne": // Northeast - resize from southwest corner
              scaleX =
                (startElementData.size.width + deltaX) /
                startElementData.size.width;
              scaleY =
                (startElementData.size.height - deltaY) /
                startElementData.size.height;
              break;
            case "nw": // Northwest - resize from southeast corner
              scaleX =
                (startElementData.size.width - deltaX) /
                startElementData.size.width;
              scaleY =
                (startElementData.size.height - deltaY) /
                startElementData.size.height;
              break;
          }

          // Use the average scale to maintain aspect ratio
          const scale = (scaleX + scaleY) / 2;

          newSize = {
            width: Math.max(20, startElementData.size.width * scale),
            height: Math.max(20, startElementData.size.height * scale),
          };

          // Calculate new position to keep the opposite corner fixed
          switch (resizeHandle) {
            case "se": // Southeast - keep northwest corner fixed
              newPosition.x = startElementData.position.x;
              newPosition.y = startElementData.position.y;
              break;
            case "sw": // Southwest - keep northeast corner fixed
              newPosition.x =
                startElementData.position.x +
                (startElementData.size.width - newSize.width);
              newPosition.y = startElementData.position.y;
              break;
            case "ne": // Northeast - keep southwest corner fixed
              newPosition.x = startElementData.position.x;
              newPosition.y =
                startElementData.position.y +
                (startElementData.size.height - newSize.height);
              break;
            case "nw": // Northwest - keep southeast corner fixed
              newPosition.x =
                startElementData.position.x +
                (startElementData.size.width - newSize.width);
              newPosition.y =
                startElementData.position.y +
                (startElementData.size.height - newSize.height);
              break;
          }
        } else if (isEdge) {
          // For edges, use simple delta calculations
          switch (resizeHandle) {
            case "n": // North - only resize height, keep south edge fixed
              newSize.height = Math.max(
                20,
                startElementData.size.height - deltaY
              );
              newPosition.y =
                startElementData.position.y +
                (startElementData.size.height - newSize.height);
              break;
            case "s": // South - only resize height, keep north edge fixed
              newSize.height = Math.max(
                20,
                startElementData.size.height + deltaY
              );
              newPosition.y = startElementData.position.y;
              break;
            case "e": // East - only resize width, keep west edge fixed
              newSize.width = Math.max(
                20,
                startElementData.size.width + deltaX
              );
              newPosition.x = startElementData.position.x;
              break;
            case "w": // West - only resize width, keep east edge fixed
              newSize.width = Math.max(
                20,
                startElementData.size.width - deltaX
              );
              newPosition.x =
                startElementData.position.x +
                (startElementData.size.width - newSize.width);
              break;
          }
        }

        onUpdate({
          size: newSize,
          position: newPosition,
        });
      }

      if (isRotating) {
        // Use center of element as rotation origin
        const centerX = element.position.x + element.size.width / 2;
        const centerY = element.position.y + element.size.height / 2;

        const startAngle = Math.atan2(
          startMousePos.y - centerY,
          startMousePos.x - centerX
        );
        const currentAngle = Math.atan2(
          e.clientY - centerY,
          e.clientX - centerX
        );

        const rotationDelta = (currentAngle - startAngle) * (180 / Math.PI);
        const newRotation = (startElementData.rotation + rotationDelta) % 360;

        onUpdate({
          rotation: newRotation,
        });
      }
    },
    [
      isResizing,
      isRotating,
      resizeHandle,
      startMousePos,
      startElementData,
      element,
      onUpdate,
    ]
  );

  // Handle cursor changes based on mouse position
  const handleMouseMoveOver = useCallback(
    (e: React.MouseEvent) => {
      const interaction = getInteractionType(e);

      let cursor = "default";

      if (interaction.type === "corner") {
        cursor =
          e.altKey || e.metaKey ? "grab" : getCornerCursor(interaction.handle);
      } else if (interaction.type === "edge") {
        cursor = getEdgeCursor(interaction.handle);
      } else if (interaction.type === "move") {
        cursor = "move";
      }

      (e.currentTarget as HTMLElement).style.cursor = cursor;
    },
    [getInteractionType]
  );

  const getCornerCursor = (handle: string) => {
    switch (handle) {
      case "nw":
        return "nw-resize";
      case "ne":
        return "ne-resize";
      case "sw":
        return "sw-resize";
      case "se":
        return "se-resize";
      default:
        return "default";
    }
  };

  const getEdgeCursor = (handle: string) => {
    switch (handle) {
      case "n":
        return "n-resize";
      case "s":
        return "s-resize";
      case "e":
        return "e-resize";
      case "w":
        return "w-resize";
      default:
        return "default";
    }
  };

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    setIsRotating(false);
    setResizeHandle(null);
  }, []);

  React.useEffect(() => {
    if (isResizing || isRotating) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, isRotating, handleMouseMove, handleMouseUp]);

  return (
    <div
      className="absolute inset-0 pointer-events-auto border border-dashed border-emerald-400"
      style={{
        left: 0,
        top: 0,
        width: element.size.width,
        height: element.size.height,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMoveOver}
    />
  );
}
