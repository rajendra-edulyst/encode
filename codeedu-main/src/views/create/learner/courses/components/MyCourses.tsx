import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom';
import LoadingSection from '@/components/LoadingSection';
import MyCourseCard from '@/components/MyCourseCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonGroup } from '@/components/ui/button-group';
import { Button } from '@/components/ui/ShadcnButton';
import { useMyCourses } from '@/hooks/data/create/useCourses';
import { mixpanelService } from '@/services/mixpanel/MixpanelService';

type FilterType = 'all' | 'ongoing' | 'completed';

const MyCourses = () => {

    const { data: courses = [], isLoading } = useMyCourses();
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    const filteredCourses = useMemo(() => {
        if (!courses?.length) return [];
        console.log('Filtering courses with filter:', activeFilter);
        switch (activeFilter) {
            case 'ongoing':
                return courses.filter(course => course.completion < 100);
            case 'completed':
                return courses.filter(course => course.completion === 100);
            case 'all':
            default:
                return courses;
        }
    }, [courses, activeFilter]);

    // Show loading state - moved AFTER all hooks
    if (isLoading && courses?.length <= 0) {
        return <LoadingSection isLoading={isLoading} title='My Courses' description='We are fetching your courses...' />;
    }

    // 5 courses or less
    const visibleCourses = filteredCourses.slice(0, 5);

    if (courses.length === 0 && !isLoading) {
        return null;
    }

    return (
        <Card className='dark:bg-[#1D1D1D]'>
            <CardHeader className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <CardTitle className='text-primary text-lg md:text-[28px]'>My Courses</CardTitle>
                <CardAction>
                    <ButtonGroup className='rounded-xl'>
                        <Button variant={activeFilter === 'all' ? 'default' : 'outline'} className={`w-full rounded-none rounded-l-md border dark:text-white md:px-10 bg-[#5A5A5A] ${activeFilter === 'all' && 'bg-primary'}`} onClick={() => setActiveFilter('all')}>All</Button>
                        <Button variant={activeFilter === 'ongoing' ? 'default' : 'outline'} className={`w-full md:px-10 ${activeFilter === 'ongoing' ? 'bg-primary text-white' : 'bg-[#5A5A5A] dark:text-white'}`} onClick={() => setActiveFilter('ongoing')}>Ongoing</Button>
                        <Button variant={activeFilter === 'completed' ? 'default' : 'outline'} className={`w-full rounded-none  dark:text-white rounded-r-md border bg-[#5A5A5A] ${activeFilter === 'completed' && 'text-white bg-primary'}`} onClick={() => setActiveFilter('completed')}>Completed</Button>
                    </ButtonGroup>
                </CardAction>
            </CardHeader>
            <CardContent>
                <div className='flex justify-end mb-4'>
                    <Link to="/my-courses" className="text-primary underline font-medium" onClick={() => mixpanelService.track("My Courses View All Clicked")}>
                        View All
                    </Link>
                </div>
                <LoadingSection isLoading={isLoading} title='My Courses' description='We are fetching your courses...' />
                {visibleCourses?.length > 0 && (
                    <Carousel className="w-full">
                        <CarouselContent>
                            {visibleCourses.map((course) => (
                                <CarouselItem key={`course-${course.id}`} className="md:basis-1/2 lg:basis-1/2 2xl:basis-1/3">
                                    <Link to={`/my-course/details/${course.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'course'}-${course.id}?enroll_disabled=1`} state={{ courseSource: 'my-courses' }} onClick={() => mixpanelService.track("My Courses Course Viewed", { course_id: course.id, course_name: course.name })}>
                                        <MyCourseCard course={course} />
                                    </Link>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className='border-primary border w-12 h-12 text-primary border-2 bg-[#1D1D1D]' />
                        <CarouselNext className='border-primary border w-12 h-12 text-primary border-2 bg-[#1D1D1D]' />
                    </Carousel>
                )}
                {
                    (visibleCourses?.length === 0 && activeFilter !== 'all') && (
                        <div className='py-10 text-center text-muted-foreground'>
                            No {activeFilter === 'ongoing' ? 'ongoing' : 'completed'} courses found.
                        </div>
                    )
                }
                {
                    (visibleCourses?.length === 0 && activeFilter === 'all') && (
                        <div className='py-10 text-center text-muted-foreground'>
                            You have not enrolled in any courses yet. <br />
                            <Link to='/courses' className='text-primary hover:underline'>Browse courses</Link> to get started.
                        </div>
                    )
                }
            </CardContent>
            <CardFooter></CardFooter>
        </Card>
    )
}

export default MyCourses