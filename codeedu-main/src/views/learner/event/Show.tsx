import { CourseModule } from '@/@types/learner/Courses';
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { fetchCourseById, fetchModuleByCourseId, saveUserCourseLead } from '@/services/learner/CourseService';
import { useSingleCourseStore } from '@/store/learner/courseStore';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/shadcnTooltip";
import ContentTypeIcons from '@/views/player/content/icons';

const CourseShow: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { setCourse, course, loading, setLoading, error, setError } = useSingleCourseStore();
    const [whyChooseThisCourse, setWhyChooseThisCourse] = useState<string>('');
    const [activeModule, setActiveModule] = useState<CourseModule | null>(null);
    const [moduleLoading, setModuleLoading] = useState<boolean>(false);
    const [moduleError, setModuleError] = useState<string>('');
    const [activeTab, setActiveTab] = useState<number>(0);
    const [enrollDialog, setEnrollDialog] = useState(false);


    const fetchCourse = useCallback(async () => {
        if (!id) {
            setError('Course ID is required');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await fetchCourseById(id);
            setCourse(response);
            if (response?.modules?.length) {
                loadModuleContent(response.modules[0].id);
                setActiveTab(response.modules[0].id);
            }
        } catch (err) {
            console.log(err);
            setError('Failed to fetch course details');
        } finally {
            setLoading(false);
        }
    }, [id, setCourse, setLoading, setError]);

    // load fetch courses api
    useEffect(() => {
        fetchCourse();
    }, [fetchCourse]);

    const loadModuleContent = async (moduleId: number) => {
        setModuleLoading(true);
        try {
            const response = await fetchModuleByCourseId(`${moduleId}`);
            setActiveModule(response);
        } catch (err) {
            console.log(err);
            setModuleError('Failed to fetch module content');
        } finally {
            setModuleLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab) {
            loadModuleContent(activeTab);
        }
    }, [activeTab]);

    const enrollNow = async () => {
        setEnrollDialog(false);
        const result = await Swal.fire({
            title: 'Enroll Now',
            text: 'Are you sure you want to enroll in this course?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes, Enroll Now',
            cancelButtonText: 'No, Cancel',
        });

        if (result.isConfirmed) {
            if (course?.is_course_assigned) {
                return Swal.fire('Already Enrolled!', 'You have already enrolled in this course.', 'info');
            }

            if (!course?.id) {
                return Swal.fire('Course ID not found!', 'Course ID is required to enroll in this course.', 'error');
            }

            if (course?.subscription_type !== 'open' && !whyChooseThisCourse) {
                return Swal.fire('Why Choose This Course?', 'Please tell us why you want to choose this course.', 'info');
            }

            try {
                await saveUserCourseLead({
                    program_id: course?.id,
                    wp_center_id: course?.organization?.id,
                    reason: whyChooseThisCourse ?? ''
                });
                Swal.fire('Enrolled!', 'You have successfully enrolled in this course.', 'success');
                // featch course again 
                fetchCourse();
            } catch (err) {
                console.log(err);
                Swal.fire('Failed!', 'Failed to enroll in this course. Please try again later.', 'error');
            }
        }
    };

    if (loading) return <Loading loading={loading} />;
    if (error) return <Alert title={error} type="danger" />;

    return (
        <div>
            <Breadcrumbs eventName={course?.name} />
            <div className='bg-white p-6 rounded-lg shadow-sm mb-5'>
                <div className='flex space-x-5 mb-5'>
                    <div>
                        <img src={course?.image} alt={course?.name} className="w-56 h-auto rounded-lg" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-3xl font-bold mb-2">
                            {course?.name}
                        </h1>
                        <p className="text-gray-600 mb-2 line-clamp-7"
                            dangerouslySetInnerHTML={{ __html: course?.description ?? '' }}
                        />

                        <div className="flex items-center space-x-2">
                            <div className="flex -space-x-3">
                                {course?.program_faculty?.map((instructor, index) => (
                                    instructor.name && <div key={index} className="h-10 w-10 rounded-full bg-gray-200 border-2 border-white bg-center bg-cover"
                                        style={{ backgroundImage: `url('${instructor?.image ?? 'https://ui-avatars.com/api/?name=' + instructor?.name}')` }}
                                    ></div>
                                ))}
                            </div>
                            {course?.program_faculty ? (
                                <div className="text-sm">
                                    {course?.program_faculty && course?.program_faculty[0].name && <span>Instructors: </span>}
                                    <a href="#" className="text-primary hover:underline">{course?.program_faculty?.[0]?.name}</a>
                                    {course?.program_faculty?.length > 1 && <span> +{course?.program_faculty?.length - 1} more</span>}
                                </div>
                            ) : (
                                <div className="text-sm">
                                    <span>Instructors: </span>
                                    <span className="text-gray-600">No instructors found</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mx-auto p-4 bg-white rounded-lg shadow-sm mt-5">
                <section>
                    <h2 className="text-xl font-bold mb-3">
                        There {course?.modules?.length === 1 ? "is" : "are"} {course?.modules?.length} activity{course && course?.modules?.length > 1 ? 's' : ''} in this event
                    </h2>
                    {course?.modules?.map((module, index) => (
                        <div key={`module-${index}`} className="border border-gray-200 p-4 rounded-lg mb-4 hover:shadow-md hover:border-primary transition-all group cursor-pointer" onClick={() => setActiveTab(module?.id)}>
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold group-hover:text-primary">{module?.name}</h3>
                                <div className="flex items-center space-x-1">
                                    <button className="p-2">
                                        {activeTab === module?.id ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                                    </button>
                                </div>
                            </div>
                            {activeTab === module?.id && (
                                <div className="mt-3 border-t border-gray-300 pt-3 transition-all">
                                    <p className="text-gray-600"
                                        dangerouslySetInnerHTML={{ __html: module?.description ?? '' }}
                                    />
                                    <div className='mt-3'>
                                        {moduleLoading && <div className='h-40'><Loading loading={moduleLoading} /></div>}
                                        {!moduleLoading && activeModule?.contents?.map((content, index) => (
                                            <Link
                                                key={`content-${index}`}
                                                to={`/courses/${course?.id}/modules/${module?.id}?content_id=${content?.program_content_id}`}
                                                className="text-gray-600 flex items-center justify-between bg-white p-3 mb-1 rounded border border-transparent hover:border-gray-200 transition-all hover:text-primary">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <div className='flex items-center gap-3'>
                                                                <ContentTypeIcons content_type={content?.content_type} />
                                                                <div>
                                                                    <h3 className="text-lg font-bold mb-0 text-left">{content?.title}</h3>
                                                                    <div className='flex items-center gap-3'>
                                                                        <div>
                                                                            {content?.content_type === 'video' && <span className=''>Video</span>}
                                                                            {content?.content_type === 'notes' && <span className='text-blue-400'>Notes</span>}
                                                                            {content?.content_type === 'assignment' && <span className='text-purple-700'>Assignment</span>}
                                                                            {content?.content_type === 'assessment' && <span>Assesment</span>}
                                                                            {content?.content_type === 'zoomclass' && <span className='text-blue-700'>Zoom Class</span>}
                                                                        </div>
                                                                        {content?.duration_in_minutes && <div className="flex items-center gap-1">
                                                                            <Clock size={14} />
                                                                            <span className="text-xs text-gray-500">{content?.duration_in_minutes ?? '-'} Min</span>
                                                                        </div>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent className='w-96'>
                                                            <p>{content?.description}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </Link>
                                        ))}
                                        {moduleError && <div className="text-red-500 py-3 rounded hover:border-primary transition-all hover:text-primary">
                                            {moduleError}
                                        </div>}
                                        {!moduleLoading && !activeModule?.contents?.length && (
                                            <div className="text-gray-600 py-3 rounded hover:border-primary transition-all hover:text-primary">
                                                No content found
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </section>
            </div>

            <Dialog open={enrollDialog} onOpenChange={setEnrollDialog}>
                <DialogContent className='bg-white p-6 rounded-lg shadow-lg'>
                    <DialogHeader>
                        <DialogTitle>Why do you want to choose this course?</DialogTitle>
                        <DialogDescription>
                            <textarea
                                value={whyChooseThisCourse}
                                placeholder="Why do you want to choose this course?"
                                className="w-full p-2 border border-gray-200 rounded-md mt-3"
                                rows={5}
                                onChange={(e) => setWhyChooseThisCourse(e.target.value)}
                            ></textarea>
                            <button className="bg-primary hover:bg-blue-900 text-white px-8 py-3 rounded-md font-medium transition-colors w-full mt-3"
                                onClick={enrollNow}
                            >Enroll Now</button>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CourseShow;

const Breadcrumbs: React.FC<{ eventName?: string }> = ({ eventName }) => {
    return (
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <a href="#" className="hover:text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            </a>
            <span>›</span>
            <Link to={'/courses/enrolled'} className="hover:text-blue-600">Events</Link>
            <span>›</span>
            <Link to="#" className="hover:text-blue-600">{eventName}</Link>
        </nav>
    );
};