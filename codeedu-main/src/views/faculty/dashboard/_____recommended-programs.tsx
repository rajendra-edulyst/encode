import React from "react";
import { Link } from "react-router-dom";
import Loading from "@/components/shared/Loading";
import { Alert } from "@/components/ui";
import { useCourses } from "@/hooks/data/create/useCourses";
import CourseCard from "@/components/CourseCard";


const RecommendedCourses: React.FC = () => {

    const params = new URLSearchParams();
    params.append('limit', '3');
    params.append('page', '1');
    params.append('subscription_type', 'open');
    const { data: coursesData, isLoading, isError, error } = useCourses();

    const courses = coursesData?.data || [];

    if (isLoading && courses?.length <= 0) return <div className='h-96 flex items-center justify-center'>
        <Loading loading={isLoading} /></div>

    if (isError && courses?.length == 0) {
        return <Alert type="danger" title={error.message} />;
    }

    if (courses && courses?.length <= 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg border p-3">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-bold text-primary">
                    Recommended Courses
                </h1>
                {
                    courses?.length > 3 && (
                        <Link to="/courses/recommended" className="text-blue-500 text-sm font-medium">View All</Link>
                    )
                }
            </div>
            <div className='grid gird-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-4'>
                {
                    courses?.splice(0, 3).map((course, index) => (
                        <Link key={`recommended-${index}`} to={`/courses/${course.id}`}>
                            <CourseCard key={course.id} course={course} />
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default RecommendedCourses;