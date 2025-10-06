import { Badge } from "@/components/ui/Badge";
import { SkillData } from "@/types/resume";

interface SkillElementProps {
  content: SkillData;
  isPreview?: boolean;
}

export function SkillElement({
  content,
  isPreview = false,
}: SkillElementProps) {
  return (
    <div
      className="p-3"
    >
      <h4 className="font-semibold mb-2">Skills</h4>
      <div className="flex flex-wrap gap-1">
        {content.skills.map((skill: string, index: number) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
}
