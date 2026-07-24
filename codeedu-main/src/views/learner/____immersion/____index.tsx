import React, { useState } from "react";
import { Link } from "react-router-dom";
import Loading from "@/components/shared/Loading";
import { Alert } from "@/components/ui";
import Heading from "@/components/heading";
import { Input } from "@/components/ui/ShadcnInput";
import { RefreshCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/ShadcnButton";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useMasterClass } from "@/hooks/data/create/useCourses";


const RecommendedCourses: React.FC = () => {

    const queryClient = useQueryClient();
    const [fakeLoading, setFakeLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { data: courses = [], isLoading, isError } = useMasterClass('1256');

    const filteredCourses = courses.filter(course => searchQuery ? course.name.toLowerCase().includes(searchQuery.toLowerCase()) : true);

    const refreshData = () => {
        queryClient.invalidateQueries({ queryKey: ['masterClass', '1256'] });
        setFakeLoading(true);
        setTimeout(() => {
            setFakeLoading(false);
        }, 1000);
        toast.success('Courses refreshed successfully!');
    };

    if (isLoading && courses?.length <= 0) return <div className='h-96 flex items-center justify-center'>
        <Loading loading={isLoading} /></div>

    if (isError) {
        return <Alert type="danger" title={isError} />;
    }

    if (courses?.length <= 0) {
        return null;
    }

    return (
        <div className="rounded-lg flex flex-col gap-4">
            <div className='flex justify-between items-center'>
                <Heading title="Immersion Programs" description="List of immersion programs available for you" className='mb-0' />
                <div className='flex items-center'>
                    <div className='relative'>
                        <Input placeholder="Search courses..." className='focus-visible:ring-0 pl-8' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        <Search className='absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-500' size={16} />
                    </div>
                    <Button size={'icon'} variant="outline" className='ml-2' onClick={refreshData}><RefreshCcw className={`${fakeLoading ? 'animate-spin' : ''}`} /></Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {
                    filteredCourses?.map((course) => (
                        <Link key={`course-${course.id}`} to={`/courses/${course?.id}`} className="bg-white border rounded-lg shadow overflow-hidden hover:shadow-lg relative hover:transform hover:scale-95 transition-transform duration-300">
                            <div className="relative h-40">
                                <img src={course?.image} alt="Cybersecurity" className="w-full h-full object-cover" />
                                {
                                    course?.subscription_type === "open" && (
                                        <span className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-sm font-medium">Free</span>
                                    )
                                }
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <img src={course?.organization?.logo ?? `https://ui-avatars.com/api/?name=${course?.organization?.name}`} alt="Coursera" className="w-6 h-6 rounded-full" />
                                    <span className="text-sm text-gray-600">{course?.organization?.name}</span>
                                </div>
                                <h3 className="font-semibold mb-5 text-sm line-clamp-3">{course?.name}</h3>
                                <span className="text-sm text-gray-500 absolute bottom-2">Course</span>
                            </div>
                        </Link>
                    ))
                }
                {
                    filteredCourses?.length <= 0 && searchQuery !== '' && !isLoading && !isError && (<div className="text-left">No courses found</div>)
                }
            </div>
        </div>
    )
}

export default RecommendedCourses