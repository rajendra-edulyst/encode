import React from 'react';
import CourseSelectionHeader from './components/CourseSelectionHeader';
import CoursesListing from './components/CoursesListing';
import CourseProceedHeader from './components/CourseProceedHeader';
import { BookOpenCheck } from 'lucide-react'

function Index() {
  return (
    <section className="p-0 space-y-6">
      {/* Heading at the Top */}
      <div className="flex justify-between items-center flex-wrap gap-4">
            {/* Left: Image + Title + Description */}
            <div className="flex items-center gap-4">
                <div className='size-12 flex rounded-md items-center text-white bg-primary justify-center'><BookOpenCheck className="w-6 h-6"/></div>
                <div>
                <h1 className="text-2xl font-bold">Available Courses</h1>
                <p className="text-gray-500">
                    Following are the skill level courses offered for you. Please prepare yourself for course selection opening
                </p>
                </div>
            </div>

            {/* Right: Accomplished Courses Button */}
            <div>
            <button className="px-4 py-2 border border-primary text-primary rounded-md text-sm hover:bg-primary hover:text-white transition">
                Accomplished Courses
            </button>
            </div>
            </div>

      <CourseProceedHeader/>

      {/* Full-Width Layout */}
      <div className="space-y-6">
        <CoursesListing />
      </div>
    </section>
  );
}

export default Index;
