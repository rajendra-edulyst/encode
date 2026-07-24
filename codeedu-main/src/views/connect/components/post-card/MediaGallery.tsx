import { ChevronLeft, ChevronRight, Images, Loader, Play, Volume2, VolumeX } from 'lucide-react';
import React, { useState, useRef, useEffect, useMemo } from 'react';

interface MediaGalleryProps {
    post: {
        id: number;
        title: string;
        multi_file_uploads?: string[];
    };
    onMediaClick: () => void;
}

const MediaGallery: React.FC<MediaGalleryProps> = React.memo(({ post, onMediaClick }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [videoProgress, setVideoProgress] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);


    const images = useMemo(() => {
        return post.multi_file_uploads && Array.isArray(post.multi_file_uploads) && post.multi_file_uploads.length > 0 ? post.multi_file_uploads : [];
    }, [post.multi_file_uploads]);

    const hasImages = images.length > 0;
    const hasMultipleImages = images.length > 1;


    const isVideoUrl = useMemo(() => {
        return (url: string): boolean => {
            const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
            const lowerUrl = url.toLowerCase();
            return videoExtensions.some(ext => lowerUrl.includes(ext));
        };
    }, []);

    const currentMedia = images[currentImageIndex];
    const isCurrentVideo = currentMedia ? isVideoUrl(currentMedia) : false;


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

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        setImageLoaded(false);
        setImageDimensions(null);
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        setImageLoaded(false);
        setImageDimensions(null);
    };


    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        const dims = {
            width: img.naturalWidth,
            height: img.naturalHeight
        };
        setImageDimensions(dims);
        setImageLoaded(true);

    };


    useEffect(() => {
        setCurrentImageIndex(0);
        setImageLoaded(false);
        setImageDimensions(null);
        setIsPlaying(false);
        setIsMuted(true);
        setVideoProgress(0);
    }, [post.id]);

    useEffect(() => {
        setIsPlaying(false);
        setVideoProgress(0);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, [currentImageIndex]);


    if (!hasImages) return null;

    return (
        <div className='col-span-1 md:col-span-2 relative group flex h-full min-h-0 w-full max-w-full flex-col'>
            <div
                className='relative flex min-h-[240px] w-full min-w-0 flex-1 cursor-pointer flex-col overflow-hidden rounded-xl bg-gray-900/5 shadow-sm transition-all duration-500 hover:shadow-md dark:bg-gray-950/40 md:min-h-0'
                onClick={onMediaClick}
            >
                {/* Image background blur effect for better aesthetics */}
                {!isCurrentVideo && images[currentImageIndex] && (
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center blur-2xl opacity-30 scale-110 transition-opacity duration-700"
                        style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
                    />
                )}

                {/* Loading skeleton */}
                {!imageLoaded && !isCurrentVideo && (
                    <div className='absolute inset-0 z-20 bg-gray-200/50 dark:bg-gray-800/50 animate-pulse flex items-center justify-center backdrop-blur-sm'>
                        <Loader className='w-8 h-8 text-primary animate-spin' />
                    </div>
                )}

                {/* Video Player */}
                {isCurrentVideo ? (
                    <div className='group/video relative z-10 flex min-h-0 w-full flex-1 flex-col'>
                        <video
                            ref={videoRef}
                            playsInline
                            src={currentMedia}
                            className='min-h-0 w-full flex-1 rounded-lg bg-black object-contain'
                            muted={isMuted}
                            onTimeUpdate={handleVideoTimeUpdate}
                            onEnded={() => setIsPlaying(false)}
                            onLoadedData={() => setImageLoaded(true)}
                            onClick={handleVideoClick}
                        />
                        <div
                            className='absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300 opacity-0 group-hover/video:opacity-100'
                            onClick={handleVideoClick}
                        >
                            {!isPlaying && (
                                <div className='bg-black/60 dark:bg-black/80 rounded-full p-5 backdrop-blur-md shadow-2xl scale-90 group-hover/video:scale-100 transition-transform duration-300'>
                                    <Play className='w-10 h-10 text-white' fill='white' />
                                </div>
                            )}
                        </div>
                        <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 group-hover/video:opacity-100 transition-opacity duration-300'>
                            <div className='h-1.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm'>
                                <div
                                    className='h-full bg-primary transition-all duration-200'
                                    style={{ width: `${videoProgress}%` }}
                                />
                            </div>
                        </div>
                        <button
                            className='bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-full backdrop-blur-md transition-all duration-200 hover:scale-110 absolute top-3 right-3 z-30'
                            aria-label={isMuted ? 'Unmute' : 'Mute'}
                            onClick={handleMuteToggle}
                        >
                            {isMuted ? <VolumeX className='w-5 h-5' /> : <Volume2 className='w-5 h-5' />}
                        </button>
                    </div>
                ) : (
                    /* Image */
                    <div className="relative z-10 flex min-h-0 w-full flex-1 items-center justify-center p-1">
                        <img
                            src={images[currentImageIndex] || '/img/default.png'}
                            alt={post.title}
                            className={`max-w-full max-h-full rounded-lg object-contain transition-all duration-700 ${imageLoaded ? 'opacity-100 scale-100 shadow-lg' : 'opacity-0 scale-95'}`}
                            onLoad={handleImageLoad}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (target.src !== '/img/default.png') {
                                    target.src = '/img/default.png';
                                }
                                setImageLoaded(true);
                            }}
                        />
                    </div>
                )}


                {hasImages && (
                    <>
                        <div className='absolute top-3 left-3 z-20 bg-black/60 dark:bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border border-white/10 shadow-lg'>
                            {currentImageIndex + 1} / {images.length}
                        </div>
                        <div className='absolute bottom-3 right-3 z-30 bg-black/60 dark:bg-black/70 text-white p-2 rounded-lg backdrop-blur-md border border-white/10 shadow-xl opacity-90'>
                            <Images className='w-4 h-4' />
                        </div>
                        {hasMultipleImages && (
                            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full'>
                                {images.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-4 bg-primary' : 'w-1.5 bg-white/50'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}


                {(imageDimensions && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) && (
                    <div className='absolute bottom-3 left-3 z-30 bg-blue-500/80 text-white px-2 py-1 rounded-md text-[10px] font-mono backdrop-blur-sm shadow-md'>
                        {imageDimensions.width}×{imageDimensions.height}
                    </div>
                )}
            </div>


            {hasMultipleImages && (
                <>
                    <button
                        type='button'
                        className='absolute left-2 top-1/2 -translate-y-1/2 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-black/65 text-white transition-all duration-200 hover:scale-110 hover:bg-black/80 shadow-[0_6px_18px_rgba(0,0,0,0.35)] backdrop-blur-sm'
                        aria-label='Previous image'
                        onClick={handlePrevImage}
                    >
                        <ChevronLeft size={20} strokeWidth={3.25} />
                    </button>
                    <button
                        type='button'
                        className='absolute right-2 top-1/2 -translate-y-1/2 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-black/65 text-white transition-all duration-200 hover:scale-110 hover:bg-black/80 shadow-[0_6px_18px_rgba(0,0,0,0.35)] backdrop-blur-sm'
                        aria-label='Next image'
                        onClick={handleNextImage}
                    >
                        <ChevronRight size={20} strokeWidth={3.25} />
                    </button>
                </>
            )}
        </div>
    );
});

MediaGallery.displayName = 'MediaGallery';

export default MediaGallery;
