import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ModuleList from "./ModuleList";
import ModuleDetail from "./ModuleDetail";
import CourseDetail from "./CourseDetail";
import { mockCourse } from "./mockCourse";
import { PencilLine } from "lucide-react";
import { Module } from "./course";

const CourseEditor: React.FC = () => {
  const navigate = useNavigate();
  const { moduleId } = useParams();
  const [course, setCourse] = useState(mockCourse);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to handle module selection from URL params
  useEffect(() => {
    if (moduleId) {
      // Check if the moduleId exists in our course
      const moduleExists = course.modules.some(m => m.id === moduleId);
      if (moduleExists) {
        setSelectedModuleId(moduleId);
      } else {
        // Redirect to not found if module doesn't exist
        navigate("/course/not-found");
      }
    }
    setIsLoading(false);
  }, [moduleId, course.modules, navigate]);

  const selectedModule = selectedModuleId
    ? course.modules.find(m => m.id === selectedModuleId)
    : null;

 
  const handleSelectModule = (moduleId: string) => {
    setSelectedModuleId(moduleId);
  };

  const handleAddModule = () => {
    const newModule: Module = {
      id: `module_${Date.now()}`,
      title: `New Module`,
      description: "",
      contents: []
    };
    
    setCourse({
      ...course,
      modules: [...course.modules, newModule]
    });
    
    setSelectedModuleId(newModule.id);    
   
  };

  const handleUpdateModule = (updatedModule: Module) => {
    setCourse({
      ...course,
      modules: course.modules.map(m => 
        m.id === updatedModule.id ? updatedModule : m
      )
    });
    
    
  };

  const handleReorderModules = (newOrder: Module[]) => {
    setCourse({
      ...course,
      modules: newOrder
    });
  };

  const handleUpdateCourse = (updatedCourse: typeof course) => {
    setCourse(updatedCourse);
    setEditingCourse(false);
    
    
  };

  const handleCancelEdit = () => {
    if (editingCourse) {
      setEditingCourse(false);
    } else {
      setSelectedModuleId(null);
      navigate("content-creation/edit");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="border rounded-md p-4 items-center justify-between bg-white">
                <div className="flex p-4 border bg-gray-200 rounded-md items-center justify-between">
                <h2 className="font-medium text-lg">{course.title}</h2>
              <button 
                className="text-sm text-purple-600 hover:text-purple-800"
                onClick={() => setEditingCourse(true)}
              >
                <PencilLine className="h-5 w-5 inline-block mr-1" />
              </button>
                </div>
              
            <ModuleList 
              modules={course.modules}
              selectedModuleId={selectedModuleId || undefined}
              onSelectModule={handleSelectModule}
              onAddModule={handleAddModule}
              onReorderModules={handleReorderModules}
              />
            </div>
          </div>
          
          <div className="md:col-span-3">
            {editingCourse ? (
              <CourseDetail
                course={course}
                onSave={handleUpdateCourse}
                onCancel={() => setEditingCourse(false)}
              />
            ) : selectedModule ? (
              <ModuleDetail
                module={selectedModule}
                onSave={handleUpdateModule}
                onCancel={handleCancelEdit}
              />
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <h3 className="text-xl font-medium mb-4">Select a module to edit</h3>
                <p className="text-gray-500">
                  Click on a module from the list on the left, or create a new module to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEditor;
