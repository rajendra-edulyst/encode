import React from 'react';
import { X } from 'lucide-react';
import type { Course } from './ProceedCoursesListing';

type Props = {
  selectedCourses: Course[];
  onRemoveCourse: (id: number) => void;
};

const RegistrationSummary: React.FC<Props> = ({ selectedCourses, onRemoveCourse }) => {
  // Group selected courses by category
  const groupedCourses = selectedCourses.reduce<Record<string, Course[]>>((acc, course) => {
    const category = course.category_name || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(course);
    return acc;
  }, {});

  const formatTime = (timeStr: string): string => {
    if (!timeStr) return "";
    const [rawHours, minutes, seconds] = timeStr.split(":").map(Number);
    if (isNaN(rawHours) || isNaN(minutes) || isNaN(seconds)) return "";
    const hours = rawHours % 24;
    const isNextDay = rawHours >= 24;
    const date = new Date(1970, 0, isNextDay ? 2 : 1, hours, minutes, seconds);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  return (
    <div className="w-full p-4 bg-white rounded-xl">
      <div className='border-b border-gray-300 pb-2 mb-4'>
        <h3 className="text-lg text-primary font-semibold">Registration Summary</h3>
        <p className="text-sm text-gray-600 mt-1">
          Your list of selected courses
        </p>
      </div>

      {selectedCourses.length === 0 ? (
        <p className="text-gray-600 text-sm">No courses added</p>
      ) : (
        Object.entries(groupedCourses).map(([categoryName, courses]) => (
          <div key={categoryName} className="mb-6">
            <h4 className="text-base font-semibold text-gray-700 mb-2">{categoryName}</h4>
            {courses.map((course) => {
              const slot = course.class_slots[course.selectedSlotIndex ?? -1];
              return (
                <div key={course.course_id} className="flex items-start justify-between border rounded-xl p-3 mb-3">
                  <div className='flex flex-col gap-2'>
                    <p className="text-base font-bold">{course.course_name}</p>
                    {slot &&
                        <div className="inline-flex items-center gap-2 px-3 py-1 mt-2 bg-primary text-white text-sm rounded-full w-fit">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {`${slot.day_of_week} ${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`}
                        </div>
                      }
                   <div className="flex">
                    <span className='bg-orange-100 text-orange-900 text-sm px-2 py-1 rounded-full'>{course.credits || "N/A"} Credits</span>
                  </div>
                  </div>
                  <button
                    onClick={() => onRemoveCourse(course.course_id)}
                    className="text-grey-500 hover:text-grey-700 ml-4"
                    title="Remove course"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              );
            })}

          {selectedCourses.length > 0 && (
            <div className='flex justify-center'>
              <button
                onClick={() => {
                  const selectedIds = selectedCourses.map(c => c.course_id);
                  console.log("Selected Course IDs:", selectedIds);
                }}
                className="text-white bg-primary rounded-xl px-6 py-2"
              >
                Submit
              </button>
            </div>
          )}
          </div>
        ))
      )}
    </div>
  );
};

export default RegistrationSummary;
