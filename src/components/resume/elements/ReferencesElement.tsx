import { ReferencesData } from "@/types/resume";

interface ReferencesElementProps {
  content: ReferencesData;
  isPreview?: boolean;
}

export function ReferencesElement({
  content,
  isPreview = false,
}: ReferencesElementProps) {
  return (
    <div className="w-full h-full overflow-hidden">
      <h3 className="text-lg font-semibold mb-3 text-gray-900">References</h3>
      <div className="space-y-3">
        {content.references.map((reference, index) => (
          <div key={index} className="border-l-2 border-emerald-500 pl-3">
            <h4 className="font-medium text-gray-900">{reference.name}</h4>
            <p className="text-sm text-gray-600">{reference.title}</p>
            <p className="text-sm text-gray-600">{reference.company}</p>
            {content.showContact && (
              <div className="mt-1 space-y-1">
                {reference.phone && (
                  <p className="text-xs text-gray-500">
                    Phone: {reference.phone}
                  </p>
                )}
                {reference.email && (
                  <p className="text-xs text-gray-500">
                    Email: {reference.email}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
