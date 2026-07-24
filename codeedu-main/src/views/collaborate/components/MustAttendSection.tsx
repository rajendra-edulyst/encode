import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { mixpanelService } from '@/services/mixpanel/MixpanelService';
import MustAttendEventCard from '@/components/MustAttendEventCard';

interface MustAttendSectionProps {
    mustAttendData: any[];
}

const MustAttendSection: React.FC<MustAttendSectionProps> = ({ mustAttendData }) => {
    return (
        <Card>
            <CardHeader className='flex flex-col gap-2 px-8'>
                <CardTitle className='text-primary text-lg md:text-[28px]'>Must Attend</CardTitle>
                <div className="flex items-end w-full justify-between gap-2">
                    <CardDescription className='md:w-[70%] dark:text-white text-lg'>
                        High-priority flagship events and community gatherings across India
                    </CardDescription>
                    <Link
                        to={'/collaborate/must-attend-list'}
                        className="whitespace-nowrap"
                        onClick={() => mixpanelService.track('Collaborate Must Attend View All Clicked')}
                    >
                        <div className="text-primary underline cursor-pointer pb-1">View all</div>
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                <Carousel>
                    <CarouselContent className="pb-5 md:pb-0 my-2">
                        {mustAttendData.map((item, index) => (
                            <CarouselItem key={`${item.type}-${index}`} className="md:basis-1/2 lg:basis-1/3 2xl:basis-1/3 pb-4 h-full relative rounded-[20px]">
                                <Link
                                    key={item.type}
                                    to={`/collaborate/must-attend?category=${item.type}`}
                                    onClick={() => mixpanelService.track(`Collaborate Must Attend :- ${item.title} > Clicked`, { category: item.type })}
                                    className="block h-full"
                                >
                                    <MustAttendEventCard data={item} />
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="bg-[#5A5A5A] text-primary w-12 h-12 rounded-full shadow -left-5" />
                    <CarouselNext className="bg-[#5A5A5A] text-primary w-12 h-12 rounded-full shadow -right-5" />
                </Carousel>
            </CardContent>
        </Card>
    );
};

export default MustAttendSection;
