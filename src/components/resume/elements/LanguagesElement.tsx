import { LanguagesData } from "@/types/resume";

interface LanguagesElementProps {
  content: LanguagesData;
  isPreview?: boolean;
}

export function LanguagesElement({
  content,
  isPreview = false,
}: LanguagesElementProps) {
  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case "native":
        return "bg-emerald-500";
      case "advanced":
        return "bg-emerald-400";
      case "intermediate":
        return "bg-emerald-300";
      case "beginner":
        return "bg-emerald-200";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <div className="w-full h-full overflow-hidden">
      <h3 className="text-lg font-semibold mb-3 text-gray-900">Languages</h3>
      <div className="space-y-2">
        {content.languages.map((language, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="font-medium text-gray-900">{language.name}</span>
            {content.showProficiency && (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`w-3 h-3 rounded-full ${
                        (language.proficiency === "native" && level <= 4) ||
                        (language.proficiency === "advanced" && level <= 3) ||
                        (language.proficiency === "intermediate" &&
                          level <= 2) ||
                        (language.proficiency === "beginner" && level <= 1)
                          ? getProficiencyColor(language.proficiency)
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 capitalize">
                  {language.proficiency}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
