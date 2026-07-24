import React from 'react'
import { Button } from '@/components/ui/ShadcnButton'
import Loading from '@/components/shared/Loading'
import { useTrendingCommunityStore,useOrgPopularCommunityStore } from '../../../store/communityStore';
import TrandingCommunityCard from '../../../components/TrandingCommunityCard';
import { TrendingCommunity } from '../../../types/community';
import { Link } from 'react-router-dom';
import { joinCommunity, leaveCommunity } from '../../../services/CommunityService';
import Swal from 'sweetalert2';

const TrendingCommunities = () => {


    const { trendingCommunities, fetchTrendingCommunities, loading, error } = useTrendingCommunityStore();
  const { popularCommunities, fetchPopularCommunities } = useOrgPopularCommunityStore();

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
        <div className="bg-white rounded-xl p-4 shadow-sm border glowConnectCard">
            <div className="flex items-center mb-4">
                <h2 className="text-lg font-semibold text-cblack">Trending Design<span className="font-bold text-cblue text-2xl"> Communities</span></h2>
            </div>
            <div className="space-y-4">
                {
                    trendingCommunities && trendingCommunities?.slice(0, 3)?.map((community: TrendingCommunity, index: number) => (
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
                <div className="text-right">
                    <Button asChild variant="link" className="text-[#00A8E9] p-0 h-auto !rounded-button whitespace-nowrap">
                        <Link to="/community/discover/trending"  state={{ heading: 'Trending Design Communities' }} className="flex items-center gap-1">
                            View All
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default TrendingCommunities