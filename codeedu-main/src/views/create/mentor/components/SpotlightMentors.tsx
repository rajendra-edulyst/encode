// import { usePromotions } from '@/hooks/data/usePromotions';
// import { useMentors } from '@/hooks/data/create/useMentor';
// import { ArrowLeft, ArrowRight, CalendarPlus, MapPin } from 'lucide-react';
// import React, { useRef } from 'react'
// import { useNavigate } from 'react-router-dom';
// import type { Swiper as SwiperType } from 'swiper'
// import { Swiper, SwiperSlide } from 'swiper/react'
// import { Navigation, Pagination, Autoplay } from 'swiper/modules'
// import { Button } from '@/components/ui/ShadcnButton';
// import appConfig from '@/configs/app.config';
// import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { getMentorAvailableSlotCount } from '@/utils/mentorSlots';

// const SpotlightMentors = () => {

//     const swiperRef = useRef<SwiperType | null>(null)
//     const { data: courses = [], isLoading: promotionsLoading } = usePromotions('mentor');
//     const { data: mentorsList = [], isLoading: mentorsLoading } = useMentors();

//     const navigate = useNavigate();

//     const isLoading = promotionsLoading || mentorsLoading;

//     console.log('Trending Courses:', courses);

//     if (isLoading) {
//         return <div className="text-center py-8">Loading...</div>
//     }

//     if (!courses || courses.length === 0) {
//         return <div className="text-center py-8">No spotlight mentors available</div>
//     }

//     const profileServiceid = appConfig?.organization?.profileServiceid;

//     return (
//         <Card className="gap-0 py-4">
//             <CardHeader>
//                 <CardTitle className='text-xl text-white'><span className='text-cblue'>Spotlight</span> Mentors</CardTitle>
//                 <CardAction>
//                     <div className="flex gap-3">
//                         <button
//                             className="w-5 h-5 rounded-full border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all flex items-center justify-center"
//                             aria-label="Previous slide"
//                             onClick={() => swiperRef.current?.slidePrev()}
//                         >
//                             <ArrowLeft className="w-5 h-5" />
//                         </button>
//                         <button
//                             className="w-5 h-5 rounded-full border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all flex items-center justify-center"
//                             aria-label="Next slide"
//                             onClick={() => swiperRef.current?.slideNext()}
//                         >
//                             <ArrowRight className="w-5 h-5" />
//                         </button>
//                     </div>
//                 </CardAction>
//             </CardHeader>
//             <CardContent>
//                 {/* Swiper */}
//                 <Swiper
//                     modules={[Navigation, Pagination, Autoplay]}
//                     spaceBetween={20}
//                     slidesPerView={1}
//                     pagination={{
//                         clickable: true,
//                         bulletClass: 'swiper-pagination-bullet !bg-gray-600',
//                         bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary',
//                     }}
//                     autoplay={{
//                         delay: 5000,
//                         disableOnInteraction: false,
//                     }}
//                     loop={courses.length > 1}
//                     className="trending-courses-swiper pb-14"
//                     onSwiper={(swiper) => (swiperRef.current = swiper)}
//                 >
//                     {courses.map((course) => {
//                         const searchMentor = mentorsList?.find(
//                             (m) => m.uniqueIdentifier === String(course.profiles[0]?.id) ||
//                                 m._id === String(course.profiles[0]?.id) ||
//                                 m.portfolio_id === String(course.profiles[0]?.id)
//                         );
//                         const mentorLocation = searchMentor?.profileSection?.about?.[0]?.location || course.profiles[0]?.location || 'N/A';
//                         const slotCount = searchMentor ? getMentorAvailableSlotCount(searchMentor, undefined) : 0;

