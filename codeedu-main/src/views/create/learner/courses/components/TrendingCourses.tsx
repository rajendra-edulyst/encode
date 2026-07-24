import { usePromotions } from '@/hooks/data/usePromotions';
import React, { useRef } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { useNavigate } from 'react-router-dom';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { mixpanelService } from '@/services/mixpanel/MixpanelService';

const TrendingCourses = () => {
    const swiperRef = useRef<SwiperType | null>(null)
    const { data: courses = [], isLoading } = usePromotions('course');

    const navigate = useNavigate();

    if (isLoading) {
        return <div className="text-center py-8">Loading...</div>
    }

    if (!courses || courses.length === 0) {
        return <div className="text-center py-8">No trending courses available</div>
    }

    return (
        <Card className='gap-0 py-4'>
            <CardHeader>
                <h3 className="text-xl text-white"> <span className='text-cblue'>Trending</span> Courses</h3>
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
                        bulletActiveClass: 'swiper-pagination-bullet-active !bg-white',
                    }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    loop={courses.length > 1}
                    className="trending-courses-swiper"
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                >
                    {courses.map((course) => (
                        <SwiperSlide key={course.id}>
                            <div className="relative rounded-2xl overflow-hidden group cursor-pointer h-[150px] bg-center bg-cover" style={{ backgroundImage: `url(${course?.profiles[0]?.image})` }} onClick={() => {
                                mixpanelService.track("Trending Course Clicked", { course_id: course?.profiles[0]?.id });
                                navigate(`/explore-course/${course?.profiles[0]?.id}`);
                            }}>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <style>{`
                .trending-courses-swiper .swiper-pagination {
                    bottom: 1rem !important;
                    right: 20px !important;
                    left: auto !important;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                }
                .trending-courses-swiper .swiper-pagination-bullet {
                    width: 10px;
                    height: 10px;
                    margin: 0 4px !important;
                    opacity: 1;
                }
            `}</style>
            </CardContent>
        </Card>
    )
}

export default TrendingCourses