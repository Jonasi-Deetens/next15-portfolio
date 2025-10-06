import { ExperienceData } from "@/types/resume";

interface ExperienceElementProps {
  content: ExperienceData;
  isPreview?: boolean;
}

export function ExperienceElement({
  content,
  isPreview = false,
}: ExperienceElementProps) {
  return (
    <div
      className="p-3"
    >
      <h4 className="font-semibold">{content.title}</h4>
      <p className="text-sm text-gray-600">
        {content.company} • {content.location}
      </p>
      <p className="text-xs text-gray-500">
        {content.startDate} - {content.current ? "Present" : content.endDate}
      </p>
      <p className="text-sm mt-2">{content.description}</p>
    </div>
  );
}
