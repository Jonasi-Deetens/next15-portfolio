import { CertificationsData } from "@/types/resume";

interface CertificationsElementProps {
  content: CertificationsData;
  isPreview?: boolean;
}

export function CertificationsElement({
  content,
  isPreview = false,
}: CertificationsElementProps) {
  return (
    <div className="w-full h-full overflow-hidden">
      <h3 className="text-lg font-semibold mb-3 text-gray-900">
        Certifications
      </h3>
      <div className="space-y-3">
        {content.certifications.map((cert, index) => (
          <div key={index} className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{cert.name}</h4>
              <p className="text-sm text-gray-600">{cert.issuer}</p>
              {content.showCredentialIds && cert.credentialId && (
                <p className="text-xs text-gray-500">ID: {cert.credentialId}</p>
              )}
            </div>
            <div className="text-right">
              {content.showDates && (
                <span className="text-sm text-gray-500">{cert.date}</span>
              )}
              {cert.url && (
                <div className="mt-1">
                  <a
                    href={cert.url}
                    className="text-sm text-emerald-600 hover:text-emerald-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Verify
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
