import { LineData } from "@/types/resume";

interface LineElementProps {
  content: LineData;
  isPreview?: boolean;
}

export function LineElement({ content, isPreview = false }: LineElementProps) {
  const { style, color, thickness, length, angle } = content;

  const getLineStyle = () => {
    switch (style) {
      case "dashed":
        return "dashed";
      case "dotted":
        return "dotted";
      default:
        return "solid";
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
      <div
        style={{
          width: `${length}px`,
          height: `${thickness}px`,
          backgroundColor: color,
          borderStyle: getLineStyle(),
          borderWidth: style === "solid" ? 0 : thickness,
          borderColor: color,
          transform: `rotate(${angle}deg)`,
        }}
        className="border-0"
      />
    </div>
  );
}
