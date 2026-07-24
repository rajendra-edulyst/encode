import React from "react";
import { 
  FileText, 
  Headphones, 
  Video, 
  ClipboardList, 
  HelpCircle, 
  Video as VideoIcon, 
  BarChart, 
  FileQuestion, 
  Laptop, 
  FileText as TextIcon  
} from "lucide-react";
import { ContentType } from "./course";

interface ContentTypeIconProps {
  type: ContentType;
  size?: number;
  className?: string;
}

const ContentTypeIcon: React.FC<ContentTypeIconProps> = ({ 
  type, 
  size = 24, 
  className = "" 
}) => {
  const iconProps = { size, className };

  switch (type) {
    case "notes":
      return <FileText {...iconProps} />;
    case "audio":
      return <Headphones {...iconProps} />;
    case "video":
      return <Video {...iconProps} />;
    case "assignment":
      return <ClipboardList {...iconProps} />;
    case "quiz":
      return <HelpCircle {...iconProps} />;
    case "liveClass":
      return <VideoIcon {...iconProps} />;
    case "scorm":
      return <BarChart {...iconProps} />;
    case "survey":
      return <FileQuestion {...iconProps} />;
    case "interactive":
      return <Laptop {...iconProps} />;
    case "text":
      return <TextIcon {...iconProps} />;
    default:
      return <FileText {...iconProps} />;
  }
};

export default ContentTypeIcon;
