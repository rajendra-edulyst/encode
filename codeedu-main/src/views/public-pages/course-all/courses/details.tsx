
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCourseById, featchCourseModules, fetchCourseInstructors, fetchCourseSkillsAndJobRoles } from '@/services/learner/CourseService';
import { Button } from '@/components/ui/ShadcnButton';
import Loading from '@/components/shared/Loading';
import { Star, Clock, Users, BookOpen, ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SEO from '@/components/SEO/SEO';

const CourseDetails = () => {
    const { slugId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();


    const courseId = slugId?.split('-').pop();

    const { data: course, isLoading } = useQuery({
        queryKey: ['public-course-details', courseId],
        queryFn: () => fetchCourseById(courseId),
        enabled: !!courseId,
    });

    const { data: modules } = useQuery({
        queryKey: ['public-course-modules', courseId],
        queryFn: () => featchCourseModules(courseId),
        enabled: !!courseId,
    });

    const { data: instructors } = useQuery({
        queryKey: ['public-course-instructors', courseId],
        queryFn: () => fetchCourseInstructors(courseId),
        enabled: !!courseId,
    });

    const { data: skills } = useQuery({
        queryKey: ['public-course-skills', courseId],
        queryFn: () => fetchCourseSkillsAndJobRoles(courseId),
        enabled: !!courseId,
    });

    const handleEnrollClick = () => {
        const currentPath = location.pathname + location.search;
        navigate(`/sign-in?redirectUrl=${encodeURIComponent(currentPath)}`);
    };

    if (isLoading) {
        return <div className="min-h-screen bg-black flex items-center justify-center"><Loading loading={true} /></div>;
    }

    if (!course) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">Course not found.</div>;
    }

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": course.name || "Course Details",
        "description": course.short_description || course.description || "Learn more about this course."
    };

    return (
        <div className="bg-black text-white pb-20">
            <SEO
                title={`${course.name} | enCODE Course`}
                description={course.short_description || course.description?.replace(/<[^>]*>/g, '').substring(0, 160) || `Learn ${course.name} on enCODE`}
                image={course.image}
                structuredData={structuredData}
            />

            {/* Hero Section */}
            <div className="relative border-b border-gray-800">
                <div className="absolute inset-0 z-0 opacity-20">
                    <img
                        src={course.image || '/img/default-course.jpg'}
                        alt="Course Banner"
                        loading="lazy"
                        className="w-full h-full object-cover blur-sm"
                    />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-20 lg:py-32 flex flex-col md:flex-row gap-12 items-start">
                    <div className="flex-1">
                        <div className="mb-4">
                            <span className="bg-codeblue/20 text-codeblue border border-codeblue/30 px-3 py-1 rounded-full text-sm font-medium">
                                {course.category_name || 'Technology'}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight">
                            {course.name}
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl">
                            {course.short_description || "Discover comprehensive concepts and build real-world projects with this expertly crafted course."}
                        </p>

                        <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-10">
                            <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-gray-300" /> {course.duration || 'Flexible'} Duration</div>
                            <div className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-gray-300" /> {course.level || 'Beginner'} Level</div>
                            <div className="flex items-center gap-2 text-yellow-500"><Star className="w-5 h-5 fill-current" /> {course.rating || '4.8'} Rating</div>
                            <div className="flex items-center gap-2"><Users className="w-5 h-5 text-gray-300" /> {course.learners_count || '1,200+'} Learners</div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button onClick={handleEnrollClick} className="bg-codeblue hover:bg-codeblue/90 text-white font-semibold px-8 py-6 rounded-xl text-lg w-full sm:w-auto h-auto">
                                Login to Enroll
                            </Button>
                            <Button onClick={handleEnrollClick} variant="outline" className="border-gray-700 hover:bg-gray-800 text-white font-semibold px-8 py-6 rounded-xl text-lg w-full sm:w-auto h-auto">
                                Sign Up to Start Learning
                            </Button>
                        </div>
                    </div>
                    <div className="w-full md:w-[400px] rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                        <img
                            src={course.image || '/img/default-course.jpg'}
                            alt={course.name}
                            loading="lazy"
                            className="w-full aspect-video object-cover"
                        />
                    </div>
                </div>
            </div>


            <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
                <div className="lg:col-span-2 space-y-16">

                    <section>
                        <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-4">About This Course</h2>
                        <div className="text-gray-300 leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: course.description || 'Detailed description coming soon.' }} />
                    </section>


                    {course.learning_outcomes && (
                        <section>
                            <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-4">What You&apos;ll Learn</h2>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {course.learning_outcomes.split('\n').map((outcome: string, idx: number) => (
                                    outcome.trim() && (
                                        <li key={idx} className="flex items-start gap-3 text-gray-300">
                                            <div className="mt-1 w-5 h-5 rounded-full bg-codeblue/20 flex items-center justify-center flex-shrink-0">
                                                <div className="w-2 h-2 rounded-full bg-codeblue" />
                                            </div>
                                            <span>{outcome}</span>
                                        </li>
                                    )
                                ))}
                            </ul>
                        </section>
                    )}


                    {skills?.skills && skills.skills.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-4">Skills You&apos;ll Gain</h2>
                            <div className="flex flex-wrap gap-3">
                                {skills.skills.map((skill: Record<string, unknown> | string, idx: number) => (
                                    <span key={idx} className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-gray-300 hover:text-white hover:border-gray-600 transition-colors cursor-default">
                                        {typeof skill === 'string' ? skill : ((skill.name as string) || (skill.skill_name as string) || 'Skill')}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}


                    {modules && modules.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-4">Course Curriculum</h2>
                            <Accordion type="single" collapsible className="w-full">
                                {modules.map((module: Record<string, unknown> | any, idx: number) => (
                                    <AccordionItem key={idx} value={`item-${idx}`} className="border-gray-800">
                                        <AccordionTrigger className="text-left text-lg hover:text-codeblue transition-colors hover:no-underline">
                                            Module {idx + 1}: {module.name || module.module_name || 'Module'}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-gray-400">
                                            <div className="space-y-3 pt-2">
                                                {module.topics && module.topics.length > 0 ? (
                                                    module.topics.map((topic: Record<string, unknown> | any, tIdx: number) => (
                                                        <div key={tIdx} className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg border border-gray-800/50">
                                                            <BookOpen className="w-4 h-4 text-gray-500" />
                                                            <span>{topic.name || topic.topic_name}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="pl-7">Module content available upon enrollment.</div>
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </section>
                    )}
                </div>


                <div className="space-y-10">

                    <section className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
                        <h3 className="text-xl font-bold mb-6 text-white">Your Instructor</h3>
                        {instructors?.instructor && instructors.instructor.length > 0 ? (
                            instructors.instructor.map((inst: Record<string, unknown> | any, idx: number) => (
                                <div key={idx} className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-800 last:border-0 last:mb-0 last:pb-0">
                                    <div className="w-16 h-16 rounded-full bg-gray-800 overflow-hidden flex-shrink-0">
                                        <img src={inst.avatar || inst.profile_image || '/img/avatars/thumb-1.jpg'} alt={inst.name || 'Instructor'} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">{inst.name || inst.first_name + ' ' + inst.last_name || 'Instructor'}</h4>
                                        <p className="text-sm text-gray-400">{inst.designation || inst.title || 'Expert Instructor'}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gray-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                    <Users className="w-6 h-6 text-gray-500" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">enCODE Faculty</h4>
                                    <p className="text-sm text-gray-400">Industry Experts</p>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
