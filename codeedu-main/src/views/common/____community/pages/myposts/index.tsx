import React, { useEffect, lazy } from 'react';
import { Button } from "@/components/ui/ShadcnButton";
import Loading from '@/components/shared/Loading';
import CommunityLayout from '../../layouts';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PostCardView from '../../components/post/CardView';
import { usePostsStore } from '../../store/postStore';


const Pined = lazy(() => import('../../components/post/pined'));
const MyCommunities = lazy(() => import('../../components/post/mycommunites'));
const Poppin = lazy(() => import('../../components/post/poppin'));


const MyPosts: React.FC = () => {


  const { myPosts: data, fetchMyPosts } = usePostsStore();
  const { data: posts, loading } = data || {};


  useEffect(() => {
    fetchMyPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  if (loading && !posts?.length) {
    return <Loading loading={loading} />;
  }


  return (
    <CommunityLayout active='myposts'>
      <div className="w-full flex flex-col md:flex-row py-6 gap-5">
        <div className="w-full md:w-[75%] space-y-">
          <div className='flex  items-center justify-between gap-2'>
            <div className="flex justify-end cursor-pointer mb-2">
              <Link to="/community">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2 text-[#009BD8] border border-[#009BD8] rounded-md bg-transparent bg-white 
                   hover:bg-transparent hover:text-[#009BD8] hover:border-[#009BD8] 
                   hover:scale-105 transition-all duration-200"
                >
                  <Plus size={18} strokeWidth={2} />
                  Back
                </Button>
              </Link>
            </div>
            <div className="flex justify-end cursor-pointer mb-2">
              <Link to="/community/myposts/createpost">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2 text-[#009BD8] border border-[#009BD8] rounded-md bg-transparent bg-white 
                   hover:bg-transparent hover:text-[#009BD8] hover:border-[#009BD8] 
                   hover:scale-105 transition-all duration-200"
                >
                  <Plus size={18} strokeWidth={2} />
                  Create Post
                </Button>
              </Link>
            </div>
          </div>
          <div>
            {
              <div className='flex flex-col gap-3'>
                {
                  posts && [...posts].sort((a, b) => {
                    if (Number(a.is_pin) === 1 && Number(b.is_pin) !== 1) return -1;
                    if (Number(a.is_pin) !== 1 && Number(b.is_pin) === 1) return 1;
                    return 0;
                  }).map((post, key) => (
                    <PostCardView
                      key={key}
                      post={post}
                      is_repost={post?.repost_id ? true : false}
                    />
                  ))
                }
              </div>
            }
            {
              posts?.length === 0 && (
                <div className="text-center text-gray-500">
                  <p>No posts available</p>
                </div>
              )
            }
          </div>
        </div>
        <div className="w-full md:w-[30%]">
          <div className='space-y-5'>
            <Pined />
            <MyCommunities />
            {/* Poppin */}
            <Poppin />
          </div>
        </div>
      </div>
    </CommunityLayout>
  );
};


export default MyPosts