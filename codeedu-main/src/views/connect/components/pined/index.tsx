import React, { memo } from 'react';
import { Calendar, Pin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePosts } from '@/hooks/data/connect/usePosts';
import { formatApiDate } from '@/utils/dateFormat';
import { pinPost } from '@/services/connect/PostService';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/auth';
import { isPinnedForUser } from '@/utils/postUtils';
import { mixpanelService } from '@/services/mixpanel/MixpanelService';

const Pined: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: pinPosts = [], isLoading: loading, isError: error } = usePosts();

  const blogPosts = React.useMemo(() => {
    const seen = new Set<number>();
    return pinPosts.filter(post => {
      const isBlog = Number(post.content_type) === 21;
      if (!isBlog) return false;
      const idNum = Number(post.id);
      if (seen.has(idNum)) return false;
      seen.add(idNum);
      return true;
    });
  }, [pinPosts]);

  const displayPosts = React.useMemo(() => {
    const pinnedPosts = blogPosts.filter(p => isPinnedForUser(p, user));
    const others = blogPosts.filter(p => !isPinnedForUser(p, user));
    return [...pinnedPosts, ...others].slice(0, 8);
  }, [blogPosts, user]);

  // Handle loading state
  if (loading && !pinPosts?.length) {
    return <div className="text-center">Loading...</div>;
  }

  // Handle error state
  if (error && !pinPosts?.length) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <Card className='py-4 gap-0'>
      <CardHeader>
        <CardTitle className="text-xl text-white"> <span className='text-primary'>Blog</span> Buzz...</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayPosts?.map((post, index) => (
            <EventCard
              key={post.id}
              icon={post.thumbnail_url || post.multi_file_uploads?.[0] || ''}
              title={post.title}
              organization={post.category_name}
              date={post.created_at}
              isLast={index === displayPosts.length - 1}
              id={post.id}
              contentType={post.content_type}
              isPinned={isPinnedForUser(post, user)}
              onPinToggle={() => {
                const currentPinStatus = isPinnedForUser(post, user) ? 1 : 0;
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
              author={(post as any)?.user_name || 'Anonymous'}
            />
          ))}
          {blogPosts?.length === 0 && (
            <div className="text-gray-500">No blog posts available.</div>
          )}
          {blogPosts?.length > 3 && (
            <div className="text-right">
              <Link
                to="/connect/pined"
                className="text-primary text-sm font-medium hover:underline"
                onClick={() => mixpanelService.track('Connect Blog Buzz View All Clicked')}
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
  isLast?: boolean;
  id?: number;
  contentType?: string | number;
  isPinned: boolean;
  onPinToggle: () => void;
  author?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  icon,
  title,
  organization,
  date,
  isLast = false,
  id,
  contentType,
  isPinned,
  onPinToggle,
  author
}) => {
  const fallbackIcon = `https://ui-avatars.com/api/?name=${encodeURIComponent(title || 'Unknown')}&background=random`;
  const [imgSrc, setImgSrc] = React.useState(icon || fallbackIcon);

  React.useEffect(() => {
    setImgSrc(icon || fallbackIcon);
  }, [icon, fallbackIcon]);

  const slug = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'post';
  const postUrl = Number(contentType) === 21
    ? `/connect/blogs/${slug}/pid?pid=${id}`
    : `/connect/post/${id}`;

  const cleanTitle = title?.replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, '').replace(/\s+/g, ' ').trim() || 'Unknown Title';

  return (
    <div className={`grid grid-cols-5 gap-3 mb-3 last:mb-0 ${!isLast ? 'border-b-[0.5px] border-[#b6b6b6]/40 pb-3 mb-3' : ''}`}>
      <Link
        to={postUrl}
        className="col-span-4"
        onClick={() => mixpanelService.track(`Connect :- ${cleanTitle} => blog buzz clicked`, {
          blog_id: id,
          blog_title: cleanTitle,
          author: author || 'Anonymous'
        })}
      >
        <div className="flex flex-row gap-2 mb-1">
          <img
            src={imgSrc}
            alt={title}
            className="w-16 h-16 rounded-lg object-cover bg-gray-200 dark:bg-gray-700"
            onError={() => setImgSrc(fallbackIcon)}
          />
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