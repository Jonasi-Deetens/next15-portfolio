import { ResumeElement } from "@/types/resume";

export const resumeTemplates = [
  {
    id: "software-engineer",
    name: "Software Engineer",
    description: "Professional template for software developers",
    elements: [
      {
        id: "header-1",
        type: "text",
        content: {
          text: "John Doe",
          fontSize: 24,
          fontWeight: "bold",
        },
        position: { x: 20, y: 20 },
        size: { width: 200, height: 30 },
        isDragging: false,
        isPreview: false,
      },
      {
        id: "contact-1",
        type: "contact",
        content: {
          phone: "+1 (555) 123-4567",
          email: "john.doe@email.com",
          location: "San Francisco, CA",
          website: "https://johndoe.dev",
        },
        position: { x: 20, y: 60 },
        size: { width: 200, height: 80 },
        isDragging: false,
        isPreview: false,
      },
      {
        id: "experience-1",
        type: "experience",
        content: {
          title: "Senior Software Engineer",
          company: "Tech Company Inc.",
          location: "San Francisco, CA",
          startDate: "2020",
          endDate: "Present",
          current: true,
          description:
            "Led development of scalable web applications using React, Node.js, and AWS. Mentored junior developers and improved team productivity by 30%.",
        },
        position: { x: 20, y: 160 },
        size: { width: 300, height: 120 },
        isDragging: false,
        isPreview: false,
      },
      {
        id: "skills-1",
        type: "skill",
        content: {
          skills: [
            "JavaScript",
            "TypeScript",
            "React",
            "Node.js",
            "AWS",
            "Docker",
          ],
        },
        position: { x: 20, y: 300 },
        size: { width: 200, height: 80 },
        isDragging: false,
        isPreview: false,
      },
    ],
  },
  {
    id: "marketing-manager",
    name: "Marketing Manager",
    description: "Template for marketing professionals",
    elements: [
      {
        id: "header-2",
        type: "text",
        content: {
          text: "Jane Smith",
          fontSize: 24,
          fontWeight: "bold",
        },
        position: { x: 20, y: 20 },
        size: { width: 200, height: 30 },
        isDragging: false,
        isPreview: false,
      },
      {
        id: "contact-2",
        type: "contact",
        content: {
          phone: "+1 (555) 987-6543",
          email: "jane.smith@email.com",
          location: "New York, NY",
          website: "https://janesmith.com",
        },
        position: { x: 20, y: 60 },
        size: { width: 200, height: 80 },
        isDragging: false,
        isPreview: false,
      },
      {
        id: "experience-2",
        type: "experience",
        content: {
          title: "Marketing Manager",
          company: "Digital Agency",
          location: "New York, NY",
          startDate: "2019",
          endDate: "Present",
          current: true,
          description:
            "Developed and executed marketing campaigns that increased brand awareness by 150%. Managed a team of 5 marketing specialists.",
        },
        position: { x: 20, y: 160 },
        size: { width: 300, height: 120 },
        isDragging: false,
        isPreview: false,
      },
      {
        id: "skills-2",
        type: "skill",
        content: {
          skills: [
            "Digital Marketing",
            "SEO",
            "Social Media",
            "Analytics",
            "Team Leadership",
          ],
        },
        position: { x: 20, y: 300 },
        size: { width: 200, height: 80 },
        isDragging: false,
        isPreview: false,
      },
    ],
  },
  {
    id: "data-scientist",
    name: "Data Scientist",
    description: "Template for data science professionals",
    elements: [
      {
        id: "header-3",
        type: "text",
        content: {
          text: "Alex Johnson",
          fontSize: 24,
          fontWeight: "bold",
        },
        position: { x: 20, y: 20 },
        size: { width: 200, height: 30 },
        isDragging: false,
        isPreview: false,
      },
      {
        id: "contact-3",
        type: "contact",
        content: {
          phone: "+1 (555) 456-7890",
          email: "alex.johnson@email.com",
          location: "Seattle, WA",
          website: "https://alexjohnson.ai",
        },
        position: { x: 20, y: 60 },
        size: { width: 200, height: 80 },
        isDragging: false,
        isPreview: false,
      },
      {
        id: "experience-3",
        type: "experience",
        content: {
          title: "Senior Data Scientist",
          company: "AI Solutions Corp",
          location: "Seattle, WA",
          startDate: "2021",
          endDate: "Present",
          current: true,
          description:
            "Built machine learning models that improved business outcomes by 40%. Led data science initiatives across multiple product teams.",
        },
        position: { x: 20, y: 160 },
        size: { width: 300, height: 120 },
        isDragging: false,
        isPreview: false,
      },
      {
        id: "skills-3",
        type: "skill",
        content: {
          skills: [
            "Python",
            "Machine Learning",
            "TensorFlow",
            "SQL",
            "Statistics",
            "Deep Learning",
          ],
        },
        position: { x: 20, y: 300 },
        size: { width: 200, height: 80 },
        isDragging: false,
        isPreview: false,
      },
    ],
  },
];

export function getTemplateById(id: string) {
  return resumeTemplates.find((template) => template.id === id);
}
