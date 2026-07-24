// import CommunityLayout from '@community/layouts'
// import React, { lazy, useEffect, useMemo, useState } from 'react';
// import Loading from '@/components/shared/Loading';
// import { usePosts } from '../../@hooks/usePost';
// import { Link } from 'react-router-dom';
// import { Button } from '@/components/ui/ShadcnButton';
// import { Plus, Scroll } from 'lucide-react';
// import { useQueryClient } from '@tanstack/react-query';
// import WeeklyCalendar from '../../components/Calendar';

// const PostCardView = lazy(() => import('@community/components/post/CardView'));

// const Pined = lazy(() => import('@community/components/post/pined'));
// const OpinionPoll = lazy(() => import('./poll'));
// const Cat = lazy(() => import('@/views/common/community/components/post/cat'));

// const Wall = () => {


//   const queryClient = useQueryClient();
//   const [filter, setFilter] = useState<'all' | 'my'>('all');

//   const params = useMemo(() => {
//     const p = new URLSearchParams();
//     if (filter === 'my') {
//       p.append('my_post', '1');
//     }
//     return p;
//   }, [filter]);

//   const { data: posts = [], isLoading, isError, error } = usePosts(params);

//   const myPosts = () => {
//     if (filter === 'my') {
//       setFilter('all');
//     } else {
//       setFilter('my');
//     }
//   };

//   useEffect(() => {
//     queryClient.invalidateQueries({
//       queryKey: ['posts', params],
//     });
//   }, [filter]);


//   if (isLoading && !posts?.length) {
//     return <Loading loading={isLoading} />;
//   }

//   if (isError && !posts?.length) {
//     return <div className="text-red-500 text-center">Error: {error.message}</div>;
//   }


//   return (
//     <CommunityLayout active='mywall'>
//       <div className="grid grid-cols-1 lg:grid-cols-[70%_28%] gap-6 mt-4">
//         <div>
//           <div className="flex items-center justify-end gap-2">
//             <div className="flex justify-end cursor-pointer mb-2">
//               <Button
//                 size="sm"
//                 variant="outline"
//                 className={`flex items-center gap-2 text-[#009BD8] border border-[#009BD8] rounded-md bg-transparent bg-white 
//                                 hover:bg-transparent hover:text-[#009BD8] hover:border-[#009BD8] 
//                                 hover:scale-105 transition-all duration-200 ${filter === 'my' ? 'bg-[#009BD8] text-white hover:bg-[#e5e9ea]' : ''}`}
//                 onClick={myPosts}
//               >
//                 <Scroll size={18} strokeWidth={2} />
//                 My Post
//               </Button>
//             </div>
//             <div className="flex justify-end cursor-pointer mb-2">
//               <Link to="/community/myposts/createpost">
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   className="flex items-center gap-2 text-[#009BD8] border border-[#009BD8] rounded-md bg-transparent bg-white 
//                                 hover:bg-transparent hover:text-[#009BD8] hover:border-[#009BD8] 
//                                 hover:scale-105 transition-all duration-200"
//                 >
//                   <Plus size={18} strokeWidth={2} />
//                   Create Post
//                 </Button>
//               </Link>
//             </div>
//           </div>
//           <div className='flex flex-col gap-3'>
//             {posts && posts.map((post, index) => (<PostCardView key={index} post={post} is_repost={post.repost_id == null ? false : true} />))}
//           </div>
//         </div>
//         <div className="w-full">
//           <div className='space-y-5'>
//             <WeeklyCalendar />
//             <OpinionPoll />
//             <Pined />
//             {/* <Cat /> */}
//           </div>
//         </div>
//       </div>
//     </CommunityLayout>
//   )
// }


// export default Wall
import CommunityLayout from '../../layouts'
import React, { lazy, useEffect, useMemo, useState } from 'react';
import Loading from '@/components/shared/Loading';
import { usePosts } from '../../@hooks/usePost';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/ShadcnButton';
import { Plus, Scroll, FileText } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import WeeklyCalendar from '../../components/Calendar';

import Profile from '@/views/learner/dashboard/components/Profile';
import Announcement from '@/views/faculty/dashboard/Announcement';
import Advitisement from './advitisement';
import QuickAction from '@/views/faculty/dashboard/QuickAction';

const PostCardView = lazy(() => import('../../components/post/CardView'));

const OpinionPoll = lazy(() => import('./poll'));
const Cat = lazy(() => import('../../components/post/cat'));

const Wall = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'my'>('all');

  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (filter === 'my') {
      p.append('my_post', '1');
    }
    return p;
  }, [filter]);

  const { data: posts = [], isLoading, isError, error } = usePosts(params);

  const myPosts = () => {
    if (filter === 'my') {
      setFilter('all');
    } else {
      setFilter('my');
    }
  };

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ['posts', params],
    });
  }, [filter, queryClient, params]);

  if (isLoading && !posts?.length) {
    return <Loading loading={isLoading} />;
  }

  if (isError && !posts?.length) {
    return <div className="text-red-500 text-center">Error: {error.message}</div>;
  }

  return (
    <CommunityLayout active='mywall'>
      <div className="grid grid-cols-1 lg:grid-cols-[70%_28%] gap-6 mt-4">
        <div>
          <div className="flex items-center justify-end gap-2">
            <div className="flex justify-end cursor-pointer mb-2">
              <Button
                size="sm"
                variant="outline"
                className={`flex items-center gap-2 text-[#009BD8] border border-[#009BD8] rounded-md bg-transparent bg-white 
                                hover:bg-transparent hover:text-[#009BD8] hover:border-[#009BD8] 
                                hover:scale-105 transition-all duration-200 ${filter === 'my' ? 'bg-[#009BD8] text-white hover:bg-[#e5e9ea]' : ''}`}
                onClick={myPosts}
              >
                <Scroll size={18} strokeWidth={2} />
                My Post
              </Button>
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

          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg p-6 text-center">
              <FileText size={64} className="text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {filter === 'my' ? 'No posts found' : 'No posts available'}
              </h3>
              <p className="text-gray-500 mb-4">
                {filter === 'my'
                  ? "You haven't created any posts yet. Start sharing your thoughts with the community!"
                  : "There are no posts to display at the moment. Be the first to share something!"}
              </p>
              <Link to="/community/myposts/createpost">
                <Button className="flex items-center gap-2 bg-[#009BD8] text-white hover:bg-[#008ac0]">
                  <Plus size={18} strokeWidth={2} />
                  Create Your First Post
                </Button>
              </Link>
            </div>
          ) : (
            <div className='flex flex-col gap-3'>
              {[...posts].sort((a, b) => {
                if (Number(a.is_pin) === 1 && Number(b.is_pin) !== 1) return -1;
                if (Number(a.is_pin) !== 1 && Number(b.is_pin) === 1) return 1;
                return 0;
              }).map((post, index) => (
                <PostCardView
                  key={index}
                  post={post}
                  is_repost={post.repost_id != null}
                />
              ))}
            </div>
          )}
        </div>
        <div className="w-full">
          <div className='space-y-5'>
            <Profile />
            <WeeklyCalendar />
            <Cat />
            <OpinionPoll />
            {/* <Pined /> */}

            <Announcement />
            <Advitisement />
            <QuickAction />


          </div>
        </div>
      </div>
    </CommunityLayout>
  );
};

export default Wall;