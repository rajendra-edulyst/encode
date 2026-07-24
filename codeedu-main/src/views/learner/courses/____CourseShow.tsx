import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { saveUserCourseLead } from '@/services/learner/CourseService';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/ShadcnButton';
import ContentTypeIcons from '@/views/player/content/icons';
import { useQueryClient } from '@tanstack/react-query';
import { useCourse, useCourseModuleDetails } from '@/hooks/data/create/useCourses';
import LoadingSection from '@/components/LoadingSection';
import Breadcrumb from "@/components/breadcrumb";
import SafeHtml from "@/components/SafeHtml";
import { Faculty } from "@/@types/learner/Courses";
import { FaStar } from "react-icons/fa6";

const CourseShow: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [whyChooseThisCourse, setWhyChooseThisCourse] = useState<string>('');
    const [tab, setTab] = useState('about');
    const [activeModuleId, setActiveModuleId] = useState<number | null>(null);
    const [enrollDialog, setEnrollDialog] = useState(false);
    const queryClient = useQueryClient();

    const { data: course, refetch: fetchCourse, isLoading: loading } = useCourse(id);
    const { data: activeModule, isLoading: moduleLoading, isError: moduleIsError, error: moduleError } = useCourseModuleDetails(activeModuleId ? String(activeModuleId) : undefined);

    const courseDuration = useMemo(() => {
        if (!course?.start_date || !course?.end_date) return null;
        return `${new Date(course.start_date).toLocaleDateString('en-US', {
            month: 'long', day: '2-digit', year: 'numeric'
        })} to ${new Date(course.end_date).toLocaleDateString('en-US', {
            month: 'long', day: '2-digit', year: 'numeric'
        })}`;
    }, [course?.start_date, course?.end_date]);

    const instructors = useMemo(() => course?.program_faculty ?? [], [course?.program_faculty]);


    useEffect(() => {
        if (tab === "modules" && course?.modules?.length) {
            setActiveModuleId(prev => prev ?? course.modules[0].id);
        }
    }, [tab, course?.modules]);


    if (loading) return <LoadingSection isLoading={loading} title='Loading Course details ...' description='Please wait a moment.' />;

    const breadcrumbItems = [
        { label: 'Courses', path: '/courses/explore' },
        { label: course?.name || 'Course Details' }
    ];

    const enrollNow = async () => {
        setEnrollDialog(false);
        const result = await Swal.fire({
            title: 'Request Now',
            text: 'Are you sure you want to request in this course?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes, Request Now',
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
                Swal.fire('Request Sent!', 'You have successfully submitted your enrollment request.', 'success');
                // fetch course again
                queryClient.invalidateQueries({ queryKey: ['mycourses'] });
                fetchCourse();
            } catch (err) {
                console.log(err);
                Swal.fire('Failed!', 'Failed to enroll in this course. Please try again later.', 'error');
            }
        }
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />
            <div className='bg-white p-6 rounded-lg shadow-sm mb-5'>
                <div className='flex space-x-5 mb-5 items-center '>
                    <div>
                        <img src={course?.image ?? 'https://via.placeholder.com/500'} alt={course?.name} className="w-60 h-auto rounded-lg" />
                    </div>
                    <div className='flex-1'>
                        <h1 className="text-xl md:text-3xl font-bold mb-2">{course?.name}</h1>
                        <div className='flex items-center space-x-2 mb-3'>
                            <img src={course?.organization?.organization_logo} alt={course?.organization?.name} className="w-5 h-5 object-contain rounded-full bg-gray-100 border" />
                            <h4 className="font-semibold text-sm line-clamp-2">{course?.organization?.name}</h4>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm mb-0"><span className='font-semibold text-gray-500'>Leader:</span> <span className="text-cblck font-bold">{course?.course_leader_name || '-'}</span> </p>
                            <p className="text-sm mb-0"><span className='font-semibold text-gray-500'>Duration:</span> <span className="text-cblck font-bold">{courseDuration}</span> </p>
                            <p className="text-sm mb-0"><span className='font-semibold text-gray-500'>Number of Credits:</span> <span className="text-cblck font-bold">{course?.course_meta?.number_of_credits || '-'}</span> </p>
                            <InstructorsDisplay instructors={instructors} subscriptionType={course?.subscription_type || 'open'} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto p-4 bg-white rounded-lg shadow-sm mt-5">
                <div className="grid grid-cols-1 divide-y md:grid-cols-5 md:divide-y-0 md:divide-x text-center">
                    <div className="p-3">
                        <div className="text-xl font-semibold text-primary capitalize">
                            {course?.course_meta?.nature || '-'}
                        </div>
                        <div className="text-base text-gray-500">Course Nature</div>
                    </div>
                    <div className="p-3">
                        <div className="text-xl font-semibold text-primary capitalize">
                            {course?.course_meta?.mode_of_delivery || '-'}
                        </div>
                        <div className="text-base text-gray-500">Type Of Delivery</div>
                    </div>
                    <div className="p-3">
                        <div className="text-xl font-semibold text-primary">
                            {course?.course_meta?.duration ? `${course?.course_meta?.duration} Hours` : '-'}
                        </div>
                        <div className="text-base text-gray-500">Duration</div>
                    </div>
                    <div className="p-3 cursor-pointer" onClick={() => { setTab('about'); scrollToSection('skills-you-will-gain'); }}>
                        <div className="text-xl font-semibold text-primary">
                            {course?.course_skills ? course?.course_skills.split(',').length : '0'}
                        </div>
                        <div className="text-base text-gray-500">Skills</div>
                    </div>
                    <div className="p-3 cursor-pointer" onClick={() => { setTab('about'); scrollToSection('skills-you-will-gain'); }}>
                        <div className="text-xl font-semibold text-primary flex items-center justify-center gap-1">
                            <FaStar size={15} className='text-yellow-500' /> {course?.course_meta?.rating || '-'}
                        </div>
                        <div className="text-base text-gray-500">Rating</div>
                    </div>
                </div>
            </div>


            <div className="mx-auto p-4 bg-white rounded-lg shadow-sm mt-5">
                <nav className="border-b border-gray-200 mb-4 sticky top-16 bg-white z-10 w-full flex justify-between items-center">
                    <ul className="flex flex-wrap -mb-px text-sm font-medium text-gray-500">
                        {
                            <li className="mr-6">
                                <button className={`inline-block p-3 ${tab === 'about' ? 'text-primary border-pink-500 border-b-2' : 'hover:text-gray-600'}`} onClick={() => setTab('about')}>Course Info</button>
                            </li>
                        }
                        {
                            course?.is_course_assigned &&
                            <li className="mr-6">
                                <button className={`inline-block p-3 ${tab === 'modules' ? 'text-primary border-pink-500 border-b-2' : 'hover:text-gray-600'}`} onClick={() => setTab('modules')}>Modules</button>
                            </li>
                        }
                    </ul>
                    {course?.subscription_type === 'open' && !course?.is_course_assigned && (
                        <div className="space-y-4 mb-2">
                            <button
                                className="bg-primary hover:bg-blue-900 text-white px-8 py-3 rounded-md font-medium transition-colors w-full md:w-auto"
                                onClick={enrollNow}
                            >
                                Request Now
                            </button>
                        </div>
                    )}
                    {course?.subscription_type !== 'open' && !course?.is_course_assigned && (
                        course?.is_map_id ? (
                            <div className="space-y-4 mb-2">
                                <Button variant="outline"
                                    onClick={() => {
                                        Swal.fire('Already Requested!', 'Request to enroll in this course is already sent.', 'info');
                                    }}
                                >
                                    Pending
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4 mb-2">
                                <button
                                    className="bg-primary hover:bg-blue-900 text-white px-8 py-3 rounded-md font-medium transition-colors w-full md:w-auto"
                                    onClick={() => setEnrollDialog(true)}
                                >
                                    Enroll Now
                                </button>
                            </div>
                        )
                    )}
                </nav>
                {tab === 'about' && (
                    <section>
                        <SafeHtml html={course?.description ?? ''} className="text-gray-800" />
                        <HtmlBlock title="About Course" html={course?.course_meta?.about_course} />
                        <HtmlBlock title="Degree" html={course?.course_meta?.degree} />
                        <HtmlBlock title="Eligibility" html={course?.course_meta?.eligibility} />
                        <HtmlBlock title="Field of Study" html={course?.course_meta?.field_of_study} />
                        <HtmlBlock title="School Department" html={course?.course_meta?.school_department} />
                        <HtmlBlock title="Tuition Fee" html={course?.course_meta?.tuition_fee} />
                        <HtmlBlock title="Language" html={course?.course_meta?.language} />
                        <HtmlBlock title="Scholarship" html={course?.course_meta?.scholarship} />
                        <HtmlBlock title="How to Apply" html={course?.course_meta?.how_to_apply} />
                        <HtmlBlock title="Course Structure" html={course?.course_meta?.course_structure} />
                        <HtmlBlock title="Learning Outcome" html={course?.course_meta?.learning_outcome} />
                        <HtmlBlock title="Partners" html={course?.course_meta?.partners} />
                        <HtmlBlock title="Collaboration" html={course?.course_meta?.collaboration} />
                        <HtmlBlock title="Career Opportunities" html={course?.course_meta?.career_opportunities} />
                        <HtmlBlock title="Course USP" html={course?.course_meta?.course_usp} />
                        <HtmlBlock title="What You Will Get" html={course?.course_meta?.what_you_will_get} />
                        <div id="skills-you-will-gain" className="mt-6">
                            <h2 className="text-2xl font-bold mb-2">{`Skills you'll gain`}</h2>
                            <div className="flex flex-wrap gap-3">
                                {course?.course_skills?.split(',').map((skill, index) => (
                                    <span key={`skill-${index}`} className="px-4 py-2 bg-gray-100 hover:text-primary cursor-pointer rounded-md text-gray-700 hover:bg-gray-200 transition-colors">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
                {course?.is_course_assigned && tab === 'modules' && (
                    <section>
                        <h2 className="text-xl font-bold mb-3 text-cblack">
                            {/* There {course?.modules?.length === 1 ? "is" : "are"} {course?.modules?.length} module{course && course?.modules?.length > 1 ? 's' : ''} in this course */}
                            {course?.modules?.length === 0 && "No Content"}
                        </h2>
                        {course?.modules?.map((module, index) => (
                            <div key={`module-${index}`} className="border border-gray-200 p-4 rounded-lg mb-4 hover:shadow-md hover:border-primary transition-all group cursor-pointer" onClick={() => setActiveModuleId(module?.id)}>
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold group-hover:text-primary capitalize">{module?.name}</h3>
                                    <div className="flex items-center space-x-1">
                                        <button className="p-2">
                                            {activeModuleId === module?.id ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                                        </button>
                                    </div>
                                </div>
                                {activeModuleId === module?.id && (
                                    <div className="mt-3 border-t border-gray-300 pt-3 transition-all">
                                        <p className="text-gray-600 line-clamp-3"
                                            dangerouslySetInnerHTML={{ __html: module?.description }}
                                        ></p>
                                        <div className='mt-3'>
                                            {moduleLoading && <LoadingSection isLoading={moduleLoading} title='Loading module contents ...' description='Please wait a moment.' />}
                                            {!moduleLoading && activeModule?.contents?.map((content, index) => (
                                                <Link
                                                    key={`content-${index}`}
                                                    to={`/courses/${course?.id}/modules/${module?.id}?content_id=${content?.program_content_id}`}
                                                    className="text-gray-600 block bg-white p-3 mb-1 rounded border border-transparent hover:border-gray-200 transition-all hover:text-primary">
                                                    <div className='w-full flex justify-between items-center'>
                                                        <div className='flex items-center gap-3'>
                                                            <ContentTypeIcons content_type={content?.content_type} />
                                                            <div>
                                                                <h3 className="text-sm font-bold mb-0 text-left capitalize">{content?.title}</h3>
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
                                                        <div>
                                                            {/* prcentage */}
                                                            <div className="relative w-10 h-10">
                                                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                                                    <circle className="text-gray-200 stroke-current" strokeWidth="10" cx="50" cy="50" r="40" fill="transparent" />
                                                                    <circle className={`${content?.completion == 100 ? 'text-green-500' : 'text-blue-500'}  stroke-current`} strokeWidth="10" cx="50" cy="50" r="40" fill="transparent"
                                                                        strokeDasharray="251.2" strokeDashoffset={`calc(251.2 - (251.2 * ${content?.completion ?? 0}) / 100)`} strokeLinecap="round" />
                                                                </svg>
                                                                <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-gray-700">
                                                                    {content?.completion ?? 0}%
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                            {moduleIsError && <div className="text-red-500 py-3 rounded hover:border-primary transition-all hover:text-primary">
                                                {moduleError?.message || 'Failed to load contents. Please try again.'}
                                            </div>
                                            }
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
                )
                }
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
        </div >
    );
};

export default CourseShow;

const HtmlBlock = ({ title, html }: { title: string, html?: string }) => {
    if (!html) return null;
    return (
        <div className="mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <SafeHtml html={html} className="text-gray-800" />
        </div>
    );
};

const InstructorsDisplay: React.FC<{ instructors: Faculty[]; subscriptionType: string }> = ({ instructors, subscriptionType }) => {
    return (
        <div className="flex items-center space-x-2 mt-2">
            <span className="text-sm text-gray-500 font-semibold">Instructors:</span>
            {subscriptionType === 'paid' && instructors?.length ? (
                <div className="flex -space-x-3">
                    {instructors.map((instructor, index) => (
                        instructor.name && (
                            <div
                                key={index}
                                className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white bg-center bg-cover"
                                style={{ backgroundImage: `url('${instructor.image ?? `https://ui-avatars.com/api/?name=${instructor.name}`}')` }}
                            />
                        )
                    ))}
                </div>
            ) : (
                <div className="flex -space-x-3">
                    <h6>Self Paced</h6>
                </div>
            )}
            {instructors?.length ? (
                <div className="text-sm">
                    <a className="text-primary">{instructors[0].name}</a>
                    {instructors.length > 1 && <span> +{instructors.length - 1} more</span>}
                </div>
            ) : (
                <div className="text-sm">
                    <span>Instructors: </span>
                    <span className="text-gray-600">No instructors found</span>
                </div>
            )}
        </div>
    );
};