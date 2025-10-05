import { ResumeElement } from "@/types/resume";
import { TextElement } from "./elements/TextElement";
import { ImageElement } from "./elements/ImageElement";
import { ExperienceElement } from "./elements/ExperienceElement";
import { EducationElement } from "./elements/EducationElement";
import { SkillElement } from "./elements/SkillElement";
import { ContactElement } from "./elements/ContactElement";

interface ResumeElementRendererProps {
  element: ResumeElement;
  isPreview?: boolean;
}

export function ResumeElementRenderer({
  element,
  isPreview = false,
}: ResumeElementRendererProps) {
  const { type, content } = element;

  switch (type) {
    case "text":
      return <TextElement content={content} isPreview={isPreview} />;
    case "image":
      return <ImageElement content={content} isPreview={isPreview} />;
    case "experience":
      return <ExperienceElement content={content} isPreview={isPreview} />;
    case "education":
      return <EducationElement content={content} isPreview={isPreview} />;
    case "skill":
      return <SkillElement content={content} isPreview={isPreview} />;
    case "contact":
      return <ContactElement content={content} isPreview={isPreview} />;
    default:
      return <div>Unknown element</div>;
  }
}
