import React, { memo } from 'react';
import { Calendar, Pin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePosts } from '@/hooks/data/connect/usePosts';
import { formatApiDate } from '@/utils/dateFormat';

const MBM = () => {

    const parms = new URLSearchParams();
    // parms.append('is_pin', '1');
    parms.append('category_id', '353'); // User will change this catergory_id

    const { data: pinPosts = [], isLoading: loading, isError: error } = usePosts(parms);


    // Handle loading state
    if (loading && !pinPosts?.length) {
        return <div className="text-center">Loading...</div>;
    }

    // Handle error state
    if (error && !pinPosts?.length) {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }

    const slicedPosts = pinPosts?.slice(0, 3) || [];

    return (
        <Card className='py-4 gap-0'>
            <CardHeader>
                <CardTitle className="text-xl text-white"> <span className='text-primary'>Myth Busters</span> Monday</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {slicedPosts.map((post, index) => (
                        <EventCard
                            key={index}
                            icon={post.thumbnail_url || `https://ui-avatars.com/api/?name=${post.title || 'Unknown'}&background=random`}
                            title={post.title}
                            organization={post.category_name}
                            date={post.created_at}
                            isLast={index === slicedPosts.length - 1}
                            id={post.id}
                        />
                    ))}
                    {
                        pinPosts?.length === 0 && (
                            <div className="text-gray-500">No MBM posts available.</div>
                        )
                    }
                    {pinPosts?.length > 3 && (
                        <div className="text-right">
                            <Link
                                to="/connect/mbm"
                                className="text-primary text-sm font-medium hover:underline"
                            >
                                View All
                            </Link>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};


interface EventCardProps {
    icon: string;
    title: string;
    organization: string;
    date: string | number | Date | null;
    isHighlighted?: boolean;
    isLast?: boolean;
    id?: number;
}

const EventCard: React.FC<EventCardProps> = ({
    icon, title, organization, date, isLast = false, id
}) => {

    return (
        <div className={`grid grid-cols-5 gap-3 mb-3 last:mb-0 ${!isLast ? 'border-b-[0.5px] border-[#b6b6b6]/40 pb-3 mb-3' : ''}`}>
            <Link to={`/connect/post/${id}`} className="col-span-4">
                <div className="flex flex-row gap-2 mb-1">
                    <img src={icon} alt={title} className="w-16 h-16 rounded-lg" />
                    <div>
                        <h3 className="font-semibold text-sm text-cblack dark:text-gray-400 mb-[2px] line-clamp-2">{title}</h3>
                        <p className="text-xs text-cblack dark:text-gray-500">{organization}</p>
                        <div className="flex items-center text-xs text-cblack dark:text-gray-500 mt-1 col-span-1">
                            <Calendar strokeWidth={1.5} size={14} className="mr-1" />
                            <span>{date && formatApiDate(date)}</span>
                        </div>
                    </div>
                </div>
            </Link>
            <div className='flex justify-end col-span-1'>
                <Pin size={20} strokeWidth={1.5} className="text-[#FF0000]" />
            </div>
        </div>
    );
};

export default memo(MBM);