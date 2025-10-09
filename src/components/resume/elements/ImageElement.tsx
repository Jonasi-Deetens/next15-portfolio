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
  const imageStyle: React.CSSProperties = {
    display: "block",
    opacity: content.opacity || 1,
    borderColor: content.borderColor,
    borderWidth: content.borderWidth ? `${content.borderWidth}px` : undefined,
    borderStyle: content.borderWidth ? "solid" : undefined,
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      {content.src ? (
        <img
          src={content.src}
          alt={content.alt}
          className={`w-full h-full object-cover ${
            content.rounded ? "rounded-2xl" : ""
          }`}
          style={imageStyle}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
      )}
    </div>
  );
}
