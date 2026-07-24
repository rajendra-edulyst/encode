import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, lazy, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import ConnectLayout from "../layouts";
import RightSidePanel from "../layouts/right-side-panel";
import PostActions from "../components/post-card/PostActions";
import PostInteractionBar from "../components/post-card/PostInteractionBar";
import CommentsList from "../components/post-card/CommentsList";
import { useFetchPostComments, useLikePost, usePostDetails, useSendComment } from "@/hooks/data/connect/usePosts";
import LoadingSection from "@/components/LoadingSection";
import PostHeader from "../components/post-card/PostHeader";
import { mergeBlogDescriptionWithServerUploads } from '@/utils/blogPostHtmlUpload';
import { getGalleryImageUrls } from '@/utils/postGalleryImages';


const RepostDialog = lazy(() => import('../components/RepostDialog'));



const PostDetails = () => {

    const { postId: paramPostId } = useParams<{ postId: string }>();
    const { search } = window.location;

    // extract pid from query if paramPostId is not set
    let queryPostId = parseInt(search.replace('?', '').replace('pid=', ''));
    if (isNaN(queryPostId)) {
        queryPostId = parseInt(new URLSearchParams(search).get('pid') ?? '0');
    }
    const finalPostId = paramPostId || (queryPostId ? queryPostId.toString() : undefined);

    const { data: fetchedPost, isLoading: loading } = usePostDetails(finalPostId);
    const post = useMemo(() => {
        if (!fetchedPost) return null;
        const searchParams = new URLSearchParams(window.location.search);
        const repost_id = searchParams.get('repost_id') ? Number(searchParams.get('repost_id')) : null;
        const url_created_at = searchParams.get('created_at');
        const created_at = url_created_at || fetchedPost.created_at;

        if (repost_id) {
            return {
                ...fetchedPost,
                repost_id,
                repost_user_id: searchParams.get('repost_user_id') ? Number(searchParams.get('repost_user_id')) : null,
                repost_user_name: searchParams.get('repost_user_name'),
                repost_description: searchParams.get('repost_description'),
                repost_created_at: searchParams.get('repost_created_at') || '',
                repost_user_profile_image: searchParams.get('repost_user_profile_image'),
                created_at,
                repost_count: 1,
            };
        }
        return {
            ...fetchedPost,
            created_at,
        };
    }, [fetchedPost]);

    const [comment, setComment] = useState('');
    const [toggleShowComments, setToggleShowComments] = useState(true);
    const [visibleCommentsCount, setVisibleCommentsCount] = useState(3);
    const [showRepostDialog, setShowRepostDialog] = useState(false);

    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)
    const galleryUrls = useMemo(() => (post ? getGalleryImageUrls(post as any) : []), [post]);
    const isBlogPost = String(post?.content_type) === '21';

    // Use optimized hooks from post-card
    const { data: fetchedComments = [] } = useFetchPostComments(Number(finalPostId), toggleShowComments);
    const likeMutation = useLikePost();
    const sendCommentMutation = useSendComment();

    // Callback handlers for post interactions
    const handleLikeClick = useCallback(() => {
        if (post) {
            likeMutation.mutate(post);
        }
    }, [likeMutation, post]);

    const handleCommentClick = useCallback(() => {
        setToggleShowComments(prev => !prev);
    }, []);

    const handleRepostClick = useCallback(() => {
        setShowRepostDialog(true);
    }, []);

    const sendCommentHandler = useCallback(() => {
        if (comment.trim() === '' || !post) return;
        sendCommentMutation.mutate({
            post: post,
            content: comment,
        });
        setComment('');
    }, [comment, post, sendCommentMutation]);

    const loadMoreComments = useCallback(() => {
        setVisibleCommentsCount(prev => prev + 3);
    }, []);

    const handleCommentChange = useCallback((value: string) => {
        setComment(value);
    }, []);

    const hasMoreComments = (fetchedComments?.length || 0) > visibleCommentsCount;


    useEffect(() => {
        if (!api) {
            return
        }
        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])


    return (
        <ConnectLayout active='encode'>
            <div className="w-full flex flex-col md:flex-row pb-6 gap-5">
                <div className="w-full md:w-[75%] space-y-6">
                    <LoadingSection isLoading={loading} title="Post Details" />
                    {post && <Card className="shadow-none border-none rounded-lg">
                        <CardContent>
                            <div className='flex gap-4 items-start'>
                                <div className='flex-1'>
                                    {post && post.repost_id && (
                                        <div className='mb-3 border-b pb-3 border-[#747474]'>
                                            <PostHeader
                                                repost
                                                post={post}
                                            />
                                            <div className='text-sm text-gray-500 dark:text-white'>
                                                {post?.repost_description}
                                            </div>
                                        </div>
                                    )}
                                    {post && <PostHeader post={post} />}
                                    {!isBlogPost && (
                                        <div className='mb-4'>
                                            {galleryUrls.length > 0 && galleryUrls && (
                                                <Carousel setApi={setApi} className="relative">
                                                    <CarouselContent>
                                                        {galleryUrls && galleryUrls?.slice(0, 5).map((file: string, index: number) => (
                                                            <CarouselItem key={index}>
                                                                {file && <div className="mb-2 border rounded-lg overflow-hidden cursor-pointer">
                                                                    <img
                                                                        src={file}
                                                                        alt={`Post image ${index + 1}`}
                                                                        className="w-full object-cover rounded-lg"
                                                                        onError={(e) => {
                                                                            const target = e.target as HTMLImageElement;
                                                                            target.style.display = 'none';
                                                                            if (target.parentElement) target.parentElement.style.display = 'none';
                                                                        }}
                                                                    />
                                                                </div>}
                                                            </CarouselItem>
                                                        ))}
                                                    </CarouselContent>
                                                    {galleryUrls.length > 1 && (
                                                        <>
                                                            <div className="absolute bottom-2 left-0 right-0 p-2">
                                                                <div className="flex justify-center items-center gap-2 mt-2">
                                                                    {Array.from({ length: count }).map((_, index) => (
                                                                        <button
                                                                            key={index}
                                                                            className={`h-3 rounded-full ${current === index + 1 ? 'bg-[#00A8E9] w-10' : 'w-3 bg-gray-300'}`}
                                                                            onClick={() => api?.scrollTo(index)}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 text-cblue border border-[#00A8E9]" />
                                                            <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cblue border border-[#00A8E9]" />
                                                        </>
                                                    )}
                                                </Carousel>
                                            )}

                                            {post?.content_type === '2' && (
                                                <div className="mb-4 border rounded-lg overflow-hidden relative">
                                                    <video controls src={post?.resource_path} className="w-full rounded-lg" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="mb-3">
                                        <h3 className="text-lg font-semibold mb-1 text-cblack dark:text-white">{post?.title}</h3>
                                        <div
                                            className="text-sm text-cblack dark:text-white prose max-w-none dark:prose-invert prose-ul:list-disc prose-ul:pl-5 prose-ol:list-disc prose-ol:pl-5 prose-a:text-blue-600 dark:prose-p:!bg-transparent dark:prose-p:!text-white dark:prose-strong:!bg-transparent dark:prose-strong:!text-white dark:prose-ul:!bg-transparent dark:prose-ul:!text-white blog-img-prose blog-img-prose--detail"
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    isBlogPost
                                                        ? mergeBlogDescriptionWithServerUploads(
                                                            post?.description ?? '',
                                                            post?.multi_file_uploads
                                                        )
                                                        : (post?.description ?? ''),
                                            }}
                                        />

                                    </div>
                                    {isBlogPost && (
                                        <div className='mb-3'>
                                            {galleryUrls.length > 0 && (
                                                <Carousel setApi={setApi} className="relative">
                                                    <CarouselContent>
                                                        {galleryUrls.slice(0, 6).map((file: string, index: number) => (
                                                            <CarouselItem key={index}>
                                                                {file && <div className="mb-2 border rounded-lg overflow-hidden cursor-pointer">
                                                                    <img
                                                                        src={file}
                                                                        alt={`Post image ${index + 1}`}
                                                                        className="w-full object-cover rounded-lg"
                                                                        onError={(e) => {
                                                                            const target = e.target as HTMLImageElement;
                                                                            target.style.display = 'none';
                                                                            if (target.parentElement) target.parentElement.style.display = 'none';
                                                                        }}
                                                                    />
                                                                </div>}
                                                            </CarouselItem>
                                                        ))}
                                                    </CarouselContent>
                                                    {galleryUrls.length > 1 && (
                                                        <>
                                                            <div className="absolute bottom-2 left-0 right-0 p-2">
                                                                <div className="flex justify-center items-center gap-2 mt-2">
                                                                    {Array.from({ length: count }).map((_, index) => (
                                                                        <button
                                                                            key={index}
                                                                            className={`h-3 rounded-full ${current === index + 1 ? 'bg-[#00A8E9] w-10' : 'w-3 bg-gray-300'}`}
                                                                            onClick={() => api?.scrollTo(index)}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 text-cblue border border-[#00A8E9]" />
                                                            <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cblue border border-[#00A8E9]" />
                                                        </>
                                                    )}
                                                </Carousel>
                                            )}

                                            {post?.content_type === '2' && (
                                                <div className="mb-4 border rounded-lg overflow-hidden relative">
                                                    <video controls src={post?.resource_path} className="w-full rounded-lg" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="border-t  pt-4 mt-5">
                                        <PostActions
                                            post={{
                                                ...post,
                                                comment_count: fetchedComments?.length || 0
                                            }}
                                            onCommentClick={handleCommentClick}
                                            onRepostClick={handleRepostClick}
                                        />
                                        <div className="mt-4">
                                            <PostInteractionBar
                                                post={post}
                                                comment={comment}
                                                isSubmitting={sendCommentMutation.isPending}
                                                onCommentChange={handleCommentChange}
                                                onCommentSubmit={sendCommentHandler}
                                                onLikeClick={handleLikeClick}
                                                onRepostClick={handleRepostClick}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Comments Section */}
                            {toggleShowComments && fetchedComments && fetchedComments.length > 0 && (
                                <div className="mt-6 border-t border-gray-600 dark:border-gray-700 pt-6" id="comments-section">
                                    <CommentsList
                                        comments={fetchedComments}
                                        visibleCount={visibleCommentsCount}
                                        hasMore={hasMoreComments}
                                        onLoadMore={loadMoreComments}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>}
                    {
                        !loading && !post && (
                            <div className="text-center py-10">
                                <p className="text-gray-500 dark:text-gray-400">Post not found.</p>
                            </div>
                        )
                    }
                </div>
                <div className="w-full md:w-[25%]">
                    <RightSidePanel />
                </div>
            </div>
            {/* Repost Dialog */}
            {post && (
                <RepostDialog
                    post={post}
                    open={showRepostDialog}
                    onOpenChange={setShowRepostDialog}
                />
            )}
        </ConnectLayout>


    );
}

export default PostDetails;

