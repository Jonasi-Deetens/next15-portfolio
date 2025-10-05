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
    <div
      className={`p-2 text-center ${
        isPreview ? "" : "border border-dashed border-gray-300 rounded"
      }`}
    >
      {content.src ? (
        <img
          src={content.src}
          alt={content.alt}
          style={{ width: content.width, height: content.height }}
          className="rounded object-cover mx-auto"
        />
      ) : (
        <div
          className="flex items-center justify-center bg-gray-100 rounded"
          style={{ width: content.width, height: content.height }}
        >
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
      )}
    </div>
  );
}
