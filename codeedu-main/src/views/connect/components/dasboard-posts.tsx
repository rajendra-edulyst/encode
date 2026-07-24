import { Link } from 'react-router-dom';
import LoadingSection from '@/components/LoadingSection';
import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { usePosts } from '@/hooks/data/connect/usePosts';

function Posts() {
    const { data: posts = [], isLoading } = usePosts();
    const postsWithThumbnail = useMemo(() => posts.filter(post => post.thumbnail_url), [posts]);
    const notRepostedPosts = useMemo(() => postsWithThumbnail.filter(post => !post.repost_id), [postsWithThumbnail]);
    const visiblePosts = useMemo(() => notRepostedPosts.slice(0, 4), [notRepostedPosts]);
    if (isLoading && posts.length <= 0) return <LoadingSection isLoading={isLoading} title='Posts' description='We are fetching posts...' />;

    if (visiblePosts && visiblePosts?.length === 0) return null;

    return (
        <Card>
            <CardContent>
                <div className='flex items-center justify-between'>
                    <h1 className="text-2xl font-semibold mb-4 text-primary">Community Posts</h1>
                    <Link to="/connect" className="text-primary text-sm">View All</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {visiblePosts?.map((blog, index) => (
                        index < 3 && <div key={index} className="bg-white dark:bg-[#5A5A5A] border rounded-xl cursor-pointer shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-95">
                            <Link to={`/community/wall/post/${blog?.id}`}>
                                <div className="relative h-32 overflow-hidden"><img src={blog?.thumbnail_url ?? '/img/default.png'} alt={blog.title} className="w-full h-full object-cover"
                                    onError={(e) => e.currentTarget.src = '/img/default.png'}
                                /></div>
                                <div className="p-3"><h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 dark:text-white">{blog.title}</h3></div>
                            </Link>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

    )
}

export default Posts