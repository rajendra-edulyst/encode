import React, { memo } from 'react';
import { Calendar, Pin } from 'lucide-react';
// import { Button } from '@/components/ui/ShadcnButton';
import { Link } from 'react-router-dom';
import { formatApiDate } from '../../../utils/dateFormat';
import { usePinnedPost } from '../../../@hooks/usePost';
import { Card, CardContent } from '@/components/ui/card';
import { pinPost } from '@/services/connect/PostService';
import { useQueryClient } from '@tanstack/react-query';

const Pined: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: pinPosts = [], isLoading: loading, isError: error } = usePinnedPost();

  const displayPosts = React.useMemo(() => {
    const pinnedPosts = pinPosts.filter(p => Number(p.is_pin) === 1);
    const others = pinPosts.filter(p => Number(p.is_pin) !== 1);
    return [...pinnedPosts, ...others].slice(0, 3);
  }, [pinPosts]);

  // Handle loading state
  if (loading && !pinPosts?.length) {
    return <div className="text-center">Loading...</div>;
  }

  // Handle error state
  if (error && !pinPosts?.length) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <Card>
      <CardContent className='pt-4'>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold dark:text-white">
            <span className="text-cpink font-bold text-2xl">Blog</span> Buzz...
          </h2>
        </div>
        <div className="space-y-4">
          {displayPosts?.map((post, index) => (
            <EventCard
              key={post.id}
              icon={post.thumbnail_url || `https://ui-avatars.com/api/?name=${post.title || 'Unknown'}&background=random`}
              title={post.title}
              organization={post.category_name}
              date={post.created_at}
              isLast={index === displayPosts.length - 1}
              id={post.id}
              isPinned={Number(post.is_pin) === 1}
              onPinToggle={() => {
                const currentPinStatus = Number(post.is_pin) === 1 ? 1 : 0;
                const newPinStatus = currentPinStatus === 1 ? 0 : 1;
                
                pinPost({ joy_content_id: post.id, is_pin: newPinStatus })
                  .then(() => {
                    import('sonner').then(({ toast }) => {
                      toast.success(newPinStatus === 0 ? "Post unpinned" : "Post pinned to top");
                    });
                    queryClient.invalidateQueries({ queryKey: ['posts'] });
                    queryClient.invalidateQueries({ queryKey: ['pinned-posts'] });
                  })
                  .catch((err) => {
                    import('sonner').then(({ toast }) => {
                      toast.error("Failed to update pin status");
                    });
                  });
              }}
            />
          ))}
          {
            pinPosts?.length === 0 && (
              <div className="text-gray-500">No pinned posts available.</div>
            )
          }
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
  isPinned: boolean;
  onPinToggle: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  icon, title, organization, date, isLast = false, id, isPinned, onPinToggle
}) => {
  return (
    <div className={`grid grid-cols-5 gap-3 mb-3 last:mb-0 ${!isLast ? 'border-b-[0.5px] border-[#b6b6b6]/40 pb-3 mb-3' : ''}`}>
      <Link to={`/connect/blogs/${title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'post'}/pid?pid=${id}`} className="col-span-4">
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
      <div 
        className='flex justify-end col-span-1 cursor-pointer'
        onClick={(e) => {
          e.preventDefault();
          onPinToggle();
        }}
      >
        <Pin size={20} strokeWidth={1.5} className={isPinned ? "text-[#FF0000]" : "text-gray-400"} />
      </div>
    </div>
  );
};

export default memo(Pined);