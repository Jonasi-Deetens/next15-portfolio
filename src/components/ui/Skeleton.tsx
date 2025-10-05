import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

export function Skeleton({
  className,
  width,
  height,
  rounded = true,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200",
        rounded && "rounded-md",
        className
      )}
      style={{
        width: width || "100%",
        height: height || "1rem",
      }}
    />
  );
}
