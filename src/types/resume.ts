export interface ResumeElement {
  id: string;
  type: "text" | "image" | "experience" | "education" | "skill" | "contact";
  content: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isDragging?: boolean;
  isPreview?: boolean;
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

export interface DraggableElement {
  type: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}
