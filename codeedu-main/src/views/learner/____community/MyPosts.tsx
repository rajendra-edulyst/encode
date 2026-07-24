import Loading from '@/components/shared/Loading';
import { fetchCommunityMyPosts } from '@/services/public/CommunityService';
import { useCommunityMyPostsStore } from '@/store/learner/____communityStore';
import React, { memo, useEffect } from 'react'
import Post from './components/Post';
import { Post as PostType } from '@/@types/learner/community';

interface MyPostsProps {
    handleDeleteDialogOpen: (post: PostType) => void
}

const MyPosts = ({ handleDeleteDialogOpen }: MyPostsProps) => {
    const { setCommunity, communityContent, setCommunityContent, error, setError, loading, setLoading } = useCommunityMyPostsStore();

    const fetchCommunityDetails = async () => {
        setError('');
        setLoading(true);
        try {
            const response = await fetchCommunityMyPosts('209')
            setCommunity(response?.data?.community);
            setCommunityContent(response?.data?.posts);
        } catch (error) {
            console.log('Error:', error)
            setError('Failed to load community details.');
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchCommunityDetails();
    }, [])

    if (loading) {
        return <Loading loading={loading} />
    }

    if (error) {
        return <p>{error}</p>
    }


    return (
        <div>
            {Array.isArray(communityContent) &&
                communityContent.map((communityItem: PostType, index) => (
                    <Post key={index} post={communityItem} canDelete={true} handleDeleteDialogOpen={handleDeleteDialogOpen} />
                ))
            }
            {
                communityContent.length === 0 && (
                    <div className='flex justify-center items-center h-[50vh]'>
                        <p className='text-gray-500 text-xl'>No posts available.</p>
                    </div>
                )
            }
        </div>
    )
}

export default memo(MyPosts)