import React from "react";
import { ContentType, ContentTypeInfo } from "./course";
import ContentTypeIcon from "./ContentTypeIcon";

const contentTypes: ContentTypeInfo[] = [
  { type: "notes", label: "Notes", icon: "notes" },
  { type: "audio", label: "Audio", icon: "audio" },
  { type: "video", label: "Video", icon: "video" },
  { type: "assignment", label: "Assignment", icon: "assignment" },
  { type: "quiz", label: "Quiz", icon: "quiz" },
  { type: "liveClass", label: "Live Class", icon: "liveClass" },
  { type: "scorm", label: "Scorm", icon: "scorm" },
  { type: "survey", label: "Survey", icon: "survey" },
  { type: "interactive", label: "Interactive Content", icon: "interactive" },
  { type: "text", label: "Text", icon: "text" },
];

interface ContentTypeSelectorProps {
  onSelectType: (type: ContentType) => void;
}

const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({ onSelectType }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {contentTypes.map((contentType) => (
        <button
          key={contentType.type}
          onClick={() => onSelectType(contentType.type)}
          className="flex flex-col items-center justify-center p-4 border rounded-md hover:border-purple-300 hover:bg-purple-50 transition-colors"
        >
          <div className="w-10 h-10 flex items-center justify-center mb-2">
            <ContentTypeIcon type={contentType.type} />
          </div>
          <span className="text-sm">{contentType.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ContentTypeSelector;
