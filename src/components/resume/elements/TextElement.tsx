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
      }}
      className={`p-2 ${
        isPreview ? "" : "border border-dashed border-gray-300 rounded"
      }`}
    >
      {content.text}
    </div>
  );
}
