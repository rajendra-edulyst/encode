import React, { useCallback, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Star, MapPin, Clock, Info, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/ShadcnButton'
import { useCourses } from '@/hooks/data/create/useCourses'

const COLOR_THEMES = [
    { bg: 'bg-codeblue', text: 'text-codeblue', border: 'border-codeblue' },
    { bg: 'bg-codeyellow', text: 'text-codeyellow', border: 'border-codeyellow' },
    { bg: 'bg-codepink', text: 'text-codepink', border: 'border-codepink' },
    { bg: 'bg-codegreen', text: 'text-codegreen', border: 'border-codegreen' },
];

const TrendingCourses = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    
    const params = useMemo(() => new URLSearchParams({ items: "10" }), []);
    const { data: courseData, isLoading } = useCourses(params);
    const courses = courseData?.data ?? [];

    const scrollPrev = useCallback(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
        }
    }, [])

    const scrollNext = useCallback(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
    }, [])

    return (
        <section className="mb-8">
            <div className="bg-[#1D1D1D] rounded-2xl p-6 md:p-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                        <h2 className="text-[30px] lg:text-[32px] font-semibold text-codegreen">
                        Premium Learning
                    </h2>
                    <p className="mt-2 text-[30px] lg:text-[22px] font-normal leading-[1.1] text-#FFFFFF max-w-3xl">
                        Trending Courses
                     </p>
                </div>
                
                <div className="flex flex-col items-end gap-3">
                    <Link to="/courses/all" className="text-codegreen text-xs hover:underline uppercase tracking-wider font-semibold">
                        View All
                    </Link>
                </div>
            </div>

            <div className="relative group">
                <button 
                    onClick={scrollPrev}
                    className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-codeblue text-codeblue bg-black/90 hover:bg-codeblue hover:text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                    onClick={scrollNext}
                    className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-codeblue text-codeblue bg-black/90 hover:bg-codeblue hover:text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>

                <style>{`
                    .hide-scroll::-webkit-scrollbar {
                        display: none;
                    }
                    .hide-scroll {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>
                <div 
                    className="flex gap-6 pb-4 overflow-x-auto snap-x snap-mandatory hide-scroll scroll-smooth" 
                    ref={scrollContainerRef}
                >
                    {isLoading ? (
                        <div className="text-gray-400 p-4">Loading courses...</div>
                    ) : courses.map((course, index) => {
                        const theme = COLOR_THEMES[index % COLOR_THEMES.length];
                        const rating = course?.course_meta?.rating || course?.course_meta_data?.rating || '0.0';
                        const reviews = course?.course_meta?.num_people_rated || course?.course_meta_data?.num_people_rated || '0';
                        
                        return (
                            <div key={course.id} className="flex-[0_0_100%] md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(25%-18px)] min-w-0 snap-start">
                                <div className="bg-[#2a2a2a] rounded-2xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 h-full flex flex-col relative">
                                    {/* Starter Badge */}
                                    <div className="absolute top-0 right-0 bg-codepink text-white text-sm font-bold px-5 py-2 rounded-bl-2xl z-20 shadow-sm">
                                        Starter
                                    </div>
                                    <div className="h-48 overflow-hidden relative">
                                        <img 
                                            src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop'} 
                                            alt={course.name} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-lg bg-[#111] shrink-0 flex items-center justify-center overflow-hidden p-1">
                                                 <img src={course.organization?.logo || "/logo-light-full-1@2x.png"} alt="logo" className="w-full h-full object-contain" />
                                            </div>
                                            <h3 className="font-bold text-lg leading-tight line-clamp-2 text-white">{course.name}</h3>
                                        </div>
                                        
                                        <p className="text-gray-400 text-[14px] leading-relaxed mb-6 line-clamp-2">
                                            {(course.short_description || course.description || 'This course familiarizes learners with the 6D process-Discover, Define, Design, Develop, Deploy...').replace(/<[^>]*>?/gm, '')}
                                        </p>
                                        
                                        <div className="flex items-center justify-between text-[15px] font-medium mb-6">
                                            <div className="flex items-center gap-2 text-codeblue">
                                                <Clock className="w-5 h-5" />
                                                <span className="text-gray-400">
                                                    {course.course_meta?.duration || '30 hrs'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-codeyellow shrink-0">
                                                <Star className="w-5 h-5 fill-current" />
                                                <span>{rating}</span>
                                                <span className="text-white font-medium">({reviews})</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-end mt-auto gap-4">
                                            <div className="flex flex-wrap gap-2.5 flex-1 content-start">
                                                {(course.skills || ['Collaboration & Teamwork', 'Critical Thinking', 'Problem-Solving']).slice(0, 3).map((tag, i) => (
                                                    <span key={`${tag}-${i}`} className="text-[12px] px-3 py-1 rounded-full border border-codeblue text-white bg-transparent font-normal tracking-wide">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <Link to={`/courses/details/${course.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'course'}-${course.id}`}>
                                                <Button className="bg-codeblue hover:bg-codeblue/90 text-black rounded-xl flex flex-col items-center justify-center w-[80px] h-[80px] p-2 gap-1.5 shrink-0">
                                                    <ArrowRight className="w-5 h-5" />
                                                    <span className="text-[13px] font-medium leading-[1.2] tracking-wide text-center">View<br/>Details</span>
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                </div>
            </div>
        </section>
    )
}

export default TrendingCourses
