import React, { useMemo } from 'react'
import { Link } from 'react-router-dom';
import { PreAssignCourse } from "@/@types/learner/Courses";
import LoadingSection from '@/components/LoadingSection';
import MyCourseCard from '@/components/MyCourseCard';


interface PreAssignedCoursesProps {
    courses: PreAssignCourse[];
    loading: boolean;
    error: Error | null;
}

const PreAssignedCourses: React.FC<PreAssignedCoursesProps> = ({ courses = [], loading }) => {

    if (loading && courses?.length <= 0) return <LoadingSection isLoading={loading} title='My Courses' description='We are fetching your courses...' />;
    const visibleCourses = useMemo(() => courses?.length && courses?.slice(0, 3), [courses]);



    if (!visibleCourses) return null;

    return (
        <div className="bg-white rounded-lg border p-3">
            <div className='flex items-center justify-between'>
                <h1 className="text-2xl font-bold mb-4 text-primary">
                    My Courses
                </h1>
                <Link to="/courses/enrolled" className="text-primary text-sm">View All</Link>
            </div>
            <div className='grid gird-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-4'>
                {
                    visibleCourses?.map((course) => (
                        <Link key={`course-${course.id}`} to={`/courses/${course?.id}`}>
                            <MyCourseCard course={course} />
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default PreAssignedCourses