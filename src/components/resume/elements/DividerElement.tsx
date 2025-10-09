import { DividerData } from "@/types/resume";

interface DividerElementProps {
  content: DividerData;
  isPreview?: boolean;
}

export function DividerElement({
  content,
  isPreview = false,
}: DividerElementProps) {
  const getDividerStyle = () => {
    const baseStyle = {
      width: "100%",
      height: `${content.thickness}px`,
      backgroundColor: content.color,
      opacity: content.opacity || 1,
    };

    switch (content.style) {
      case "line":
        return { ...baseStyle };
      case "dots":
        return {
          ...baseStyle,
          backgroundImage: `radial-gradient(circle, ${content.color} 1px, transparent 1px)`,
          backgroundSize: "8px 8px",
          backgroundColor: "transparent",
        };
      case "dashes":
        return {
          ...baseStyle,
          backgroundImage: `repeating-linear-gradient(90deg, ${content.color}, ${content.color} 10px, transparent 10px, transparent 20px)`,
          backgroundColor: "transparent",
        };
      case "thick":
        return {
          ...baseStyle,
          height: `${content.thickness * 2}px`,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div style={getDividerStyle()} />
    </div>
  );
}
