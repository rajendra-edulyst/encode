import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CommunityLayout from '@/views/common/community/layouts'
import { SlidersHorizontal } from 'lucide-react';
import React, { lazy, useEffect } from 'react'
import Loading from '@/components/shared/Loading';
import PostCardView from '@community/components/post/CardView';
import { usePostsStore } from '@/views/common/community/store/postStore';
import WeeklyCalendar from '@/views/learner/dashboard/components/Calendar';
import Pined from '../../../components/post/pined';
import Cat from '../cat';



const OpinionPoll = lazy(() => import('../../../pages/wall/poll/index'));

const ViewAll = () => {

    const { fetchPinPosts, pinPosts: data } = usePostsStore();
    const { data: pinPosts, loading, error } = data || {};

    useEffect(() => {
        fetchPinPosts();
    }, [fetchPinPosts]);

    if (loading || !pinPosts) {
        return <Loading loading={loading ?? false} />
    }

    if (error) {
        return <div>Error: {error}</div>
    }


    if (pinPosts?.length === 0) {
        return null;
    }

    return (
        <CommunityLayout>
            <div className="w-full flex flex-col md:flex-row py-6 gap-5">
                <div className="w-full md:w-[75%]">
                    <div className='flex justify-between items-center'>
                        <h2 className="text-lg font-semibold text-cblack"><span className='text-[#00A8e9] font-bold text-2xl '>Blog</span> Buzz...</h2>
                        <DropdownMenu>
                            <DropdownMenuTrigger className='flex justify-center gap-2 border px-3 py-1 rounded-lg '><SlidersHorizontal size={20} strokeWidth={1.5} className='text-cblack' /> Filter</DropdownMenuTrigger>
                            <DropdownMenuContent className='w-40' side='left' align='start'>
                                <DropdownMenuItem>All</DropdownMenuItem>
                                <DropdownMenuItem>Events</DropdownMenuItem>
                                <DropdownMenuItem>Industries</DropdownMenuItem>
                                <DropdownMenuItem>Workshops</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className='mt-2'>
                        {
                            pinPosts && pinPosts?.map((post) => (
                                <PostCardView
                                    key={post.id}
                                    post={post}
                                />
                            ))
                        }
                    </div>
                </div>
                <div className="w-full md:w-[30%] overflow-hidden">
                    <div className='sticky top-0 space-y-5'>
                        <WeeklyCalendar />
                        <OpinionPoll />
                        <Pined />
                        {/* <Cat /> */}
                    </div>
                </div>
            </div>
        </CommunityLayout>
    )
}

export default ViewAll