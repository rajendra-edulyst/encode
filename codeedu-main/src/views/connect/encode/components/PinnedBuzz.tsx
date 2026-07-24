import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { usePosts } from '@/hooks/data/connect/usePosts';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useAuth } from '@/auth';
import { isPinnedForUser } from '@/utils/postUtils';
import { pinPost } from '@/services/connect/PostService';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { PinOff } from 'lucide-react';

const PinnedBuzz = () => {
    const parms = new URLSearchParams();
    const { data: pinPosts = [], isLoading: loading, isError: error } = usePosts(parms);
    const { user } = useAuth();

    const filteredPosts = pinPosts?.filter((post: any) =>
        Number(post?.is_pin) === 1 &&
        !post.repost_id &&
        post?.pin_by_role?.toLowerCase() === 'learner'
    ) || [];

    if (loading && !pinPosts?.length) {
        return (
            <Card className="bg-[#1D1D1D] border border-[#2A2A2A] rounded-[20px] p-4 mb-0 shadow-none">
                <div className="flex justify-between items-center mb-4 px-1">
                    <Skeleton className="h-6 w-32 bg-[#2A2A2A]" />
                </div>
                <CardContent className="p-0">
                    <div className="flex gap-4">
                        <Skeleton className="h-[100px] w-full max-w-[300px] rounded-xl bg-[#2A2A2A]" />
                        <Skeleton className="h-[100px] w-full max-w-[300px] rounded-xl bg-[#2A2A2A] hidden sm:block" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error && !pinPosts?.length) {
        return null;
    }

    if (filteredPosts.length === 0) {
        return null;
    }

    return (
        <Card className="bg-[#1D1D1D] border border-[#2A2A2A] rounded-[20px] p-3 sm:p-4 mb-0 shadow-none relative w-full">
            <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full"
            >
                <div className="flex items-center justify-between mb-3 px-1">
                    <h2 className="text-lg sm:text-xl font-bold text-white">Pinned Buzz</h2>
                    <div className="flex gap-2">
                        <CarouselPrevious className="static translate-y-0 bg-transparent border-primary text-primary hover:bg-primary hover:text-white w-8 h-8 rounded-full" />
                        <CarouselNext className="static translate-y-0 bg-transparent border-primary text-primary hover:bg-primary hover:text-white w-8 h-8 rounded-full" />
                    </div>
                </div>
                <CardContent className="p-0 pb-0">
                    <CarouselContent className="-ml-4">
                        {filteredPosts.map((post: any, index: number) => (
                            <CarouselItem
                                key={`${post.id}-${index}`}
                                className={`pl-4 ${post.post_type === 'event' ? 'basis-full lg:basis-1/2 xl:basis-1/2 2xl:basis-1/3' : 'basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/3 2xl:basis-1/4'}`}
                            >
                                <EventCard post={post} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </CardContent>
            </Carousel>
        </Card>
    );
};

interface EventCardProps {
    post: any;
}

const EventCard: React.FC<EventCardProps> = ({ post }) => {
    const icon = post.thumbnail_url || post.resource_path || `https://ui-avatars.com/api/?name=${post.title || 'Unknown'}&background=random`;
    const title = post.title;
    const authorAvatar = post.created_by_profile_image || `https://ui-avatars.com/api/?name=${post.name || 'Unknown'}`;
    const authorName = post.name || post.created_by_name || 'Unknown';
    const queryClient = useQueryClient();

    const handleUnpin = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await pinPost({ joy_content_id: post.id, is_pin: 0 });
            toast.success('Post unpinned successfully!');
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['pinned-posts'] });
        } catch (error) {
            toast.error('Failed to unpin post.');
        }
    };

    return (
        <div className="w-full bg-[#2A2A2A] rounded-xl overflow-hidden flex flex-row h-[100px] hover:bg-[#323232] transition-colors border border-white/5 relative group">
            <button
                onClick={handleUnpin}
                className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full text-white/70 hover:text-white hover:bg-red-500/80 opacity-0 group-hover:opacity-100 transition-all z-10"
                title="Unpin"
            >
                <PinOff size={16} />
            </button>
            <Link to={`/connect/post/${post.id}`} className="flex flex-row w-full h-full">
                <div className={`${post.post_type === 'event' ? 'h-full max-w-[260px]' : 'w-[120px] h-full'} shrink-0 relative flex ${post.post_type === 'event' ? 'bg-[#2A2A2A]' : 'bg-[#FFC107]'}`}>
                    <img
                        src={icon}
                        alt={title}
                        className={`${post.post_type === 'event' ? 'h-full w-auto max-w-full object-contain object-left' : 'w-full h-full object-cover'}`}
                        onError={(e: any) => { e.target.src = post.post_type === 'event' ? 'https://ui-avatars.com/api/?name=Event&background=random' : 'https://ui-avatars.com/api/?name=Blog&background=random' }}
                    />
                </div>

                <div className="p-3 flex flex-col justify-between flex-grow overflow-hidden pr-8">
                    <h3 className="font-semibold text-sm text-white leading-snug line-clamp-2" title={title}>
                        {title}
                    </h3>

                    <div className="flex items-center mt-auto">
                        <img src={authorAvatar} alt={authorName} className="w-5 h-5 rounded-full mr-2 object-cover bg-gray-100" />
                        <span className="text-xs text-gray-400 truncate">{authorName}</span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default memo(PinnedBuzz);
