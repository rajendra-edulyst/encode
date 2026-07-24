import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/ShadcnButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar1, EllipsisVertical, Globe, ImagePlus, Plus } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSessionUser } from '@/store/authStore';
import { stripHtmlTags } from '@/utils/stripHtmlTags';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import ConnectLayout from '../layouts';
import Swal from 'sweetalert2';
import Loading from '@/components/shared/Loading';
import { toast } from 'sonner';
import { useCommunityDetails, useCommunityMembers, useJoinCommunity, useLeaveCommunity, useReportCommunity, useMuteCommunity, useDeleteCommunity } from '@/hooks/data/connect/useCommunity';
import { usePosts } from '@/hooks/data/connect/usePosts';
import LoadingSection from '@/components/LoadingSection';
import ShareDialog from '@/components/shared/ShareDialog';
import { useAuth } from '@/auth'
import { isPinnedForUser } from '@/utils/postUtils'
import { mixpanelService } from '@/services/mixpanel/MixpanelService';
import PostCard from '../components/post-card';

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
    <div className={`flex items-start gap-3 ${!isLast ? 'border-b border-[#b6b6b6]/30 dark:border-gray-700 pb-4 mb-4' : ''}`}>
      <div className="text-pink-600 dark:text-pink-400 text-xl mt-1">{icon}</div>
      <div>
        <h3 className="text-[15px] leading-[22px] font-medium text-cblack dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
};