//                         return (
//                             <SwiperSlide key={course.id}>
//                                 <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-3 border border-gray-700">
//                                     <div className="flex items-start justify-between gap-6">
//                                         {/* Left Section - Profile & Info */}
//                                         <div className="cursor-pointer" onClick={() => navigate(`/portfolio/${profileServiceid}/${course?.profiles[0]?.id}`)}>
//                                             <div className='flex items-center gap-4 flex-1 mb-2'>
//                                                 {/* Profile Image */}
//                                                 <div className="w-[46px] h-[46px] rounded-lg overflow-hidden flex-shrink-0">
//                                                     <img
//                                                         src={course.profiles[0]?.profile_image}
//                                                         alt="Mentor"
//                                                         className="w-[46px] h-[46px] object-cover"
//                                                     />
//                                                 </div>
//                                                 {/* Info */}
//                                                 <div className="flex-1">
//                                                     <h3 className="text-sm font-bold line-clamp-1 text-white">{course.profiles[0]?.name}</h3>
//                                                     <div className="flex items-center gap-2 mb-2">
//                                                         <MapPin className="w-3 h-3 text-gray-400" />
//                                                         <span className="text-white text-xs">{mentorLocation}</span>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div>
//                                                 <p className="text-gray-400 text-[10px]">{course.profiles[0]?.profileSection?.about?.[0]?.current_role_head_line || course.type}</p>
//                                             </div>
//                                         </div>
//                                         {/* Right Section - Book Button */}
//                                         <div className="flex-shrink-0">
//                                             <Button
//                                                 disabled={slotCount <= 0}
//                                                 className="bg-yellow-400 w-[75px] h-[64px] hover:bg-yellow-500 text-black font-bold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     navigate(`/calendar/create?userType=mentor&id=${course?.profiles[0]?.id}`);
//                                                 }}
//                                             >
//                                                 <div className="text-center flex flex-col items-center">
//                                                     <CalendarPlus className='mb-2' />
//                                                     <div className="text-xs leading-tight">Book &</div>
//                                                     <div className="text-xs leading-tight">Connect</div>
//                                                 </div>
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </SwiperSlide>
//                         );
//                     })}
//                 </Swiper>
//                 <style>
//                     {`
//                         .trending-courses-swiper .swiper-pagination {
//                             bottom: 4px !important;
//                             left: 0 !important;
//                             right: 12px !important;
//                             display: flex;
//                             justify-content: flex-end;
//                             align-items: center;
//                         }
//                         .trending-courses-swiper .swiper-pagination-bullet {
//                             width: 8px !important;
//                             height: 8px !important;
//                             margin: 0 4px !important;
//                             opacity: 1;
//                             border-radius: 50% !important;
//                             flex-shrink: 0;
//                         }
//                     `}
//                 </style>
//             </CardContent>
//         </Card>
//     )
// }

// export default SpotlightMentors
import { usePromotions } from '@/hooks/data/usePromotions';
import { useMentors } from '@/hooks/data/create/useMentor';
import { ArrowLeft, ArrowRight, CalendarPlus, MapPin } from 'lucide-react';
import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import type { Swiper as SwiperType } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { Button } from '@/components/ui/ShadcnButton';
import appConfig from '@/configs/app.config';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMentorAvailableSlotCount } from '@/utils/mentorSlots';

