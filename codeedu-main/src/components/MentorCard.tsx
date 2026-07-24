import React from 'react'
import { Card, CardContent, CardFooter } from './ui/card'
import { Briefcase, CalendarPlus, Star } from 'lucide-react';
import { Button } from './ui/ShadcnButton';
import { IndustryMentor } from '@/@types/create/mentor';

interface MentorCardProps {
    mentor: IndustryMentor;
}

const MentorCard = ({ mentor }: MentorCardProps) => {

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-current text-yellow-500" />);
        }

        if (hasHalfStar) {
            stars.push(
                <div key="half" className="relative">
                    <Star className="w-4 h-4 text-gray-300" />
                    <div className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>
                        <Star className="w-4 h-4 fill-current text-yellow-500" />
                    </div>
                </div>
            );
        }

        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
        }

        return stars;
    };

    return (
        <Card className='bg-[#323232]'>
            <CardContent>
                <div className='text-center flex flex-col items-center justify-center gap-2'>
                    <img src={mentor?.org_logo || '/img/default-avatar.png'} alt="Mentor Avatar" className="w-24 h-24 rounded-xl mb-4 bg-white" />
                    <h2 className="text-xl font-bold dark:text-white">{mentor?.name || 'Mentor Name'}</h2>
                    <p className="dark:text-white text-xs">Associate Director - Atlas Design Lab ATLAS SkillTech University</p>

                    {/* Rating Display */}
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center">
                            {renderStars(Number(mentor?.rating))}
                        </div>
                        <span className="text-yellow-500 font-medium text-sm">
                            {Number(mentor?.rating).toFixed() || '0.0'}
                        </span>

                    </div>
                </div>
                <div className='flex flex-col justify-center items-center'>
                    <div className='text-primary flex items-center gap-2 mt-4'>
                        <Briefcase />
                        <h6 className='text-sm'>Experience- <span className='text-white'>16 Years</span></h6>
                    </div>
                    <div className='text-primary flex items-center gap-2 mt-4'>
                        <Star className="text-primary" />
                        <h6 className='text-sm'>Expertise- <span className='text-white'>UI/UX Design</span></h6>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <div className='flex justify-between w-full'>
                    <div className='flex justify-center items-center gap-2 flex-col'>
                        <div className='flex gap-4'>
                            <a href="https://www.behance.net/" target="_blank" rel="noopener noreferrer">
                                <img src={`/img/icons/behance.svg`} alt="Behance" className='w-10 h-10' />
                            </a>
                            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                                <img src={`/img/icons/linkedin.svg`} alt="LinkedIn" className='w-10 h-10' />
                            </a>
                        </div>
                        <div className='flex gap-4'>
                            <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
                                <img src={`/img/icons/youtube.svg`} alt="YouTube" className='w-10 h-10' />
                            </a>
                            <a href="https://vidwan.in/" target="_blank" rel="noopener noreferrer">
                                <img src={`/img/icons/Vidwan.svg`} alt="Vidwan" className='w-10 h-10' />
                            </a>
                        </div>
                    </div>
                    <div className='flex justify-between mt-4'>
                        <Button className='bg-primary p-3 px-4 rounded-lg h-[96px] w-[126px] flex flex-col justify-center items-center text-center text-black mb-3 cursor-pointer'>
                            <CalendarPlus className='mb-2' />
                            <div className='text-sm font-medium'>Book & Connect</div>
                        </Button>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

export default MentorCard