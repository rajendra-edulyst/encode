import React from "react";
import TrandingCommunityCard from "../../components/TrandingCommunityCard";
import Poppin from "../../components/post/poppin";
import CommunityLayout from "../../layouts";
import { useOrgPopularCommunityStore, useTrendingCommunityStore } from "../../store/communityStore";
import { useLocation } from "react-router-dom";
import Loading from "@/components/shared/Loading";
import Swal from "sweetalert2";
import { joinCommunity, leaveCommunity } from "../../services/CommunityService";
import { TrendingCommunity } from "../../types/community";

const ViewAllDiscover = () => {


const location = useLocation();


  const { popularCommunities, fetchPopularCommunities, loading } = useOrgPopularCommunityStore();

  React.useEffect(() => {
    fetchPopularCommunities();
  }, [fetchPopularCommunities]);

  if (loading) {
     return <Loading loading={loading} />
   }

//   if (error) {
//     return <div className="text-red-500 text-center">{error}</div>
//   }

const communities = popularCommunities
  ?.filter((org) => org.communities)
  .flatMap((org) => org.communities)
  .filter((community) => !community?.user_joined_id) || [];


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
              <h2 className="text-lg font-semibold text-cblack">Discover<span className="font-bold text-cblue text-2xl"> Communities</span></h2>
            </div>
            {communities.length > 0 ? (
      <div className="space-y-4">
       {communities.map((community, index) => (
        <TrandingCommunityCard
        key={community.id}
        title={community.title}
        logo={community.image}
        category={community?.domain_name || 'General'}
        isLast={index === communities.length - 1}
        members={community.total_user_joined}
        id={community.id}
        user_joined_id={community.user_mapping_id}
        joinThisCommunity={joinThisCommunity}
        leaveThisCommunity={leaveThisCommunity}
      />
       ))}
         </div>
            ) : (
            <div className="text-center text-cblack mt-4 py-16">
                No communities found.
            </div>
            )}

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
  );
};

export default ViewAllDiscover;
