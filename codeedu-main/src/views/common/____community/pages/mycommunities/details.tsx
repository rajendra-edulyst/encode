import React, { lazy, useEffect, useState } from 'react';
import { Button } from "@/components/ui/ShadcnButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar1, ChevronLeft, EllipsisVertical, Globe, MapPin, Plus } from 'lucide-react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Poppin from '@community/components/post/poppin';
import { useSessionUser } from '@/store/authStore';
import { stripHtmlTags } from '@/utils/stripHtmlTags';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import ShareData from '../../components/ShareData';
import Report from './report';
import CommunityLayout from '../../layouts';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCommunity, fetchCommunityDetails, fetchCommunityMembers, joinCommunity, leaveCommunity, muteCommunity } from '../../services/CommunityService';
import Swal from 'sweetalert2';
import { usePostsStore } from '../../store/postStore';
import PostCardView from '../../components/post/CardView';
import Loading from '@/components/shared/Loading';
import { toast } from 'sonner';
import WeeklyCalendar from '@/views/faculty/dashboard/Calendar';
import Pined from '../../components/post/pined';
const OpinionPoll = lazy(() => import('../../pages/wall/poll'));

interface Member {
  id: number;
  name: string;
  email: string;
  profile_image: string | null;
  user_status: string;
  user_id: number;
  is_joined: boolean;
  role: 'admin' | 'member' | 'moderator';
}

interface AboutCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isLast?: boolean;
}

