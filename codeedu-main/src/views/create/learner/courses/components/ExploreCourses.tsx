import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import Loading from "@/components/shared/Loading";
import { Alert } from "@/components/ui";
import { useCourses } from "@/hooks/data/create/useCourses";
import CourseCard from "@/components/CourseCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mixpanelService } from '@/services/mixpanel/MixpanelService';

const ExploreCourses: React.FC = () => {
    const params = new URLSearchParams();
    params.append('limit', '6');
    params.append('page', '1');
    params.append('type', 'close');

    const { data: coursesData, isLoading, isError } = useCourses(params);
    const courses = coursesData?.data || [];

    const displayCourses = useMemo(() => {
        return [...courses].sort(() => Math.random() - 0.5).slice(0, 6);
    }, [courses]);

    if (isLoading && courses?.length <= 0) return (
        <div className='h-96 flex items-center justify-center'>
            <Loading loading={isLoading} />
        </div>
    );

    if (isError) {
        return <Alert type="danger" title={isError} />;
    }

    if (courses?.length <= 0) {
        return null;
    }



    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-primary text-lg md:text-[28px]'> Explore More Courses</CardTitle>
                <CardAction>
                    {courses?.length > 3 && (
                        <Link to="/courses/explore" className="text-primary hover:underline font-medium" onClick={() => mixpanelService.track("Explore More Courses View All Clicked")}>
                            View All
                        </Link>
                    )}
                </CardAction>
            </CardHeader>
            <CardContent>
                <Carousel className="w-full">
                    <CarouselContent>
                        {displayCourses.map((course, index) => {
                            return (
                                <CarouselItem key={`recommended-${course.id}-${index}`} className="md:basis-1/2 lg:basis-1/2 2xl:basis-1/3">
                                    <Link to={`/explore-courses/details/${course.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'course'}-${course.id}?enroll_disabled=1`} state={{ courseSource: 'explore' }} onClick={() => mixpanelService.track("Explore More Course Viewed", { course_id: course.id, course_name: course.name })}><CourseCard course={course} /></Link>
                                </CarouselItem>
                            );
                        })}
                    </CarouselContent>
                    <CarouselPrevious className='border-primary border w-12 h-12 text-primary border-2 bg-[#1D1D1D]' />
                    <CarouselNext className='border-primary border w-12 h-12 text-primary border-2 bg-[#1D1D1D]' />
                </Carousel>
            </CardContent>
        </Card>
    );
}

export default ExploreCourses;