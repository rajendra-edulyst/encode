import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useFetchLikedUsers, postKeys } from '@/hooks/data/connect/usePosts';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import appConfig from '@/configs/app.config';
import { useSessionUser } from '@/store/authStore';

interface PostActionsProps {
    post: {
        id: number;
        repost_id?: number | null;
        repost_user_id?: number | null;
        user_liked?: number;
        is_user_repost_like?: boolean;
        like_count?: number;
        repost_like?: number | null;
        comment_count?: number;
        repost_count?: number;
    };
    onCommentClick: () => void;
    onRepostClick: () => void;
}

const PostActions: React.FC<PostActionsProps> = React.memo(({
    post,
    onCommentClick,
    onRepostClick
}) => {
    const navigate = useNavigate();
    const profileServiceid = appConfig?.organization?.profileServiceid;
    const currentUserId = useSessionUser(state => state.user?.id);
    const [showApplaudModal, setShowApplaudModal] = useState(false);
    const { data: likedUsers = [], isLoading: isLikedUsersLoading } = useFetchLikedUsers(post, showApplaudModal);

    const openApplaudModal = () => {
        setShowApplaudModal(true);
    };

    const handleUserClick = (userId: number) => {
        if (!profileServiceid || !userId) return;
        setShowApplaudModal(false);
        navigate(`/user-portfolio/${profileServiceid}/${userId}`);
    };

    /** Stats row: opens “who applauded” only — never toggles like (use PostInteractionBar to applaud). */
    const handleApplaudStatsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        openApplaudModal();
    };

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
    const displayLikeCount = post.repost_id != null ? (post.repost_like ?? post.like_count ?? 0) : (post.like_count ?? 0);
    // Disabled only when the SAME user who reposted views this card; other users can re-Buzz freely.
    const isRebuzzed = post?.repost_id != null && post?.repost_user_id != null && post?.repost_user_id === currentUserId;
    const displayRepostCount = (post?.repost_count && Number(post.repost_count) > 0)
        ? Number(post.repost_count)
        : (hasRepostedFromCache ? 1 : 0);

    return (
        <>
            <div className='flex items-center gap-10 text-gray-400 dark:text-gray-500'>
                <button
                    type="button"
                    className="flex cursor-pointer items-center gap-2 rounded-md py-1 -my-1 pr-1 -ml-1 pl-1 text-left transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#323232] dark:focus-visible:ring-offset-[#323232]"
                    onClick={handleApplaudStatsClick}
                    title="View who applauded"
                    aria-label={`${displayLikeCount} applaud${displayLikeCount === 1 ? '' : 's'} — open list`}
                >
                    {isLiked ? (
                        <img
                            src="/img/icons/connect/Applaud_Full.png"
                            alt=""
                            aria-hidden
                            className="w-6 h-6 shrink-0 pointer-events-none select-none"
                        />
                    ) : (
                        <img
                            src="/img/icons/connect/Applaud_Empty.png"
                            alt=""
                            aria-hidden
                            className="w-6 h-6 shrink-0 pointer-events-none select-none"
                        />
                    )}
                    <span className="align-middle text-white dark:text-gray-200 font-bold tabular-nums pointer-events-none select-none">
                        {displayLikeCount}
                    </span>
                </button>
                <div className='flex items-center cursor-pointer' onClick={onCommentClick}>
                    <img
                        src="/img/icons/connect/Comment_Full.png"
                        alt="Comment"
                        className="w-6 h-6 inline-block cursor-pointer"
                    />
                    <span className='ml-2 align-middle text-white dark:text-gray-200 font-bold'>
                        {post?.comment_count}
                    </span>
                </div>
                <div
                    className={`flex items-center ${isRebuzzed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
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
                        src="/img/icons/connect/share_windows.png"
                        alt="Share"
                        className={`w-5 h-5 inline-block ${isRebuzzed ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    />
                    <span className='ml-2 align-middle text-white dark:text-gray-200 font-bold'>
                        {displayRepostCount || 0}
                    </span>
                </div>
            </div>

            <Dialog open={showApplaudModal} onOpenChange={setShowApplaudModal}>
                <DialogContent className="bg-[#323232] border-[2px] border-[#646464] text-white !rounded-[24px] p-0 w-[378px] h-auto max-h-[500px] max-w-[378px] overflow-hidden [&>button]:right-4 [&>button]:top-4 [&>button_svg]:h-7 [&>button_svg]:w-7 [&>button_svg]:text-white/90">
                    <div className="px-6 pt-6 pb-2">
                        <DialogTitle className="text-[18px] font-semibold leading-6 text-white pr-10">
                            This post is Applauded by
                        </DialogTitle>
                    </div>

                    <div className="px-6 pb-6">
                        <div className="max-h-[350px] overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            {isLikedUsersLoading && (
                                <div className="h-full flex items-center justify-center">
                                    <Loader className="h-5 w-5 animate-spin text-white/90" />
                                </div>
                            )}
                            {!isLikedUsersLoading && Array.isArray(likedUsers) && likedUsers.length === 0 && (
                                <div className="h-full flex items-center justify-center text-sm text-white/70">
                                    No applauds yet
                                </div>
                            )}
                            {!isLikedUsersLoading && Array.isArray(likedUsers) && likedUsers.map((user) => (
                                <button
                                    key={user.id}
                                    type="button"
                                    className="w-full text-left flex items-center gap-3 py-2 border-b border-white/20 hover:border-white/45 transition-colors"
                                    onClick={() => handleUserClick(user.id)}
                                >
                                    <img
                                        src={user.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <span className="text-[13px] leading-5 text-white/95">{user.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
});

PostActions.displayName = 'PostActions';

export default PostActions;