const AboutCard: React.FC<AboutCardProps> = ({ title, description, icon, isLast }) => {
  return (
    <div className={`flex items-start gap-3 ${!isLast ? 'border-b border-[#b6b6b6]/30 pb-4 mb-4' : ''}`}>
      <div className="text-pink-600 text-xl mt-1">{icon}</div>
      <div>
        <h3 className="text-[15px] leading-[22px] font-medium text-cblack mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

const CommunityDetails: React.FC = () => {

  const navigate = useNavigate();
  const { communityId } = useParams<{ communityId: string }>();
  const queryClient = useQueryClient();
  const { id } = useSessionUser((state) => state.user);
  const location = useLocation();
  const isDiscover = location.pathname.includes('/community/discover');
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [shareContent, setShareContent] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);


  const { communityPosts: communityPostsData, fetchCommunityPosts } = usePostsStore();
  const {data: posts, loading: postsLoading} = communityPostsData;


  // Fetch community details
  const { data: communityDetails, isLoading: isDetailsLoading, error: detailsError } = useQuery({
    queryKey: ['communityDetails', communityId],
    queryFn: () => fetchCommunityDetails(communityId!),
    enabled: !!communityId,
  });

  // Fetch community members
  const { data: members, isLoading: isMembersLoading } = useQuery({
    queryKey: ['communityMembers', communityId],
    queryFn: () => fetchCommunityMembers(communityId!),
    enabled: !!communityId,
  });

   // Fetch community posts
  useEffect(() => {
    if (communityId) {
      fetchCommunityPosts(communityId);
    }
  }, [communityId, fetchCommunityPosts]);

  // Mutations
  const joinMutation = useMutation({
    mutationFn: joinCommunity,
    onSuccess: () => {
      Swal.fire({
        title: 'Success',
        text: 'You have successfully joined the community!',
        icon: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['communityDetails', communityId] });
      queryClient.invalidateQueries({ queryKey: ['communityMembers', communityId] });
    },
    onError: (error) => {
      console.error('Failed to join community:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to join the community. Please try again later.',
        icon: 'error',
      });
    },
  });

  const leaveMutation = useMutation({
    mutationFn: leaveCommunity,
    onSuccess: () => {
      Swal.fire({
        title: 'Success',
        text: 'You have successfully left the community!',
        icon: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['communityDetails', communityId] });
      queryClient.invalidateQueries({ queryKey: ['communityMembers', communityId] });
    },
    onError: (error) => {
      console.error('Failed to leave community:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to leave the community. Please try again later.',
        icon: 'error',
      });
    },
  });

  const muteMutation = useMutation({
    mutationFn: muteCommunity,
    onSuccess: () => {
      Swal.fire({
        title: 'Success',
        text: `You have successfully ${communityDetails?.is_mute ? 'unmuted' : 'muted'} the community!`,
        icon: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['communityDetails', communityId] });
    },
    onError: (error) => {
      console.error('Failed to mute community:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to mute the community. Please try again later.',
        icon: 'error',
      });
    },
  });

  const deleteNowCommunityMutation = useMutation({
    mutationFn: deleteCommunity,
    onSuccess: () => {
      Swal.fire({
        title: 'Success',
        text: 'Community deleted successfully!',
        icon: 'success',
      });
      navigate('/community/mycommunities');
      queryClient.invalidateQueries({ queryKey: ['communityDetails', communityId] });
      queryClient.invalidateQueries({ queryKey: ['communityMembers', communityId] });
    },
    onError: (error) => {
      console.error('Failed to delete community:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to delete the community. Please try again later.',
        icon: 'error',
      });
    },
  });

  const filteredMembers: Member[] = [];
  if (members?.data?.followers) {
    filteredMembers.push(...members.data.followers.map(member => ({
      ...member,
      role: 'member' as const,
    })));
  }
  if (members?.data?.admin) {
    filteredMembers.push(...members.data.admin.map(member => ({
      ...member,
      role: 'admin' as const,
    })));
  }

  if (members?.data?.moderator) {
    filteredMembers.push(...members.data.moderator.map(member => ({
      ...member,
      role: 'moderator' as const,
    })));
  }

  const joinThisCommunity = (communityId: number) => {
    Swal.fire({
      title: 'Join Community',
      text: 'Are you sure you want to join this community?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Join',
      cancelButtonText: 'No, Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        joinMutation.mutate(communityId);
      }
    });
  };

  const leaveThisCommunity = (communityId: number) => {
    Swal.fire({
      title: 'Leave Community',
      text: 'Are you sure you want to leave this community?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Leave',
      cancelButtonText: 'No, Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        leaveMutation.mutate(communityId);
      }
    });
  };

  const muteThisCommunity = (communityId: number) => {
    Swal.fire({
      title: 'Mute Community',
      text: `Are you sure you want to ${communityDetails?.is_mute ? 'unmute' : 'mute'} this community? You will not receive notifications.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${communityDetails?.is_mute ? 'Unmute' : 'Mute'}`,
      cancelButtonText: 'No, Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        muteMutation.mutate(communityId);
      }
    });
  };

  const deleteCommunityHandle = (communityId: number) => {
    Swal.fire({
      title: 'Delete Community',
      text: 'Are you sure you want to delete this community? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteNowCommunityMutation.mutate(communityId);
      }
    });
  };

  if (isDetailsLoading) {
    return (
      <CommunityLayout active={isDiscover ? 'discover' : 'mycommunities'}>
           <div className="w-full flex justify-center items-center h-96">
            <Loading loading={isDetailsLoading} />
           </div>
      </CommunityLayout>
    );
  }

  if (detailsError) {
    return (
      <CommunityLayout active={isDiscover ? 'discover' : 'mycommunities'}>
        <div className="w-full flex flex-col md:flex-row py-6 gap-5">
          <div className="w-full md:w-[75%] text-center py-6 text-red-500">
            Error loading community details. Please try again later.
          </div>
        </div>
      </CommunityLayout>
    );
  }

  return (
    <CommunityLayout active={isDiscover ? 'discover' : 'mycommunities'}>
      <div className="w-full flex flex-col md:flex-row py-6 gap-5">
        <div className="w-full md:w-[75%]">
          <div className="mt-4">
            <Button variant="outline" className="mb-4">
              <Link to={isDiscover ? "/community/discover" : "/community/mycommunities"} className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Back to Communities
              </Link>
            </Button>
            <div className="rounded-lg overflow-hidden bg-white shadow-sm mb-6 border p-3">
              <div
                className="w-full h-[200px] overflow-hidden rounded-lg relative"
                style={{
                  backgroundImage: `url(${communityDetails?.cover_image || ''})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="py-6 px-3 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <div>
                        <img src={communityDetails?.image || ''} alt={communityDetails?.title} className="w-16 h-16 rounded-md object-cover border-2 p-1 mb-4" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{communityDetails?.title}</h1>
                        <p className="text-gray-600 max-w-3xl mb-4">
                          {stripHtmlTags(communityDetails?.description ?? '')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <span>Public Group</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">{filteredMembers.length} members</span>
                    </div>
                  </div>
                  {communityDetails?.domain_name && <div className="flex flex-col items-end gap-2">
                    <Button variant="outline" className="rounded-full whitespace-nowrap">
                      {communityDetails?.domain_name}
                    </Button>
                  </div>
                  }
                </div>
                <div className="flex items-center justify-between mt-4 w-full">
                  <div className="flex -space-x-2">
                    {filteredMembers.slice(0, 4).map((member) => (
                      <img
                        key={member.id}
                        src={member.profile_image || ''}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white cursor-pointer"
                      />
                    ))}
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white text-xs text-gray-600 cursor-pointer">
                      +
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!communityDetails?.user_joined_id ? (
                      <Button
                        variant="outline"
                        className="border border-[--IndexBlue] text-[--IndexBlue] rounded-full flex items-center gap-2 whitespace-nowrap cursor-pointer hover:bg-[--IndexBlue] hover:text-white"
                        disabled={joinMutation.isPending}
                        onClick={() => joinThisCommunity(Number(communityId))}
                      >
                        Join Community
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="border border-[--IndexBlue] text-[--IndexBlue] rounded-full flex items-center gap-2 whitespace-nowrap cursor-pointer hover:bg-[--IndexBlue] hover:text-white"
                        disabled={communityDetails?.user_mapping_id !== null}
                      >
                        Joined Community
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 focus-visible:ring-0 focus-visible:ring-offset-0">
                          <EllipsisVertical className="h-4 w-4 text-gray-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        side="bottom"
                        align="end"
                        sideOffset={8}
                        className="w-40 bg-white shadow-xl rounded-xl p-1"
                      >
                        {
                          communityDetails?.created_by && id !== communityDetails?.created_by &&
                          <DropdownMenuItem className="px-4 py-2 text-sm text-black hover:bg-gray-100 rounded-md cursor-pointer">
                          Block
                        </DropdownMenuItem>
                        }
                         {
                          communityDetails?.created_by && id !== communityDetails?.created_by &&
                          <DropdownMenuItem
                            className="px-4 py-2 text-sm text-black hover:bg-gray-100 rounded-md cursor-pointer"
                            onClick={() => muteThisCommunity(Number(communityId))}
                          >
                            {communityDetails?.is_mute ? 'Unmute' : 'Mute'}
                          </DropdownMenuItem>
                        }
                        <DropdownMenuItem
                          className="px-4 py-2 text-sm hover:bg-gray-100 rounded-md cursor-pointer flex items-center gap-2"
                          onClick={() => {
                            setShareContent(`https://codeedu.community/community/mycommunities/${communityId}`);
                            setShareOpen(true);
                          }}
                        >
                          <span>Share</span>
                        </DropdownMenuItem>
                         {
                          communityDetails?.created_by && id !== communityDetails?.created_by &&  communityDetails?.user_joined_id &&
                          <DropdownMenuItem
                            className="px-4 py-2 text-sm hover:bg-gray-100 hover:text-red-500 rounded-md cursor-pointer flex items-center gap-2 whitespace-nowrap focus-visible:ring-0 focus-visible:ring-offset-0"
                            onClick={() => leaveThisCommunity(Number(communityId))}
                          >
                            <span>Leave Community</span>
                          </DropdownMenuItem>
                        }
                        {
                          // /community/edit/225
                           communityDetails?.created_by && id === communityDetails?.created_by &&  communityDetails?.user_joined_id &&
                            <DropdownMenuItem asChild
                              className="px-4 py-2 text-sm hover:bg-gray-100 rounded-md cursor-pointer flex items-center gap-2 whitespace-nowrap focus-visible:ring-0 focus-visible:ring-offset-0"
                            >
                              <Link to={`/community/edit/${communityId}`} className="flex items-center gap-2">
                                <span>Edit Community</span>
                              </Link>
                            </DropdownMenuItem>
                        }
                        <DropdownMenuSeparator className='border-b border-gray-100 my-1' />
                        {
                          communityDetails?.created_by && id === communityDetails?.created_by &&
                          <DropdownMenuItem
                            className="px-4 py-2 text-sm hover:bg-gray-100 hover:text-red-500 rounded-md cursor-pointer flex items-center gap-2 whitespace-nowrap focus-visible:ring-0 focus-visible:ring-offset-0"
                            onClick={() => deleteCommunityHandle(Number(communityId))}
                          >
                            <span>Delete Community</span>
                          </DropdownMenuItem>
                        }
                        {
                          communityDetails?.created_by && id !== communityDetails?.created_by &&
                          <DropdownMenuItem
                            className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md cursor-pointer"
                            onClick={() => setReportOpen(true)}
                          >
                            Report
                          </DropdownMenuItem>
                        }
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <Tabs defaultValue="posts" className="w-full">
                <div className="border-b">
                  <div className="flex justify-between items-center">
                    <TabsList className="bg-transparent border-b-0 flex gap-9">
                      <TabsTrigger
                        value="posts"
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[--IndexBlue] data-[state=active]:text-[--IndexBlue] rounded-none py-3"
                      >
                        Posts
                      </TabsTrigger>
                      <TabsTrigger
                        value="members"
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[--IndexBlue] data-[state=active]:text-[--IndexBlue] rounded-none py-3"
                      >
                        Members
                      </TabsTrigger>
                    </TabsList>
                    {/* {communityDetails?.user_mapping_id && (
                      <Button asChild className="bg-[--IndexBlue] hover:bg-[--IndexBlue] text-white cursor-pointer mb-1">
                        <Link
                          to={`/community/myposts/createpost`}
                          state={{ communityId: communityDetails?.id, communityName: communityDetails.title }}
                          className="flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Create Post
                        </Link>
                      </Button>
                    )} */}
                    <Button asChild className="bg-[--IndexBlue] hover:bg-[--IndexBlue] text-white cursor-pointer my-1 scale-95 mr-8">
                          <Link
                            to={`/community/myposts/createpost`}
                            state={{ communityId: communityDetails?.id,communityName: communityDetails?.title  }}
                            className="flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Create Post
                          </Link>
                    </Button>
                  </div>
                </div>
                <TabsContent value="posts" className="p-0 mt-0">
                  {posts && [...posts].sort((a, b) => {
                      if (Number(a.is_pin) === 1 && Number(b.is_pin) !== 1) return -1;
                      if (Number(a.is_pin) !== 1 && Number(b.is_pin) === 1) return 1;
                      return 0;
                  }).map((post) => (
                    <PostCardView key={post.id} post={post} />
                  ))}
                  {posts && posts?.length === 0 && (
                    <div className="text-center text-gray-500 py-6">
                      No posts available in this community.
                    </div>
                  )}
                  {postsLoading && (
                    <div className="text-center py-6">
                      <Loading loading={postsLoading} spinnerClass="text-gray-500" />
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="members" className="p-6 mt-0 space-y-10">
                  {filteredMembers.length > 0 && (
                    <div>
                      {['admin','moderator', 'member'].map((role, index) => {
                        const roleMembers = filteredMembers.filter((m) => m.role === role);
                        if (roleMembers.length === 0) return null;

                        const isMemberSection = role === 'member';
                        const visibleMembers = isMemberSection && !showAllMembers
                          ? roleMembers.slice(0, 3)
                          : roleMembers;

                        return (
                          <div key={index}>
                            <h2 className={`text-xl font-semibold mb-4 text-cblack ${index === 0 ? 'mt-0' : 'mt-8'}`}>
                              {role === 'admin' ? 'Admin' :role==='Moderator' ? 'Moderators' :'Members'}
                            </h2>
                            <div className={`space-y-4 ${role === 'admin' ? 'border-b border-pink-200 pb-8' : ''}`}>
                              {visibleMembers.map((member) => (
                                <div key={member.id} className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <img
                                      src={member.profile_image || ''}
                                      alt={member.name}
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <div className="text-[15px] leading-[22px] font-normal">
                                          {member.name}
                                        {/* </div>
                                        {member.role === 'admin' && (
                                          <span className="bg-pink-100 text-pink-600 px-2 py-0.5 text-xs rounded-full">
                                            Admin
                                          </span>
                                        )}
                                      </div> */}
                                      </div>
                                        {['admin', 'moderator'].includes(member.role) && (
                                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                                            member.role === 'admin'
                                              ? 'bg-pink-100 text-pink-600'
                                              : 'bg-blue-100 text-blue-600'
                                          }`}>
                                            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-sm text-gray-500">{member.email}</div>
                                    </div>
                                  </div>
                                  {id !== member.id && (
                                    <div className="flex items-center gap-x-2">
                                      {/* <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-1.5 rounded-full text-sm">
                                        Follow
                                      </button> */}
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                                            <EllipsisVertical className="h-4 w-4 text-gray-600" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                          side="bottom"
                                          align="end"
                                          sideOffset={8}
                                          className="w-40 bg-white shadow-xl rounded-xl p-1"
                                        >
                                          <DropdownMenuItem
                                        
                                          className="px-4 py-2 text-sm text-black hover:bg-gray-100 rounded-md cursor-pointer">
                                           <Link to={`/portfolio/${member.id}`}>View Profile</Link>
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                        
                                            onClick={() => {
                                              navigator.clipboard.writeText(`${window.location.origin}/portfolio/${member.id}`);
                                              toast.success("Profile link copied successfully!", {
                                                  position: "bottom-right",
                                              });
                                            }}
                                            className="px-4 py-2 text-sm text-black hover:bg-gray-100 rounded-md cursor-pointer">
                                           Copy Profile link
                                          </DropdownMenuItem>
                                          {/* <DropdownMenuItem className="px-4 py-2 text-sm text-black hover:bg-gray-100 rounded-md cursor-pointer">
                                            Make Moderator
                                          </DropdownMenuItem> */}
                                          
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  )}
                                </div>
                              ))}
                              {isMemberSection && roleMembers.length > 3 && (
                                <div className="pt-2 flex justify-end">
                                  <button
                                    className="text-pink-600 hover:underline text-sm"
                                    onClick={() => setShowAllMembers((prev) => !prev)}
                                  >
                                    {showAllMembers ? 'Show Less' : 'See All Members'}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {filteredMembers.length === 0 && (
                    <div className="text-center text-gray-500">
                      No members found in this community.
                    </div>
                  )}
                  {isMembersLoading && <Loading loading={isMembersLoading} />}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        <div className="w-full md:w-[25%]">
          <div className="sticky top-24 space-y-5">
            <div className="bg-white rounded-xl p-4 shadow-sm border glowConnectCard">
              <div className="mb-4">
                <h2 className="font-bold text-cblue text-2xl">About...</h2>
              </div>
              <div className="space-y-4">
                {
                  communityDetails?.is_public === true && <AboutCard
                  title="Public Group"
                  description="Anyone can join the group and see who’s in the and what they post."
                  icon={<Globe strokeWidth={1.5} />}
                  isLast={false}
                />
                }
                <AboutCard
                  title="Date Created"
                  description={`This group was created on ${new Date(communityDetails?.created_at || '').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}`}
                  icon={<Calendar1 strokeWidth={1.5} />}
                  isLast={true}
                />
                {/* <AboutCard
                  title="Jaipur, India"
                  description="This place also known as pink city of India"
                  icon={<MapPin strokeWidth={1.5} />}
                  isLast={true}
                /> */}
              </div>
            </div>
           <WeeklyCalendar />
                        <OpinionPoll />
                        <Pined />
          </div>
        </div>
      </div>
      <ShareData open={shareOpen} content={shareContent} onOpenChange={setShareOpen} />
      <Report communityId={Number(communityId)} open={reportOpen} onOpenChange={setReportOpen} />
    </CommunityLayout>
  );
};

export default CommunityDetails;


// import React, { useEffect, useState } from 'react';
// import { Button } from "@/components/ui/ShadcnButton";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Calendar1, ChevronLeft, EllipsisVertical, Globe, MapPin, Plus } from 'lucide-react';
// import { useCommunitiesStore } from '../../store/communityStore';
// import CommunityLayout from '../../layouts';
// import { Link, useLocation, useParams } from 'react-router-dom';
// import Post from '@community/pages/mycommunities/posts/Post';
// import Poppin from '@community/components/post/poppin';
// import { useSessionUser } from '@/store/authStore';
// import { stripHtmlTags } from '@/utils/stripHtmlTags';
// import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
// import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
// import ShareData from '../../components/ShareData';
// import { joinCommunity, leaveCommunity, muteCommunity } from '../../services/CommunityService';
// import Swal from 'sweetalert2';
// import Report from './report';

// interface Member {
//   id: number;
//   name: string;
//   email: string;
//   profile_image: string | null;
//   user_status: string;
//   user_id: number;
//   is_joined: boolean;
//   role: 'admin' | 'member' | 'moderator'; // Added role property
// }

// const App: React.FC = () => {
//   const { communityId } = useParams<{ communityId: string }>();
//   const { communityPosts, communityDetails, fetchCommunityDetails, members, fetchCommunityMembers } = useCommunitiesStore();
//   const [showAllMembers, setShowAllMembers] = useState(false);
//   const [shareContent, setShareContent] = useState<string | null>(null);
//   const [shareOpen, setShareOpen] = useState(false);
//   const [reportOpen, setReportOpen] = useState(false);

//   useEffect(() => {
//     if (communityId) {
//       fetchCommunityDetails(communityId);
//       fetchCommunityMembers(communityId);
//     }
//   }, [communityId, fetchCommunityDetails, fetchCommunityMembers]);

//   // Initialize filteredMembers
//   const filteredMembers: Member[] = [];

//   // Populate filteredMembers with role assignments
//   if (members?.followers) {
//     filteredMembers.push(...members.followers.map(member => ({
//       ...member,
//       role: 'member' as const
//     })));
//   }

//   if (members?.admin) {
//     filteredMembers.push(...members.admin.map(member => ({
//       ...member,
//       role: 'admin' as const
//     })));
//   }

//   const { id } = useSessionUser((state) => state.user);

//   const location = useLocation();
//   const isDiscover = location.pathname.includes('/community/discover');


//   const joinThisCommunity = (communityId: number) => {
//     // Logic to join the community
//     Swal.fire({
//       title: 'Join Community',
//       text: `Are you sure you want to join this community?`,
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, Join',
//       cancelButtonText: 'No, Cancel',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         // Call the API to join the community
//         joinCommunity(communityId).then(() => {
//           console.log(`Joined community with ID: ${communityId}`);
//           Swal.fire({
//             title: 'Success',
//             text: 'You have successfully joined the community!',
//             icon: 'success',
//           });
//         }).catch((error) => {
//           console.error(`Failed to join community with ID: ${communityId}`, error);
//           Swal.fire({
//             title: 'Error',
//             text: 'Failed to join the community. Please try again later.',
//           });
//         }
//         );
//       }
//     });
//   };

//   const leaveThisCommunity = (communityId: number) => {
//     // Logic to leave the community
//     Swal.fire({
//       title: 'Leave Community',
//       text: `Are you sure you want to leave this community?`,
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, Leave',
//       cancelButtonText: 'No, Cancel',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         // Call the API to leave the community
//         leaveCommunity(communityId).then(() => {
//           console.log(`Left community with ID: ${communityId}`);
//           Swal.fire({
//             title: 'Success',
//             text: 'You have successfully left the community!',
//             icon: 'success',
//           });
//         }).catch(() => {
//           Swal.fire({
//             title: 'Error',
//             text: 'Failed to leave the community. Please try again later.',
//           });
//         }
//         );
//       }
//     });
//   };


//   const muteThisCommunity = (communityId: number) => {
//     // Logic to mute the community
//     Swal.fire({
//       title: 'Mute Community',
//       text: `Are you sure you want to mute this community? You will not receive notifications.`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, Mute',
//       cancelButtonText: 'No, Cancel',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         muteCommunity(communityId).then(() => {
//           console.log(`Muted community with ID: ${communityId}`);
//           Swal.fire({
//             title: 'Success',
//             text: 'You have successfully muted the community!',
//             icon: 'success',
//           });
//         }).catch(() => {
//           Swal.fire({
//             title: 'Error',
//             text: 'Failed to mute the community. Please try again later.',
//           });
//         });
//       }
//     });
//   }



//   return (
//     <CommunityLayout active={isDiscover ? 'discover' : 'mycommunities'}>
//       <div className="w-full flex flex-col md:flex-row py-6 gap-5">
//         <div className="w-full md:w-[75%]">
//           <div className='mt-4'>
//             <Button variant="outline" className="mb-4">
//               <Link to={isDiscover ? "/community/discover" : "/community/mycommunities"} className="flex items-center gap-2">
//                 <ChevronLeft className="w-4 h-4" /> Back to Communities
//               </Link>

//             </Button>
//             <div className="rounded-lg overflow-hidden bg-white shadow-sm mb-6 border p-3">
//               <div
//                 className="w-full h-[200px] overflow-hidden rounded-lg"
//                 style={{
//                   backgroundImage: `url(${communityDetails?.cover_image || ''})`,
//                   backgroundSize: 'cover',
//                   backgroundPosition: 'center'
//                 }}
//               />
//               <div className="py-6 px-3">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h1 className="text-2xl font-bold text-gray-900 mb-2">{communityDetails?.title}</h1>
//                     <p className="text-gray-600 max-w-3xl mb-4">
//                       {stripHtmlTags(communityDetails?.description ?? '')}
//                     </p>
//                     <div className="flex items-center gap-2 mb-4">
//                       <div className="flex items-center gap-1 text-gray-600">
//                         <Globe className="w-4 h-4 text-gray-500" />
//                         <span>Public Group</span>
//                       </div>
//                       <span className="text-gray-400">•</span>
//                       <span className="text-gray-600">{filteredMembers?.length} members</span>
//                     </div>
//                   </div>


//                   <div className="flex flex-col items-end gap-2">
//                     <Button variant="outline" className="rounded-full whitespace-nowrap">
//                       Event Announcements
//                     </Button>
//                   </div>
//                 </div>
//                 <div className="flex items-center justify-between mt-4 w-full">
//                   <div className="flex -space-x-2">
//                     {filteredMembers.slice(0, 4).map((member) => (
//                       <img
//                         key={member.id}
//                         src={member.profile_image || ''}
//                         alt={member.name}
//                         className="w-8 h-8 rounded-full object-cover border-2 border-white cursor-pointer"
//                       />
//                     ))}
//                     <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white text-xs text-gray-600 cursor-pointer">
//                       +
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     {/* {
//                       communityDetails?.user_mapping_id &&
//                       <div className="text-sm text-gray-500 whitespace-nowrap">
//                         Joined this community on Mar 24
//                       </div>
//                     } */}
//                     {
//                       !communityDetails?.user_mapping_id ? (
//                         <Button variant="outline" className="border border-[--IndexBlue] text-[--IndexBlue] rounded-full flex items-center gap-2 whitespace-nowrap cursor-pointer  hover:bg-[--IndexBlue] hover:text-white"
//                           onClick={() => joinThisCommunity(Number(communityId))}
//                         >
//                           Join Community
//                         </Button>
//                       ) : (
//                         <Button variant="outline" className="border border-[--IndexBlue] text-[--IndexBlue] rounded-full flex items-center gap-2 whitespace-nowrap cursor-pointer  hover:bg-[--IndexBlue] bg-[--IndexBlue] text-white"
//                           onClick={() => leaveThisCommunity(Number(communityId))}
//                         >
//                           Joined Community
//                         </Button>
//                       )
//                     }
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
//                           <EllipsisVertical className="h-4 w-4 text-gray-600" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent
//                         side="bottom"
//                         align="end"
//                         sideOffset={8}
//                         className="w-40 bg-white shadow-xl rounded-xl p-1"
//                       >
//                         <DropdownMenuItem className="px-4 py-2 text-sm text-black hover:bg-gray-100 rounded-md cursor-pointer">
//                           Block
//                         </DropdownMenuItem>
//                         <DropdownMenuItem className="px-4 py-2 text-sm text-black hover:bg-gray-100 rounded-md cursor-pointer"
//                           onClick={() => muteThisCommunity(Number(communityId))}
//                         >
//                           {
//                             communityDetails?.is_mute ? <span>Unmute</span> : <span>Mute</span>
//                           }
//                         </DropdownMenuItem>
//                         {/* <DropdownMenuItem className="px-4 py-2 text-sm text-black hover:bg-gray-100 rounded-md cursor-pointer"
//                           onClick={() => {
//                             if (communityDetails?.user_mapping_id) {
//                               leaveThisCommunity(Number(communityId));
//                             } else {
//                               joinThisCommunity(Number(communityId));
//                             }
//                           }}
//                         >
//                           {communityDetails?.user_mapping_id ? 'Unfollow' : 'Follow'}
//                         </DropdownMenuItem> */}
//                         <DropdownMenuItem
//                           className="px-4 py-2 text-sm  hover:bg-gray-100 rounded-md cursor-pointer flex items-center gap-2"
//                           onClick={() => {
//                             setShareContent(`https://codeedu.community/community/mycommunities/${communityId}`);
//                             setShareOpen(true);
//                           }}
//                         >
                       
//                           <span>Share</span>
//                         </DropdownMenuItem>

//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md cursor-pointer"
//                           onClick={() => setReportOpen(true)}
//                         >
//                           Report
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </div>
//                 </div>
//               </div>

//             </div>
//             <div className="bg-white rounded-lg shadow-sm mb-6">
//               <Tabs defaultValue="posts" className="w-full">
//                 <div className="border-b">
//                   <div className="flex justify-between items-center">
//                     <TabsList className="bg-transparent border-b-0 flex gap-9">
//                       <TabsTrigger
//                         value="posts"
//                         className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[--IndexBlue] data-[state=active]:text-[--IndexBlue] rounded-none py-3"
//                       >
//                         Posts
//                       </TabsTrigger>
//                       <TabsTrigger
//                         value="members"
//                         className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[--IndexBlue] data-[state=active]:text-[--IndexBlue] rounded-none py-3"
//                       >
//                         Members
//                       </TabsTrigger>
//                     </TabsList>
//                     {
//                       communityDetails?.user_mapping_id && 
//                       <Button asChild className="bg-[--IndexBlue] hover:bg-[--IndexBlue] text-white cursor-pointer mb-1">
//                         <Link to={`/community/myposts/createpost`} state={{ communityId: communityDetails?.id, communityName: communityDetails.title }} className="flex items-center gap-2">
//                           <Plus className="w-4 h-4" />
//                           Create Post
//                         </Link>
//                       </Button>
//                     }
//                   </div>
//                 </div>
//                 <TabsContent value="posts" className="p-0 mt-0">
//                   {communityPosts?.map((post) => (
//                     <Post key={post.id} post={post} />
//                   ))}
//                   {
//                     communityPosts?.length === 0 && (
//                       <div className="text-center text-gray-500 py-6">
//                         No posts available in this community.
//                       </div>
//                     )
//                   }
//                 </TabsContent>
//                 <TabsContent value="members" className="p-6 mt-0 space-y-10">
//                   {filteredMembers && filteredMembers?.length != 0 &&
//                     <div>
//                       {['admin', 'member'].map((role, index) => {
//                         const roleMembers = filteredMembers.filter((m) => m.role === role);
//                         if (roleMembers.length === 0) return null;

//                         const isMemberSection = role === 'member';
//                         const visibleMembers = isMemberSection && !showAllMembers
//                           ? roleMembers.slice(0, 3)
//                           : roleMembers;

//                         return (
//                           <div key={index}>
//                             <h2 className={`text-xl font-semibold mb-4 text-cblack ${index == 0 ? 'mt-0' : 'mt-8'}`}>
//                               {role === 'admin' ? 'Admin' : 'Members'}
//                             </h2>
//                             <div className={`space-y-4 ${role === 'admin' ? 'border-b border-pink-200 pb-8' : ''}`}>
//                               {visibleMembers.map((member) => (
//                                 <div key={member.id} className="flex items-center justify-between">
//                                   <div className="flex items-center gap-4">
//                                     <img
//                                       src={member.profile_image || ''}
//                                       alt={member.name}
//                                       className="w-10 h-10 rounded-full object-cover"
//                                     />
//                                     <div>
//                                       <div className="flex items-center gap-2">
//                                         <div className="text-[15px] leading-[22px] font-normal">
//                                           {member.name}
//                                         </div>
//                                         {member.role === 'admin' && (
//                                           <span className="bg-pink-100 text-pink-600 px-2 py-0.5 text-xs rounded-full">
//                                             Admin
//                                           </span>
//                                         )}
//                                       </div>
//                                       <div className="text-sm text-gray-500">{member.email}</div>
//                                     </div>
//                                   </div>
//                                   {
//                                     id !== member?.id && (
//                                       <div className="flex items-center gap-x-2">
//                                         <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-1.5 rounded-full text-sm">
//                                           Follow
//                                         </button>
//                                         <DropdownMenu>
//                                           <DropdownMenuTrigger asChild>
//                                             <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
//                                               <EllipsisVertical className="h-4 w-4 text-gray-600" />
//                                             </Button>
//                                           </DropdownMenuTrigger>
//                                           <DropdownMenuContent
//                                             side="bottom"
//                                             align="end"
//                                             sideOffset={8}
//                                             className="w-40 bg-white shadow-xl rounded-xl p-1"
//                                           >
//                                             <DropdownMenuItem className="px-4 py-2 text-sm text-black hover:bg-gray-100 rounded-md cursor-pointer">
//                                               Block
//                                             </DropdownMenuItem>
//                                             <DropdownMenuItem className="px-4 py-2 text-sm text-black hover:bg-gray-100 rounded-md cursor-pointer"
//                                             >
//                                               Mute
//                                             </DropdownMenuItem>
//                                             <DropdownMenuSeparator />
//                                             <DropdownMenuItem className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md cursor-pointer"
//                                             >
//                                               Remove
//                                             </DropdownMenuItem>
//                                           </DropdownMenuContent>
//                                         </DropdownMenu>
//                                       </div>
//                                     )
//                                   }
//                                 </div>
//                               ))}
//                               {isMemberSection && roleMembers.length > 3 && (
//                                 <div className="pt-2 flex justify-end">
//                                   <button
//                                     className="text-pink-600 hover:underline text-sm"
//                                     onClick={() => setShowAllMembers((prev) => !prev)}
//                                   >
//                                     {showAllMembers ? 'Show Less' : 'See All Members'}
//                                   </button>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   }
//                   {
//                     filteredMembers && filteredMembers.length === 0 && (
//                       <div className="text-center text-gray-500">
//                         No members found in this community.
//                       </div>
//                     )
//                   }
//                 </TabsContent>
//               </Tabs>
//             </div>
//           </div>
//         </div>
//         <div className="w-full md:w-[25%]">
//           <div className='sticky top-24 space-y-5'>
//             <div className="bg-white rounded-xl p-4 shadow-sm border glowConnectCard">
//               <div className="mb-4">
//                 <h2 className="font-bold text-cblue text-2xl">About...</h2>
//               </div>

//               <div className="space-y-4">
//                 <AboutCard
//                   title="Public Group"
//                   description="Anyone can join the group and see who’s in the and what they post."
//                   icon={<Globe strokeWidth={1.5} />}
//                   isLast={false}
//                 />
//                 <AboutCard
//                   title="Date Created"
//                   description="This group was created on November 2023."
//                   icon={<Calendar1 strokeWidth={1.5} />}
//                   isLast={false}
//                 />
//                 <AboutCard
//                   title="Jaipur, India"
//                   description="This place also known as pink city of india"
//                   icon={<MapPin strokeWidth={1.5} />}
//                   isLast={true}
//                 />
//               </div>
//             </div>
//             <Poppin />
//           </div>
//         </div>
//       </div>
//       <ShareData open={shareOpen} content={shareContent} onOpenChange={setShareOpen} />
//       <Report communityId={Number(communityId)} open={reportOpen} onOpenChange={setReportOpen} />
//     </CommunityLayout>
//   );
// };


// interface AboutCardProps {
//   title: string;
//   description: string;
//   icon: React.ReactNode;
//   isLast?: boolean;
// }

// const AboutCard: React.FC<AboutCardProps> = ({
//   title, description, icon, isLast
// }) => {
//   return (
//     <div className={`flex items-start gap-3 ${!isLast ? 'border-b border-[#b6b6b6]/30 pb-4 mb-4' : ''}`}>
//       <div className="text-pink-600 text-xl mt-1">
//         {icon}
//       </div>
//       <div>
//         <h3 className="text-[15px] leading-[22px] font-medium text-cblack mb-1">{title}</h3>
//         <p className="text-sm text-gray-500">{description}</p>
//       </div>
//     </div>
//   );
// };



// export default App;