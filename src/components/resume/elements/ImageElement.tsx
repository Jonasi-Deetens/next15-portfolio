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
    <div className="w-full h-full flex items-center justify-center">
      {content.src ? (
        <img
          src={content.src}
          alt={content.alt}
          className={`w-full h-full object-cover ${
            content.rounded ? "rounded-2xl" : ""
          }`}
          style={{ display: "block" }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
      )}
    </div>
  );
}
