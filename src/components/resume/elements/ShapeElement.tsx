import { ShapeData } from "@/types/resume";

interface ShapeElementProps {
  content: ShapeData;
  isPreview?: boolean;
}

export function ShapeElement({
  content,
  isPreview = false,
}: ShapeElementProps) {
  const renderShape = () => {
    const { type, color, rotation, opacity, borderColor, borderWidth } =
      content;
    const style = {
      width: "100%",
      height: "100%",
      backgroundColor: color,
      transform: `rotate(${rotation}deg)`,
      opacity: opacity || 1,
      borderColor: borderColor,
      borderWidth: borderWidth ? `${borderWidth}px` : undefined,
      borderStyle: borderWidth ? "solid" : undefined,
    };

    switch (type) {
      case "triangle":
        return (
          <div
            className="w-full h-full"
            style={{
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              backgroundColor: color,
              opacity: opacity || 1,
              borderColor: borderColor,
              borderWidth: borderWidth ? `${borderWidth}px` : undefined,
              borderStyle: borderWidth ? "solid" : undefined,
            }}
          />
        );
      case "circle":
        return <div style={style} className="rounded-full" />;
      case "square":
        return <div style={style} />;
      case "diamond":
        return <div style={style} className="transform rotate-45" />;
      case "star":
        return (
          <div
            className="w-full h-full"
            style={{
              clipPath:
                "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
              backgroundColor: color,
              opacity: opacity || 1,
              borderColor: borderColor,
              borderWidth: borderWidth ? `${borderWidth}px` : undefined,
              borderStyle: borderWidth ? "solid" : undefined,
            }}
          />
        );
      default:
        return <div style={style} />;
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      {renderShape()}
    </div>
  );
}
