import { Button } from '@/components/ui/ShadcnButton';
// import { useAssignedProgramStore } from '@/store/faculty/ProgramStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
// swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from "swiper";
// @ts-expect-error - Swiper CSS has no type declarations
import 'swiper/css';
// @ts-expect-error - Swiper CSS has no type declarations
import 'swiper/css/pagination';
import SubjectCard from '@faculty/partials/SubjectCard';
import { useMyAssignedPrograms } from '@/hooks/data/faculty/useProgram';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AssignedProgram: React.FC = () => {

    const swiperRef = useRef<SwiperCore | null>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const { data: assignedPrograms, isError, error } = useMyAssignedPrograms();

    const handleSwiper = (swiper: SwiperCore) => {
        swiperRef.current = swiper;
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    const handleSlideChange = (swiper: SwiperCore) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    // Navigate to next slide
    const goNext = () => {
        if (swiperRef.current && !swiperRef.current.isEnd) {
            swiperRef.current.slideNext();
        }
    };

    // Navigate to previous slide
    const goPrev = () => {
        if (swiperRef.current && !swiperRef.current.isBeginning) {
            swiperRef.current.slidePrev();
        }
    };

    if (assignedPrograms?.length === 0) {
        return null;
    }

    if (isError) {
        return <div className="text-red-500">{error?.message}</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-white'>Assigned Subjects</CardTitle>
                <CardTitle className='text-white'>Manage your assigned subjects</CardTitle>
                <CardAction>
                    <Link to="/subjects" className="text-black text-sm">
                        <Button className="text-black" size="sm">View All</Button>
                    </Link>
                </CardAction>
            </CardHeader>
            <CardContent>
                <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    className='mt-3 w-full max-w-full min-w-0 overflow-hidden'
                    pagination={{ clickable: true, dynamicBullets: true }}
                    breakpoints={{
                        640: {
                            slidesPerView: 1,
                            spaceBetween: 10,
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 1,
                        },
                        1024: {
                            slidesPerView: 2,
                            spaceBetween: 10,
                        },
                    }}
                    onSwiper={handleSwiper}
                    onSlideChange={handleSlideChange}
                >
                    {
                        assignedPrograms?.slice(0, 5)?.map((program, index) => (
                            <SwiperSlide key={index} >
                                <SubjectCard subject={program} />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
                <div className="flex items-center justify-between mt-3">
                    <div className='text-sm text-gray-500 dark:text-white'>
                        Total <span className='font-bold'>{assignedPrograms?.length}</span> Subjects Assigned
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <Button className="text-black bg-primary rounded-full" size="icon" disabled={isBeginning} onClick={goPrev}><ChevronLeft /></Button>
                        <Button className="text-black bg-primary rounded-full" size="icon" disabled={isEnd} onClick={goNext}><ChevronRight /></Button>
                    </div>
                </div>
            </CardContent>
        </Card >
    )
}

export default AssignedProgram