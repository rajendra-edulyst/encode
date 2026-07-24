import React from 'react'
import Loading from '@/components/shared/Loading'
import { useOrgPopularCommunityStore, useTrendingCommunityStore } from '../../../store/communityStore';
import TrandingCommunityCard from '../../../components/TrandingCommunityCard';
import { TrendingCommunity } from '../../../types/community';
import CommunityLayout from '../../../layouts';
import Poppin from '../../../components/post/poppin';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { joinCommunity, leaveCommunity } from '../../../services/CommunityService';



const TrendingCommunities = () => {



  const location = useLocation();
  const heading = location.state?.heading || 'Trending Design Communities';
  const { popularCommunities, fetchPopularCommunities } = useOrgPopularCommunityStore();


  const { trendingCommunities, fetchTrendingCommunities, loading, error } = useTrendingCommunityStore();

  React.useEffect(() => {
    fetchTrendingCommunities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Loading loading={loading} />
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>
  }


  const leaveThisCommunity = (communityId: number) => {
      // Logic to leave the community
      Swal.fire({
        title: 'Leave Community',
        text: `Are you sure you want to leave this community?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Leave',
        cancelButtonText: 'No, Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          // Call the API to leave the community
          leaveCommunity(communityId).then(() => {
            console.log(`Left community with ID: ${communityId}`);
            Swal.fire({
              title: 'Success',
              text: 'You have successfully left the community!',
              icon: 'success',
            });
            fetchPopularCommunities(); // Refresh the communities list after leaving
          }).catch(() => {
            Swal.fire({
              title: 'Error',
              text: 'Failed to leave the community. Please try again later.',
            });
          }
          );
        }
      });
    };

    const joinThisCommunity = (communityId: number) => {
        // Logic to join the community
        Swal.fire({
          title: 'Join Community',
          text: `Are you sure you want to join this community?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes, Join',
          cancelButtonText: 'No, Cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            // Call the API to join the community
            joinCommunity(communityId).then(() => {
              console.log(`Joined community with ID: ${communityId}`);
              Swal.fire({
                title: 'Success',
                text: 'You have successfully joined the community!',
                icon: 'success',
              });
              fetchPopularCommunities(); // Refresh the communities list after joining
            }).catch((error) => {
              console.error(`Failed to join community with ID: ${communityId}`, error);
              Swal.fire({
                title: 'Error',
                text: 'Failed to join the community. Please try again later.',
              });
            }
            );
          }
        });
      };

  return (
    <CommunityLayout>
      <div className="flex flex-col space-y-6 mt-4">
        {/* Main Content */}
        <div className="w-full flex flex-col md:flex-row gap-5 pr-5">
          <div className="w-full md:w-[70%]">
            <div className="flex items-center mb-4">
              <h2 className="text-lg font-semibold text-cblack">Trending Design<span className="font-bold text-cblue text-2xl"> Communities</span></h2>
            </div>
            <div className="space-y-4">
              {
                trendingCommunities && trendingCommunities?.map((community: TrendingCommunity, index: number) => (
                  <TrandingCommunityCard
                    key={community.id}
                    title={community.title}
                    logo={community.image}
                    category={community?.org_name || 'General'}
                    isLast={index === trendingCommunities.length - 1}
                    members={community.total_user_joined}
                    id={community.id}
                    user_joined_id={community.user_mapping_id}
                    joinThisCommunity={joinThisCommunity}
                  leaveThisCommunity={leaveThisCommunity}
                  />
                ))
              }
            </div>
          </div>
          <div className="w-full md:w-[30%]">
            <div className='space-y-5'>
              {/* Trending Tags */}
              <Poppin />
            </div>
          </div>
        </div>
      </div>
    </CommunityLayout>
  )
}

export default TrendingCommunities