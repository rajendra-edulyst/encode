import React, { useState, useMemo, useEffect } from 'react'
import ConnectLayout from '../layouts'
import { Button } from '@/components/ui/ShadcnButton'
import { Card, CardContent } from '@/components/ui/card'
import { usePosts } from '@/hooks/data/connect/usePosts'
import RightSidePanel from '../layouts/right-side-panel'
import { Link, useSearchParams } from 'react-router-dom'
import LoadingSection from '@/components/LoadingSection'
import PinnedBuzz from './components/PinnedBuzz'
import animatedImagesIcon from '@/assets/icons/animated_images.png'
import { BarChart3 } from 'lucide-react'
import OpinionPoll from '../components/OpinionPoll'
import { usePackageAccessCounts } from '@/hooks/data/usePackageAccessCounts'
import useAuth from '@/auth/useAuth'
import { isPinnedForUser } from '@/utils/postUtils'
import PostCard from '../components/post-card'
import { mixpanelService } from '@/services/mixpanel/MixpanelService'

const index = () => {
    const [searchParams] = useSearchParams();
    const { isAccessExhausted } = usePackageAccessCounts();
    const [visibleCount, setVisibleCount] = useState(20);
    const [isOpinionPollOpen, setIsOpinionPollOpen] = useState(false);
    const [isMobileViewport, setIsMobileViewport] = useState(
        typeof window !== 'undefined' ? window.innerWidth < 1024 : false,
    );
    const { user } = useAuth();

    // Read isMyPosts from URL params
    const isMyPosts = searchParams.get('myposts') === '1';
    const shouldOpenOpinionPollFromSidebar = searchParams.get('opinionPoll') === '1';

    // Memoize params to prevent unnecessary re-renders and API calls
    const params = useMemo(() => {
        const apiParams = new URLSearchParams();
        if (isMyPosts) {
            apiParams.append('my_post', '1');
        }
        return apiParams;
    }, [isMyPosts]);

    const { data: posts, isLoading } = usePosts(params, { refetchIntervalMs: 30_000 });

    // Reset visible count when toggling between all posts and my posts
    useEffect(() => {
        setVisibleCount(20);
    }, [isMyPosts]);

    const trackedPageView = React.useRef(false);
    useEffect(() => {
        if (!trackedPageView.current) {
            mixpanelService.track('Connect Page Viewed', {
                is_my_posts: isMyPosts,
                page_path: window.location.pathname,
                timestamp: new Date().toISOString()
            });
            trackedPageView.current = true;
        }
    }, [isMyPosts]);

    // Handle Load More
    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 20);
    };

    const isBlogAccessExhausted = isAccessExhausted('blog');
    const isBuzzAccessExhausted = isAccessExhausted('buzz');
    // Calculate visible posts (filtering out pinned posts, which are shown in PinnedBuzz)
    const unpinnedPosts = posts ? posts.filter(post => !isPinnedForUser(post, user)) : [];

    const visiblePosts = unpinnedPosts.slice(0, visibleCount);
    const hasMorePosts = unpinnedPosts.length > visibleCount;
    const isNativeAppWebView = typeof window !== 'undefined' &&
        (Boolean((window as Window & { ReactNativeWebView?: unknown }).ReactNativeWebView)
            || /\bwv\b|webview|codeeduapp/i.test(window.navigator.userAgent));
    const showOpinionPollAction = isNativeAppWebView || isMobileViewport;

    useEffect(() => {
        const handleResize = () => {
            setIsMobileViewport(window.innerWidth < 1024);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!showOpinionPollAction && isOpinionPollOpen) {
            setIsOpinionPollOpen(false);
        }
    }, [showOpinionPollAction, isOpinionPollOpen]);

    useEffect(() => {
        if (showOpinionPollAction && shouldOpenOpinionPollFromSidebar) {
            setIsOpinionPollOpen(true);
        }
    }, [showOpinionPollAction, shouldOpenOpinionPollFromSidebar]);

    return (
        <ConnectLayout active='encode'>
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-x-8 gap-y-6">
                <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">

                    <div>
                        <div className={`w-full bg-[#1D1D1D] border border-[#2A2A2A] rounded-[20px] p-3 sm:p-[14px] grid grid-cols-2 gap-3 ${showOpinionPollAction ? 'lg:grid-cols-4' : 'lg:flex lg:items-center lg:gap-4'}`}>
                            {showOpinionPollAction && (
                                <Button
                                    className={`h-11 sm:h-[56px] w-full rounded-[12px] px-3 border-[#3A3A3A] text-[12px] sm:text-[15px] font-medium gap-1.5 sm:gap-2 bg-transparent justify-center transition-colors ${isOpinionPollOpen
                                        ? 'border-primary text-primary'
                                        : 'text-[#F3F3F3] hover:bg-[#3A3A3A] hover:text-[#F3F3F3]'
                                        }`}
                                    type='button'
                                    variant='outline'
                                    onClick={() => setIsOpinionPollOpen((prev) => !prev)}
                                >
                                    <BarChart3 className='h-[18px] w-[18px] sm:h-5 sm:w-5' />
                                    <span>Opinion Poll</span>
                                </Button>
                            )}
                            <Link
                                to='/connect/add-buzz?composer=start'
                                className='min-w-0 lg:flex-1'
                                title={isBuzzAccessExhausted ? 'You have reached the maximum limit available under your current package' : ''}
                                aria-disabled={isBuzzAccessExhausted}
                                tabIndex={isBuzzAccessExhausted ? -1 : undefined}
                                onClick={(event) => {
                                    if (isBuzzAccessExhausted) {
                                        event.preventDefault();
                                    }
                                }}
                            >
                                <Button
                                    variant='outline'
                                    disabled={isBuzzAccessExhausted}
                                    className='w-full h-11 sm:h-[56px] rounded-[12px] bg-[#323232] border-[#3A3A3A] text-[#F3F3F3] justify-center sm:justify-start text-[12px] sm:text-[15px] font-medium px-3 sm:px-6 tracking-[0.01em] hover:bg-[#3A3A3A] hover:text-[#F3F3F3]'
                                >
                                    Start a Buzz
                                </Button>
                            </Link>
                            <Link
                                to='/connect/add-buzz?composer=media'
                                className='min-w-0'
                                title={isBuzzAccessExhausted ? 'You have reached the maximum limit available under your current package' : ''}
                                aria-disabled={isBuzzAccessExhausted}
                                tabIndex={isBuzzAccessExhausted ? -1 : undefined}
                                onClick={(event) => {
                                    if (isBuzzAccessExhausted) {
                                        event.preventDefault();
                                    }
                                }}
                            >
                                <Button variant='outline' disabled={isBuzzAccessExhausted} className='h-11 sm:h-[56px] w-full lg:w-[196px] rounded-[12px] border-primary text-primary px-3 sm:px-5 text-[12px] sm:text-[15px] font-medium gap-1.5 sm:gap-2 bg-transparent hover:bg-transparent hover:text-primary'>
                                    <img src={animatedImagesIcon} alt="Photos videos" className='h-4 w-4 sm:h-5 sm:w-5 object-contain' />
                                    Add Photo/Video
                                </Button>
                            </Link>

                            <Link
                                to='/connect/add-buzz?composer=blog'
                                className='min-w-0'
                                title={isBlogAccessExhausted ? 'You have reached the maximum limit available under your current package' : ''}
                                aria-disabled={isBlogAccessExhausted}
                                tabIndex={isBlogAccessExhausted ? -1 : undefined}
                                onClick={(event) => {
                                    if (isBlogAccessExhausted) {
                                        event.preventDefault();
                                    }
                                }}
                            >
                                <Button disabled={isBlogAccessExhausted} className='h-11 sm:h-[56px] w-full lg:w-[142px] rounded-[12px] bg-primary text-white px-3 sm:px-6 text-[12px] sm:text-[15px] font-medium hover:bg-primary/90'>
                                    + Add Blog
                                </Button>
                            </Link>
                        </div>
                    </div>
                    {showOpinionPollAction && isOpinionPollOpen && (
                        <div className='w-full'>
                            <OpinionPoll />
                        </div>
                    )}
                    <PinnedBuzz />
                    <div>
                        <LoadingSection isLoading={isLoading} />
                        {
                            !isLoading && <Card className='bg-card'>
                                <CardContent>
                                    {visiblePosts.length > 0 ? (
                                        <>
                                            {visiblePosts.map((post, index) => (
                                                <PostCard key={`${post.id}-${index}`} post={post} />
                                            ))}
                                            {hasMorePosts && (
                                                <div className='flex justify-center mt-6 mb-4'>
                                                    <Button
                                                        variant='outline'
                                                        className='text-primary border-primary rounded-lg px-8'
                                                        onClick={handleLoadMore}
                                                    >
                                                        Load More Posts
                                                    </Button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className='text-center py-10 text-gray-400'>
                                            {isMyPosts ? 'No posts found. Create your first buzz!' : 'No posts available.'}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        }
                    </div>
                </div>
                <div className="col-span-1 lg:col-span-3 flex flex-col gap-6">
                    <RightSidePanel />
                </div>
            </div>
        </ConnectLayout>
    )
}

export default index
