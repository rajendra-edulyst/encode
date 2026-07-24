import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/shadcnAvatar";
import { stripHtmlTags } from "@/utils/stripHtmlTags";
import { Post, PostComment } from "@community/types/community";
import { Button } from "@/components/ui/ShadcnButton";
import { usePostsStore } from "@community/store/postStore";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import RePost from "../repost";
import { useSessionUser } from "@/store/authStore";
import { toast } from "sonner";
import PostHeader from "./PostHeader";
import Comments from "./Comments";
import { fetchPostComments } from "../../services/PostService";
import PostActions from "./PostActions";
import Swal from "sweetalert2";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import FullPreview from "../../pages/wall/post/fullPreview";

interface PostCardProps {
    post: Post,
    is_repost?: boolean,
}

const PostCardView: React.FC<PostCardProps> = ({
    post,
    is_repost
}) => {

    const { deletePost, sendComment } = usePostsStore();
    const [openRepostDialog, setOpenRepostDialog] = useState(false);
    const [viewMore, setViewMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<PostComment[]>([]);
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)
    const [viewcarousel, setViewCarousel] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [initialIndex, setInitialIndex] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);

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
    const { name, email, profile_image, id: user_id } = useSessionUser((state) => state.user);

    const sendPostComment = (postId: number, comment: string, isRepost?: boolean) => {
        if (!comment.trim()) return;
        sendComment(postId, comment.trim(), isRepost);
        // top append in comments
        const newComment: PostComment = {
            id: Math.floor(Math.random() * 1000000),
            joy_content_id: postId,
            user_name: name ?? 'Unknown',
            name: name ?? 'Unknown',
            content: comment.trim(),
            created_at: Date.now()?.toString(),
            updated_at: Math.floor(Date.now() / 1000),
            level: 0,
            email: email ?? 'unknown@example.com',
            profile_image: profile_image ?? null,
            user_id: user_id ?? 0,
            parent_id: null,
        };

        setComments((prev) => [newComment, ...prev]);


    }

    const getPostComments = useCallback(async () => {
        if (!post.id) return;
        try {
            setLoading(true);
            const response = await fetchPostComments(post.repost_id || post.id);
            setComments(response);
        } catch (error) {
            console.error("Error fetching comments:", error);
            toast.error("Failed to fetch comments. Please try again later.");
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [post.id, post.repost_id, fetchPostComments, setComments]);

    const { id } = useSessionUser((state) => state.user);

    const deleteMyPost = (postId: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deletePost(postId);
                Swal.fire(
                    'Deleted!',
                    'Your post has been deleted.',
                    'success'
                );
            }
        });
    };

    const handleViewCarousel = () => {
        setViewCarousel(!viewcarousel)
    }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleImageClick = (files: any, index: number) => {
        setSelectedFiles(files);
        setInitialIndex(index);
        setOpenDialog(true);
        //  console.log("files", files)

    };

    return (
        <>
            <Card className="p-4 shadow-none border-[0.5px]  rounded-lg overflow-hidden">
                {!is_repost && <div className='flex gap-4 items-start'>
                    <div className='flex-1'>
                        <PostHeader post={post} isRepost={is_repost} userId={id} onDelete={deleteMyPost} />
                        <div className="mb-3 cursor-pointer">
                            <Link to={`/community/wall/post/${post.id}`}
                                onClick={() => window.scrollTo(0, 0)}
                            >
                                <h3 className="text-lg font-semibold mb-1 text-cblack">{post.title}</h3>
                                {!viewMore && <p className="text-sm line-clamp-2 text-cblack">{stripHtmlTags(post.description)}</p>}
                            </Link>
                            {viewMore && (
                                <p className="text-sm text-cblack" dangerouslySetInnerHTML={{ __html: post.description }}></p>
                            )}
                            {
                                stripHtmlTags(post.description).length > 320 &&
                                <Button variant="link" size="sm" className="text-primary hover:underline px-0 py-0" onClick={() => setViewMore(!viewMore)}>{viewMore ? 'Show less' : 'Read more'}</Button>
                            }
                        </div>
                        {
                            post?.content_type === '4' &&
                            <div className='mb-3 cursor-pointer'>
                                {!viewcarousel &&
                                    <div className={`grid grid-cols-1 ${post?.multi_file_uploads?.length > 1 ? 'md:grid-cols-3' : ''} gap-4`}>
                                        <div className={`mb-4 ${post?.multi_file_uploads?.length > 1 ? 'md:col-span-2' : ''}`}>
                                            <Link to={`/community/wall/post/${post.id}`}
                                                onClick={() => window.scrollTo(0, 0)}
                                            >
                                                {post.thumbnail_url && (
                                                    <img src={post.thumbnail_url} alt={post.title} className="w-full object-cover rounded-lg h-96" loading="lazy" />
                                                )}
                                            </Link>
                                        </div>
                                        <div className={`grid-cols-2 gap-4 relative ${post?.multi_file_uploads?.length > 1 ? 'md:col-span-1' : ''}`}>
                                            <Link to={`/community/wall/post/${post.id}`}
                                                onClick={() => window.scrollTo(0, 0)}
                                            >
                                                {
                                                    post?.multi_file_uploads?.length > 0 && post?.multi_file_uploads?.slice(1, 3).map((file, index) => (
                                                        <div key={index} className="mb-1">
                                                            <img src={file} alt={`Post image ${index + 1}`} className="w-full object-cover rounded-lg h-48 border" loading="lazy" />
                                                        </div>
                                                    ))
                                                }
                                            </Link>
                                            <Link to={`/community/wall/post/${post.id}`} onClick={() => window.scrollTo(0, 0)}>
                                                {post?.multi_file_uploads.length > 3 && (
                                                    <div className="absolute inset-0 bg-gradient-to-t rounded-md h-96">
                                                        <div className="absolute bottom-2 right-2 p-1 px-2 text-white bg-black/80 rounded-full">
                                                            <span
                                                                className="text-sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    e.preventDefault();
                                                                    handleViewCarousel();
                                                                }}
                                                            >
                                                                +{post?.multi_file_uploads.length - 3} more
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </Link>
                                        </div>
                                    </div>
                                }
                                {viewcarousel &&
                                    <Carousel setApi={setApi} className="relative">
                                        <CarouselContent>
                                            <CarouselItem>

                                                <div className="mb-2 border rounded-lg overflow-hidden">
                                                    <img src={post?.thumbnail_url} alt={`Post image`} className="w-full object-cover rounded-lg h-96" loading="lazy" onClick={() => handleImageClick(post?.multi_file_uploads, 0)} />
                                                </div>

                                            </CarouselItem>
                                            {post?.multi_file_uploads && post?.multi_file_uploads?.slice(1, 5)?.map((file, index) => (
                                                <CarouselItem key={index}>

                                                    <div className="mb-2 border rounded-lg overflow-hidden">
                                                        <img src={file} alt={`Post image ${index + 1}`} className="w-full object-cover rounded-lg h-96" loading="lazy" onClick={() => handleImageClick(post?.multi_file_uploads, index + 1)} />
                                                    </div>

                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        {/* show dots */}
                                        <div className="absolute bottom-2 left-0 right-0 p-2 z-40">
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
                                    </Carousel>
                                }
                                {/* Carousel ENDS */}
                            </div>
                        }
                        {
                            post?.content_type === '2' && (
                                <div className="mb-4 border rounded-lg overflow-hidden relative">
                                    <video controls src={post?.resource_path} className="w-full rounded-lg" />
                                </div>
                            )
                        }
                        {
                            post?.content_type === '16' &&
                            <div className='mb-3 cursor-pointer'>
                                <Link to={`${post?.reference_id ? post?.post_type === 'job' ? `/internship/${post?.reference_id}` : `/event-activity/${post?.reference_id}` : `/community/wall/post/${post.id}`}`}>
                                    {post.thumbnail_url && (
                                        <img src={post.thumbnail_url} alt={post.title} className="w-full object-cover rounded-lg h-96" loading="lazy" />
                                    )}
                                </Link>
                            </div>
                        }
                        <PostActions
                            post={post}
                            onCommentToggle={() => {
                                setShowComments(!showComments);
                                if (!comments.length) {
                                    getPostComments();
                                }
                            }}
                            onRepost={() => setOpenRepostDialog(true)}
                        />
                    </div>
                </div>}
                {
                    is_repost && <div className='flex gap-4 items-start'>
                        <div className='flex-1'>
                            <PostHeader post={post} isRepost={is_repost} userId={id} onDelete={deleteMyPost} />
                            <div className="mb-3 cursor-pointer">
                                {!viewMore && <p className="text-sm line-clamp-2 text-cblack">{stripHtmlTags(post?.repost_description || '')}</p>}
                                {viewMore && (
                                    <p className="text-sm text-cblack" dangerouslySetInnerHTML={{ __html: post?.repost_description || '' }}></p>
                                )}
                                {
                                    stripHtmlTags(post?.repost_description || '').length > 320 &&
                                    <Button variant="link" size="sm" className="text-primary hover:underline px-0 py-0" onClick={() => setViewMore(!viewMore)}>
                                        {viewMore ? 'Show less' : 'Read more'}
                                    </Button>
                                }
                            </div>
                            <div className='mb-3 cursor-pointer'>
                                <Link to={`/community/wall/post/${post.id}`} onClick={() => window.scrollTo(0, 0)}>
                                    {/* Shared Content Preview */}
                                    <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                                        <div className='flex-1'>
                                            <div>
                                                <div className='flex gap-2 mb-2 rounded-lg overflow-hidden cursor-pointer'>
                                                    <img src='/img/icons/people.png' className='w-5 h-5' loading="lazy" /> {post?.category_name || 'Community Name'}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={post.user_profile_image ?? `https://ui-avatars.com/api/?name=${post.name}`} alt={post.name} />
                                                        <AvatarFallback>{post?.name?.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="flex items-center text-xs text-cblack">
                                                            <span className='capitalize'>{post.name}</span>
                                                            <span className="mx-1">•</span>
                                                            <span>
                                                                { }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-3 cursor-pointer">
                                                <h3 className="text-lg font-semibold mb-1 text-cblack">{post.title}</h3>
                                                <p className="text-sm line-clamp-2 text-cblack">{stripHtmlTags(post.description) || ''}</p>
                                            </div>
                                            <div className='mb-3 cursor-pointer'>
                                                {post.thumbnail_url && (
                                                    <img src={post.thumbnail_url} alt={post.title} className="w-full object-cover rounded-lg h-48" loading="lazy" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <PostActions
                                post={post}
                                onCommentToggle={() => {
                                    setShowComments(!showComments);
                                    if (!comments.length) {
                                        getPostComments();
                                    }
                                }}
                                onRepost={() => setOpenRepostDialog(true)}
                            />
                        </div>
                    </div>
                }
                {comments && showComments && <Comments
                    postId={post.id}
                    loading={loading}
                    comments={comments}
                    sendComment={sendPostComment}
                    repost_id={post?.repost_id}
                />}

                <FullPreview
                    open={openDialog}
                    selectedFiles={selectedFiles}
                    initialIndex={initialIndex}
                    onClose={() => setOpenDialog(false)}
                />
            </Card>
            <RePost post={post} open={openRepostDialog} onOpenChange={setOpenRepostDialog} />
        </>
    );
};

export default PostCardView;