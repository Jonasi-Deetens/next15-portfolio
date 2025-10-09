import {
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Linkedin,
  Github,
} from "lucide-react";
import { ContactData } from "@/types/resume";

interface ContactElementProps {
  content: ContactData;
  isPreview?: boolean;
}

export function ContactElement({
  content,
  isPreview = false,
}: ContactElementProps) {
  return (
    <div>
      <h4 className="font-semibold mb-2">Contact</h4>
      <div className="space-y-1 text-sm">
        {content.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3" />
            {content.phone}
          </div>
        )}
        {content.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-3 h-3" />
            {content.email}
          </div>
        )}
        {content.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            {content.location}
          </div>
        )}
        {content.website && (
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3 h-3" />
            {content.website}
          </div>
        )}
        {content.linkedin && (
          <div className="flex items-center gap-2">
            <Linkedin className="w-3 h-3" />
            {content.linkedin}
          </div>
        )}
        {content.github && (
          <div className="flex items-center gap-2">
            <Github className="w-3 h-3" />
            {content.github}
          </div>
        )}
        {content.portfolio && (
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3 h-3" />
            {content.portfolio}
          </div>
        )}
      </div>
    </div>
  );
}
