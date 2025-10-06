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
  | "line";

export interface ResumeElementContent {
  text: string;
  image: string;
  experience: ExperienceData;
  education: EducationData;
  skill: SkillData;
  contact: ContactData;
  shape: ShapeData;
  line: LineData;
}

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
}

export interface TextData {
  text: string;
  fontSize: number;
  fontWeight: string;
}

export interface ImageData {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface SkillData {
  skills: string[];
}

export interface ShapeData {
  type: "triangle" | "circle" | "square" | "diamond" | "star";
  color: string;
  size: number;
  rotation: number;
}

export interface LineData {
  style: "solid" | "dashed" | "dotted";
  color: string;
  thickness: number;
  length: number;
  angle: number;
}

export interface DraggableElement {
  type: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}