const Community: React.FC = () => {

  const navigate = useNavigate();
  const { communityId } = useParams<{ communityId: string }>();
  const { id } = useSessionUser((state) => state.user);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [visiblePostsCount, setVisiblePostsCount] = useState(20);

  // params for posts
  const params = new URLSearchParams();
  params.append('category_id', communityId!);
  // Use optimized hooks
  const { data: communityDetails, isLoading: isDetailsLoading } = useCommunityDetails(Number(communityId));
  const { data: posts, isLoading: postsLoading } = usePosts(params);
  const { user } = useAuth();
  const { data: members, isLoading: isMembersLoading } = useCommunityMembers(Number(communityId));
  const { mutate: joinCommunityMutation, isPending: isJoining } = useJoinCommunity();
  const { mutate: leaveCommunityMutation, isPending: isLeaving } = useLeaveCommunity();
  const { mutate: reportCommunityMutation, isPending: isReporting } = useReportCommunity();
  const { mutate: muteCommunityMutation, isPending: isMuting } = useMuteCommunity();
  const { mutate: deleteCommunityMutation, isPending: isDeleting } = useDeleteCommunity();

  const trackedPageView = React.useRef(false);
  React.useEffect(() => {
    if (communityDetails?.title && !trackedPageView.current) {
      mixpanelService.track('Connect Community Details Viewed', {
        community_name: communityDetails.title,
        community_id: communityId,
        page_path: window.location.pathname,
        timestamp: new Date().toISOString()
      });
      trackedPageView.current = true;
    }
  }, [communityDetails, communityId]);

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

  const joinThisCommunity = useCallback((communityId: number) => {
    Swal.fire({
      title: 'Join Community',
      text: 'Are you sure you want to join this community?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Join',
      cancelButtonText: 'No, Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        joinCommunityMutation({ id: communityId });
      }
    });
  }, [joinCommunityMutation]);

  const leaveThisCommunity = useCallback((communityId: number) => {
    Swal.fire({
      title: 'Leave Community',
      text: 'Are you sure you want to leave this community?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Leave',
      cancelButtonText: 'No, Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        leaveCommunityMutation({ id: communityId });
      }
    });
  }, [leaveCommunityMutation]);

  const muteThisCommunity = useCallback((communityId: number) => {
    Swal.fire({
      title: 'Mute Community',
      text: `Are you sure you want to ${communityDetails?.is_mute ? 'unmute' : 'mute'} this community? ${!communityDetails?.is_mute ? 'You will not receive notifications.' : ''}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${communityDetails?.is_mute ? 'Unmute' : 'Mute'}`,
      cancelButtonText: 'No, Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        muteCommunityMutation({ communityId });
      }
    });
  }, [muteCommunityMutation, communityDetails?.is_mute]);

  const deleteCommunityHandle = useCallback((communityId: number) => {
    Swal.fire({
      title: 'Delete Community',
      text: 'Are you sure you want to delete this community? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCommunityMutation({ communityId });
        // Navigate after successful deletion (handled in the hook's onSuccess)
        navigate('/connect/communities');
      }
    });
  }, [deleteCommunityMutation, navigate]);

  const handleReportCommunity = useCallback((communityId: number) => {
    Swal.fire({
      title: 'Report Community',
      input: 'textarea',
      inputLabel: 'Please provide a reason for reporting this community',
      inputPlaceholder: 'Enter your reason here...',
      inputAttributes: {
        'aria-label': 'Report reason'
      },
      showCancelButton: true,
      confirmButtonText: 'Submit Report',
      cancelButtonText: 'Cancel',
      preConfirm: (reason) => {
        if (!reason || reason.trim().length === 0) {
          Swal.showValidationMessage('Please enter a reason for reporting');
          return false;
        }
        if (reason.trim().length > 1000) {
          Swal.showValidationMessage('Reason cannot exceed 1000 characters');
          return false;
        }
        return reason.trim();
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        reportCommunityMutation({
          communityId: communityId,
          reason: result.value
        });
      }
    });
  }, [reportCommunityMutation]);

  // Handle Load More Posts
  const handleLoadMorePosts = useCallback(() => {
    setVisiblePostsCount(prev => prev + 20);
  }, []);

  // Calculate visible posts and if there are more
  const sortedPosts = posts ? [...posts].sort((a, b) => {
    // Pinned posts first
    const aPinned = isPinnedForUser(a, user) ? 1 : 0;
    const bPinned = isPinnedForUser(b, user) ? 1 : 0;
    if (aPinned === 1 && bPinned !== 1) return -1;
    if (aPinned !== 1 && bPinned === 1) return 1;
    return 0;
  }) : [];

  const visiblePosts = sortedPosts.slice(0, visiblePostsCount);
  const hasMorePosts = sortedPosts.length > visiblePostsCount;


  return (
    <ConnectLayout active={'communities'}>
      <div className="w-full flex flex-col md:flex-row pb-6 gap-5">
        <div className="w-full md:w-[75%]">
          <div>
            <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm mb-6 border dark:border-gray-700 p-3">
              <LoadingSection isLoading={isDetailsLoading} title='Community Details' />
              <div
                className="w-full h-[350px] overflow-hidden rounded-lg relative"
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
                        <img src={communityDetails?.image || ''} alt={communityDetails?.title} className="w-16 h-16 rounded-md object-cover border-2 dark:border-gray-700 p-1 mb-4" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{communityDetails?.title}</h1>
                        <p className="text-gray-400 dark:text-gray-300 max-w-3xl mb-4">
                          {stripHtmlTags(communityDetails?.description ?? '')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1 text-gray-400 dark:text-gray-300">
                        <Globe className="w-4 h-4 text-gray-400 dark:text-gray-200" />
                        <span>Public Group</span>
                      </div>
                      <span className="text-gray-400 dark:text-gray-300">•</span>
                      <span className="text-gray-400 dark:text-gray-300">{filteredMembers.length} members</span>
                    </div>
                  </div>
                  {communityDetails?.domain_name && <div className="flex flex-col items-end gap-2">
                    <Button variant="outline" className="rounded-full whitespace-nowrap dark:text-white dark:border-gray-600">
                      {communityDetails?.domain_name}
                    </Button>
                  </div>
                  }
                </div>
                <div className="flex justify-between mt-4 w-full">
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
                      <div className='bg-primary p-3 rounded-lg h-[96px] w-[126px] flex flex-col justify-center items-center text-center text-black mb-3 cursor-pointer' onClick={() => joinThisCommunity(Number(communityId))}>
                        {isJoining ? 'Joining...' : 'Join Community'}
                      </div>
                    ) : (
                      <div className='bg-gray-500 p-3 rounded-lg h-[96px] w-[126px] flex flex-col justify-center items-center text-center text-black mb-3 cursor-pointer'>
                        Joined Community
                      </div>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 focus-visible:ring-0 focus-visible:ring-offset-0">
                          <EllipsisVertical className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        side="bottom"
                        align="end"
                        sideOffset={8}
                        className="w-40 bg-white dark:bg-gray-800 shadow-xl rounded-xl p-1 border dark:border-gray-700"
                      >
                        {/* {
                          communityDetails?.created_by && id !== communityDetails?.created_by &&
                          <DropdownMenuItem className="px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer">
                            Block
                          </DropdownMenuItem>
                        } */}
                        {
                          communityDetails?.created_by && id !== communityDetails?.created_by &&
                          <DropdownMenuItem
                            className="px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                            disabled={isMuting}
                            onClick={() => muteThisCommunity(Number(communityId))}
                          >
                            {isMuting ? 'Processing...' : (communityDetails?.is_mute ? 'Unmute' : 'Mute')}
                          </DropdownMenuItem>
                        }
                        <DropdownMenuItem
                          className="px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer flex items-center gap-2"
                          onClick={() => setShareDialogOpen(true)}
                        >
                          <span>Share</span>
                        </DropdownMenuItem>
                        {
                          communityDetails?.created_by && id !== communityDetails?.created_by && communityDetails?.user_joined_id &&
                          <DropdownMenuItem
                            className="px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-500 rounded-md cursor-pointer flex items-center gap-2 whitespace-nowrap focus-visible:ring-0 focus-visible:ring-offset-0"
                            onClick={() => leaveThisCommunity(Number(communityId))}
                          >
                            <span>{isLeaving ? 'Leaving...' : 'Leave Community'}</span>
                          </DropdownMenuItem>
                        }
                        {
                          // /community/edit/225
                          communityDetails?.created_by && id === communityDetails?.created_by && communityDetails?.user_joined_id &&
                          <DropdownMenuItem asChild
                            className="px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer flex items-center gap-2 whitespace-nowrap focus-visible:ring-0 focus-visible:ring-offset-0"
                          >
                            <Link to={`/community/edit/${communityId}`} className="flex items-center gap-2">
                              <span>Edit Community</span>
                            </Link>
                          </DropdownMenuItem>
                        }
                        <DropdownMenuSeparator className='border-b border-gray-100 dark:border-gray-700 my-1' />
                        {
                          communityDetails?.created_by && id === communityDetails?.created_by &&
                          <DropdownMenuItem
                            className="px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-500 rounded-md cursor-pointer flex items-center gap-2 whitespace-nowrap focus-visible:ring-0 focus-visible:ring-offset-0"
                            disabled={isDeleting}
                            onClick={() => deleteCommunityHandle(Number(communityId))}
                          >
                            <span>{isDeleting ? 'Deleting...' : 'Delete Community'}</span>
                          </DropdownMenuItem>
                        }
                        {
                          communityDetails?.created_by && id !== communityDetails?.created_by &&
                          <DropdownMenuItem
                            className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                            onClick={() => handleReportCommunity(Number(communityId))}
                          >
                            {isReporting ? 'Reporting...' : 'Report'}
                          </DropdownMenuItem>
                        }
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm mb-6 border dark:border-gray-700">
              <Tabs defaultValue="posts" className="w-full">
                <div className="border-b dark:border-gray-700">
                  <div className="flex justify-between items-center pr-3">
                    <TabsList className="bg-transparent border-b-0 flex gap-9">
                      <TabsTrigger
                        value="posts"
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary dark:text-gray-300 dark:data-[state=active]:text-white rounded-none py-3"
                      >
                        Posts
                      </TabsTrigger>
                      <TabsTrigger
                        value="members"
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary dark:text-gray-300 dark:data-[state=active]:text-white rounded-none py-3"
                      >
                        Members
                      </TabsTrigger>
                    </TabsList>
                    {communityDetails?.user_mapping_id !== null && (
                      <div className="flex items-center gap-3 py-2">
                        <div
                          className="bg-gray-100 dark:bg-[#2e2e2e] text-gray-500 dark:text-white px-4 py-2 rounded-lg cursor-pointer w-48 md:w-64 text-sm font-medium border border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                          onClick={() => navigate(`/connect/add-buzz?category_id=${communityId}&composer=start`)}
                        >
                          Start a Buzz
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-pink-600 text-pink-600 dark:border-pink-500 dark:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-950/30 gap-2 rounded-lg h-9"
                          onClick={() => navigate(`/connect/add-buzz?category_id=${communityId}&composer=media`)}
                        >
                          <ImagePlus className="w-4 h-4" />
                          <span className="hidden sm:inline">Add Photo/Video</span>
                        </Button>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white gap-2 rounded-lg border-none h-9"
                          onClick={() => navigate(`/connect/add-buzz?category_id=${communityId}&composer=blog`)}
                        >
                          <Plus className="w-4 h-4" />
                          <span className="hidden sm:inline">Add Blog</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <TabsContent value="posts" className="p-0 mt-0 p-3">
                  {visiblePosts && visiblePosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                  {posts && posts?.length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-6">
                      No posts available in this community.
                    </div>
                  )}
                  {hasMorePosts && (
                    <div className="flex justify-center mt-6 mb-4">
                      <Button
                        variant="outline"
                        className="text-primary border-primary rounded-lg px-8 dark:text-white dark:border-white hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-black"
                        onClick={handleLoadMorePosts}
                      >
                        Load More Posts
                      </Button>
                    </div>
                  )}
                  <LoadingSection isLoading={postsLoading} title='Community Posts' />
                </TabsContent>
                <TabsContent value="members" className="p-6 mt-0 space-y-10">
                  {filteredMembers.length > 0 && (
                    <div>
                      {['admin', 'moderator', 'member'].map((role, index) => {
                        const roleMembers = filteredMembers.filter((m) => m.role === role);
                        if (roleMembers.length === 0) return null;

                        const isMemberSection = role === 'member';
                        const visibleMembers = isMemberSection && !showAllMembers
                          ? roleMembers.slice(0, 3)
                          : roleMembers;

                        return (
                          <div key={index}>
                            <h2 className={`text-xl font-semibold mb-4 text-cblack dark:text-white ${index === 0 ? 'mt-0' : 'mt-8'}`}>
                              {role === 'admin' ? 'Admin' : role === 'moderator' ? 'Moderators' : 'Members'}
                            </h2>
                            <div className={`space-y-4 ${role === 'admin' ? 'border-b border-pink-200 dark:border-gray-700 pb-8' : ''}`}>
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
                                        <div className="text-[15px] leading-[22px] font-normal text-black dark:text-white">
                                          {member.name}
                                        </div>
                                        {['admin', 'moderator'].includes(member.role) && (
                                          <span className={`px-2 py-0.5 text-xs rounded-full ${member.role === 'admin'
                                            ? 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300'
                                            : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                                            }`}>
                                            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">{member.email}</div>
                                    </div>
                                  </div>
                                  {id !== member.id && (
                                    <div className="flex items-center gap-x-2">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                                            <EllipsisVertical className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                          side="bottom"
                                          align="end"
                                          sideOffset={8}
                                          className="w-40 bg-white dark:bg-gray-800 shadow-xl rounded-xl p-1 border dark:border-gray-700"
                                        >
                                          <DropdownMenuItem

                                            className="px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer">
                                            <Link to={`/portfolio/${member.id}`}>View Profile</Link>
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            className="px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                                            onClick={() => {
                                              navigator.clipboard.writeText(`${window.location.origin}/portfolio/${member.id}`);
                                              toast.success("Profile link copied successfully!", {
                                                position: "bottom-right",
                                              });
                                            }}
                                          >
                                            Copy Profile link
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  )}
                                </div>
                              ))}
                              {isMemberSection && roleMembers.length > 3 && (
                                <div className="pt-2 flex justify-end">
                                  <button
                                    className="text-pink-600 dark:text-pink-400 hover:underline text-sm"
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
                    <div className="text-center text-gray-500 dark:text-gray-400">
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
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border dark:border-gray-700 glowConnectCard">
              <div className="mb-4">
                <h2 className="font-bold text-cblue dark:text-white text-2xl">About...</h2>
              </div>
              <div className="space-y-4">
                {
                  communityDetails?.is_public === true && <AboutCard
                    title="Public Group"
                    description="Anyone can join the group and see who's in the and what they post."
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <ShareDialog
        open={shareDialogOpen}
        title={communityDetails?.title || 'Community'}
        description={stripHtmlTags(communityDetails?.description ?? '')}
        url={`${window.location.origin}/connect/communities/${communityId}`}
        onOpenChange={setShareDialogOpen}
      />
    </ConnectLayout >
  );
};

export default Community;