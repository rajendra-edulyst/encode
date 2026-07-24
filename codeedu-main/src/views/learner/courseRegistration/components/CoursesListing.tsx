import React, { useEffect, useState } from "react";
import { fetchNepCategory, fetchNepCourseById } from "@/services/learner/NepCourseService";
import CourseDialog from "./CourseDialog";
import CourseCard from "./CourseCard";

// ----------------- Types -----------------
type Slot = {
  id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  program_id: number;
  status: string;
};

type Course = {
  category_id: number;
  category_name: string;
  course_id: number;
  course_name: string;
  host_department_id: string | null;
  host_department_name: string | null;
  credits: string;
  maximum_seats: string;
  available_seats: string;
  course_start_date: string;
  course_end_date: string;
  level: string;
  pre_requisite: string;
  pre_requisite_course_id: string;
  keywords?: string;
  learning_outcomes:string;
  description: string;
  class_slots: Slot[];
  image:string;
};

type Category = {
  id: string;
  name: string;
};

const CoursesListing = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedPrerequisite, setSelectedPrerequisite] = useState("");
  const [selectedSeat, setSelectedSeat] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetchNepCategory("nep");
        const cats: Category[] = res?.data || [];
        setCategories(cats);
        if (cats.length > 0) {
          setActiveTabId(cats[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (activeTabId) {
      const fetchCourses = async () => {
        try {
          setLoading(true);
          const res = await fetchNepCourseById(activeTabId);
          setCourses(res?.data || []);
        } catch (err) {
          console.error("Failed to fetch courses by category", err);
        } finally {
          setLoading(false);
        }
      };
      fetchCourses();
    }
  }, [activeTabId]);

  // Extract dropdown options
  const departmentOptions = Array.from(
    new Set(
      courses
        .map((c) => c.host_department_name)
        .filter((name): name is string => !!name && name.trim() !== "")
    )
  );
  const prerequisiteOptions = Array.from(new Set(courses.map(c => c.pre_requisite).filter(Boolean)));
  const seatOptions = Array.from(new Set(courses.map(c => c.available_seats).filter(Boolean))).sort(
    (a, b) => Number(a) - Number(b)
  );

  // Filter and Sort
  let filteredCourses = [...courses];

  if (searchTerm) {
    filteredCourses = filteredCourses.filter((c) =>
      c.course_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (selectedDepartment) {
    filteredCourses = filteredCourses.filter(
      (c) => (c.host_department_name) === selectedDepartment
    );
  }

  if (selectedPrerequisite) {
    filteredCourses = filteredCourses.filter(
      (c) => c.pre_requisite === selectedPrerequisite
    );
  }

  if (selectedSeat) {
    filteredCourses = filteredCourses.filter(
      (c) => c.available_seats === selectedSeat
    );
  }

  if (sortBy === "name") {
    filteredCourses.sort((a, b) => a.course_name.localeCompare(b.course_name));
  } else if (sortBy === "seats") {
    filteredCourses.sort((a, b) => Number(b.available_seats) - Number(a.available_seats));
  }


  const formatTime = (timeStr: string): string => {
    if (!timeStr) return "";
  
    const [rawHours, minutes, seconds] = timeStr.split(":").map(Number);
    if (
      isNaN(rawHours) ||
      isNaN(minutes) ||
      isNaN(seconds)
    ) return "";
  
    const hours = rawHours % 24;
    const isNextDay = rawHours >= 24;
  
    // Create a base date and set hours
    const date = new Date(1970, 0, isNextDay ? 2 : 1, hours, minutes, seconds); // Jan 2 if next day
  
    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  
    return isNextDay ? `${formattedTime}` : formattedTime;
  };
  


  const isNoResult = filteredCourses.length === 0 && (searchTerm || selectedDepartment || selectedPrerequisite || selectedSeat);

  return (
    <>
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-gray-800">
          Explore the courses
        </h2>
      </div>

      <div className="w-full p-4 bg-white rounded-xl">
        {/* Tabs */}
        <div className="grid grid-cols-3 border-b mb-4 bg-[#FCE5F3] rounded-xl">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveTabId(cat.id);
                setSearchTerm("");
                setSortBy("");
                setSelectedDepartment("");
                setSelectedPrerequisite("");
                setSelectedSeat("");
              }}
              className={`w-full px-4 py-4 text-lg rounded-xl font-semibold text-center ${
                activeTabId === cat.id ? "bg-primary text-white" : "text-gray-600"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-2 gap-4">
          {/* Search + Total */}
          <div className="flex flex-col w-full md:w-1/2 gap-2">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search course..."
                className="w-full pl-10 pr-3 py-2 border border-gray-400 rounded-xl text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="w-4 h-4 absolute left-3 top-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 w-full md:w-auto ml-auto justify-end">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-xl text-sm"
            >
              <option value="">Sort by</option>
              <option value="name">Sort by Name</option>
              <option value="seats">Sort by Seat</option>
            </select>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-xl text-sm"
            >
              <option value="">All Departments</option>
              {departmentOptions.map((dep) => (
                <option key={dep} value={dep}>{dep}</option>
              ))}
            </select>

            {prerequisiteOptions.length > 0 && (
              <select
                value={selectedPrerequisite}
                onChange={(e) => setSelectedPrerequisite(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-xl text-sm"
              >
                <option value="">All Prerequisite</option>
                {prerequisiteOptions.map((pre) => (
                  <option key={pre} value={pre}>{pre}</option>
                ))}
              </select>
            )}

            <select
              value={selectedSeat}
              onChange={(e) => setSelectedSeat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-xl text-sm"
            >
              <option value="">All Seats</option>
              {seatOptions.map((seat) => (
                <option key={seat} value={seat}>{seat}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredCourses.length > 0 && (
          <div className="text-black-500 text-base mt-4 mb-4">
            Total available courses: {filteredCourses.length}
          </div>
        )}

        {/* Course Cards */}
            {isNoResult ? (
            <div className="text-center text-gray-500 py-12 text-base col-span-full">
                No courses found matching your criteria.
            </div>
            ) : filteredCourses.length === 0 && !loading ? (
            <div className="text-center text-gray-500 py-12 text-base col-span-full">
                No courses available for this category.
            </div>
            ) : (
            <div className="grid md:grid-cols-3 gap-4">
                {filteredCourses.map((course) => (
                <CourseCard
                    key={course.course_id}
                    title={course.course_name}
                    credits={course.credits}
                    department={course.host_department_name ?? ""}
                    availableSeats={Number(course.available_seats) || 0}
                    maximumSeats={Number(course.maximum_seats) || 0}
                    slots={
                        course.class_slots
                        ? course.class_slots.map((slot) => ({
                            dayOfWeek: slot.day_of_week,
                            startDateTime: formatTime(slot.start_time),
                            endDateTime: formatTime(slot.end_time),
                            }))
                        : []
                    }
                    keywords={course.keywords || "No keyword provided"}
                    description={course.description || "No description provided"}
                    onClick={() => setSelectedCourse(course)}
                    imageUrl={course.image}
                />
                ))}
            </div>
            )}

                <CourseDialog
                open={!!selectedCourse}
                onClose={() => setSelectedCourse(null)}
                course={
                    selectedCourse
                    ? {
                        courseName: selectedCourse.course_name,
                        credits: selectedCourse.credits,
                        hostDepartment: selectedCourse.host_department_name ?? "",
                        availableSeats: Number(selectedCourse.available_seats) || 0,
                        maximumSeats: Number(selectedCourse.maximum_seats) || 0,
                        keywords: selectedCourse.keywords  ?? "",
                        description: selectedCourse.description ?? '',
                        learningoutcomes: selectedCourse.learning_outcomes ?? '',
                        slots: selectedCourse.class_slots
                            ? selectedCourse.class_slots.map((slot) => ({
                                dayOfWeek: slot.day_of_week,
                                startDateTime: slot.start_time,
                                endDateTime: slot.end_time,
                            }))
                            : [],
                        }
                    : null
                }
                />


      </div>
    </>
  );
};

export default CoursesListing;
