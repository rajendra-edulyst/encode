import React, { useRef, useState } from 'react'
import { useOrgCommunities } from '@/hooks/data/connect/useCommunity';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import CommunityCard from '@/components/CommunityCard';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Community } from '@/@types/connect/community';
import LoadingSection from '@/components/LoadingSection';

const DiscoverCommunities = () => {

    const { data: orgCommunities = [], isLoading } = useOrgCommunities();

    return (
        <div>
            <LoadingSection isLoading={isLoading} title='Communities' />
            {orgCommunities.map((org, index) => (
                <Card key={index} className='gap-0'>
                    <CardHeader className='pb-0'>
                        <CardHeader className='text-2xl font-bold text-primary px-0'>{org.org_name} Communities</CardHeader>
                        <CardAction className='flex items-center gap-2 mt-2'>
                            <Link to={`/connect/communities/org/${org.org_id}`} className='text-sm text-muted-foreground hover:underline text-primary'>View All</Link>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <CommunitySlider
                            communities={org.communities.slice(0, 5)}
                            org_name={org.org_name}
                            org_logo={org.org_logo}
                            org_id={org.org_id}
                        />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

// Community Slider Component
const CommunitySlider = ({ communities, org_name, org_logo, org_id }: {
    communities: Community[],
    org_name: string,
    org_logo: string,
    org_id: string | number
}) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.offsetWidth / 3;
            const newScrollLeft = direction === 'left'
                ? scrollContainerRef.current.scrollLeft - scrollAmount
                : scrollContainerRef.current.scrollLeft + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 10);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    React.useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            handleScroll();
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [communities]);

    return (
        <div className='relative group'>
            {/* Left Arrow */}
            {showLeftArrow && (
                <button
                    className='absolute border border-primary left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100 -translate-x-1/2'
                    aria-label='Scroll left'
                    onClick={() => scroll('left')}
                >
                    <ArrowLeft className='w-6 h-6 text-primary' />
                </button>
            )}

            {/* Slider Container */}
            <div
                ref={scrollContainerRef}
                className='flex gap-5 overflow-x-auto scroll-smooth scrollbar-hide'
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {communities.map((community, index) => (
                    <div key={index} className='flex-shrink-0 w-full md:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]'>
                        {/* Use community cover image for the header instead of org logo */}
                        <CommunityCard
                            community={community}
                            org_name={org_name}
                            org_logo={community.cover_image || org_logo}
                            org_id={org_id?.toString()}
                        />
                    </div>
                ))}
            </div>

            {/* Right Arrow */}
            {showRightArrow && (
                <button
                    className='absolute right-0 top-1/2 border border-primary -translate-y-1/2 z-10 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100 translate-x-1/2'
                    aria-label='Scroll right'
                    onClick={() => scroll('right')}
                >
                    <ArrowRight className='w-6 h-6 text-primary' />
                </button>
            )}
        </div>
    );
};

export default DiscoverCommunities