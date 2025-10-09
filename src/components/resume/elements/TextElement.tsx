import { TextData } from "@/types/resume";

interface TextElementProps {
  content: TextData;
  isPreview?: boolean;
}

export function TextElement({ content, isPreview = false }: TextElementProps) {
  return (
    <div
      style={{
        fontSize: content.fontSize,
        fontWeight: content.fontWeight,
        color: content.color || "#374151",
        textAlign: content.textAlign || "left",
        fontFamily: content.fontFamily,
        lineHeight: content.lineHeight || 1.5,
      }}
      className="w-full h-full overflow-hidden"
    >
      <div
        className="w-full h-full overflow-hidden"
        style={{
          wordWrap: "break-word",
          overflowWrap: "break-word",
          whiteSpace: "normal",
        }}
      >
        {content.text}
      </div>
    </div>
  );
}
