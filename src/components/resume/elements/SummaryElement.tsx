import { SummaryData } from "@/types/resume";

interface SummaryElementProps {
  content: SummaryData;
  isPreview?: boolean;
}

export function SummaryElement({
  content,
  isPreview = false,
}: SummaryElementProps) {
  return (
    <div className="w-full h-full overflow-hidden">
      <p
        style={{
          fontSize: content.fontSize,
          fontWeight: content.fontWeight,
          color: content.color || "#374151",
          textAlign: content.textAlign || "left",
          lineHeight: content.lineHeight || 1.5,
          margin: 0,
        }}
      >
        {content.text}
      </p>
    </div>
  );
}
