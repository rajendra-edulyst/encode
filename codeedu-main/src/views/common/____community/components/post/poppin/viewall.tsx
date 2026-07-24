import React, { useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/ShadcnButton';
import { usePopinTagPostStore } from '@/views/common/community/store/communityStore';
import PoppinCard from '@/views/common/community/components/PoppinCard';
import { Link } from 'react-router-dom';
import CommunityLayout from '../../../layouts';
import Pined from '../pined';
import MyCommunities from '../mycommunites';

const Poppin: React.FC = () => {
  const { poppinTags, fetchPoppinTags, loading, error } = usePopinTagPostStore();

  // Fetch poppin tags on mount
  useEffect(() => {
    fetchPoppinTags();
  }, [fetchPoppinTags]);

  // Memoize filtered poppinTags to avoid recomputation
  const validPoppinTags = useMemo(
    () => poppinTags?.filter((post) => post?.tag) || [],
    [poppinTags]
  );

  // Handle loading state
  if (loading) {
    return <div className="text-center text-gray-500 py-4">Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div className="text-center text-red-500 py-4">Error: {error}</div>;
  }

  // Handle empty or null poppinTags
  if (!validPoppinTags || validPoppinTags.length === 0) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border glowConnectCard">
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-semibold text-cblack">{`What's `} <span className="font-bold text-cgreen text-2xl">Poppin</span></h2>
        </div>
        <div className="text-center text-gray-500 py-10">
          No trending tags available.
        </div>
      </div>
    );
  }

  return (
    <CommunityLayout>
      <div className="flex flex-col space-y-6 mt-4">
        {/* Main Content */}
        <div className="w-full flex flex-col md:flex-row gap-5 pr-5">
          <div className="w-full md:w-[70%]">
            <div className="flex items-center mb-4">
              <h2 className="text-lg font-semibold text-cblack">{`What's `} <span className="font-bold text-cgreen text-2xl">{`Poppin'`}</span></h2>
            </div>
            <div className="space-y-4">
              {validPoppinTags && validPoppinTags?.slice(0, 5).map((post, index) => (
                <PoppinCard
                  key={index} // Prefer unique id if available
                  tag={post.tag}
                  posts={post.post_count}
                  isLast={index === validPoppinTags.length - 1}
                  index={index + 1}
                />
              ))}
              <div className="text-right">
                <Button
                  asChild
                  variant="link"
                  className="text-[#00A8E9] p-0 h-auto rounded-none whitespace-nowrap"
                  aria-label="View all trending tags"
                >
                  <Link to="/community/discover/poppin">View All</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full md:w-[30%]">
            <Pined />
            <MyCommunities />
          </div>
        </div>
      </div>
    </CommunityLayout>
  );
};

export default Poppin;