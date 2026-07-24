import { Dot, EllipsisVertical, Pin } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import formatRelativeOrLong from '@/utils/formatDate';
import { Post } from '@/@types/connect/posts';
import { useNavigate } from 'react-router-dom';
import appConfig from '@/configs/app.config';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/auth';
import { useDeletePost, useDeleteRepost } from '@/hooks/data/connect/usePosts';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import RepostDialog from '../RepostDialog';
import { useQueryClient } from '@tanstack/react-query';
import { pinPost } from '@/services/connect/PostService';
import { isPinnedForUser } from '@/utils/postUtils';

interface PostHeaderProps {
    repost?: boolean;
    post: Post;
}

const PostHeader: React.FC<PostHeaderProps> = React.memo(({ repost, post }) => {
    const navigate = useNavigate();
    const profileServiceid = appConfig?.organization?.profileServiceid;
    const { user } = useAuth();
    const [isRepostDialogOpen, setIsRepostDialogOpen] = useState(false);

    // Delete post mutation
    const { mutate: deletePostMutation, isPending: isDeleting } = useDeletePost();
    const { mutate: deleteRepostMutation, isPending: isRepostDeleting } = useDeleteRepost();

    const createdByRaw = repost ? post.repost_user_id : post.created_by;
    const createdById =
        typeof createdByRaw === 'object' && createdByRaw !== null
            ? Number((createdByRaw as { id?: number }).id ?? 0)
            : Number(createdByRaw ?? 0);
    const createdByName =
        (repost ? post.repost_user_name : post.name) ||
        (typeof post.created_by === 'object' && post.created_by !== null
            ? (post.created_by as { name?: string }).name
            : '') ||
        post?.created_by_name ||
        'Unknown User';
    const createdByProfileImage =
        (repost
            ? post.repost_user_profile_image
            : (
                post.created_by_profile_image ||
                post.created_by_image ||
                post.user_profile_image ||
                post.profile_image ||
                (typeof post.created_by === 'object' && post.created_by !== null
                    ? (post.created_by as { profile_image?: string | null }).profile_image
                    : null)
            )) || null;
    const [imageLoadFailed, setImageLoadFailed] = useState(false);
    const createdAt = repost ? post.repost_created_at : post.created_at;
    const isBlog = String(post?.content_type) === '21' || String(post?.content_type) === '1';

    const isPinnedByCurrentUser = isPinnedForUser(post, user);

    // Handle edit post
    const handleEditPost = useCallback(() => {
        // If it's a repost, open the RepostDialog for editing
        if (post.repost_id) {
            setIsRepostDialogOpen(true);
        } else {
            // Regular post - navigate to edit page
            const composer = isBlog ? 'blog' : '';
            navigate(`/connect/add-buzz/${post.id}${composer ? `?composer=${composer}` : ''}`);
        }
    }, [navigate, post.id, post.repost_id, post.content_type]);

    // Handle delete post
    const handleDeletePost = useCallback(async () => {
        const result = await Swal.fire({
            title: `Delete ${isBlog ? 'Blog' : 'Post'}?`,
            text: `Are you sure you want to delete this ${isBlog ? 'blog' : 'post'}? This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            if (repost) {
                deleteRepostMutation(post.repost_id!);
                return;
            }
            deletePostMutation(post.id);
        }
    }, [deletePostMutation, deleteRepostMutation, post.id, repost, post.repost_id, post.content_type]);

    // Handle view profile
    const handleViewProfile = useCallback(() => {
        if (createdById) {
            navigate(`/user-portfolio/${profileServiceid}/${createdById}`);
        }
    }, [navigate, profileServiceid, createdById]);

    // Handle copy profile link
    const handleCopyProfileLink = useCallback(() => {
        const profileUrl = `${window.location.origin}/user-portfolio/${profileServiceid}/${createdById}`;
        navigator.clipboard.writeText(profileUrl);
        toast.success('Profile link copied to clipboard!');
    }, [profileServiceid, createdById]);

    // Handle copy Blog link
    const handleCopyPostLink = useCallback(() => {
        const slug = post?.title ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'post';
        const postUrl = `${window.location.origin}/blogs/${slug}/pid?pid=${post.id}`;
        navigator.clipboard.writeText(postUrl);
        toast.success('Post link copied to clipboard!');
    }, [post.title, post.id]);

    const queryClient = useQueryClient();
    const handlePinPost = useCallback(async () => {
        try {
            const newPinStatus = isPinnedByCurrentUser ? 0 : 1;
            await pinPost({ joy_content_id: post.id, is_pin: newPinStatus });
            toast.success(newPinStatus === 1 ? 'Post pinned successfully!' : 'Post unpinned successfully!');
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['pinned-posts'] });
        } catch (error) {
            toast.error('Failed to pin post.');
        }
    }, [post.id, isPinnedByCurrentUser, queryClient]);

    return (
        <>
            <div className='flex justify-between items-start'>
                <div>
                    {!repost && <div>
                        {post?.category_name && <div className='flex items-center text-[#f9038d] gap-2'>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" className="w-6 h-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"></path>
                            </svg>
                            <span className='text-[#f9038d] text-base font-bold'>{post?.category_name}</span>
                        </div>}
                        {(!post?.category_name && post?.organization_name) && <div className='flex items-center text-[#f9038d] gap-2'>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" className="w-6 h-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"></path>
                            </svg>
                            <span className='text-[#f9038d] text-base font-bold'>{post?.organization_name}</span>
                        </div>}
                    </div>}
                    <div className='flex items-center gap-2 mt-2 mb-4'>
                        {
                            createdById && <div className='flex items-center gap-2 cursor-pointer' onClick={() => createdById && navigate(`/user-portfolio/${profileServiceid}/${createdById}`)}
                            >
                                {createdByProfileImage && !imageLoadFailed ? (
                                    <img
                                        src={createdByProfileImage}
                                        alt={createdByName}
                                        className='w-6 h-6 rounded-full object-cover'
                                        onError={() => setImageLoadFailed(true)}
                                    />
                                ) : (
                                    <div className='w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center'>
                                        <span className='text-xs font-bold text-gray-600 dark:text-gray-300'>
                                            {createdByName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <h3 className='text-sm font-semibold text-white dark:text-gray-200'>{createdByName}</h3>
                            </div>
                        }
                        {
                            repost && <div>
                                rebuzzed
                            </div>
                        }
                        {createdAt && (
                            <div className='flex items-center gap-1'>
                                <Dot size={25} className='text-codegreen dark:text-green-400' />
                                <span className='text-sm font-semibold text-white dark:text-gray-200'>
                                    {formatRelativeOrLong(createdAt)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                {
                    repost &&
                    <div className="flex items-center gap-2">
                        {isPinnedByCurrentUser && <Pin size={20} strokeWidth={1.5} className="text-[#FF0000] cursor-pointer" onClick={handlePinPost} />}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="focus:outline-none">
                                    <EllipsisVertical className='w-6 h-6 text-gray-400 dark:text-white cursor-pointer' />
                                </button>
                            </DropdownMenuTrigger>
                            {Number(user?.id) !== Number(createdById) ? (
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem className="cursor-pointer" onClick={handleViewProfile}>
                                        View Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer" onClick={handleCopyProfileLink}>
                                        Copy Profile Link
                                    </DropdownMenuItem>
                                    {isBlog && <DropdownMenuItem className="cursor-pointer" onClick={handleCopyPostLink}>
                                        Copy Blog URL
                                    </DropdownMenuItem>}
                                    <DropdownMenuItem className="cursor-pointer" onClick={handlePinPost}>
                                        {isPinnedByCurrentUser ? 'Unpin Post' : 'Pin Post'}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            ) : (
                                <DropdownMenuContent align="end" className="w-48">
                                    {isBlog && <DropdownMenuItem className="cursor-pointer" onClick={handleCopyPostLink}>
                                        Copy Blog URL
                                    </DropdownMenuItem>}
                                    <DropdownMenuItem className="cursor-pointer" onClick={handlePinPost}>
                                        {isPinnedByCurrentUser ? 'Unpin Post' : 'Pin Post'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer" onClick={handleEditPost}>
                                        Edit {isBlog ? 'Blog' : 'Post'}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                                        disabled={isDeleting || isRepostDeleting}
                                        onClick={handleDeletePost}
                                    >
                                        {(isDeleting || isRepostDeleting) ? 'Deleting...' : `Delete ${isBlog ? 'Blog' : 'Post'}`}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            )}
                        </DropdownMenu>
                    </div>
                }
                {
                    !post?.repost_id &&
                    <div className="flex items-center gap-2">
                        {isPinnedByCurrentUser && <Pin size={20} strokeWidth={1.5} className="text-[#FF0000] cursor-pointer" onClick={handlePinPost} />}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="focus:outline-none">
                                    <EllipsisVertical className='w-6 h-6 text-gray-400 dark:text-white cursor-pointer' />
                                </button>
                            </DropdownMenuTrigger>
                            {Number(user?.id) !== Number(createdById) ? (
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem className="cursor-pointer" onClick={handleViewProfile}>
                                        View Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer" onClick={handleCopyProfileLink}>
                                        Copy Profile Link
                                    </DropdownMenuItem>
                                    {isBlog && <DropdownMenuItem className="cursor-pointer" onClick={handleCopyPostLink}>
                                        Copy Blog URL
                                    </DropdownMenuItem>}
                                    <DropdownMenuItem className="cursor-pointer" onClick={handlePinPost}>
                                        {isPinnedByCurrentUser ? 'Unpin Post' : 'Pin Post'}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            ) : (
                                <DropdownMenuContent align="end" className="w-48">
                                    {isBlog && <DropdownMenuItem className="cursor-pointer" onClick={handleCopyPostLink}>
                                        Copy Blog URL
                                    </DropdownMenuItem>}
                                    <DropdownMenuItem className="cursor-pointer" onClick={handlePinPost}>
                                        {isPinnedByCurrentUser ? 'Unpin Post' : 'Pin Post'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer" onClick={handleEditPost}>
                                        Edit {isBlog ? 'Blog' : 'Post'}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                                        disabled={isDeleting}
                                        onClick={handleDeletePost}
                                    >
                                        {isDeleting ? 'Deleting...' : `Delete ${isBlog ? 'Blog' : 'Post'}`}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            )}
                        </DropdownMenu>
                    </div>
                }
            </div>
            {/* Repost Dialog for editing */}
            {post.repost_id && (
                <RepostDialog
                    post={post}
                    open={isRepostDialogOpen}
                    isEdit={true}
                    repostId={post.repost_id}
                    onOpenChange={setIsRepostDialogOpen}
                />
            )}
        </>
    );
});

PostHeader.displayName = 'PostHeader';

export default PostHeader;
