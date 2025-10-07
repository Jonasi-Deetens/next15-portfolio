import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { GripVertical } from "lucide-react";
import { DraggableElement } from "@/types/resume";

interface ElementsPanelProps {
  elements: DraggableElement[];
  onMouseDown: (e: React.MouseEvent, elementType: string) => void;
}

export function ElementsPanel({ elements, onMouseDown }: ElementsPanelProps) {
  return (
    <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle>Elements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {elements.map((element) => (
            <div
              key={element.type}
              onMouseDown={(e) => {
                onMouseDown(e, element.type);
              }}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-move hover:bg-gray-50 transition-colors select-none"
              style={{ userSelect: "none" }}
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
              {element.icon}
              <div className="flex-1">
                <p className="font-medium text-sm">{element.label}</p>
                <p className="text-xs text-gray-500">{element.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
