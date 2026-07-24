import React from "react";
import { Link } from "react-router-dom";
import { Alert } from "@/components/ui";
import { useRecommendedCourses } from "@/hooks/data/create/useCourses";
import CourseCard from "@/components/CourseCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSection from "@/components/LoadingSection";
import { mixpanelService } from '@/services/mixpanel/MixpanelService';

const RecommendedCourses: React.FC = () => {
    const params = new URLSearchParams();
    params.append('limit', '50');
    params.append('page', '1');

    const PREPARATORY_COURSE_IDS = [9320, 9313, 9327, 9334];
    const { data: coursesData, isLoading, isError, error } = useRecommendedCourses(params);
    const allCourses = coursesData?.data || [];

    const courses = allCourses.filter(course => !PREPARATORY_COURSE_IDS.includes(Number(course.id)));

    if (isError && courses?.length == 0) {
        return <Alert type="danger" title={error.message} />;
    }

    if (courses && courses?.length <= 0 && !isLoading) {
        return null;
    }

    const displayCourses = courses.slice(0, 6);

    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-primary text-lg md:text-[28px]'>Recommended Courses</CardTitle>
                <CardAction>
                    <Link to="/courses/recommended" className="text-primary hover:underline font-medium" onClick={() => mixpanelService.track("Recommended Courses View All Clicked")}>
                        View All
                    </Link>
                </CardAction>
            </CardHeader>
            <CardContent>
                <LoadingSection isLoading={isLoading} title="Recommended Courses" />
                <Carousel className="w-full">
                    <CarouselContent>
                        {displayCourses.map((course, index) => (
                            <CarouselItem key={`recommended-${course.id}-${index}`} className="md:basis-1/2 lg:basis-1/2 2xl:basis-1/3">
                                <Link to={`/recommended-courses/details/${course.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'course'}-${course.id}?enroll_disabled=1`} state={{ courseSource: 'recommended' }} onClick={() => mixpanelService.track("Recommended Course Viewed", { course_id: course.id, course_name: course.name })}><CourseCard course={course} /></Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className='border-primary border w-12 h-12 text-primary border-2 bg-[#1D1D1D]' />
                    <CarouselNext className='border-primary border w-12 h-12 text-primary border-2 bg-[#1D1D1D]' />
                </Carousel>
            </CardContent>
        </Card>
    );
}

export default RecommendedCourses;