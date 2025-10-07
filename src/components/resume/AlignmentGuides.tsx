import React from "react";
import { ResumeElement } from "@/types/resume";

interface AlignmentGuidesProps {
  elements: ResumeElement[];
  currentElement: ResumeElement | null;
  snapToElements: boolean;
}

export function AlignmentGuides({
  elements,
  currentElement,
  snapToElements,
}: AlignmentGuidesProps) {
  if (!snapToElements || !currentElement) return null;

  const guides: Array<{
    type: "vertical" | "horizontal";
    position: number;
    start: number;
    end: number;
  }> = [];

  const otherElements = elements.filter((el) => el.id !== currentElement.id);
  if (otherElements.length === 0) return null;

  const SNAP_THRESHOLD = 8;

  // Check for vertical alignment guides
  for (const element of otherElements) {
    const currentLeft = currentElement.position.x;
    const currentRight = currentElement.position.x + currentElement.size.width;
    const currentCenter =
      currentElement.position.x + currentElement.size.width / 2;

    const elementLeft = element.position.x;
    const elementRight = element.position.x + element.size.width;
    const elementCenter = element.position.x + element.size.width / 2;

    // Left edge alignment
    if (Math.abs(currentLeft - elementLeft) < SNAP_THRESHOLD) {
      guides.push({
        type: "vertical",
        position: elementLeft,
        start: Math.min(currentElement.position.y, element.position.y),
        end: Math.max(
          currentElement.position.y + currentElement.size.height,
          element.position.y + element.size.height
        ),
      });
    }

    // Right edge alignment
    if (Math.abs(currentRight - elementRight) < SNAP_THRESHOLD) {
      guides.push({
        type: "vertical",
        position: elementRight,
        start: Math.min(currentElement.position.y, element.position.y),
        end: Math.max(
          currentElement.position.y + currentElement.size.height,
          element.position.y + element.size.height
        ),
      });
    }

    // Center alignment
    if (Math.abs(currentCenter - elementCenter) < SNAP_THRESHOLD) {
      guides.push({
        type: "vertical",
        position: elementCenter,
        start: Math.min(currentElement.position.y, element.position.y),
        end: Math.max(
          currentElement.position.y + currentElement.size.height,
          element.position.y + element.size.height
        ),
      });
    }
  }

  // Check for horizontal alignment guides
  for (const element of otherElements) {
    const currentTop = currentElement.position.y;
    const currentBottom =
      currentElement.position.y + currentElement.size.height;
    const currentCenter =
      currentElement.position.y + currentElement.size.height / 2;

    const elementTop = element.position.y;
    const elementBottom = element.position.y + element.size.height;
    const elementCenter = element.position.y + element.size.height / 2;

    // Top edge alignment
    if (Math.abs(currentTop - elementTop) < SNAP_THRESHOLD) {
      guides.push({
        type: "horizontal",
        position: elementTop,
        start: Math.min(currentElement.position.x, element.position.x),
        end: Math.max(
          currentElement.position.x + currentElement.size.width,
          element.position.x + element.size.width
        ),
      });
    }

    // Bottom edge alignment
    if (Math.abs(currentBottom - elementBottom) < SNAP_THRESHOLD) {
      guides.push({
        type: "horizontal",
        position: elementBottom,
        start: Math.min(currentElement.position.x, element.position.x),
        end: Math.max(
          currentElement.position.x + currentElement.size.width,
          element.position.x + element.size.width
        ),
      });
    }

    // Center alignment
    if (Math.abs(currentCenter - elementCenter) < SNAP_THRESHOLD) {
      guides.push({
        type: "horizontal",
        position: elementCenter,
        start: Math.min(currentElement.position.x, element.position.x),
        end: Math.max(
          currentElement.position.x + currentElement.size.width,
          element.position.x + element.size.width
        ),
      });
    }
  }

  return (
    <>
      {guides.map((guide, index) => (
        <div
          key={index}
          className="absolute pointer-events-none z-50"
          style={{
            left:
              guide.type === "vertical"
                ? `calc(50% - 105mm + ${guide.position}px)`
                : `calc(50% - 105mm + ${guide.start}px)`,
            top:
              guide.type === "horizontal"
                ? `${guide.position}px`
                : `${guide.start}px`,
            width: guide.type === "vertical" ? "1px" : guide.end - guide.start,
            height:
              guide.type === "horizontal" ? "1px" : guide.end - guide.start,
            borderStyle: "dashed",
            borderWidth: "1px",
            borderColor: "#10b981",
            backgroundColor: "transparent",
          }}
        />
      ))}
    </>
  );
}
