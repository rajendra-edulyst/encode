import { Input } from '@/components/ui/ShadcnInput';
import { Loader, SendHorizontal } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { postKeys } from '@/hooks/data/connect/usePosts';
import { useSessionUser } from '@/store/authStore';

interface PostInteractionBarProps {
    post: {
        id: number;
        repost_id?: number | null;
        repost_user_id?: number | null;
        user_liked?: number;
        is_user_repost_like?: boolean;
        repost_count?: number;
    };
    comment: string;
    isSubmitting: boolean;
    onCommentChange: (value: string) => void;
    onCommentSubmit: () => void;
    onLikeClick: () => void;
    onRepostClick: () => void;
}

const PostInteractionBar: React.FC<PostInteractionBarProps> = React.memo(({
    post,
    comment,
    isSubmitting,
    onCommentChange,
    onCommentSubmit,
    onLikeClick,
    onRepostClick
}) => {
    const currentUserId = useSessionUser(state => state.user?.id);
    const queryClient = useQueryClient();
    const listsData = queryClient.getQueriesData({ queryKey: postKeys.lists() });
    let hasRepostedFromCache = false;
    if (Array.isArray(listsData)) {
        for (const [, val] of listsData) {
            if (val && typeof val === 'object') {
                const posts = (val as any)?.data?.post;
                if (Array.isArray(posts)) {
                    const found = posts.find((p: any) =>
                        (p.id === post?.id || p.repost_id === post?.id || p.id === post?.repost_id) &&
                        (p.repost_count === 1 || String(p.repost_count) === '1')
                    );
                    if (found) {
                        hasRepostedFromCache = true;
                        break;
                    }
                }
            }
        }
    }

    const isRepost = post.repost_id != null;
    const isLiked = isRepost
        ? (post.is_user_repost_like === true || (post.is_user_repost_like as any) === 1 || String(post.is_user_repost_like) === '1' || String(post.is_user_repost_like) === 'true')
        : (post.user_liked === 1 || (post.user_liked as any) === true || String(post.user_liked) === '1' || String(post.user_liked) === 'true');

    // Disabled only when the SAME user who reposted views this card; other users can re-Buzz freely.
    const isRebuzzed = post?.repost_id != null && post?.repost_user_id != null && post?.repost_user_id === currentUserId;

    return (
        <div className='mt-8 space-y-3'>
            <div className='flex items-center gap-3'>
                <div
                    className='bg-[#f9038d] hover:bg-[#e0027a] p-3 rounded-lg h-full w-[126px] flex flex-col justify-center items-center text-center text-black cursor-pointer transition-colors'
                    onClick={onLikeClick}
                >
                    <img
                        src={isLiked ? "/img/icons/connect/Applaud_Black_Full.png" : "/img/icons/connect/Applaud_Black_Empty.png"}
                        alt="Liked"
                        className="w-6 h-6 inline-block cursor-pointer"
                    />
                    {isLiked ? 'Applauded' : 'Applaud'}
                </div>
                <div
                    className={`flex items-center px-1 ${isRebuzzed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => {
                        if (isRebuzzed) {
                            toast.error("You are already rebuzzed this", { id: "already-rebuzzed" });
                        } else {
                            onRepostClick();
                        }
                    }}
                    onMouseEnter={() => {
                        if (isRebuzzed) {
                            toast.error("You are already rebuzzed this", { id: "already-rebuzzed" });
                        }
                    }}
                    title={isRebuzzed ? "You are already rebuzzed this" : undefined}
                >
                    <img
                        src='/img/icons/connect/share_windows_white.png'
                        alt='Comment'
                        className='w-5 h-5 inline-block'
                    />
                    <span className='ml-2 align-middle text-white dark:text-gray-200 text-sm'>
                        re-Buzz
                    </span>
                </div>
            </div>
            <div className='relative w-full'>
                <Input
                    className='w-full h-[50px] rounded-xl pr-12 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400'
                    placeholder='Add your Spark'
                    value={comment}
                    onChange={(e) => onCommentChange(e.target.value)}
                />
                {isSubmitting ? (
                    <Loader className='absolute right-3 top-1/2 transform -translate-y-1/2 text-primary animate-spin' />
                ) : (
                    <button
                        type="button"
                        className='absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors'
                        onClick={onCommentSubmit}
                        aria-label='Send comment'
                    >
                        <SendHorizontal className='text-[#f9038d]' />
                    </button>
                )}
            </div>
        </div>
    );
});

PostInteractionBar.displayName = 'PostInteractionBar';

export default PostInteractionBar;
