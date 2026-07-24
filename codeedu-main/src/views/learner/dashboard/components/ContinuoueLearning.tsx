import React, { useEffect } from "react";
import { useContinueReadingStore } from "@/store/learner/courseStore";
import { fetchContinueReadingCourses } from "@/services/learner/CourseService";
import Loading from "@/components/shared/Loading";
import { Alert } from "@/components/ui";
import { Link } from "react-router-dom";


function ContinuoueLearning() {

    const { courses, loading, error, setCourses, setLoading, setError } = useContinueReadingStore();

    useEffect(() => {
        setLoading(true);
        setError('');
        fetchContinueReadingCourses().then((courses) => {
            setCourses(courses);
        }).catch((error) => {
            setError('Failed to fetch courses');
            console.log(error);
        }).finally(() => {
            setLoading(false);
            console.log("Courses fetched");
        });
    }, [setCourses, setLoading, setError]);

    if (loading && courses?.length <= 0) return <div className='h-96 flex items-center justify-center'>
        <Loading loading={loading} /></div>

    if (error) {
        return <Alert type="danger" title={error} />;
    }

    return (
        <>
            {
                courses.length !== 0 &&
                <div className="bg-white rounded-lg shadow-md p-5 mb-5">
                    <h1 className="text-3xl font-bold mb-3">Continue Learning</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {
                            courses?.map((course) => (
                                <Link key={`course-${course.id}`} to={`/courses/${course?.id}`} className="bg-white rounded-lg shadow-md overflow-hidden relative">
                                    <div className="relative h-40">
                                        <img src={course.image} alt="Cybersecurity" className="w-full h-full object-cover" />
                                        <span className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-sm font-medium">Free</span>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <img src={course?.organization?.logo} alt="Coursera" className="w-6 h-6 rounded-full" />
                                            <span className="text-sm text-gray-600">{course?.organization?.name}</span>
                                        </div>
                                        <h3 className="font-semibold mb-5 text-sm line-clamp-3">{course?.name}</h3>
                                        <span className="text-sm text-gray-500 absolute bottom-2">Course</span>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </div>
            }
        </>
    )
}

export default ContinuoueLearning