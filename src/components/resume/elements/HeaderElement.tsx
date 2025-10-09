import { HeaderData } from "@/types/resume";

interface HeaderElementProps {
  content: HeaderData;
  isPreview?: boolean;
}

export function HeaderElement({
  content,
  isPreview = false,
}: HeaderElementProps) {
  return (
    <div className="w-full h-full overflow-hidden">
      <div
        style={{
          fontSize: content.fontSize,
          fontWeight: content.fontWeight,
          color: content.color || "#1f2937",
          textAlign: content.textAlign || "left",
          lineHeight: 1.2,
        }}
      >
        <h1 className="mb-1">{content.name}</h1>
        <h2
          className="mb-1"
          style={{
            fontSize: content.fontSize * 0.7,
            fontWeight: "normal",
            color: content.color || "#6b7280",
          }}
        >
          {content.title}
        </h2>
        {content.subtitle && (
          <p
            style={{
              fontSize: content.fontSize * 0.5,
              color: content.color || "#9ca3af",
            }}
          >
            {content.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