const SpotlightMentors = () => {

    const swiperRef = useRef<SwiperType | null>(null)
    const { data: courses = [], isLoading: promotionsLoading } = usePromotions('mentor');
    const { data: mentorsList = [], isLoading: mentorsLoading } = useMentors();

    const navigate = useNavigate();

    const isLoading = promotionsLoading || mentorsLoading;

    if (isLoading) {
        return <div className="text-center py-8">Loading...</div>
    }

    if (!courses || courses.length === 0) {
        return <div className="text-center py-8">No spotlight mentors available</div>
    }

    const profileServiceid = appConfig?.organization?.profileServiceid;

    return (
        <Card className="gap-0 py-4">
            <CardHeader>
                <CardTitle className='text-xl text-white'><span className='text-cblue'>Spotlight</span> Mentors</CardTitle>
                <CardAction>
                    <div className="flex gap-3">
                        <button
                            className="w-5 h-5 rounded-full border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all flex items-center justify-center"
                            aria-label="Previous slide"
                            onClick={() => swiperRef.current?.slidePrev()}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <button
                            className="w-5 h-5 rounded-full border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all flex items-center justify-center"
                            aria-label="Next slide"
                            onClick={() => swiperRef.current?.slideNext()}
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </CardAction>
            </CardHeader>
            <CardContent>
                {/* Swiper */}
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    pagination={{
                        clickable: true,
                        bulletClass: 'swiper-pagination-bullet !bg-gray-600',
                        bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary',
                    }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    loop={courses.length > 1}
                    className="trending-courses-swiper pb-8"
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                >
                    {courses.map((course) => {
                        const searchMentor = mentorsList?.find(
                            (m) => m.uniqueIdentifier === String(course.profiles[0]?.id) ||
                                m._id === String(course.profiles[0]?.id) ||
                                m.portfolio_id === String(course.profiles[0]?.id)
                        );
                        const mentorLocation = searchMentor?.profileSection?.about?.[0]?.location || course.profiles[0]?.location || 'N/A';
                        const slotCount = searchMentor ? getMentorAvailableSlotCount(searchMentor, undefined) : 0;

                        return (
                            <SwiperSlide key={course.id}>
                                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-3 border border-gray-700">
                                    <div className="flex items-start justify-between gap-6">
                                        {/* Left Section - Profile & Info */}
                                        <div className="cursor-pointer" onClick={() => navigate(`/user-portfolio/${profileServiceid}/${course?.profiles[0]?.id}`)}>
                                            <div className='flex items-center gap-4 flex-1 mb-2'>
                                                {/* Profile Image */}
                                                <div className="w-[46px] h-[46px] rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={course.profiles[0]?.profile_image}
                                                        alt="Mentor"
                                                        className="w-[46px] h-[46px] object-cover"
                                                    />
                                                </div>
                                                {/* Info */}
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-bold line-clamp-2 text-white">{course.profiles[0]?.name}</h3>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <MapPin className="w-3 h-3 text-gray-400" />
                                                        <span className="text-white text-xs">{mentorLocation}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-[10px]">{course.profiles[0]?.profileSection?.about?.[0]?.current_role_head_line || course.type}</p>
                                            </div>
                                        </div>
                                        {/* Right Section - Book Button */}
                                        {slotCount > 0 && (
                                            <div className="flex-shrink-0">
                                                <Button
                                                    disabled={slotCount <= 0}
                                                    className="bg-yellow-400 w-[75px] h-[64px] hover:bg-yellow-500 text-black font-bold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/calendar/create?userType=mentor&id=${course?.profiles[0]?.id}`);
                                                    }}
                                                >
                                                    <div className="text-center flex flex-col items-center">
                                                        <CalendarPlus className='mb-2' />
                                                        <div className="text-xs leading-tight">Book &</div>
                                                        <div className="text-xs leading-tight">Connect</div>
                                                    </div>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
                <style>
                    {`
                        .trending-courses-swiper {
                            padding-bottom: 30px !important;
                        }
                        .trending-courses-swiper .swiper-pagination {
                            bottom: 0px !important;
                            left: 0 !important;
                            width: 100% !important;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            gap: 8px;
                        }
                        .trending-courses-swiper .swiper-pagination-bullet {
                            width: 8px !important;
                            height: 8px !important;
                            margin: 0 !important;
                            opacity: 1;
                            border-radius: 50% !important;
                            flex-shrink: 0;
                            background-color: #4B5563 !important;
                        }
                        .trending-courses-swiper .swiper-pagination-bullet-active {
                            background-color: #06B6D4 !important;
                        }
                    `}
                </style>
            </CardContent>
        </Card>
    )
}

export default SpotlightMentors