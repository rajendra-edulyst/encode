import React, { useState } from 'react';
import CourseSelectionHeader from './CourseSelectionHeader';
import ProceedCoursesListing from './ProceedCoursesListing';
import RegistrationCriteria from './RegistrationCriteria';
import RegistrationSummary from './RegistrationSummary';
import type { Course } from './ProceedCoursesListing';

function ProceedMain() {
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [isTimeExpired, setIsTimeExpired] = useState(false);

  const handleAddCourse = (newCourse: Course, slotIndex: number) => {
    setSelectedCourses((prevCourses) => {
      const index = prevCourses.findIndex(c => c.course_id === newCourse.course_id);
  
      if (index !== -1) {
        // Replace existing course with updated slot
        const updated = [...prevCourses];
        updated[index] = { ...newCourse, selectedSlotIndex: slotIndex };
        return updated;
      } else {
        // Add new course
        return [...prevCourses, { ...newCourse, selectedSlotIndex: slotIndex }];
      }
    });
  };

  const handleRemoveCourse = (id: number) => {
    setSelectedCourses(prev => prev.filter(course => course.course_id !== id));
  };

  return (
    <section className="w-full">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-[70%] w-full gap-4 flex-col flex">
        <CourseSelectionHeader
            selected={selectedCourses.length}
            total={3}
            onExpire={() => setIsTimeExpired(true)}
          />
          <ProceedCoursesListing
            selectedCourses={selectedCourses}
            onAddCourse={handleAddCourse}
            onRemoveCourse={handleRemoveCourse}
            isTimeExpired={isTimeExpired} 
          />
        </div>
        <div className="md:w-[30%] w-full gap-4 flex flex-col">
          <RegistrationCriteria />
          <RegistrationSummary
            selectedCourses={selectedCourses}
            onRemoveCourse={handleRemoveCourse}
          />
        </div>
      </div>
    </section>
  );
}

export default ProceedMain;
