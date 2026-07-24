import React, { useState, useMemo, useEffect } from 'react'
import ConnectLayout from './layouts'
import { Plus, Scroll, ChevronDown, Layers } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import RightSidePanel from './layouts/right-side-panel'
import { Link, useSearchParams } from 'react-router-dom'
import PostCard from './components/post-card.tsx'
import LoadingSection from '@/components/LoadingSection'
import { Button } from '@/components/ui/ShadcnButton'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { usePosts } from '@/hooks/data/connect/usePosts'

const index = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [visibleCount, setVisibleCount] = useState(20);

    // Read isMyPosts from URL params
    const isMyPosts = searchParams.get('myposts') === '1';

    // Memoize params to prevent unnecessary re-renders and API calls
    const params = useMemo(() => {
        const apiParams = new URLSearchParams();
        if (isMyPosts) {
            apiParams.append('my_post', '1');
        }
        return apiParams;
    }, [isMyPosts]);

    const { data: posts, isLoading } = usePosts(params);

    // Reset visible count when toggling between all posts and my posts
    useEffect(() => {
        setVisibleCount(20);
    }, [isMyPosts]);

    // Handle My Posts toggle
    const handleMyPostsToggle = () => {
        const newSearchParams = new URLSearchParams(searchParams);
        if (isMyPosts) {
            newSearchParams.delete('myposts');
        } else {
            newSearchParams.set('myposts', '1');
        }
        setSearchParams(newSearchParams);
    };

    // Handle Load More
    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 20);
    };

    // Calculate visible posts and if there are more
    const visiblePosts = posts?.slice(0, visibleCount) || [];
    const hasMorePosts = (posts?.length || 0) > visibleCount;


    return (
        <ConnectLayout active='encode'>
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-x-8 gap-y-6">
                <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
                    <div className='flex justify-end items-center gap-4'>
                        <Button
                            variant='outline'
                            className={`rounded-lg ${isMyPosts
                                ? 'bg-primary text-white border-primary'
                                : 'text-primary border-primary'
                                }`}
                            onClick={handleMyPostsToggle}
                        >
                            <Scroll /> My Buzz
                        </Button>
                        <Link to='/connect/add-buzz'>
                            <Button variant='outline' className='text-primary border-primary rounded-lg'><Plus /> Add Buzz</Button>
                        </Link>
                        {/* make dropdown btn  */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="rounded-lg text-gray-400 flex items-center gap-2"
                                >
                                    <Layers /> <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => console.log("View All Buzzes clicked")}>
                                    View All Buzzes
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => console.log("Manage Categories clicked")}>
                                    Manage Categories
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => console.log("Settings clicked")}>
                                    Settings
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div>
                        <LoadingSection isLoading={isLoading} />
                        {
                            !isLoading && <Card className='bg-card'>
                                <CardContent>
                                    {visiblePosts.length > 0 ? (
                                        <>
                                            {visiblePosts.map((post) => (
                                                <PostCard key={post.id} post={post} />
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