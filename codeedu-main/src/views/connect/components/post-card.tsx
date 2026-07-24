import { Post } from '@/@types/connect/posts';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useFetchPostComments, useLikePost, useSendComment } from '@/hooks/data/connect/usePosts';
import React, { useState, useCallback, lazy, useMemo } from 'react'
import { useNavigate } from 'react-router-dom';
import MediaGallery from './post-card/MediaGallery';
import PostHeader from './post-card/PostHeader';
import PostContent from './post-card/PostContent';
import PostActions from './post-card/PostActions';
import PostInteractionBar from './post-card/PostInteractionBar';
import CommentsList from './post-card/CommentsList';
import { isBlogStyleFeedPost } from './post-card/blogStylePost';
import { getGalleryImageUrls } from '@/utils/postGalleryImages';

const RepostDialog = lazy(() => import('./RepostDialog'));

interface PostCardProps {
    post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const [comment, setComment] = useState('');
    const [toggleShowComments, setToggleShowComments] = useState(false);
    const [visibleCommentsCount, setVisibleCommentsCount] = useState(3);
    const [expandedPosts, setExpandedPosts] = useState<Record<number, boolean>>({});
    const [showRepostDialog, setShowRepostDialog] = useState(false);

    const navigate = useNavigate();
    /** Same thread id as `sendComment` / detail page — must match `get-comments-list/:id`. */
    const commentThreadId = post.repost_id || post.id;
    /** Fetch comments only when expanded to prevent a flood of eager API requests on render. */
    const { data: comments = [], isFetched, isError } = useFetchPostComments(commentThreadId, toggleShowComments);
    const displayCommentCount =
        isFetched && !isError ? comments.length : (post.comment_count ?? 0);

    const likeMutation = useLikePost();
    const sendCommentMutation = useSendComment();

    // Memoized callbacks for better performance
    const togglePostExpansion = useCallback(() => {
        setExpandedPosts(prev => ({
            ...prev,
            [post.id]: !prev[post.id]
        }));
    }, [post.id]);

    const sendComment = useCallback(() => {
        if (comment.trim() === '') return;
        sendCommentMutation.mutate({
            post: post,
            content: comment,
        });
        setComment('');
        setToggleShowComments(true);
    }, [comment, post, sendCommentMutation]);

    const loadMoreComments = useCallback(() => {
        setVisibleCommentsCount(prev => prev + 3);
    }, []);

    const handleLikeClick = useCallback(() => {
        likeMutation.mutate(post);
    }, [likeMutation, post]);

    const handleCommentClick = useCallback(() => {
        setToggleShowComments(prev => !prev);
    }, []);

    const handleRepostClick = useCallback(() => {
        setShowRepostDialog(true);
    }, []);

    const getPostDetailUrl = useCallback((p: Post) => {
        let url = `/connect/post/${p.id}`;
        const params = new URLSearchParams();
        if (p.created_at) params.set('created_at', String(p.created_at));
        if (p.repost_id) {
            params.set('repost_id', String(p.repost_id));
            if (p.repost_user_id) params.set('repost_user_id', String(p.repost_user_id));
            if (p.repost_user_name) params.set('repost_user_name', p.repost_user_name);
            if (p.repost_description) params.set('repost_description', p.repost_description);
            if (p.repost_created_at) params.set('repost_created_at', p.repost_created_at);
            if (p.repost_user_profile_image) params.set('repost_user_profile_image', p.repost_user_profile_image);
        }
        const queryString = params.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
        return url;
    }, []);

    const handleMediaClick = useCallback(() => {
        if (post.post_type === 'event') {
            navigate(`/collaborate/agenda/details/${post.reference_id}`);
        } else if (isBlogStyleFeedPost(post)) {
            const slug = post?.title
                ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                : 'post';
            navigate(`/connect/blogs/${slug}/pid?pid=${post.id}`);
        } else {
            navigate(getPostDetailUrl(post));
        }
    }, [navigate, post, getPostDetailUrl]);

    const handleTitleClick = useCallback(() => {
        if (post.post_type === 'event') {
            navigate(`/collaborate/agenda/details/${post.reference_id}`);
        } else if (isBlogStyleFeedPost(post)) {
            const slug = post?.title
                ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                : 'post';
            navigate(`/connect/blogs/${slug}/pid?pid=${post.id}${post.created_at ? `&created_at=${post.created_at}` : ''}`);
        } else {
            navigate(getPostDetailUrl(post));
        }
    }, [navigate, post, getPostDetailUrl]);

    const handleCommentChange = useCallback((value: string) => {
        setComment(value);
    }, []);

    const hasMoreComments = comments.length > visibleCommentsCount;
    const isBlogPost = isBlogStyleFeedPost(post);
    const galleryUrls = useMemo(() => getGalleryImageUrls(post), [post]);
    /** Blog posts with a gallery (thumbnail + uploads + HTML imgs): left column slider, right column text only. */
    const showBlogGallery = isBlogPost && galleryUrls.length > 0;
    const hasMedia = galleryUrls.length > 0;
    const galleryPost = useMemo(
        () => ({ ...post, multi_file_uploads: galleryUrls }),
        [post, galleryUrls]
    );

    return (
        <Card key={post.id} className='mb-4 dark:bg-[#323232]'>
            <CardContent>
                {post.repost_id && <div className='mb-3 border-b pb-3 border-[#747474]'>
                    <PostHeader
                        repost
                        post={post}
                    />
                    <div className='text-sm text-gray-500 dark:text-white'>
                        {
                            post?.repost_description
                        }
                    </div>
                </div>}
                <div className='grid grid-cols-1 md:grid-cols-5 gap-4 md:items-stretch'>
                    {hasMedia && (
                        <MediaGallery
                            post={galleryPost}
                            onMediaClick={handleMediaClick}
                        />
                    )}
                    <div
                        className={`${hasMedia ? 'col-span-1 md:col-span-3' : 'col-span-1 md:col-span-5'} flex min-h-0 min-w-0 flex-col ${hasMedia ? 'md:h-full' : ''}`}
                    >
                        <div className='min-h-0 flex-1'>
                            <PostHeader
                                post={post}
                            />
                            <PostContent
                                post={post}
                                omitDescriptionImages={showBlogGallery}
                                isExpanded={expandedPosts[post.id] || false}
                                onToggleExpand={togglePostExpansion}
                                onTitleClick={handleTitleClick}
                            />
                            <PostActions
                                post={{ ...post, comment_count: displayCommentCount }}
                                onCommentClick={handleCommentClick}
                                onRepostClick={handleRepostClick}
                            />
                        </div>

                        <PostInteractionBar
                            post={post}
                            comment={comment}
                            isSubmitting={sendCommentMutation.isPending}
                            onCommentChange={handleCommentChange}
                            onCommentSubmit={sendComment}
                            onLikeClick={handleLikeClick}
                            onRepostClick={handleRepostClick}
                        />
                    </div>
                </div>
            </CardContent>

            {toggleShowComments && (
                <CardFooter>
                    <div className='border-t border-gray-600 dark:border-gray-700 pt-4 w-full'>
                        <CommentsList
                            comments={comments}
                            visibleCount={visibleCommentsCount}
                            hasMore={hasMoreComments}
                            onLoadMore={loadMoreComments}
                        />
                    </div>
                </CardFooter>
            )}
            <RepostDialog
                post={post}
                open={showRepostDialog}
                onOpenChange={setShowRepostDialog}
            />
        </Card>
    )
}

export default PostCard
