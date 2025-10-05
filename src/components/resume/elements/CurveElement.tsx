import { CurveData } from "@/types/resume";

interface CurveElementProps {
  content: CurveData;
  isPreview?: boolean;
}

export function CurveElement({
  content,
  isPreview = false,
}: CurveElementProps) {
  const { style, color, thickness, amplitude, frequency } = content;

  const renderCurve = () => {
    const width = 200;
    const height = amplitude * 2 + 20;

    switch (style) {
      case "wave":
        return (
          <svg width={width} height={height} className="overflow-visible">
            <path
              d={`M 0 ${height / 2} Q ${width / 4} ${height / 2 - amplitude} ${
                width / 2
              } ${height / 2} T ${width} ${height / 2}`}
              stroke={color}
              strokeWidth={thickness}
              fill="none"
            />
          </svg>
        );
      case "sine":
        return (
          <svg width={width} height={height} className="overflow-visible">
            <path
              d={`M 0 ${height / 2} Q ${width / 8} ${height / 2 - amplitude} ${
                width / 4
              } ${height / 2} T ${width / 2} ${height / 2} T ${
                (3 * width) / 4
              } ${height / 2} T ${width} ${height / 2}`}
              stroke={color}
              strokeWidth={thickness}
              fill="none"
            />
          </svg>
        );
      case "zigzag":
        return (
          <svg width={width} height={height} className="overflow-visible">
            <path
              d={`M 0 ${height / 2} L ${width / 4} ${
                height / 2 - amplitude
              } L ${width / 2} ${height / 2} L ${(3 * width) / 4} ${
                height / 2 + amplitude
              } L ${width} ${height / 2}`}
              stroke={color}
              strokeWidth={thickness}
              fill="none"
            />
          </svg>
        );
      case "spiral":
        return (
          <svg width={width} height={height} className="overflow-visible">
            <path
              d={`M ${width / 2} ${
                height / 2
              } A ${amplitude} ${amplitude} 0 1 1 ${width / 2 - 1} ${
                height / 2
              }`}
              stroke={color}
              strokeWidth={thickness}
              fill="none"
            />
          </svg>
        );
      default:
        return (
          <div
            style={{
              width: "200px",
              height: "20px",
              backgroundColor: color,
            }}
          />
        );
    }
  };

  return (
    <div
      className={`${
        isPreview
          ? "w-full flex justify-center items-center"
          : "border border-dashed border-gray-300 rounded p-2 flex justify-center items-center"
      }`}
    >
      {renderCurve()}
    </div>
  );
}
