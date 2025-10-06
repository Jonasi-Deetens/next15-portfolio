import { Image as ImageIcon } from "lucide-react";
import { ImageData } from "@/types/resume";

interface ImageElementProps {
  content: ImageData;
  isPreview?: boolean;
}

export function ImageElement({
  content,
  isPreview = false,
}: ImageElementProps) {
  return (
    <div className="p-2 w-full h-full flex items-center justify-center">
      {content.src ? (
        <img
          src={content.src}
          alt={content.alt}
          className="w-full h-full rounded object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
      )}
    </div>
  );
}
