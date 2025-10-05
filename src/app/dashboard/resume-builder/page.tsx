"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  Download,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
} from "lucide-react";

interface ResumeData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: string[];
}

export default function ResumeBuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
  });

  const [activeTab, setActiveTab] = useState<
    "personal" | "summary" | "experience" | "education" | "skills"
  >("personal");
  const [isPreview, setIsPreview] = useState(false);

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    setResumeData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExp],
    }));
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
    };
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));
  };

  const updateEducation = (id: string, field: string, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !resumeData.skills.includes(skill.trim())) {
      setResumeData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill.trim()],
      }));
    }
  };

  const removeSkill = (skill: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const saveResume = () => {
    // TODO: Save to database
    console.log("Saving resume:", resumeData);
  };

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={resumeData.personalInfo.name}
          onChange={(e) => updatePersonalInfo("name", e.target.value)}
        />
        <Input
          label="Professional Title"
          value={resumeData.personalInfo.title}
          onChange={(e) => updatePersonalInfo("title", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          value={resumeData.personalInfo.email}
          onChange={(e) => updatePersonalInfo("email", e.target.value)}
        />
        <Input
          label="Phone"
          value={resumeData.personalInfo.phone}
          onChange={(e) => updatePersonalInfo("phone", e.target.value)}
        />
      </div>
      <Input
        label="Location"
        value={resumeData.personalInfo.location}
        onChange={(e) => updatePersonalInfo("location", e.target.value)}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Website"
          value={resumeData.personalInfo.website || ""}
          onChange={(e) => updatePersonalInfo("website", e.target.value)}
        />
        <Input
          label="LinkedIn"
          value={resumeData.personalInfo.linkedin || ""}
          onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
        />
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Work Experience</h3>
        <Button onClick={addExperience} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {resumeData.experience.map((exp) => (
        <Card key={exp.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-2">
                <Input
                  label="Position"
                  value={exp.position}
                  onChange={(e) =>
                    updateExperience(exp.id, "position", e.target.value)
                  }
                />
                <Input
                  label="Company"
                  value={exp.company}
                  onChange={(e) =>
                    updateExperience(exp.id, "company", e.target.value)
                  }
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="month"
                    value={exp.startDate}
                    onChange={(e) =>
                      updateExperience(exp.id, "startDate", e.target.value)
                    }
                  />
                  <Input
                    label="End Date"
                    type="month"
                    value={exp.endDate}
                    onChange={(e) =>
                      updateExperience(exp.id, "endDate", e.target.value)
                    }
                    disabled={exp.current}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`current-${exp.id}`}
                    checked={exp.current}
                    onChange={(e) =>
                      updateExperience(exp.id, "current", e.target.checked)
                    }
                  />
                  <label
                    htmlFor={`current-${exp.id}`}
                    className="text-sm text-gray-600"
                  >
                    Currently working here
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={exp.description}
                    onChange={(e) =>
                      updateExperience(exp.id, "description", e.target.value)
                    }
                    placeholder="Describe your role and achievements..."
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExperience(exp.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Education</h3>
        <Button onClick={addEducation} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>

      {resumeData.education.map((edu) => (
        <Card key={edu.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-2">
                <Input
                  label="Institution"
                  value={edu.institution}
                  onChange={(e) =>
                    updateEducation(edu.id, "institution", e.target.value)
                  }
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Degree"
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(edu.id, "degree", e.target.value)
                    }
                  />
                  <Input
                    label="Field of Study"
                    value={edu.field}
                    onChange={(e) =>
                      updateEducation(edu.id, "field", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="month"
                    value={edu.startDate}
                    onChange={(e) =>
                      updateEducation(edu.id, "startDate", e.target.value)
                    }
                  />
                  <Input
                    label="End Date"
                    type="month"
                    value={edu.endDate}
                    onChange={(e) =>
                      updateEducation(edu.id, "endDate", e.target.value)
                    }
                  />
                </div>
                <Input
                  label="GPA (Optional)"
                  value={edu.gpa || ""}
                  onChange={(e) =>
                    updateEducation(edu.id, "gpa", e.target.value)
                  }
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeEducation(edu.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Skills</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {resumeData.skills.map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              className="ml-1 text-gray-500 hover:text-red-500"
            >
              ×
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Add a skill..."
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              addSkill(e.currentTarget.value);
              e.currentTarget.value = "";
            }
          }}
        />
        <Button
          onClick={() => {
            const input = document.querySelector(
              'input[placeholder="Add a skill..."]'
            ) as HTMLInputElement;
            if (input) {
              addSkill(input.value);
              input.value = "";
            }
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {resumeData.personalInfo.name || "Your Name"}
        </h1>
        <h2 className="text-xl text-gray-600 mb-4">
          {resumeData.personalInfo.title || "Your Professional Title"}
        </h2>
        <div className="flex justify-center gap-4 text-sm text-gray-500">
          {resumeData.personalInfo.email && (
            <span>{resumeData.personalInfo.email}</span>
          )}
          {resumeData.personalInfo.phone && (
            <span>{resumeData.personalInfo.phone}</span>
          )}
          {resumeData.personalInfo.location && (
            <span>{resumeData.personalInfo.location}</span>
          )}
        </div>
      </div>

      {resumeData.summary && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Summary</h3>
          <p className="text-gray-600">{resumeData.summary}</p>
        </div>
      )}

      {resumeData.experience.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Experience
          </h3>
          {resumeData.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {exp.position}
                  </h4>
                  <p className="text-gray-600">{exp.company}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              {exp.description && (
                <p className="text-gray-600 mt-2">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {resumeData.education.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Education
          </h3>
          {resumeData.education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {edu.degree} in {edu.field}
                  </h4>
                  <p className="text-gray-600">{edu.institution}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {resumeData.skills.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: "personal", label: "Personal Info", icon: "User" },
    { id: "summary", label: "Summary", icon: "FileText" },
    { id: "experience", label: "Experience", icon: "Briefcase" },
    { id: "education", label: "Education", icon: "GraduationCap" },
    { id: "skills", label: "Skills", icon: "Award" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
          <p className="text-gray-600 mt-1">
            Create and customize your professional resume
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsPreview(!isPreview)}
            variant={isPreview ? "default" : "outline"}
            size="sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            {isPreview ? "Edit" : "Preview"}
          </Button>
          <Button onClick={saveResume} size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {isPreview ? (
        renderPreview()
      ) : (
        <div className="space-y-6">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {activeTab === "personal" && renderPersonalInfo()}
            {activeTab === "summary" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Summary
                </label>
                <textarea
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={resumeData.summary}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      summary: e.target.value,
                    }))
                  }
                  placeholder="Write a brief summary of your professional background..."
                />
              </div>
            )}
            {activeTab === "experience" && renderExperience()}
            {activeTab === "education" && renderEducation()}
            {activeTab === "skills" && renderSkills()}
          </div>
        </div>
      )}
    </div>
  );
}
