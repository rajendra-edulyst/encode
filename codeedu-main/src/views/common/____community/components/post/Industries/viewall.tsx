import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CommunityLayout from '@/views/common/community/layouts'
import { SlidersHorizontal } from 'lucide-react';
import React, { useEffect } from 'react'
import { useIndustryPostsStore } from '../../../store/communityStore';
import { usePostsStore } from '../../../store/postStore';
import PostCompactView from '../compactView';
import Pined from '../pined';
import Events from '../events';
import Loading from '@/components/shared/Loading';

const ViewAll = () => {

  const { industryPosts, fetchIndustryLatestPosts } = useIndustryPostsStore();
  const { industryPosts: data, fetchIndustryPosts } = usePostsStore();
  const { data: posts, loading, error } = data || {};


  useEffect(() => {
    fetchIndustryLatestPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (industryPosts?.length === 0) {
      return;
    }
    const org_its = industryPosts.map((post) => post.org_id).join(',');
    fetchIndustryPosts(org_its);
  }, [industryPosts, fetchIndustryPosts]);


  if (industryPosts?.length === 0) {
    return null;
  }

  if (loading && !posts?.length) {
    return <Loading loading={loading} />;
  }

  if (error && !posts?.length) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
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
          <div>

            {
              posts && posts.map((post) => (
                <PostCompactView
                  key={post.id}
                  post={post}
                />
              ))}
          </div>
        </div>
        <div className="w-full md:w-[30%] overflow-hidden">
          <div className='sticky top-0 space-y-5'>
            <Pined />
            <Events />
          </div>
        </div>
      </div>
    </CommunityLayout>
  )
}

export default ViewAll