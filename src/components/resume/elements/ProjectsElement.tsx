import { ProjectsData } from "@/types/resume";

interface ProjectsElementProps {
  content: ProjectsData;
  isPreview?: boolean;
}

export function ProjectsElement({
  content,
  isPreview = false,
}: ProjectsElementProps) {
  return (
    <div className="w-full h-full overflow-hidden">
      <h3 className="text-lg font-semibold mb-3 text-gray-900">Projects</h3>
      <div className="space-y-4">
        {content.projects.map((project, index) => (
          <div key={index} className="border-l-2 border-emerald-500 pl-3">
            <div className="flex items-start justify-between mb-1">
              <h4 className="font-medium text-gray-900">{project.name}</h4>
              {content.showDates && project.startDate && (
                <span className="text-sm text-gray-500">
                  {project.startDate} - {project.endDate || "Present"}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-700 mb-2">{project.description}</p>
            {content.showTechnologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {project.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
            {(project.url || project.github) && (
              <div className="flex gap-2 mt-2">
                {project.url && (
                  <a
                    href={project.url}
                    className="text-sm text-emerald-600 hover:text-emerald-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    className="text-sm text-emerald-600 hover:text-emerald-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
