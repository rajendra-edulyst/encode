import React from "react";
import { FileText, Headphones, Video, ClipboardList, HelpCircle, Video as VideoIcon, BarChart, FileQuestion, Text as TextIcon, LucideIcon, Link, Notebook } from 'lucide-react';
import { ContentType } from "@/@types/faculty/program";
import { Button } from "./ui/ShadcnButton";
import { Link as ReactRouterLink } from "react-router-dom";

// Define the type for contentTypes
interface ContentTypeItem {
    type: ContentType;
    label: string;
    icon: LucideIcon; // Use LucideIcon type for clarity
}

const contentTypes: ContentTypeItem[] = [
    { type: "notes", label: "Notes", icon: Notebook },
    { type: "audio", label: "Audio", icon: Headphones },
    { type: "video", label: "Video", icon: Video },
    { type: "assignment", label: "Assignment", icon: ClipboardList },
    { type: "quiz", label: "Quiz", icon: HelpCircle },
    { type: "liveClass", label: "Live Class", icon: VideoIcon },
    { type: "scorm", label: "Scorm", icon: BarChart },
    { type: "survey", label: "Survey", icon: FileQuestion },
    { type: "text", label: "Text", icon: TextIcon },
    { type: "external_link", label: "External Link", icon: Link }
];

interface ContentTypeSelectorProps {
    type: ContentType;
    programId: string;
    moduleId: string;
}

const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({ type, programId, moduleId }) => {
    return (
        <div className="flex flex-wrap gap-3 mb-2">
            {contentTypes.map((content) => (
                <ReactRouterLink key={content.type} to={`/programs/${programId}/modules/${moduleId}/contents/create/${content.type}`}>
                    <Button
                        className={`flex items-center gap-3 border rounded-md hover:border-primary transition-colors bg-white ${type === content.type ? 'border-primary' : 'border-transparent'}`}
                    >
                        <content.icon
                            size={24}
                            className={`${type === content.type ? 'text-primary' : 'text-gray-500'}`}
                        />
                        <span className="text-sm">{content.label}</span>
                    </Button>
                </ReactRouterLink>
            ))}
        </div>
    );
};

export default ContentTypeSelector;