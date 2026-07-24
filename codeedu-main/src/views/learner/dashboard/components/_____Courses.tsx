import React from "react";
import { Link } from "react-router-dom";
import Loading from "@/components/shared/Loading";
import { Alert } from "@/components/ui";
import { useCourses } from "@/hooks/data/create/useCourses";
import CourseCard from "@/components/CourseCard";


const Courses: React.FC = () => {

    const params = new URLSearchParams();
    params.append('limit', '3');
    params.append('page', '1');
    params.append('subscription_type', 'paid');
    //  params.append('is_assigned', 'false');
    const { data: coursesData, isLoading, isError } = useCourses(params);

    const courses = coursesData?.data || [];

    if (isLoading && courses?.length <= 0) return <div className='h-96 flex items-center justify-center'>
        <Loading loading={isLoading} /></div>

    if (isError) {
        return <Alert type="danger" title={isError} />;
    }

    if (courses?.length <= 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg border p-3">
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-2xl font-bold text-primary">
                    Explore More Courses
                </h1>
                <Link to="/courses/explore" className="text-blue-500 hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {
                    courses?.splice(0, 3).map((course, index) => (
                        <Link key={`explore-${index}`} to={`/courses/${course.id}`}>
                            <CourseCard key={course.id} course={course} />
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default Courses