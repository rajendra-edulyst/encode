import React, { useState } from "react";
import { Course } from "./course";
import CustomButton from "./CustomButton";
import { Image, X } from "lucide-react";

interface CourseDetailProps {
  course: Course;
  onSave: (updatedCourse: Course) => void;
  onCancel: () => void;
}

const CourseDetail: React.FC<CourseDetailProps> = ({
  course,
  onSave,
  onCancel,
}) => {
  const [editedCourse, setEditedCourse] = useState<Course>({...course});

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedCourse({...editedCourse, title: e.target.value});
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedCourse({...editedCourse, description: e.target.value});
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedCourse({...editedCourse, category: e.target.value});
  };

  const handleSave = () => {
    onSave(editedCourse);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-xl font-medium">Edit course: {course.title}</h2>
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
        {/* Course Cover Image */}
        <div className="mb-6">
          {editedCourse.coverImage ? (
            <div className="relative">
              <img 
                src={editedCourse.coverImage} 
                alt="Course cover" 
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
        
        {/* Course Title */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full p-2 border rounded-md"
            value={editedCourse.title}
            onChange={handleTitleChange}
          />
        </div>
        
        {/* Course Category */}
        <div className="mb-6">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Course Category
          </label>
          <select
            id="category"
            className="w-full p-2 border rounded-md"
            value={editedCourse.category}
            onChange={handleCategoryChange}
          >
            <option value="">Select Category</option>
            <option value="Design">Design</option>
            <option value="Development">Development</option>
            <option value="Marketing">Marketing</option>
            <option value="Business">Business</option>
            <option value="Photography">Photography</option>
          </select>
        </div>
        
        {/* Course Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <div className="border rounded-md mb-2 p-1">
            <div className="flex gap-2 border-b p-1">
              <button className="p-1 hover:bg-gray-100 rounded">
                <Image className="h-5 w-5" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <span className="font-bold">B</span>
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <span className="underline">U</span>
              </button>
            </div>
            <textarea
              id="description"
              className="w-full p-2 border-none focus:outline-none min-h-[100px]"
              value={editedCourse.description}
              onChange={handleDescriptionChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
