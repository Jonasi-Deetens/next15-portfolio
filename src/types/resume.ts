export interface ResumeElement {
  id: string;
  type: ResumeElementType;
  content: ResumeElementContent;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation?: number;
  isDragging?: boolean;
  isPreview?: boolean;
  isSelected?: boolean;
}

export type ResumeElementType =
  | "text"
  | "image"
  | "experience"
  | "education"
  | "skill"
  | "contact"
  | "shape"
  | "line"
  | "header"
  | "summary"
  | "projects"
  | "certifications"
  | "languages"
  | "references"
  | "divider";

export type ResumeElementContent =
  | TextData
  | ImageData
  | ExperienceData
  | EducationData
  | SkillData
  | ContactData
  | ShapeData
  | LineData
  | HeaderData
  | SummaryData
  | ProjectsData
  | CertificationsData
  | LanguagesData
  | ReferencesData
  | DividerData;

export interface ExperienceData {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

export interface EducationData {
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ContactData {
  phone: string;
  email: string;
  location: string;
  website: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface TextData {
  text: string;
  fontSize: number;
  fontWeight: string;
  color?: string;
  textAlign?: "left" | "center" | "right";
  fontFamily?: string;
  lineHeight?: number;
}

export interface ImageData {
  src: string;
  alt: string;
  width: number;
  height: number;
  rounded: boolean;
  opacity?: number;
  borderColor?: string;
  borderWidth?: number;
}

export interface SkillData {
  skills: string[];
  categories?: string[];
  levels?: { [skill: string]: "beginner" | "intermediate" | "advanced" };
}

export interface ShapeData {
  type: "triangle" | "circle" | "square" | "diamond" | "star";
  color: string;
  size: number;
  rotation: number;
  opacity?: number;
  borderColor?: string;
  borderWidth?: number;
}

export interface LineData {
  style: "solid" | "dashed" | "dotted";
  color: string;
  thickness: number;
  length: number;
  angle: number;
}

// New element data interfaces
export interface HeaderData {
  name: string;
  title: string;
  subtitle?: string;
  fontSize: number;
  fontWeight: string;
  color?: string;
  textAlign?: "left" | "center" | "right";
}

export interface SummaryData {
  text: string;
  fontSize: number;
  fontWeight: string;
  color?: string;
  textAlign?: "left" | "center" | "right";
  lineHeight?: number;
}

export interface ProjectData {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  startDate?: string;
  endDate?: string;
}

export interface ProjectsData {
  projects: ProjectData[];
  showDates?: boolean;
  showTechnologies?: boolean;
}

export interface CertificationData {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  url?: string;
}

export interface CertificationsData {
  certifications: CertificationData[];
  showDates?: boolean;
  showCredentialIds?: boolean;
}

export interface LanguageData {
  name: string;
  proficiency: "beginner" | "intermediate" | "advanced" | "native";
}

export interface LanguagesData {
  languages: LanguageData[];
  showProficiency?: boolean;
}

export interface ReferenceData {
  name: string;
  title: string;
  company: string;
  phone?: string;
  email?: string;
}

export interface ReferencesData {
  references: ReferenceData[];
  showContact?: boolean;
}

export interface DividerData {
  style: "line" | "dots" | "dashes" | "thick";
  color: string;
  thickness: number;
  opacity?: number;
}

export interface DraggableElement {
  type: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}
