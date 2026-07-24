import React, { useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Briefcase, Linkedin, Youtube, Instagram, ChevronRight, ChevronLeft, Star, Medal, Calendar, CalendarPlus, ArrowRight, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/ShadcnButton'
import { useMentors } from '@/hooks/data/create/useMentor'

const WorldClassGuidance = () => {
    const { data: mentors = [], isLoading } = useMentors()
    const topMentors = mentors.slice(0, 10) // Show up to 10 mentors in carousel
    const navigate = useNavigate();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    
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
                    <h2 className="text-[30px] lg:text-[32px] font-semibold text-codepink">
                        World Class Guidance
                    </h2>
                    <p className="mt-2 text-[30px] lg:text-[22px] font-normal leading-[1.1] text-#FFFFFF max-w-3xl">
                        Learn From the Builders of Tomorrow
                    </p>
                </div>
                
                <div className="flex flex-col items-end gap-3">
                    <Link to="/mentor/all" className="text-codepink text-xs hover:underline uppercase tracking-wider font-semibold">
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
                        <div className="text-gray-400 p-4">Loading mentors...</div>
                    ) : topMentors.map(mentor => {
                        const profilePic = mentor?.profileSection?.basic_info?.[0]?.profilePicture ?? 'https://nlmscdnawsbackup.blob.core.windows.net/nlmsmedia/media/ojQf0ridmqH69aWJAtLqfFotJFG4aDmXOazdHNXM.jpg';
                        const about0 = mentor?.profileSection?.about?.[0];
                        const role = about0?.current_role_head_line ?? 'Mentor';
                        const domain = about0?.domain || mentor?.profileSection?.areas_of_expertise?.[0]?.areas_of_expertise || '-';
                        const years_of_exp = about0?.years_of_exp ? `${about0.years_of_exp} Years` : '-';
                        const social = mentor?.profileSection?.social_links?.[0] || {};
                        const location = mentor?.profileSection?.about?.[0]?.location || '-';
                        
                        return (
                            <div key={mentor.uniqueIdentifier || mentor._id} className="flex-[0_0_100%] md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] xl:flex-[0_0_calc(25%-18px)] min-w-0 flex snap-start">
                                <div className="bg-[#1f1f1f] rounded-2xl p-6 flex flex-col items-center text-center group hover:-translate-y-1 transition-all duration-300 w-full h-full relative overflow-hidden shadow-lg border border-transparent">
                                    {/* Location Badge */}
                                    <div className="absolute top-0 right-0 bg-codepink text-white text-[13px] font-bold px-4 py-2 rounded-bl-2xl flex items-center gap-1.5 z-10 shadow-sm">
                                        <MapPin className="w-4 h-4" />
                                        {location}
                                    </div>

                                    {/* Profile Image */}
                                    <div className="w-28 h-28 rounded-2xl overflow-hidden mb-5 shrink-0 mt-6 shadow-md border border-gray-800">
                                        <img src={profilePic} alt={mentor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    
                                    {/* Name and Role */}
                                    <h3 className="font-bold text-xl text-white mb-2 line-clamp-1">{mentor.name}</h3>
                                    <p className="text-gray-400 text-[15px] mb-4 line-clamp-1">{role}</p>
                                    
                                    {/* Rating */}
                                    <div className="flex items-center justify-center gap-1 mb-8">
                                        <Star className="w-5 h-5 fill-codeyellow text-codeyellow" />
                                        <Star className="w-5 h-5 fill-codeyellow text-codeyellow" />
                                        <Star className="w-5 h-5 fill-codeyellow text-codeyellow" />
                                        <Star className="w-5 h-5 fill-codeyellow text-codeyellow" />
                                        <Star className="w-5 h-5 fill-codeyellow text-codeyellow" />
                                        <span className="text-gray-300 text-[15px] ml-1.5 font-medium">5.0</span>
                                    </div>
                                    
                                    {/* Details */}
                                    <div className="flex flex-col items-center gap-3 mb-10 w-full text-[15px]">
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="w-4 h-4 text-codeblue shrink-0" />
                                            <span className="text-codeblue font-medium">Experience &ndash;</span>
                                            <span className="text-white font-bold">{years_of_exp}</span>
                                        </div>
                                        <div className="flex items-start gap-2 max-w-full">
                                            <Medal className="w-4 h-4 text-codeblue shrink-0 mt-0.5" />
                                            <span className="text-codeblue font-medium shrink-0">Expertise &ndash;</span>
                                            <span className="text-white font-bold line-clamp-2 text-left leading-tight">{domain}</span>
                                        </div>
                                    </div>

                                    {/* Footer / Actions */}
                                    <div className="w-full flex justify-between items-end mt-auto">
                                        {/* Social Icons 2x2 Grid */}
                                        <div className="grid grid-cols-2 gap-2.5">
                                            <a href="#" className="w-9 h-9 rounded-full bg-[#111] flex items-center justify-center hover:bg-gray-800 text-gray-500 hover:text-white transition-colors shadow-inner">
                                                <Lightbulb className="w-4.5 h-4.5" />
                                            </a>
                                            <a href={social.portfolio || '#'} target={social.portfolio ? "_blank" : "_self"} className="w-9 h-9 rounded-full bg-[#111] flex items-center justify-center hover:bg-gray-800 text-gray-500 hover:text-white transition-colors shadow-inner">
                                                <span className="font-bold text-[14px]">Bē</span>
                                            </a>
                                            <a href={social.linkedin || '#'} target={social.linkedin ? "_blank" : "_self"} className="w-9 h-9 rounded-full bg-[#111] flex items-center justify-center hover:bg-gray-800 text-gray-500 hover:text-white transition-colors shadow-inner">
                                                <Linkedin className="w-4.5 h-4.5" />
                                            </a>
                                            <a href={social.youtube || '#'} target={social.youtube ? "_blank" : "_self"} className="w-9 h-9 rounded-full bg-[#111] flex items-center justify-center hover:bg-gray-800 text-gray-500 hover:text-white transition-colors shadow-inner">
                                                <Youtube className="w-4.5 h-4.5" />
                                            </a>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2.5">
                                            <Button 
                                                onClick={() => navigate(`/portfolio/${mentor?.name ? mentor.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'mentor'}/${mentor?.uniqueIdentifier}`)}
                                                className="bg-codeblue hover:bg-codeblue/90 text-black rounded-2xl flex flex-col items-center justify-center w-[86px] h-[86px] p-2 gap-1.5 shadow-lg"
                                            >
                                                <ArrowRight className="w-5 h-5" />
                                                <span className="text-[13px] font-medium leading-[1.2] tracking-wide text-center">View<br/>Profile</span>
                                            </Button>
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

export default WorldClassGuidance
