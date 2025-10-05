import { EducationData } from "@/types/resume";

interface EducationElementProps {
  content: EducationData;
  isPreview?: boolean;
}

export function EducationElement({
  content,
  isPreview = false,
}: EducationElementProps) {
  return (
    <div
      className={`p-3 ${
        isPreview ? "" : "border border-dashed border-gray-300 rounded"
      }`}
    >
      <h4 className="font-semibold">{content.degree}</h4>
      <p className="text-sm text-gray-600">
        {content.school} • {content.location}
      </p>
      <p className="text-xs text-gray-500">
        {content.startDate} - {content.endDate}
      </p>
      <p className="text-sm mt-2">{content.description}</p>
    </div>
  );
}
