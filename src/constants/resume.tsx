import {
  Type,
  Image as ImageIcon,
  Briefcase,
  GraduationCap,
  Award,
  Phone,
  Minus,
  Star,
  User,
  FileText,
  Code,
  Globe,
  Users,
  Minus as Separator,
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
  {
    type: "header",
    label: "Header",
    icon: <User className="w-4 h-4" />,
    description: "Add name and title",
  },
  {
    type: "summary",
    label: "Summary",
    icon: <FileText className="w-4 h-4" />,
    description: "Add professional summary",
  },
  {
    type: "projects",
    label: "Projects",
    icon: <Code className="w-4 h-4" />,
    description: "Add project portfolio",
  },
  {
    type: "certifications",
    label: "Certifications",
    icon: <Award className="w-4 h-4" />,
    description: "Add professional certifications",
  },
  {
    type: "languages",
    label: "Languages",
    icon: <Globe className="w-4 h-4" />,
    description: "Add language skills",
  },
  {
    type: "references",
    label: "References",
    icon: <Users className="w-4 h-4" />,
    description: "Add professional references",
  },
  {
    type: "divider",
    label: "Divider",
    icon: <Separator className="w-4 h-4" />,
    description: "Add section dividers",
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
    case "header":
      return {
        name: "Your Name",
        title: "Your Title",
        subtitle: "Your Subtitle",
        fontSize: 24,
        fontWeight: "bold",
        color: "#1f2937",
        textAlign: "left",
      };
    case "summary":
      return {
        text: "Professional summary or objective statement",
        fontSize: 14,
        fontWeight: "normal",
        color: "#374151",
        textAlign: "left",
        lineHeight: 1.5,
      };
    case "projects":
      return {
        projects: [
          {
            name: "Project Name",
            description: "Project description",
            technologies: ["Technology 1", "Technology 2"],
            url: "",
            github: "",
            startDate: "2023",
            endDate: "2023",
          },
        ],
        showDates: true,
        showTechnologies: true,
      };
    case "certifications":
      return {
        certifications: [
          {
            name: "Certification Name",
            issuer: "Issuing Organization",
            date: "2023",
            credentialId: "",
            url: "",
          },
        ],
        showDates: true,
        showCredentialIds: false,
      };
    case "languages":
      return {
        languages: [
          {
            name: "English",
            proficiency: "native",
          },
          {
            name: "Spanish",
            proficiency: "intermediate",
          },
        ],
        showProficiency: true,
      };
    case "references":
      return {
        references: [
          {
            name: "Reference Name",
            title: "Job Title",
            company: "Company Name",
            phone: "",
            email: "",
          },
        ],
        showContact: false,
      };
    case "divider":
      return {
        style: "line",
        color: "#d1d5db",
        thickness: 1,
        opacity: 0.5,
      };
    default:
      return {} as ResumeElementContent;
  }
};
