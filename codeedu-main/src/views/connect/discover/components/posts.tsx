import { usePosts } from '@/hooks/data/connect/usePosts';
import React, { useState, useCallback } from 'react'
import PostCard from '../../components/post-card.tsx';
import LoadingSection from '@/components/LoadingSection';
import { Button } from '@/components/ui/ShadcnButton';
import { useAuth } from '@/auth'
import { isPinnedForUser } from '@/utils/postUtils'

const Posts = () => {

    const { data: posts = [], isLoading: postsLoading } = usePosts();
    const [visibleCount, setVisibleCount] = useState(20);
    const { user } = useAuth();

    // Handle Load More
    const handleLoadMore = useCallback(() => {
        setVisibleCount(prev => prev + 20);
    }, []);

    // Calculate visible posts and if there are more
    const sortedPosts = posts ? [...posts].sort((a, b) => {
        // Pinned posts first
        const aPinned = isPinnedForUser(a, user) ? 1 : 0;
        const bPinned = isPinnedForUser(b, user) ? 1 : 0;
        if (aPinned === 1 && bPinned !== 1) return -1;
        if (aPinned !== 1 && bPinned === 1) return 1;
        return 0;
    }) : [];

    const visiblePosts = sortedPosts.slice(0, visibleCount);
    const hasMorePosts = sortedPosts.length > visibleCount;

    return (
        <div>
            <LoadingSection isLoading={postsLoading} />
            {
                visiblePosts && visiblePosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))
            }
            {hasMorePosts && (
                <div className='flex justify-center mt-6 mb-4'>
                    <Button
                        variant='outline'
                        className='text-primary border-primary rounded-lg px-8 hover:bg-primary dark:hover:text-black'
                        onClick={handleLoadMore}
                    >
                        Load More Posts
                    </Button>
                </div>
            )}
        </div>
    )
}

export default Posts