export interface ResumeElement {
  id: string;
  type:
    | "text"
    | "image"
    | "experience"
    | "education"
    | "skill"
    | "contact"
    | "shape"
    | "line"
    | "curve";
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

export interface CurveData {
  style: "wave" | "sine" | "zigzag" | "spiral";
  color: string;
  thickness: number;
  amplitude: number;
  frequency: number;
}

export interface DraggableElement {
  type: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}
