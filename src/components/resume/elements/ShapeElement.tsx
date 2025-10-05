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
    const { type, color, size, rotation } = content;
    const style = {
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      transform: `rotate(${rotation}deg)`,
    };

    switch (type) {
      case "triangle":
        return (
          <div
            style={style}
            className="w-0 h-0 border-l-transparent border-r-transparent border-b-transparent"
            css={{
              borderLeft: `${size / 2}px solid transparent`,
              borderRight: `${size / 2}px solid transparent`,
              borderBottom: `${size}px solid ${color}`,
              width: 0,
              height: 0,
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
          <div style={style} className="relative">
            <div
              className="absolute inset-0"
              style={{
                clipPath:
                  "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                backgroundColor: color,
              }}
            />
          </div>
        );
      default:
        return <div style={style} />;
    }
  };

  return (
    <div
      className={`${
        isPreview
          ? "w-full flex justify-center items-center"
          : "border border-dashed border-gray-300 rounded p-2 flex justify-center items-center"
      }`}
    >
      {renderShape()}
    </div>
  );
}
