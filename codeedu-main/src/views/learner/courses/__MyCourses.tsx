import Loading from "@/components/shared/Loading";
import { Alert } from "@/components/ui";
import { Link } from "react-router-dom";
import { useMyCourses } from "@/hooks/data/create/useCourses";
import MyCourseCard from "@/components/MyCourseCard";


function MyCourses() {
    const { data: courses = [], isLoading, isError } = useMyCourses();

    if (isLoading && courses?.length <= 0) return <div className='h-96 flex items-center justify-center'>
        <Loading loading={isLoading} /></div>;

    if (isError) {
        return <Alert type="danger" title={JSON.stringify(isError)} />;
    }

    if (!courses) return <Alert type="info" title="No Enrolled Courses Found" />;

    return (
        <>
            {
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {
                        courses?.map((course) => (
                            <Link key={`course-${course.id}`} to={`/courses/${course?.id}`}>
                                <MyCourseCard course={course} />
                            </Link>
                        ))
                    }
                    {
                        courses?.length === 0 && <Alert type="info" title="No courses available" />
                    }
                </div >
            }
        </>
    )
}

export default MyCourses