import { EllipsisVertical, VolumeX } from 'lucide-react';
import React, { useState, useCallback, lazy } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CommunityLayout from '@community/layouts';
import { Link } from 'react-router-dom';
import { stripHtmlTags } from '@/utils/stripHtmlTags';
import { useSessionUser } from '@/store/authStore';
import { muteCommunity, leaveCommunity } from '../../services/CommunityService';
import Swal from 'sweetalert2';
import Loading from '@/components/shared/Loading';
import { CommunityCategory } from '../../types/community';
import Report from './report';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/shadcnTooltip';
import WeeklyCalendar from '@/views/learner/dashboard/components/Calendar';
import Pined from '../../components/post/pined';
import { Button } from '@/components/ui/ShadcnButton';
import { useOrgCommunities } from '../../@hooks/useCommunity';

interface CommunitySection {
  title: string;
  communities: CommunityCategory[];
  isAdmin?: boolean;
  isYourCommunity?: boolean;
}

const OpinionPoll = lazy(() => import('../wall/poll/index'));

const MyCommunities = () => {

  const { data: popularCommunities = [], isLoading } = useOrgCommunities(1);
  const { id } = useSessionUser((state) => state.user);
  const [reportSelectedCommunity, setReportSelectedCommunity] = useState<CommunityCategory | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const queryClient = useQueryClient();

  // Prepare community sections
  const getCommunitySections = useCallback((): CommunitySection[] => {
    const addedCommunityIds = new Set<number>();

    const getUniqueCommunities = (communities: CommunityCategory[]) =>
      communities.filter((community) => {
        if (addedCommunityIds.has(community.id)) return false;
        addedCommunityIds.add(community.id);
        return true;
      });


    const adminCommunities = getUniqueCommunities(popularCommunities.flatMap((org) => org.communities.filter((community) => community.user_joined_id)));
    const yourCommunities = getUniqueCommunities(popularCommunities.flatMap((org) => org.communities.filter((community) => community.user_joined_id && !community.created_by_admin)));

    const industryCommunities = getUniqueCommunities(
      popularCommunities.filter((org) => org.org_type === 'industry').flatMap((org) => org.communities));

    const otherOrgSections = popularCommunities.filter((org) => org.org_type !== 'industry' && org.org_name !== 'CodeEdu').map((org) => ({
        title: org.org_name,
        communities: getUniqueCommunities(org.communities.filter((community) => community.created_by !== id))
      })).filter((section) => section.communities.length > 0);

    const otherCommunities = getUniqueCommunities(
      popularCommunities.flatMap((org) =>
        org.communities.filter(
          (community) =>
            community.created_by !== id &&
            !community.created_by_admin &&
            !community.user_joined_id)));

    return [
      { title: 'CODE Community', communities: adminCommunities, isAdmin: true },
      { title: 'Your Communities', communities: yourCommunities, isYourCommunity: true },
      ...otherOrgSections,
      { title: 'Industry & Experts Community', communities: industryCommunities },
      { title: 'Other Communities', communities: otherCommunities },
    ];
  }, [popularCommunities, id]);



  // Mutations
  const leaveMutation = useMutation({
    mutationFn: ({ communityId }: { communityId: number }) => leaveCommunity(communityId),
    onSuccess: (_, { communityId }) => {
      Swal.fire({
        title: 'Success',
        text: 'You have successfully left the community!',
        icon: 'success',
      });
      popularCommunities.forEach((org) => {
        org.communities = org.communities.filter((community) => community.id !== Number(communityId));
      });
      queryClient.setQueryData(['popularCommunities'], popularCommunities);

    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      Swal.fire({
        title: 'Error',
        text: error.message || 'Failed to leave the community. Please try again later.',
        icon: 'error',
      });
    },
  });

  const muteMutation = useMutation({
    mutationFn: ({ communityId }: { communityId: number; isMute: boolean }) => muteCommunity(communityId),
    onSuccess: (_, { isMute, communityId }) => {
      Swal.fire({
        title: 'Success',
        text: `You have successfully ${isMute ? 'muted' : 'unmuted'} the community!`,
        icon: 'success',
      });
      popularCommunities.forEach((org) => {
        org.communities.forEach((community) => {
          if (community.id === Number(communityId)) {
            community.is_mute = isMute;
          }
        });
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      Swal.fire({
        title: 'Error',
        text: error.message || 'Failed to mute the community. Please try again later.',
        icon: 'error',
      });
    },
  });

  // Action Handlers
  const handleLeaveCommunity = (community: CommunityCategory) => {
    Swal.fire({
      title: 'Leave Community',
      text: 'Are you sure you want to leave this community?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Leave',
      cancelButtonText: 'No, Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        leaveMutation.mutate({ communityId: community.id });
      }
    });
  };

  const handleMuteCommunity = (community: CommunityCategory) => {
    const isMute = !community.is_mute;
    Swal.fire({
      title: `${isMute ? 'Mute' : 'Unmute'} Community`,
      text: `Are you sure you want to ${isMute ? 'mute' : 'unmute'} this community? You will ${isMute ? 'not receive notifications' : 'receive notifications again'
        }.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${isMute ? 'Mute' : 'Unmute'}`,
      cancelButtonText: 'No, Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        muteMutation.mutate({ communityId: community.id, isMute });
      }
    });
  };

  // Reusable Community Card Component
  const CommunityCard = ({ community, isYourCommunity }: { community: CommunityCategory; isYourCommunity?: boolean }) => (
    <div className="border p-3 rounded-lg mt-4 flex items-start gap-4 justify-between">
      <Link to={`/community/mycommunities/${community.id}`} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div
            className="rounded-lg items-center justify-center border col-span-1 md:min-w-14 hidden md:block"
            style={{ backgroundImage: `url('${community.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
          <div className="space-y-1 col-span-4">
            <h2 className="text-sm md:text-lg font-semibold text-nowrap text-[#273454] truncate">{community.title}</h2>
            <p className="text-xs font-medium text-[#273454] text-nowrap line-clamp-1 truncate">{stripHtmlTags(community.description)}</p>
            <p className="text-xs font-medium text-[#273454] mb-1">
              <span className="font-semibold">{community.total_user_joined}</span>{' '}
              {community.total_user_joined <= 1 ? 'Member' : 'Members'}
            </p>
          </div>
        </div>
      </Link>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger>{community.is_mute === 1 && <VolumeX size={20} strokeWidth={1.5} className='text-red-500 cursor-pointer'
            onClick={() => handleMuteCommunity(community)} />}</TooltipTrigger>
          <TooltipContent>
            <p className='text-xs'>Unmute Community</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical className="h-4 w-4 text-cblack" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-40" side="left" align="start">
          <>
            <DropdownMenuItem className='cursor-pointer' onClick={() => handleMuteCommunity(community)}>
              {community.is_mute ? 'Unmute' : <span>Mute</span>}
            </DropdownMenuItem>
            <DropdownMenuItem className='cursor-pointer' onClick={() => handleLeaveCommunity(community)}><span className='hover:text-red-500'>Leave Community</span></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='cursor-pointer'
              onClick={() => {
                setReportSelectedCommunity(community);
                setReportOpen(true);
              }}
            >
              <span className="text-[#FF0000]">Report</span>
            </DropdownMenuItem>
          </>

        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  if (isLoading) {
    return <Loading loading={isLoading} />;
  }

  return (
    <CommunityLayout active="mycommunities">
      <div className="grid grid-cols-1 lg:grid-cols-[70%_28%] gap-6 mt-4">
        <div>
          {/* <div>
            {getCommunitySections().filter((section) => section.title === "Your Communities").map((section, index) => (
              <div key={index} className="bg-card text-card-foreground p-4 shadow-none border-[0.5px] rounded-lg mb-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h1 className="text-[22px]">Your Communities</h1>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                  {section.communities.map((community) => (
                    <CommunityCard
                      key={community.id}
                      community={community}
                      isYourCommunity={section.isYourCommunity}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div> */}
          <div>
            {getCommunitySections().filter((section) => section.title === "CODE Community")
              .map((section, index) => (
                <div key={index} className="bg-card text-card-foreground p-4 shadow-none border-[0.5px] rounded-lg mb-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <h1 className="text-[22px]">
                        <span className="text-[#00A8E9]">C</span>
                        <span className="text-[#E60086]">O</span>
                        <span className="text-[#FFEC00]">D</span>
                        <span className="text-[#7FBC42]">E</span>&nbsp;
                        <span className="text-[#273454]">Community</span>
                      </h1>
                    </div>
                  </div>

                  {section.communities.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                      {section.communities.map((community) => (
                        <CommunityCard
                          key={community.id}
                          community={community}
                          isYourCommunity={section.isYourCommunity}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                      <img
                        src="/img/others/comm-img.png"
                        alt="Empty state"
                        className="w-60 h-60 mb-8"
                      />

                      <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        Not much to see here
                      </h2>
                      <p className="text-gray-500 mb-6 max-w-md">
                        Start by joining communities to bring this page to life.
                      </p>

                      <Link to="/community/discover">
                        <Button className="bg-[#00A8E9] hover:bg-[#008ec5] text-white px-6 py-2 rounded-md">
                          Explore Community
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        <div className="space-y-6">
          <WeeklyCalendar />
          <OpinionPoll />
          <Pined />
          {/* <Cat /> */}
        </div>
      </div>

      <Report communityId={reportSelectedCommunity?.id} open={reportOpen} onOpenChange={setReportOpen} />
    </CommunityLayout>
  );
};

export default MyCommunities;


{/* <div className="flex flex-col gap-5 mt-5">
        {getCommunitySections().map((section, index) => (
          <div key={index} className="bg-card text-card-foreground p-4 shadow-none border-[0.5px] rounded-lg">
            <div>
              {
                section.title === 'CODE Community' ? (
                  <div className="flex items-center justify-between">
                    <h1 className="text-[22px]">
                      <span className="text-[#00A8E9]">C</span>
                      <span className="text-[#E60086]">O</span>
                      <span className="text-[#FFEC00]">D</span>
                      <span className="text-[#7FBC42]">E</span>&nbsp;
                      <span className="text-[#273454]">Community</span>
                    </h1>
              
                  </div>
                ) : <h2 className="text-[22px] font-semibold text-cblue">{section.title}</h2>
              }
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5">
              {section.communities.map((community) => (
                <CommunityCard
                  key={community.id}
                  community={community}
                  isYourCommunity={section.isYourCommunity}
                />
              ))}
            </div>
          </div>
        ))}
      </div> */}

// const getCommunitySections = useCallback((): CommunitySection[] => {
//   const industryOrg = popularCommunities.filter((org) => org.org_type === 'industry');
//   const industryCommunities = industryOrg.flatMap((org) => org.communities);
//   const yourCommunities = popularCommunities.flatMap((org) =>
//     org.communities.filter((community) => community.user_joined_id)
//   );
//   const adminCommunities = popularCommunities.flatMap((org) =>
//     org.communities.filter((community) => community.created_by_admin)
//   );

//   const otherCommunities = popularCommunities.flatMap((org) =>
//     org.communities.filter(
//       (community) => community.created_by !== id && !community.created_by_admin
//     )
//   );


//   return [
//     { title: 'CODE Community', communities: adminCommunities, isAdmin: true },
//     ...popularCommunities
//       .filter((org) => org.org_type !== 'industry' && org.org_name !== 'CodeEdu')
//       .map((org) => ({
//         title: org.org_name,
//         communities: org.communities.filter((community) => community.created_by !== id),
//       })),
//     { title: 'Industry & Experts Community', communities: industryCommunities },
//     { title: 'Your Communities', communities: yourCommunities, isYourCommunity: true },
//     { title: 'Other Communities', communities: otherCommunities },
//   ].filter((section) => section.communities.length > 0);
// }, [popularCommunities, id]);


// <DropdownMenuContent className="w-40" side="left" align="start">
//     {isYourCommunity ? (
//       <>
//         <DropdownMenuItem asChild className='cursor-pointer'>
//           <Link to={`/community/create?id=${community.id}`}>
//             Edit
//           </Link>
//         </DropdownMenuItem>
//         <DropdownMenuItem className='cursor-pointer' onClick={() => handleDeleteCommunity(community)}>
//           <span className="text-[#FF0000]">Delete</span>
//         </DropdownMenuItem>
//       </>
//     ) : (
//       <>
//         <DropdownMenuItem className='cursor-pointer' onClick={() => handleMuteCommunity(community)}>
//           {community.is_mute ? 'Unmute' : <span>Mute</span>}
//         </DropdownMenuItem>
//         <DropdownMenuItem className='cursor-pointer' onClick={() => handleLeaveCommunity(community)}><span className='hover:text-red-500'>Leave Community</span></DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem
//           className='cursor-pointer'
//           onClick={() => {
//             setReportSelectedCommunity(community);
//             setReportOpen(true);
//           }}
//         >
//           <span className="text-[#FF0000]">Report</span>
//         </DropdownMenuItem>
//       </>
//     )}
//   </DropdownMenuContent>



// import { Button } from '@/components/ui/ShadcnButton'
// import { EllipsisVertical, Plus } from 'lucide-react'
// import React, { useCallback, useEffect, useState } from 'react'
// import { useOrgPopularCommunityStore } from '@community/store/communityStore';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// import CommunityLayout from '@community/layouts';
// import { Link } from 'react-router-dom';
// import { stripHtmlTags } from '@/utils/stripHtmlTags';
// import { useSessionUser } from '@/store/authStore';
// import { deleteCommunity, muteCommunity, leaveCommunity } from '../../services/CommunityService';
// import Swal from 'sweetalert2';
// import Loading from '@/components/shared/Loading';
// import { CommunityCategory } from '../../types/community';
// import Report from './report';
// import { useMutation, useQueryClient } from '@tanstack/react-query';


// interface CommunitySection {
//   title: string;
//   communities: CommunityCategory[];
//   isAdmin?: boolean;
//   isYourCommunity?: boolean;
// }

// const MyCommunities = () => {


//   const { popularCommunities, fetchPopularCommunities, loading } = useOrgPopularCommunityStore();
//   const { id } = useSessionUser((state) => state.user);
//   const [reportSelectedCommunity, setReportSelectedCommunity] = useState<CommunityCategory | null>(null);
//   const [reportOpen, setReportOpen] = useState(false);
//   const queryClient = useQueryClient();

//   useEffect(() => {
//     fetchPopularCommunities(1);
//   }, [fetchPopularCommunities]);

//   // Prepare community sections
//   const getCommunitySections = useCallback((): CommunitySection[] => {
//     const industryOrg = popularCommunities.filter((org) => org.org_type === 'industry');
//     const industryCommunities = industryOrg.flatMap((org) => org.communities);
//     const yourCommunities = popularCommunities.flatMap((org) =>
//       org.communities.filter((community) => community.created_by === id)
//     );
//     const adminCommunities = popularCommunities.flatMap((org) =>
//       org.communities.filter((community) => community.created_by_admin)
//     );
//     const otherCommunities = popularCommunities.flatMap((org) =>
//       org.communities.filter(
//         (community) => community.created_by !== id && !community.created_by_admin && !community.is_mute
//       )
//     );

//     return [
//       { title: 'CODE Community', communities: adminCommunities, isAdmin: true },
//       ...popularCommunities
//         .filter((org) => org.org_type !== 'industry' && org.org_name !== 'CodeEdu')
//         .map((org) => ({
//           title: org.org_name,
//           communities: org.communities.filter((community) => community.created_by !== id),
//         })),
//       { title: 'Industry & Experts Community', communities: industryCommunities },
//       { title: 'Your Communities', communities: yourCommunities, isYourCommunity: true },
//       { title: 'Other Communities', communities: otherCommunities },
//     ].filter((section) => section.communities.length > 0);
//   }, [popularCommunities, id]);

//   const leaveMutation = useMutation({
//     mutationFn: leaveCommunity,
//     onSuccess: () => {
//       Swal.fire({
//         title: 'Success',
//         text: 'You have successfully left the community!',
//         icon: 'success',
//       });
//       queryClient.invalidateQueries({ queryKey: ['communityDetails', communityId] });
//       queryClient.invalidateQueries({ queryKey: ['communityMembers', communityId] });
//     },
//     onError: (error) => {
//       console.error('Failed to leave community:', error);
//       Swal.fire({
//         title: 'Error',
//         text: 'Failed to leave the community. Please try again later.',
//         icon: 'error',
//       });
//     },
//   });

//   const muteMutation = useMutation({
//     mutationFn: muteCommunity,
//     onSuccess: () => {
//       Swal.fire({
//         title: 'Success',
//         text: `You have successfully ${communityDetails?.is_mute ? 'unmuted' : 'muted'} the community!`,
//         icon: 'success',
//       });
//     },
//     onError: (error) => {
//       console.error('Failed to mute community:', error);
//       Swal.fire({
//         title: 'Error',
//         text: 'Failed to mute the community. Please try again later.',
//         icon: 'error',
//       });
//     },
//   });

//   const deleteNowCommunityMutation = useMutation({
//     mutationFn: deleteCommunity,
//     onSuccess: () => {
//       Swal.fire({
//         title: 'Success',
//         text: 'Community deleted successfully!',
//         icon: 'success',
//       });
//       queryClient.invalidateQueries({ queryKey: ['popularCommunities'] });
//       queryClient.invalidateQueries({ queryKey: ['yourCommunities'] });
//       queryClient.invalidateQueries({ queryKey: ['industryCommunities'] });
//       queryClient.invalidateQueries({ queryKey: ['adminCommunities'] });
//       queryClient.invalidateQueries({ queryKey: ['otherCommunities'] });
//     },
//     onError: (error) => {
//       console.error('Failed to delete community:', error);
//       Swal.fire({
//         title: 'Error',
//         text: 'Failed to delete the community. Please try again later.',
//         icon: 'error',
//       });
//     },
//   });


//   const leaveThisCommunity = (community: CommunityCategory) => {
//     Swal.fire({
//       title: 'Leave Community',
//       text: 'Are you sure you want to leave this community?',
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, Leave',
//       cancelButtonText: 'No, Cancel',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         leaveMutation.mutate(community.id);
//       }
//     });
//   };

//   const muteThisCommunity = (community: CommunityCategory) => {
//     Swal.fire({
//       title: 'Mute Community',
//       text: `Are you sure you want to ${community?.is_mute ? 'unmute' : 'mute'} this community? You will not receive notifications.`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: `Yes, ${community?.is_mute ? 'Unmute' : 'Mute'}`,
//       cancelButtonText: 'No, Cancel',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         muteMutation.mutate(community.id);
//       }
//     });
//   };

//   const deleteCommunityHandle = (community: CommunityCategory) => {
//     Swal.fire({
//       title: 'Delete Community',
//       text: 'Are you sure you want to delete this community? This action cannot be undone.',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, delete it!',
//       cancelButtonText: 'No, cancel',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         deleteNowCommunityMutation.mutate(community.id);
//       }
//     });
//   };

//   if (loading) {
//     return <Loading loading={loading} />
//   }


//   return (
//     <CommunityLayout active='mycommunities'>
//       <div>
//         {adminCommunities && adminCommunities?.length > 0 && <div className='border-b-[1px] border-[#FFDCF0] pb-7 mt-4'>
//           <div className='flex items-center justify-between'>
//             <h1 className='text-[22px]'>
//               <span className='text-[#00A8E9]'>C</span>
//               <span className='text-[#E60086]'>O</span>
//               <span className='text-[#FFEC00]'>D</span>
//               <span className='text-[#7FBC42]'>E</span>&nbsp;
//               <span className='text-[#273454]'>Community</span>
//             </h1>
//             <Button asChild size="sm" variant="outline" className='bg-transparent border border-[--IndexBlue] hover:scale-105 transition-all duration-200 hover:bg-transparent mr-5'>
//               <Link to='/community/create' className='text-[--IndexBlue] font-medium flex items-center gap-2'>
//                 <span className='text-[--IndexBlue] font-medium flex items-center gap-2'><Plus /> <span className='hidden md:block'>Create Community</span></span>
//               </Link>
//             </Button>
//           </div>
//           <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5'>
//             {
//               adminCommunities && adminCommunities?.map((community, index) => (
//                 <div key={index} className='border p-3 rounded-lg mt-4 flex items-start gap-4 justify-between'>
//                   <Link to={`/community/mycommunities/${community.id}`} className='w-full'>
//                     <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
//                       <div className='rounded-lg items-center justify-center border col-span-1 md:min-w-14 hidden md:block'
//                         style={{ backgroundImage: `url('${community?.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
//                       >
//                       </div>
//                       <div className='space-y-1 col-span-4'>
//                         <h2 className='text-sm md:text-lg font-semibold text-nowrap text-[#273454] truncate'>{community.title}</h2>
//                         <p className='text-xs font-medium text-[#273454] text-nowrap line-clamp-1'>{stripHtmlTags(community.description)}</p>
//                         <p className='text-xs font-medium text-[#273454] mb-1'><span className='font-semibold'>{community.total_user_joined}</span> {community?.total_user_joined <= 1 ? 'Member' : 'Members'}</p>
//                       </div>
//                     </div>
//                   </Link>
//                   <div>
//                     <DropdownMenu>
//                       <DropdownMenuTrigger><EllipsisVertical className="h-4 w-4 text-cblack" /></DropdownMenuTrigger>
//                       <DropdownMenuContent className='w-40' side='left' align='start'>
//                         <DropdownMenuItem>Mute</DropdownMenuItem>
//                         <DropdownMenuItem>Unfollow</DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem>
//                           <span className='text-[#FF0000]'>Report</span></DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </div>
//                 </div>
//               ))
//             }
//           </div>
//         </div>}
//       </div>
//       <div>
//         {
//           popularCommunities && popularCommunities.length > 0 && popularCommunities.map((org, index) => (
//             org?.org_type != 'industry' && org.org_name !== 'CodeEdu' && <div key={index} className='border-b-[1px] border-[#FFDCF0] pb-7 mt-4'>
//               {org.org_name !== 'CodeEdu' && <h2 className='font-semibold text-[22px] text-cblue'>{org.org_name}</h2>}
//               <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5'>
//                 {
//                   org?.communities && org.communities.map((community, index) => (
//                     community?.created_by !== id && <div key={index} className='border p-3 rounded-lg mt-4 flex items-start gap-4 justify-between'>
//                       <Link to={`/community/mycommunities/${community.id}`} className='w-full'>
//                         <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
//                           <div className='rounded-lg  items-center justify-center border col-span-1 md:min-w-14 hidden md:block'
//                             style={{ backgroundImage: `url('${community?.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
//                           >
//                           </div>
//                           <div className='space-y-1 col-span-4'>
//                             <h2 className='text-sm md:text-lg font-semibold text-nowrap text-[#273454] truncate'>{community.title}</h2>
//                             <p className='text-xs font-medium text-[#273454] text-nowrap line-clamp-1'>{stripHtmlTags(community.description)}</p>
//                             <p className='text-xs font-medium text-[#273454] mb-1'><span className='font-semibold'>{community.total_user_joined}</span> {community?.total_user_joined <= 1 ? 'Member' : 'Members'}</p>
//                           </div>
//                         </div>
//                       </Link>
//                       <div>
//                         <DropdownMenu>
//                           <DropdownMenuTrigger><EllipsisVertical className="h-4 w-4 text-cblack" /></DropdownMenuTrigger>
//                           <DropdownMenuContent className='w-40' side='left' align='start'>
//                             <DropdownMenuItem onClick={() => muteThisCommunity(community.id)}>
//                               {
//                                 community?.is_mute ? <span>Unmute</span> : <span className='text-cblue'>Mute</span>
//                               }
//                             </DropdownMenuItem>
//                             <DropdownMenuItem>Unfollow</DropdownMenuItem>
//                             <DropdownMenuSeparator />
//                             <DropdownMenuItem
//                               onClick={() => {
//                                 setReportSelectedCommunity(community);
//                                 setReportOpen(true);
//                               }}
//                             >
//                               <span className='text-[#FF0000]'>Report</span></DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </div>
//                     </div>
//                   ))
//                 }
//               </div>
//             </div>
//           ))
//         }
//       </div>
//       {industryCommunities && industryCommunities?.length > 0 && <div className='border-b-[1px] border-[#FFDCF0] pb-7 mt-4'>
//         <h2 className='text-[22px] font-semibold text-cblue'>Industry & Experts Community</h2>
//         <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5'>
//           {
//             industryCommunities && industryCommunities?.map((community, index) => (
//               <div key={index} className='border p-3 rounded-lg mt-4 flex items-start gap-4 justify-between'>
//                 <Link to={`/community/mycommunities/${community.id}`} className='w-full'>
//                   <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
//                     <div className='rounded-lg items-center justify-center border col-span-1 md:min-w-14 hidden md:block'
//                       style={{ backgroundImage: `url('${community?.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
//                     >
//                     </div>
//                     <div className='space-y-1 col-span-4'>
//                       <h2 className='text-sm md:text-lg font-semibold text-nowrap text-[#273454] truncate'>{community.title}</h2>
//                       <p className='text-xs font-medium text-[#273454] text-nowrap line-clamp-1'>{stripHtmlTags(community.description)}</p>
//                       <p className='text-xs font-medium text-[#273454] mb-1'><span className='font-semibold'>{community.total_user_joined}</span> {community?.total_user_joined <= 1 ? 'Member' : 'Members'}</p>
//                     </div>
//                   </div>
//                 </Link>
//                 <div>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger><EllipsisVertical className="h-4 w-4 text-cblack" /></DropdownMenuTrigger>
//                     <DropdownMenuContent className='w-40' side='left' align='start'>
//                       <DropdownMenuItem>Mute</DropdownMenuItem>
//                       <DropdownMenuItem>Unfollow</DropdownMenuItem>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem>
//                         <span className='text-[#FF0000]'>Report</span></DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </div>
//             ))
//           }
//         </div>
//       </div>}
//       {
//         yourCommunities && yourCommunities?.length > 0 && <div className='border-b-[1px] border-[#FFDCF0] pb-7 mt-4'>
//           <h2 className='text-[22px] font-semibold text-cblue'>Your Communities</h2>
//           <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5'>
//             {
//               yourCommunities && yourCommunities?.map((community, index) => (

//                 <div key={index} className='border p-3 rounded-lg mt-4 flex items-start gap-4 justify-between'>
//                   <Link to={`/community/mycommunities/${community.id}`} className='w-full'>
//                     <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
//                       <div className='rounded-lg  items-center justify-center border col-span-1 md:min-w-14 hidden md:block'
//                         style={{ backgroundImage: `url('${community?.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
//                       >
//                       </div>
//                       <div className='space-y-1 col-span-4'>
//                         <h2 className='text-sm md:text-lg font-semibold text-nowrap text-[#273454] truncate'>{community.title}</h2>
//                         <p className='text-xs font-medium text-[#273454] text-nowrap line-clamp-1'>{stripHtmlTags(community.description)}</p>
//                         <p className='text-xs font-medium text-[#273454] mb-1'><span className='font-semibold'>{community.total_user_joined}</span> {community?.total_user_joined <= 1 ? 'Member' : 'Members'}</p>
//                       </div>
//                     </div>
//                   </Link>
//                   <div>
//                     <DropdownMenu>
//                       <DropdownMenuTrigger><EllipsisVertical className="h-4 w-4 text-cblack" /></DropdownMenuTrigger>
//                       <DropdownMenuContent className='w-40' side='left' align='start'>
//                         <DropdownMenuItem asChild>
//                           <Link to={`/community/edit/${community.id}`} className='text-cblue'>Edit</Link>
//                         </DropdownMenuItem>
//                         <DropdownMenuItem onClick={() => deleteCommunityHandle(community.id)}>
//                           <span className='text-[#FF0000]'>Delete</span></DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </div>
//                 </div>
//               ))
//             }
//           </div>
//         </div>
//       }
//       {otherCommunities && otherCommunities?.length > 0 && <div className='border-b-[1px] border-[#FFDCF0] pb-7 mt-4'>
//         <h2 className='text-[22px] font-semibold text-cblue'>Others Communities</h2>
//         <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5'>
//           {
//             otherCommunities && otherCommunities?.map((community, index) => (
//               <div key={index} className='border p-3 rounded-lg mt-4 flex items-start gap-4 justify-between'>
//                 <Link to={`/community/mycommunities/${community.id}`} className='w-full'>
//                   <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
//                     <div className='rounded-lg items-center justify-center border col-span-1 md:min-w-14 hidden md:block'
//                       style={{ backgroundImage: `url('${community?.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
//                     >
//                     </div>
//                     <div className='space-y-1 col-span-4'>
//                       <h2 className='text-sm md:text-lg font-semibold text-nowrap text-[#273454] truncate'>{community.title}</h2>
//                       <p className='text-xs font-medium text-[#273454] text-nowrap line-clamp-1'>{stripHtmlTags(community.description)}</p>
//                       <p className='text-xs font-medium text-[#273454] mb-1'><span className='font-semibold'>{community.total_user_joined}</span> {community?.total_user_joined <= 1 ? 'Member' : 'Members'}</p>
//                     </div>
//                   </div>
//                 </Link>
//                 <div>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger><EllipsisVertical className="h-4 w-4 text-cblack" /></DropdownMenuTrigger>
//                     <DropdownMenuContent className='w-40' side='left' align='start'>
//                       <DropdownMenuItem>Mute</DropdownMenuItem>
//                       <DropdownMenuItem>Unfollow</DropdownMenuItem>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem>
//                         <span className='text-[#FF0000]'>Report</span></DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </div>
//             ))
//           }
//         </div>
//       </div>}
//       <Report communityId={reportSelectedCommunity?.id} open={reportOpen} onOpenChange={setReportOpen} />
//     </CommunityLayout>
//   )
// }

// export default MyCommunities