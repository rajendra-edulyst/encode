import { Post } from '@/@types/connect/posts';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/ShadcnButton';
import { Input } from '@/components/ui/ShadcnInput';
import appConfig from '@/configs/app.config';
import { useFetchPostComments, useLikePost, useSendComment } from '@/hooks/data/connect/usePosts';
import formatRelativeOrLong from '@/utils/formatDate';
import { stripHtmlTags } from '@/utils/stripHtmlTags';
import { Dot, Loader, SendHorizontal, ChevronLeft, ChevronRight, Play, Volume2, VolumeX, Images } from 'lucide-react';
import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import RepostDialog from './RepostDialog';
import { toast } from 'sonner';
import { useSessionUser } from '@/store/authStore';

interface PostCardProps {
    post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {

    const [comment, setComment] = useState('');
    const [toggleShowComments, setToggleShowComments] = useState(false);
    const [visibleCommentsCount, setVisibleCommentsCount] = useState(3);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
    const [allImagesDimensions, setAllImagesDimensions] = useState<Map<number, { width: number; height: number }>>(new Map());
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [videoProgress, setVideoProgress] = useState(0);
    const [showRepostDialog, setShowRepostDialog] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const navigate = useNavigate();
    const { data: comments = [] } = useFetchPostComments(post.repost_id || post.id, toggleShowComments);
    const profileServiceid = appConfig?.organization?.profileServiceid;
    const currentUserId = useSessionUser(state => state.user?.id);
    const isRebuzzed = post?.repost_id != null && post?.repost_user_id != null && post?.repost_user_id === currentUserId;

    const togglePostExpansion = (postId: number) => {
        setExpandedPosts(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const [expandedPosts, setExpandedPosts] = useState<Record<number, boolean>>({});
    const likeMutation = useLikePost();

    const sendCommentMutation = useSendComment();

    const sendComment = () => {
        if (comment.trim() === '') return;
        sendCommentMutation.mutate({
            post: post,
            content: comment,
        });
        setComment('');
        setToggleShowComments(true);
    }

    const loadMoreComments = () => {
        setVisibleCommentsCount(prev => prev + 3);
    }

    const visibleComments = comments.slice(0, visibleCommentsCount);
    const hasMoreComments = comments.length > visibleCommentsCount;

    // Handle multi_file_uploads with useMemo to prevent dependency issues
    const images = React.useMemo(() => {
        return post.multi_file_uploads && Array.isArray(post.multi_file_uploads) && post.multi_file_uploads.length > 0
            ? post.multi_file_uploads
            : (post.resource_path ? [post.thumbnail_url || post.resource_path] : []);
    }, [post.multi_file_uploads, post.resource_path, post.thumbnail_url]);

    const hasImages = images.length > 0;
    const hasMultipleImages = images.length > 1;

    // Helper function to check if URL is a video
    const isVideoUrl = (url: string): boolean => {
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
        const lowerUrl = url.toLowerCase();
        return videoExtensions.some(ext => lowerUrl.includes(ext));
    };

    // Check if current media is video
    const currentMedia = images[currentImageIndex];
    const isCurrentVideo = currentMedia ? isVideoUrl(currentMedia) : false;

    // Video control handlers
    const handlePlayPause = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const handleMuteToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleVideoTimeUpdate = () => {
        if (videoRef.current) {
            setVideoProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
        }
    };

    const handleVideoClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handlePlayPause(e);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        setImageLoaded(false);
        setImageDimensions(null);
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        setImageLoaded(false);
        setImageDimensions(null);
    };

    // Calculate aspect ratio and determine container height
    const getImageContainerClass = () => {
        // If we have multiple images, calculate the maximum height needed
        if (hasMultipleImages && allImagesDimensions.size === images.length) {
            let maxHeight = 400; // Default

            allImagesDimensions.forEach((dims) => {
                const aspectRatio = dims.width / dims.height;
                let height = 400;

                if (aspectRatio > 2.5) height = 250;
                else if (aspectRatio > 2) height = 300;
                else if (aspectRatio > 1.5) height = 400;
                else if (aspectRatio > 1.2) height = 400;
                else if (aspectRatio >= 0.9 && aspectRatio <= 1.1) height = 450;
                else if (aspectRatio > 0.6) height = 500;
                else height = 550;

                maxHeight = Math.max(maxHeight, height);
            });

            return `h-[${maxHeight}px]`;
        }

        // For single images or while loading, use current image dimensions
        if (!imageDimensions) return 'h-[400px]'; // Default height while loading

        const { width, height } = imageDimensions;
        const aspectRatio = width / height;

        // Wide images (landscape) - e.g., 1400x300
        if (aspectRatio > 2.5) {
            return 'h-[250px]';
        }
        // Very wide images - e.g., 1600x400
        else if (aspectRatio > 2) {
            return 'h-[300px]';
        }
        // Standard landscape - e.g., 1200x800
        else if (aspectRatio > 1.5) {
            return 'h-[400px]';
        }
        // Slightly landscape - e.g., 800x600
        else if (aspectRatio > 1.2) {
            return 'h-[400px]';
        }
        // Square images - e.g., 300x300
        else if (aspectRatio >= 0.9 && aspectRatio <= 1.1) {
            return 'h-[450px]';
        }
        // Portrait images - e.g., 400x600
        else if (aspectRatio > 0.6) {
            return 'h-[500px]';
        }
        // Very tall portrait - e.g., 300x800
        else {
            return 'h-[550px]';
        }
    };

    // Handle image load to get dimensions
    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        const dims = {
            width: img.naturalWidth,
            height: img.naturalHeight
        };

        setImageDimensions(dims);
        setImageLoaded(true);

        // Store dimensions for this image index
        if (hasMultipleImages) {
            setAllImagesDimensions(prev => {
                const newMap = new Map(prev);
                newMap.set(currentImageIndex, dims);
                return newMap;
            });
        }
    };

    // Reset image state when changing posts
    React.useEffect(() => {
        setCurrentImageIndex(0);
        setImageLoaded(false);
        setImageDimensions(null);
        setAllImagesDimensions(new Map());
        setIsPlaying(false);
        setIsMuted(true);
        setVideoProgress(0);
    }, [post.id]);

    // Reset video state when changing media
    React.useEffect(() => {
        setIsPlaying(false);
        setVideoProgress(0);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, [currentImageIndex]);

    // Preload all images to get their dimensions for consistent height
    React.useEffect(() => {
        if (hasMultipleImages && images.length > 0) {
            const loadPromises = images.map((src, index) => {
                return new Promise<void>((resolve) => {
                    const img = new Image();
                    img.onload = () => {
                        setAllImagesDimensions(prev => {
                            const newMap = new Map(prev);
                            newMap.set(index, {
                                width: img.naturalWidth,
                                height: img.naturalHeight
                            });
                            return newMap;
                        });
                        resolve();
                    };
                    img.onerror = () => resolve(); // Continue even if image fails
                    img.src = src;
                });
            });

            Promise.all(loadPromises);
        }
    }, [images, hasMultipleImages]);

    return (
        <Card key={post.id} className='mb-4 dark:bg-[#323232]'>
            <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
                    {
                        hasImages && (
                            <div className='col-span-2 relative group'>
                                <div
                                    className={`cursor-pointer relative overflow-hidden rounded-lg bg-gray-900/10 dark:bg-gray-950/20 transition-all duration-300 ${getImageContainerClass()}`}
                                    onClick={() => navigate(`/connect/post/${post.id}`)}
                                >
                                    {/* Loading skeleton */}
                                    {!imageLoaded && !isCurrentVideo && (
                                        <div className='absolute inset-0 bg-gray-700/50 dark:bg-gray-800/50 animate-pulse flex items-center justify-center'>
                                            <Loader className='w-8 h-8 text-primary animate-spin' />
                                        </div>
                                    )}
                                    {/* Render Video */}
                                    {isCurrentVideo ? (
                                        <div className='relative w-full h-full group/video'>
                                            <video
                                                ref={videoRef}
                                                playsInline
                                                src={currentMedia}
                                                className='w-full h-full rounded-lg object-cover'
                                                muted={isMuted}
                                                onTimeUpdate={handleVideoTimeUpdate}
                                                onEnded={() => setIsPlaying(false)}
                                                onLoadedData={() => setImageLoaded(true)}
                                                onClick={handleVideoClick}
                                            />
                                            {/* Play/Pause Overlay */}
                                            <div
                                                className='absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 opacity-0 group-hover/video:opacity-100'
                                                onClick={handleVideoClick}
                                            >
                                                {!isPlaying && (
                                                    <div className='bg-black/70 dark:bg-black/80 rounded-full p-6 backdrop-blur-sm shadow-2xl'>
                                                        <Play className='w-12 h-12 text-white' fill='white' />
                                                    </div>
                                                )}
                                            </div>
                                            {/* Video Controls */}
                                            <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-0 opacity-0 group-hover/video:opacity-100 transition-opacity duration-300'>
                                                {/* Progress Bar */}
                                                <div className='mb-0'>
                                                    <div className='h-1.5 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm'>
                                                        <div
                                                            className='h-full bg-primary transition-all duration-200'
                                                            style={{ width: `${videoProgress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                className='bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 absolute top-3 right-3'
                                                aria-label={isMuted ? 'Unmute' : 'Mute'}
                                                onClick={handleMuteToggle}
                                            >
                                                {isMuted ? (
                                                    <VolumeX className='w-5 h-5' />
                                                ) : (
                                                    <Volume2 className='w-5 h-5' />
                                                )}
                                            </button>
                                            {/* Video Badge */}
                                            <div className='absolute top-3 left-3 bg-black/70 dark:bg-black/80 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm flex items-center gap-2'>
                                                <Play className='w-3.5 h-3.5' fill='white' />
                                                <span>Video</span>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Render Image */
                                        <img
                                            src={images[currentImageIndex] || '/img/default.png'}
                                            alt={post.title}
                                            className={`w-full h-full rounded-lg object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                                                }`}
                                            onLoad={handleImageLoad}
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                if (target.src !== '/img/default.png') {
                                                    target.src = '/img/default.png';
                                                }
                                                setImageLoaded(true);
                                            }}
                                        />
                                    )}

                                    {/* Image counter badge */}
                                    {hasMultipleImages && (
                                        <>
                                            <div className='absolute top-3 right-3 bg-black/70 dark:bg-black/80 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm'>
                                                {currentImageIndex + 1} / {images.length}
                                            </div>
                                            <Images className='absolute bottom-3 left-3 mix-blend-difference' />
                                        </>
                                    )}

                                    {/* Aspect ratio indicator (for debugging - remove in production) */}
                                    {(imageDimensions && window.location.hostname === 'localhost') && (
                                        <div className='absolute top-3 left-3 bg-blue-600/80 text-white px-2 py-1 rounded text-xs font-mono backdrop-blur-sm'>
                                            {imageDimensions.width}×{imageDimensions.height}
                                        </div>
                                    )}
                                </div>
                                {/* Navigation buttons for multiple images */}
                                {hasMultipleImages && (
                                    <>
                                        <button
                                            className='absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 dark:bg-black/75 hover:bg-black/80 dark:hover:bg-black/90 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm shadow-lg'
                                            aria-label='Previous image'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePrevImage();
                                            }}
                                        >
                                            <ChevronLeft size={20} strokeWidth={2.5} />
                                        </button>
                                        <button
                                            className='absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 dark:bg-black/75 hover:bg-black/80 dark:hover:bg-black/90 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm shadow-lg'
                                            aria-label='Next image'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleNextImage();
                                            }}
                                        >
                                            <ChevronRight size={20} strokeWidth={2.5} />
                                        </button>
                                    </>
                                )}
                            </div>
                        )
                    }
                    <div className={`${hasImages ? 'col-span-3' : 'col-span-5'} flex flex-col`}>
                        <div className='flex-grow'>
                            <div>
                                <div className='flex items-center text-primary dark:text-primary/90 gap-2'>
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" className="w-6 h-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"></path></svg>
                                    <span className='text-primary dark:text-primary/90 text-base font-bold'>{post?.organization_name}</span>
                                </div>
                                <div className='flex items-center gap-2 mt-2 mb-4'>
                                    <div className='flex items-center gap-2 cursor-pointer' onClick={() => navigate(`/portfolio/${profileServiceid}/${post?.created_by}`)}>
                                        <img src={post?.created_by_profile_image ?? ''} alt={post?.organization_name} className='w-6 h-6 rounded-full' />
                                        <h3 className='text-sm font-semibold text-white dark:text-gray-200'>{post?.name}</h3>
                                    </div>
                                    {
                                        post?.created_at && <div className='flex items-center gap-1'>
                                            <Dot size={25} className='text-codegreen dark:text-green-400' />
                                            <span className='text-sm font-semibold text-white dark:text-gray-200'>{formatRelativeOrLong(post?.created_at)}</span>
                                        </div>
                                    }
                                </div>
                            </div>
                            <h2 className='text-xl font-bold text-white dark:text-gray-100 mb-4 cursor-pointer' onClick={() => navigate(`/connect/post/${post?.id}`)}>{post?.title}</h2>
                            <div className='text-gray-300 dark:text-gray-400 border-b border-gray-600 dark:border-gray-700 pb-4 mb-4'>
                                <div className={`${expandedPosts?.[post.id] ? '' : 'line-clamp-4'}`}>
                                    {stripHtmlTags(post?.description)}
                                </div>
                                {post?.description && stripHtmlTags(post?.description).split('\n').length > 4 && (
                                    <button
                                        className='text-primary dark:text-primary/90 font-semibold mt-2 hover:underline'
                                        onClick={() => togglePostExpansion(post?.id)}
                                    >
                                        {expandedPosts[post?.id] ? 'See less' : 'See more'}
                                    </button>
                                )}
                            </div>
                            <div>
                                <div className='flex items-center gap-10 text-gray-400 dark:text-gray-500'>
                                    <div className='flex items-center cursor-pointer'>
                                        {
                                            post?.user_liked ? (
                                                <img src="/img/icons/connect/Applaud_Full.png" alt="Liked" className="w-6 h-6 inline-block cursor-pointer" />
                                            ) : (
                                                <img src="/img/icons/connect/Applaud_Empty.png" alt="Like" className="w-6 h-6 inline-block cursor-pointer" />
                                            )
                                        }
                                        <span className='ml-2 align-middle text-white dark:text-gray-200 font-bold'>{post?.like_count}</span>
                                    </div>
                                    <div className='flex items-center cursor-pointer' onClick={() => setToggleShowComments(!toggleShowComments)}>
                                        <img src="/img/icons/connect/Comment_Full.png" alt="Comment" className="w-6 h-6 inline-block cursor-pointer" />
                                        <span className='ml-2 align-middle text-white dark:text-gray-200 font-bold'>{post?.comment_count}</span>
                                    </div>
                                    <div className='flex items-center cursor-pointer' onClick={() => setShowRepostDialog(true)}>
                                        <img src="/img/icons/connect/share_windows.png" alt="Share" className="w-5 h-5 inline-block cursor-pointer" />
                                        <span className='ml-2 align-middle text-white dark:text-gray-200 font-bold'>{post?.repost_count}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center mt-8 gap-4'>
                            <div className='bg-primary dark:bg-primary/90 p-3 rounded-lg h-full w-[126px] flex flex-col justify-center items-center text-center text-black dark:text-gray-900 cursor-pointer hover:bg-primary/90 dark:hover:bg-primary transition-colors' onClick={() => likeMutation.mutate(post)}>
                                {
                                    <img src={post?.user_liked ? "/img/icons/connect/Applaud_Black_Full.png" : "/img/icons/connect/Applaud_Black_Empty.png"} alt="Liked" className="w-6 h-6 inline-block cursor-pointer" />
                                }
                                {
                                    post?.user_liked ? 'Applauded' : 'Applaud'
                                }
                            </div>
                            <div className='w-full'>
                                <div className='flex justify-between mb-2'>
                                    <div
                                        className={`flex items-center px-1 ${isRebuzzed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        onClick={() => {
                                            if (isRebuzzed) {
                                                toast.error("You are already rebuzzed this", { id: "already-rebuzzed" });
                                            } else {
                                                setShowRepostDialog(true);
                                            }
                                        }}
                                        onMouseEnter={() => {
                                            if (isRebuzzed) {
                                                toast.error("You are already rebuzzed this", { id: "already-rebuzzed" });
                                            }
                                        }}
                                        title={isRebuzzed ? "You are already rebuzzed this" : undefined}
                                    >
                                        <img src='/img/icons/connect/share_windows_white.png' alt='Comment' className='w-5 h-5 inline-block' />
                                        <span className='ml-2 align-middle text-white dark:text-gray-200 text-sm'>re-Buzz</span>
                                    </div>
                                </div>
                                <div className='relative'>
                                    <Input className='w-full h-[50px] rounded-xl dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400' placeholder='Add your Spark'
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                    {
                                        sendCommentMutation?.isPending ? (
                                            <Loader className='absolute right-3 top-1/2 transform -translate-y-1/2 text-primary animate-spin' />
                                        ) : (
                                            <SendHorizontal className='absolute right-3 top-1/2 transform -translate-y-1/2 text-primary dark:text-primary/90 cursor-pointer hover:text-primary/80 dark:hover:text-primary transition-colors'
                                                onClick={sendComment}
                                            />
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
            {
                toggleShowComments &&
                <CardFooter>
                    <div className='border-t border-gray-600 dark:border-gray-700 pt-4 w-full'>
                        {
                            comments && comments.length > 0 && (
                                <div className='flex flex-col gap-6'>
                                    {
                                        visibleComments.map(comment => (
                                            <div key={comment.id} className='flex items-start justify-between'>
                                                <div className='flex items-start'>
                                                    <img src={comment.profile_image ?? ''} alt={comment.user_name} className='w-12 h-12 rounded-full mr-2 border border-gray-600 dark:border-gray-700' />
                                                    <div className='flex flex-col'>
                                                        <span className='text-base font-bold text-white dark:text-gray-200'>{comment.name}</span>
                                                        <span className='text-sm text-white dark:text-gray-300'>{comment.content}</span>
                                                    </div>
                                                </div>
                                                <div className='text-gray-400 dark:text-gray-500 text-sm'>
                                                    {formatRelativeOrLong(comment.created_at)}
                                                </div>
                                            </div>
                                        ))
                                    }
                                    {
                                        hasMoreComments && (
                                            <div className='flex justify-center'>
                                                <Button
                                                    variant='outline'
                                                    className='text-white dark:text-gray-200 bg-transparent border-none h-7 rounded-lg bg-[#535353] dark:bg-gray-700 hover:bg-[#636363] dark:hover:bg-gray-600'
                                                    onClick={loadMoreComments}
                                                >
                                                    Load More
                                                </Button>
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        }
                        {
                            comments.length === 0 && (
                                <div className='text-gray-400 dark:text-gray-500'>
                                    No comments yet. Be the first to comment!
                                </div>
                            )
                        }
                    </div>
                </CardFooter>
            }

            {/* Repost Dialog */}
            <RepostDialog
                post={post}
                open={showRepostDialog}
                onOpenChange={setShowRepostDialog}
            />
        </Card>
    )
}

export default PostCard