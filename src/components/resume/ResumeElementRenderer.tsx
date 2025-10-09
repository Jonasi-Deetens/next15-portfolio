import { ResumeElement } from "@/types/resume";
import { TextElement } from "./elements/TextElement";
import { ImageElement } from "./elements/ImageElement";
import { ExperienceElement } from "./elements/ExperienceElement";
import { EducationElement } from "./elements/EducationElement";
import { SkillElement } from "./elements/SkillElement";
import { ContactElement } from "./elements/ContactElement";
import { ShapeElement } from "./elements/ShapeElement";
import { LineElement } from "./elements/LineElement";
import { HeaderElement } from "./elements/HeaderElement";
import { SummaryElement } from "./elements/SummaryElement";
import { ProjectsElement } from "./elements/ProjectsElement";
import { CertificationsElement } from "./elements/CertificationsElement";
import { LanguagesElement } from "./elements/LanguagesElement";
import { ReferencesElement } from "./elements/ReferencesElement";
import { DividerElement } from "./elements/DividerElement";

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
      return <TextElement content={content as any} isPreview={isPreview} />;
    case "image":
      return <ImageElement content={content as any} isPreview={isPreview} />;
    case "experience":
      return (
        <ExperienceElement content={content as any} isPreview={isPreview} />
      );
    case "education":
      return (
        <EducationElement content={content as any} isPreview={isPreview} />
      );
    case "skill":
      return <SkillElement content={content as any} isPreview={isPreview} />;
    case "contact":
      return <ContactElement content={content as any} isPreview={isPreview} />;
    case "shape":
      return <ShapeElement content={content as any} isPreview={isPreview} />;
    case "line":
      return <LineElement content={content as any} isPreview={isPreview} />;
    case "header":
      return <HeaderElement content={content as any} isPreview={isPreview} />;
    case "summary":
      return <SummaryElement content={content as any} isPreview={isPreview} />;
    case "projects":
      return <ProjectsElement content={content as any} isPreview={isPreview} />;
    case "certifications":
      return (
        <CertificationsElement content={content as any} isPreview={isPreview} />
      );
    case "languages":
      return (
        <LanguagesElement content={content as any} isPreview={isPreview} />
      );
    case "references":
      return (
        <ReferencesElement content={content as any} isPreview={isPreview} />
      );
    case "divider":
      return <DividerElement content={content as any} isPreview={isPreview} />;
    default:
      return <div>Unknown element</div>;
  }
}
