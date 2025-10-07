import React, { useState, useCallback } from "react";
import { ResumeElement } from "@/types/resume";

interface TransformControlsProps {
  element: ResumeElement;
  onUpdate: (updates: Partial<ResumeElement>) => void;
  onSelect: () => void;
  onElementMouseDown: (e: React.MouseEvent, element: ResumeElement) => void;
  style?: React.CSSProperties;
  snapToGrid?: boolean;
}

export function TransformControls({
  element,
  onUpdate,
  onSelect,
  onElementMouseDown,
  style,
  snapToGrid = false,
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

  const GRID_SIZE = 10;

  const snapToGridValue = (value: number) => {
    if (!snapToGrid) return value;
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

  const getInteractionType = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    const threshold = 6;

    const isInCorner =
      (x < threshold && y < threshold) ||
      (x > width - threshold && y < threshold) ||
      (x < threshold && y > height - threshold) ||
      (x > width - threshold && y > height - threshold);

    const isOnEdge =
      x < threshold ||
      x > width - threshold ||
      y < threshold ||
      y > height - threshold;

    if (isInCorner) {
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
        const shouldRotate = e.altKey || e.metaKey;

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
        onElementMouseDown(e, element);
        return;
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

        const isCorner = ["nw", "ne", "sw", "se"].includes(resizeHandle);
        const isEdge = ["n", "s", "e", "w"].includes(resizeHandle);

        if (isCorner) {
          let scaleX = 1;
          let scaleY = 1;

          switch (resizeHandle) {
            case "se":
              scaleX =
                (startElementData.size.width + deltaX) /
                startElementData.size.width;
              scaleY =
                (startElementData.size.height + deltaY) /
                startElementData.size.height;
              break;
            case "sw":
              scaleX =
                (startElementData.size.width - deltaX) /
                startElementData.size.width;
              scaleY =
                (startElementData.size.height + deltaY) /
                startElementData.size.height;
              break;
            case "ne":
              scaleX =
                (startElementData.size.width + deltaX) /
                startElementData.size.width;
              scaleY =
                (startElementData.size.height - deltaY) /
                startElementData.size.height;
              break;
            case "nw":
              scaleX =
                (startElementData.size.width - deltaX) /
                startElementData.size.width;
              scaleY =
                (startElementData.size.height - deltaY) /
                startElementData.size.height;
              break;
          }

          newSize = {
            width: snapToGridValue(
              Math.max(20, startElementData.size.width * scaleX)
            ),
            height: snapToGridValue(
              Math.max(20, startElementData.size.height * scaleY)
            ),
          };

          switch (resizeHandle) {
            case "se":
              newPosition.x = startElementData.position.x;
              newPosition.y = startElementData.position.y;
              break;
            case "sw":
              newPosition.x =
                startElementData.position.x +
                (startElementData.size.width - newSize.width);
              newPosition.y = startElementData.position.y;
              break;
            case "ne":
              newPosition.x = startElementData.position.x;
              newPosition.y =
                startElementData.position.y +
                (startElementData.size.height - newSize.height);
              break;
            case "nw":
              newPosition.x =
                startElementData.position.x +
                (startElementData.size.width - newSize.width);
              newPosition.y =
                startElementData.position.y +
                (startElementData.size.height - newSize.height);
              break;
          }
        } else if (isEdge) {
          switch (resizeHandle) {
            case "n":
              newSize.height = snapToGridValue(
                Math.max(20, startElementData.size.height - deltaY)
              );
              newPosition.y = snapToGridValue(
                startElementData.position.y +
                  (startElementData.size.height - newSize.height)
              );
              break;
            case "s":
              newSize.height = snapToGridValue(
                Math.max(20, startElementData.size.height + deltaY)
              );
              newPosition.y = snapToGridValue(startElementData.position.y);
              break;
            case "e":
              newSize.width = snapToGridValue(
                Math.max(20, startElementData.size.width + deltaX)
              );
              newPosition.x = snapToGridValue(startElementData.position.x);
              break;
            case "w":
              newSize.width = snapToGridValue(
                Math.max(20, startElementData.size.width - deltaX)
              );
              newPosition.x = snapToGridValue(
                startElementData.position.x +
                  (startElementData.size.width - newSize.width)
              );
              break;
          }
        }

        onUpdate({
          size: newSize,
          position: newPosition,
        });
      }

      if (isRotating) {
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
      className="absolute pointer-events-auto border border-dashed border-emerald-400"
      style={{
        left: 0,
        top: 0,
        width: element.size.width + 2,
        height: element.size.height + 2,
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
        ...style,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMoveOver}
    />
  );
}
