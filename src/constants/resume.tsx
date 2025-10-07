import {
  Type,
  Image as ImageIcon,
  Briefcase,
  GraduationCap,
  Award,
  Phone,
  Minus,
  Hash,
  Star,
  Quote,
  MoreHorizontal,
} from "lucide-react";
import {
  DraggableElement,
  ResumeElementContent,
  ResumeElementType,
} from "@/types/resume";

export const draggableElements: DraggableElement[] = [
  {
    type: "text",
    label: "Text Block",
    icon: <Type className="w-4 h-4" />,
    description: "Add a text block",
  },
  {
    type: "image",
    label: "Image",
    icon: <ImageIcon className="w-4 h-4" />,
    description: "Add a profile image",
  },
  {
    type: "experience",
    label: "Experience",
    icon: <Briefcase className="w-4 h-4" />,
    description: "Add work experience",
  },
  {
    type: "education",
    label: "Education",
    icon: <GraduationCap className="w-4 h-4" />,
    description: "Add education",
  },
  {
    type: "skill",
    label: "Skills",
    icon: <Award className="w-4 h-4" />,
    description: "Add skills section",
  },
  {
    type: "contact",
    label: "Contact",
    icon: <Phone className="w-4 h-4" />,
    description: "Add contact information",
  },
  {
    type: "shape",
    label: "Shape",
    icon: <Star className="w-4 h-4" />,
    description: "Add decorative shapes",
  },
  {
    type: "line",
    label: "Line",
    icon: <Minus className="w-4 h-4" />,
    description: "Add decorative lines",
  },
];

export const getDefaultContent = (
  type: ResumeElementType
): ResumeElementContent => {
  switch (type) {
    case "text":
      return { text: "Your text here", fontSize: 16, fontWeight: "normal" };
    case "image":
      return {
        src: "",
        alt: "Profile Image",
        width: 150,
        height: 150,
        rounded: false,
      };
    case "experience":
      return {
        title: "Job Title",
        company: "Company Name",
        location: "Location",
        startDate: "2020",
        endDate: "2023",
        description: "Job description here",
        current: false,
      };
    case "education":
      return {
        degree: "Degree",
        school: "School Name",
        location: "Location",
        startDate: "2018",
        endDate: "2022",
        description: "Education description",
      };
    case "skill":
      return { skills: ["Skill 1", "Skill 2", "Skill 3"] };
    case "contact":
      return {
        phone: "",
        email: "",
        location: "",
        website: "",
      };
    case "shape":
      return {
        type: "triangle",
        color: "#10b981",
        size: 50,
        rotation: 0,
      };
    case "line":
      return {
        style: "solid",
        color: "#10b981",
        thickness: 2,
        length: 100,
        angle: 0,
      };
    default:
      return {};
  }
};
