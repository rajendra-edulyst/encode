import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/shadcnAlert'
import Heading from '@/components/heading'
import { Button } from '@/components/ui/ShadcnButton'
import { Loader, RefreshCcw, Search, FileText } from 'lucide-react'
import { Input } from '@/components/ui/ShadcnInput'
import { toast } from 'sonner'
import { useCourseCategories, useMyCourses } from '@/hooks/data/create/useCourses'
import { useQueryClient } from '@tanstack/react-query'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import MyCourseCard from '@/components/MyCourseCard'
import { PreAssignCourse } from '@/@types/learner/Courses'
import Breadcrumb from '@/components/breadcrumb'

function index() {

    const [searchQuery, setSearchQuery] = useState('');
    const [fakeLoading, setFakeLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    const queryClient = useQueryClient();
    const [selectedMode, setSelectedMode] = useState<string>('');

    const { data: courses = [], isLoading, isError } = useMyCourses();
    const { data: categories = [], isError: isErrorCategories, isLoading: isLoadingCategories } = useCourseCategories();

    const uniqueModes = Array.from(new Set(courses?.map((c: PreAssignCourse) => c?.course_meta_data?.mode_of_delivery).filter(Boolean)));

    const filteredCourses = courses?.filter((course: PreAssignCourse) => {
        const courseCategoryId = course.category_id ?? course["category_id"];
        const matchesSearch = searchQuery
            ? course.name.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        const matchesCategory =
            !selectedCategory || selectedCategory === "all"
                ? true
                : String(courseCategoryId) === String(selectedCategory);
        const matchesMode =
            !selectedMode || selectedMode === "all"
                ? true
                : course?.course_meta_data?.mode_of_delivery?.toLowerCase() === selectedMode.toLowerCase();

        return matchesSearch && matchesCategory && matchesMode;
    }).sort((a: PreAssignCourse, b: PreAssignCourse) => {
        const aIsPaid = a?.subscription_type?.toLowerCase() === 'paid';
        const bIsPaid = b?.subscription_type?.toLowerCase() === 'paid';
        if (aIsPaid && !bIsPaid) return -1;
        if (!aIsPaid && bIsPaid) return 1;
        return 0;
    });

    const hasActiveFilters = searchQuery || (selectedCategory && selectedCategory !== 'all') || (selectedMode && selectedMode !== 'all');
    const isEmptyState = !filteredCourses || filteredCourses.length === 0;

    const refreshData = () => {
        queryClient.invalidateQueries({ queryKey: ['mycourses'] });
        setFakeLoading(true);
        setTimeout(() => {
            setFakeLoading(false);
        }, 1000);
        toast.success('Courses refreshed successfully!');
    };

    const breadcrumbItems = [
        // { label: 'Courses', path: '/courses/explore' },
        { label: 'My Courses' }
    ];

    return (
        <section>
            <Breadcrumb items={breadcrumbItems} />
            <div className='flex flex-col gap-2'>
                <div className='md:flex justify-between items-center'>
                    <Heading title="My Courses" description="List of courses you are enrolled in" className='mb-3' />
                    <div className='flex flex-wrap items-center gap-2'>
                        <div>
                            <Select disabled={isLoadingCategories || isErrorCategories} value={selectedCategory} onValueChange={(value) => setSelectedCategory(value)}>
                                <SelectTrigger className='w-40'>
                                    <SelectValue placeholder="Filter by Domain" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Domain</SelectLabel>
                                        <SelectItem value="all">All</SelectItem>
                                        {
                                            categories?.map((category) => (
                                                <SelectItem key={category.id} value={category?.id?.toString()}>{category.name}</SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Select value={selectedMode} onValueChange={(value) => setSelectedMode(value)}>
                                <SelectTrigger className='w-40'>
                                    <SelectValue placeholder="Delivery Mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Mode of Delivery</SelectLabel>
                                        <SelectItem value="all">All</SelectItem>
                                        {uniqueModes.map((mode) => (
                                            <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='relative'>
                            <Input placeholder="Search courses..." className='focus-visible:ring-0 pl-8' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            <Search className='absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-500' size={16} />
                        </div>
                        <Button size={'icon'} variant="outline" className='ml-2' onClick={refreshData}><RefreshCcw className={`${fakeLoading ? 'animate-spin' : ''}`} /></Button>
                    </div>
                </div>

                {filteredCourses && filteredCourses.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {filteredCourses.map((course) => (
                            <Link
                                key={`course-${course.id}`}
                                to={`/my-course/details/${course.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'course'}-${course.id}?enroll_disabled=1`}
                                state={{ courseSource: 'my-courses' }}
                                className="h-full"
                            >
                                <MyCourseCard course={course} />
                            </Link>
                        ))}
                    </div>
                )}

                {isEmptyState && !isLoading && !isError && (
                    <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg text-center">
                        <FileText className="w-16 h-16 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            {hasActiveFilters ? "No Courses Found with your search" : "No Courses Yet"}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {hasActiveFilters ? "No courses found with your search criteria." : "Nothing here... but it's your canvas!"}
                        </p>
                        <Button asChild className="text-white">
                            <Link to="/courses/explore">
                                + Explore Courses
                            </Link>
                        </Button>
                    </div>
                )}

                {isLoading && (
                    <div className="flex justify-center items-center flex-col h-32 border rounded-md">
                        <Loader className="animate-spin mb-2" size={30} />
                        <p className='mb-0'>please wait while we load your courses...</p>
                    </div>
                )}

                {isError && (
                    <div className="flex justify-center items-center flex-col h-32">
                        <Alert variant="destructive">
                            <AlertTitle>Error loading courses</AlertTitle>
                            <AlertDescription>
                                <p className='mb-0'>There was an error loading your courses. Please try again later.</p>
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
            </div>
        </section>
    )
}

export default index