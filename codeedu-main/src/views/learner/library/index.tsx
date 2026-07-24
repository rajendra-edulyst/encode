import React, { useEffect, useState, useCallback, memo } from 'react';
import debounce from 'lodash/debounce';
import { Input } from "@/components/ui/ShadcnInput";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClockIcon, Search } from 'lucide-react';
import { fetchContent } from '@/services/learner/ContentLibraryService';
import { useContentStore } from '@/store/learner/libraryStore';
import ContentTypeIcons from '@/views/player/content/icons';
import Loading from '@/components/shared/Loading';
import { Progress } from '@/components/ui/progress';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Link, useSearchParams } from 'react-router-dom';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


const CourseLibrary: React.FC = () => {

    // searchParams
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState(type || 'all');
    const { contents = [], setContents, loading, setLoading, pagination, setPagination, setError } = useContentStore();
    const [currentPage, setCurrentPage] = useState(1);


    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedLoadContent = useCallback(
        debounce(async (searchTerm, selectedType, currentPage) => {
            setLoading(true);
            setError('');
            try {
                const params = new URLSearchParams();
                if (searchTerm) params.append("query", searchTerm);
                if (selectedType !== "all") params.append("content_type", selectedType);
                if (currentPage) params.append("page", currentPage.toString());
                const data = await fetchContent(params);
                setContents(data.data);
                setPagination(data.pagination);
                window.scrollTo(0, 0);
            } catch (error) {
                setError('An error occurred while fetching content');
                console.error(error);
            } finally {
                setLoading(false);
            }
        }, 700), []);

    useEffect(() => {
        debouncedLoadContent(searchTerm, selectedType, currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, searchTerm, selectedType]);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy':
                return 'bg-green-100 text-green-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'hard':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const renderPaginationLinks = () => {
        const pages = [];
        for (let i = 1; i <= pagination.last_page; i++) {
            pages.push(
                <PaginationItem key={i}>
                    <PaginationLink href="#" isActive={i === pagination.current_page} onClick={() => setCurrentPage(i)}>
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }
        return pages;
    };

    return (
        <div className="min-h-screen w-full overflow-x-hidden">
            <Breadcrumb className='mb-4'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink to="/create">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink to='/course/library'>Course Library</BreadcrumbLink>
                    </BreadcrumbItem>
                    {/* if type */}
                    {selectedType !== 'all' && (
                        <>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className='capitalize'>{selectedType}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </>
                    )}
                </BreadcrumbList>
            </Breadcrumb>

            {/* Hero Section with Background */}
            <div className="relative h-[300px] sm:h-[300px] bg-cover bg-center rounded-t-lg" style={{
                backgroundImage: `url('/img/others/bg-lib.jpg')`
            }}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/50 rounded-t-lg">
                    <div className="container mx-auto px-6 h-full flex items-center">
                        <div className="text-white">
                            <h1 className="text-4xl font-bold mb-4 text-white">Course Content Library</h1>
                            <p className="text-xl opacity-90">Explore our comprehensive collection of learning materials</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 -mt-10 pb-20 relative bg-white dark:bg-gray-900">
                {/* Search and Filter Section */}
                <div className="pt-6">
                    <div className="bg-white dark:bg-black rounded-xl shadow-lg p-6 mb-8">
                        <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-center">
                            <div className="w-full sm:flex-1">
                                <div className="relative">
                                    <Search className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Search courses..."
                                        className="pl-10 bg-gray-50 w-full border focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 dark:bg-black"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Select value={selectedType} onValueChange={(value) => { setSelectedType(value); setCurrentPage(1); }}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Content Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="notes">Notes</SelectItem>
                                    <SelectItem value="video">Video</SelectItem>
                                    <SelectItem value="assignment">Assignment</SelectItem>
                                    <SelectItem value="assessment">Assessment</SelectItem>
                                    <SelectItem value="liveclass">Live Class</SelectItem>
                                    <SelectItem value="offlineclass">Offline Class</SelectItem>
                                    <SelectItem value="interactive">Interactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                {/* Course Grid */}
                {
                    contents.length !== 0 && !loading && (
                        <div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {contents && contents?.map((course) => (
                                    <Link key={course.id} to={`/courses/${course?.module?.skill?.course?.id}/modules/${course?.module?.id}?content_id=${course.id}`} className="block">
                                        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-black">
                                            <div className="p-6">
                                                <div className="flex items-center space-x-3 min-w-0 flex-1">
                                                    <div className={`min-w-10 h-10 overflow-hidden rounded-full flex items-center justify-center border`}>
                                                        {course.content_type && <ContentTypeIcons content_type={course?.content_type} />}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-sm line-clamp-1 break-words">{course.title}</h3>
                                                        <p className="text-xs text-gray-500 line-clamp-2">
                                                            {course?.module?.name?.length > 20 ? course?.module?.name?.substring(0, 20) + '...' : course?.module?.name}&nbsp;|&nbsp;
                                                            {course?.module?.skill?.course?.name?.length > 30 ? course?.module?.skill?.course?.name?.substring(0, 30) + '...' : course?.module?.skill?.course?.name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className='mt-3 flex justify-between items-center gap-3'>
                                                    <Progress value={0} className='h-2 bg-gray-900' />
                                                    {<p className='text-xs text-gray-500 mt-1'>{course.per_completion}0%</p>}
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                            {/* Pagination Controls */}
                            {pagination && pagination.last_page > 1 && (
                                <Pagination className='mt-24'>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious href="#" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} />
                                        </PaginationItem>
                                        {renderPaginationLinks()}
                                        {pagination.current_page < pagination.last_page - 2 && (
                                            <PaginationItem>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        )}
                                        <PaginationItem>
                                            <PaginationNext href="#" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.last_page))} />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            )}
                        </div>
                    )
                }
                {
                    contents.length === 0 && !loading && (
                        <div className="flex items-center justify-center h-96">
                            <p className="text-gray-500">No content found</p>
                        </div>
                    )
                }
                {
                    loading && <Loading loading={loading} />
                }
            </div>
        </div>
    );
};

export default memo(CourseLibrary);