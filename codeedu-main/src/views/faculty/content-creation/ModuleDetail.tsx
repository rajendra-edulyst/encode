import React, { useState } from "react";
import { Module, Content, ContentType } from "./course";
import ContentList from "./ContentList";
import ContentTypeSelector from "./ContentTypeSelector";
import CustomButton from "./CustomButton";
import { Image, X } from "lucide-react";

interface ModuleDetailProps {
  module: Module;
  onSave: (updatedModule: Module) => void;
  onCancel: () => void;
}

const ModuleDetail: React.FC<ModuleDetailProps> = ({ 
  module, 
  onSave, 
  onCancel 
}) => {
  const [editedModule, setEditedModule] = useState<Module>({...module});
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [isAddingContent, setIsAddingContent] = useState(false);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedModule({...editedModule, title: e.target.value});
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedModule({...editedModule, description: e.target.value});
  };
  
  const handleAddContent = (type: ContentType) => {
    const newContent: Content = {
      id: `content_${Date.now()}`,
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      data: {}
    };
    
    setEditedModule({
      ...editedModule,
      contents: [...editedModule.contents, newContent]
    });
    
    setIsAddingContent(false);
    setSelectedContent(newContent.id);
  };
  
  const handleSave = () => {
    onSave(editedModule);
  };
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-xl font-medium">Edit module: {module.title}</h2>
        <div className="flex gap-2">
          <CustomButton variant="outline" onClick={onCancel}>
            Cancel
          </CustomButton>
          <CustomButton onClick={handleSave}>
            Save
          </CustomButton>
        </div>
      </div>
      
      <div className="p-6">
        {/* Module Cover Image */}
        <div className="mb-6">
          {editedModule.coverImage ? (
            <div className="relative">
              <img 
                src={editedModule.coverImage} 
                alt="Module cover" 
                className="w-full h-48 object-cover rounded-md"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button className="bg-white p-2 rounded-md shadow hover:bg-gray-100">
                  <Image className="h-5 w-5" />
                  <span className="sr-only">Change Cover</span>
                </button>
                <button className="bg-white p-2 rounded-md shadow hover:bg-gray-100">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Remove Cover</span>
                </button>
              </div>
            </div>
          ) : (
            <button className="w-full h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center hover:border-purple-300 transition-colors">
              <div className="flex items-center gap-2 text-gray-600">
                <Image className="h-5 w-5" />
                <span>Add Cover</span>
              </div>
            </button>
          )}
        </div>
        
        {/* Module Title */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full p-2 border rounded-md"
            value={editedModule.title}
            onChange={handleTitleChange}
          />
        </div>
        
        {/* Module Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            className="w-full p-2 border rounded-md min-h-[100px]"
            value={editedModule.description}
            onChange={handleDescriptionChange}
          />
        </div>
        
        {/* Content Stats and List */}
        <div className="mb-6">
          <ContentList 
            contents={editedModule.contents}
            selectedContent={selectedContent || undefined}
            onSelectContent={(id) => setSelectedContent(id)}
          />
        </div>
        
        {/* Add Content */}
        {isAddingContent ? (
          <div className="border rounded-md p-6">
            <h3 className="font-medium mb-4">Select content type</h3>
            <ContentTypeSelector onSelectType={handleAddContent} />
          </div>
        ) : (
          <CustomButton 
            onClick={() => setIsAddingContent(true)}
            className="w-full"
            variant="outline"
          >
            + Add Content
          </CustomButton>
        )}
      </div>
    </div>
  );
};

export default ModuleDetail;
