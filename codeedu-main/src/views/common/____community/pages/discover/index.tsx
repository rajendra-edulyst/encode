import React, { lazy, useState } from 'react';
import { Button } from "@/components/ui/ShadcnButton";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import CommunityLayout from '@community/layouts';
import { useOrgPopularCommunityStore } from '../../store/communityStore';
import { stripHtmlTags } from '@/utils/stripHtmlTags';
import Swal from 'sweetalert2';
import { joinCommunity, leaveCommunity } from '../../services/CommunityService';
import Loading from '@/components/shared/Loading';
import { Link } from 'react-router-dom';
import WeeklyCalendar from '@/views/learner/dashboard/components/Calendar';
import Pined from '../../components/post/pined';
import { usePosts } from '../../@hooks/usePost';
import PostCardView from '../../components/post/CardView';
import { useIndustries } from '../../@hooks/useIndustry';



const OpinionPoll = lazy(() => import('../wall/poll/index'));


const Discover: React.FC = () => {


  const [filterCategories,] = React.useState<string[]>([]);
  const { popularCommunities, fetchPopularCommunities, loading } = useOrgPopularCommunityStore();
  const { RecommandedCommunities, fetchRecommandedCommunities } = useOrgPopularCommunityStore();
  const [filter, setFilter] = useState<'all' | 'posts' | 'people' | 'communities' | 'institutes' | 'industries'>('communities');

  const { data, isLoading, error } = useIndustries();
  const { data: posts = [], isError } = usePosts();

  const industries = data?.filter(item => item.type === "industry") ?? [];
  const institutes = data?.filter(item => item.type === "university") ?? [];







  React.useEffect(() => {
    fetchPopularCommunities();
  }, [fetchPopularCommunities]);

  React.useEffect(() => {
    fetchRecommandedCommunities();
  }, [fetchRecommandedCommunities]);

  const exploreMoreCommunities = [
    {
      id: 7,
      name: "Creative Coders",
      category: "Technology",
      members: 120,
      description: "A space for developers and designers to collaborate on creative coding projects.",
      imageUrl: "https://readdy.ai/api/search-image?query=product%20design%20workspace%20with%20sketches%2C%20prototypes%2C%20digital%20tools%2C%20and%20design%20elements%2C%20professional%20modern%20aesthetic%20with%20clean%20lines%20and%20minimal%20color%20palette%20on%20white%20background&width=400&height=400&seq=2&orientation=squarish"
    },
    {
      id: 8,
      name: "Sustainable Designers",
      category: "Fashion",
      members: 180,
      description: "Join us to explore sustainable design practices and share eco-friendly ideas.",
      imageUrl: "https://readdy.ai/api/search-image?query=textile%20design%20studio%20with%20fabric%20samples%2C%20looms%2C%20thread%20spools%2C%20pattern%20designs%2C%20and%20textile%20materials%20in%20a%20bright%20professional%20workspace%20with%20clean%20aesthetic%20on%20white%20background&width=400&height=400&seq=4&orientation=squarish"
    }
  ];


  // get communities from org.communites in one variable
  const communities = popularCommunities?.filter((org) => org.communities).flatMap((org) => org.communities) || [];
  // filter communities based on selected categories
  // const categories = Array.from(new Set(communities.map(community => community.domain_name))).sort() || [];
  const filteredCommunities = communities.filter(community => filterCategories.length === 0 || filterCategories?.includes(community?.domain_name ?? ''));


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


  if (loading && !popularCommunities) {
    return <Loading loading={loading} />
  }


  if (isLoading && !posts?.length) {
    return <Loading loading={isLoading} />;
  }

  if (isError && !posts?.length) {
    return <div className="text-red-500 text-center">Error: {error?.message}</div>;
  }




  return (
    <CommunityLayout active='discover'>
      <div className="flex flex-col space-y-6 mt-4">
        {/* Main Content */}
        <div className="w-full flex flex-col md:flex-row gap-5 pr-5">
          {/* Left Column - Communities List */}
          <div className="w-full md:w-[70%]">
            <div className='border-x-0 border-t-0 border-b-[1px] border-[#FFDCF0] rounded-none py-3 px-0'>
              {/* Header Section */}
              <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
                <h1 className="text-2xl md:text-3xl font-bold">
                  <span className="text-cpink">TrendSurf...</span>
                </h1>
              </div>
              {/* Categories */}
              <ScrollArea className="w-full whitespace-nowrap pb-2 mb-4">
                <div className="flex space-x-2 mt-2 px-2 gap-4">
                  {/* {categories.map((category) => (
                    category && <Badge key={category} variant="outline" className={`text-sm bg-[#009BD8]/10 hover:bg-[#009BD8]/100 hover:text-white border-[#009BD8]/100 cursor-pointer text-cblue whitespace-nowrap px-2.5 py-1 font-medium flex items-center gap-1
                      ${filterCategories?.includes(category ?? '') ? 'bg-[#009BD8]/100 text-white' : 'bg-white text-cblue'}`} onClick={() => {
                        category && setFilterCategories((prev) =>
                          prev?.includes(category ?? '')
                            ? prev?.filter((cat) => cat !== category)
                            : [...prev, category]
                        );
                      }}>
                      {category}
                      {filterCategories?.includes(category) && <X strokeWidth={1.5} size={16} className="inline-block cursor-pointer" onClick={(e) => {
                        e.stopPropagation();
                        setFilterCategories((prev) => prev.filter((cat) => cat !== category));
                      }} />}
                    </Badge>
                  ))} */}
                  <div className="flex justify-end cursor-pointer mb-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`flex items-center gap-2 text-[#009BD8] border border-[#009BD8] rounded-md bg-transparent bg-white 
                                hover:bg-transparent hover:text-[#009BD8] hover:border-[#009BD8] 
                                hover:scale-105 transition-all duration-200 ${filter === 'posts' ? 'bg-[#009BD8] text-white hover:bg-[#e5e9ea]' : ''}`}
                      onClick={() => setFilter('posts')}
                    >
                      Post
                    </Button>

                  </div>
                  {/* <div className="flex justify-end cursor-pointer mb-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`flex items-center gap-2 text-[#009BD8] border border-[#009BD8] rounded-md bg-transparent bg-white px-8
                                        hover:bg-transparent hover:text-[#009BD8] hover:border-[#009BD8] 
                                        hover:scale-105 transition-all duration-200 ${filter === 'people' ? 'bg-[#009BD8] text-white hover:bg-[#e5e9ea]' : ''}`}

                      onClick={() => setFilter('people')}
                    >
                      People
                    </Button>
                  </div> */}
                  <div className="flex justify-end cursor-pointer mb-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`flex items-center gap-2 text-[#009BD8] border border-[#009BD8] rounded-md bg-transparent bg-white px-8
                                        hover:bg-transparent hover:text-[#009BD8] hover:border-[#009BD8] 
                                        hover:scale-105 transition-all duration-200 ${filter === 'communities' ? 'bg-[#009BD8] text-white hover:bg-[#e5e9ea]' : ''}`}

                      onClick={() => setFilter('communities')}
                    >
                      Communities
                    </Button>
                  </div>
                  <div className="flex justify-end cursor-pointer mb-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`flex items-center gap-2 text-[#009BD8] border border-[#009BD8] rounded-md bg-transparent bg-white px-8
                                        hover:bg-transparent hover:text-[#009BD8] hover:border-[#009BD8] 
                                        hover:scale-105 transition-all duration-200 ${filter === 'institutes' ? 'bg-[#009BD8] text-white hover:bg-[#e5e9ea]' : ''}`}

                      onClick={() => setFilter('institutes')}
                    >
                      Institute
                    </Button>
                  </div>
                  <div className="flex justify-end cursor-pointer mb-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`flex items-center gap-2 text-[#009BD8] border border-[#009BD8] rounded-md bg-transparent bg-white px-8
                                        hover:bg-transparent hover:text-[#009BD8] hover:border-[#009BD8] 
                                        hover:scale-105 transition-all duration-200 ${filter === 'industries' ? 'bg-[#009BD8] text-white hover:bg-[#e5e9ea]' : ''}`}

                      onClick={() => setFilter('industries')}
                    >
                      Industry
                    </Button>
                  </div>
                </div>
              </ScrollArea>
              {/* {filter === 'people' && (
                <>
                  {exploreMoreCommunities?.map((institute) => (
                    <Card key={institute.id} className="flex flex-col sm:flex-row gap-4 overflow-hidden border-none shadow-none mb-6">
                      <div className="w-full sm:w-14 h-14 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={institute?.imageUrl}
                          alt={institute?.name}
                          className="w-full h-full object-cover object-top border rounded-md"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${institute?.name}&background=random&size=400`;
                          }}
                        />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div className='flex flex-col gap-0'>
                            <h3 className="font-bold text-lg mb-0 pb-0 text-cblack">Piyush tiwari</h3>
                            <p className="text-cblack text-sm mt-0 pt-0 font-medium">pt7318@gmail.com</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </>
              )} */}
              {filter === 'institutes' && (
                <>
                  {institutes?.map((institute) => (
                    <Link key={institute.id} to={`/collaborate/infocus/profile/${institute?.id}`} >

                      <Card key={institute.id} className="flex flex-col sm:flex-row gap-4 overflow-hidden border-none shadow-none mb-6">
                        <div className="w-full sm:w-32 h-32 flex-shrink-0 overflow-hidden rounded-md">
                          <img
                            src={institute?.logo}
                            alt={institute?.name}
                            className="w-full h-full object-cover object-top border rounded-md"
                            onError={(e) => {
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${institute?.name}&background=random&size=400`;
                            }}
                          />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div className='flex flex-col gap-0'>
                              <h3 className="font-bold text-lg mb-0 pb-0 text-cblack">{institute?.name}</h3>

                              <p className="text-cblack text-sm mt-0 pt-0 font-medium">{institute?.country_name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 my-2">
                            {/* <span className="text-sm text-cblack ml-1"><span className="font-semibold">{industry.total_user_joined}</span> {industry.total_user_joined <= 1 ? 'Member' : 'Members'}</span> */}
                          </div>
                          <p className="text-cblack text-sm line-clamp-2 font-normal w-1/2">{institute.org_description}</p>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </>
              )}
              {filter === 'industries' && (
                <>
                  {industries?.map((industry) => (
                    <Link key={industry.id} to={`/collaborate/infocus/profile/${industry?.id}`} >
                      <Card key={industry.id} className="flex flex-col sm:flex-row gap-4 overflow-hidden border-none shadow-none mb-6">
                        <div className="w-full sm:w-32 h-32 flex-shrink-0 overflow-hidden rounded-md">
                          <img
                            src={industry?.logo}
                            alt={industry?.name}
                            className="w-full h-full object-cover object-top border rounded-md"
                            onError={(e) => {
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${industry?.name}&background=random&size=400`;
                            }}
                          />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div className='flex flex-col gap-0'>
                              <h3 className="font-bold text-lg mb-0 pb-0 text-cblack">{industry?.name}</h3>

                              <p className="text-cblack text-sm mt-0 pt-0 font-medium">{industry?.country_name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 my-2">
                            {/* <span className="text-sm text-cblack ml-1"><span className="font-semibold">{industry.total_user_joined}</span> {industry.total_user_joined <= 1 ? 'Member' : 'Members'}</span> */}
                          </div>
                          <p className="text-cblack text-sm line-clamp-2 font-normal w-1/2">{industry.org_description}</p>
                        </div>

                      </Card>
                    </Link>
                  ))}

                </>
              )}
              {filter === 'posts' && (
                <div className="flex flex-col gap-3 mb-6">
                  {posts.length > 0 ? (
                    [...posts].sort((a, b) => {
                        if (Number(a.is_pin) === 1 && Number(b.is_pin) !== 1) return -1;
                        if (Number(a.is_pin) !== 1 && Number(b.is_pin) === 1) return 1;
                        return 0;
                    }).map((post, index) => (
                      <PostCardView key={index} post={post} is_repost={post.repost_id == null ? false : true} />
                    ))
                  ) : (
                    <div className="text-center text-gray-500">No posts found.</div>
                  )}
                </div>
              )}
              {filter === 'communities' && (
                <>
                  {(() => {
                    const unjoinedCommunities = filteredCommunities?.filter(
                      (community) => !community?.user_joined_id
                    ) || [];

                    return (
                      <>
                        {unjoinedCommunities.length > 0 ? (
                          unjoinedCommunities.map((community) => (
                            <Card key={community.id} className="flex flex-col sm:flex-row gap-4 overflow-hidden border-none shadow-none mb-6">
                              <Link to={`/community/discover/${community.id}`}>
                                <div className="w-full sm:w-32 h-32 flex-shrink-0 overflow-hidden rounded-md">
                                  <img
                                    src={community?.image}
                                    alt={community?.title}
                                    className="w-full h-full object-cover object-top border rounded-md"
                                    onError={(e) => {
                                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${community?.title}&background=random&size=400`;
                                    }}
                                  />
                                </div>
                              </Link>
                              <div className="flex-1 flex flex-col">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                  <Link to={`/community/discover/${community.id}`}>
                                    <div className="flex flex-col gap-0">
                                      <h3 className="font-bold text-lg text-cblack">{community?.title}</h3>
                                      <p className="text-cblack text-sm font-medium">{community?.domain_name}</p>
                                    </div>
                                  </Link>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    className="text-cblue !rounded-button whitespace-nowrap hover:bg-[#009bd8]/10 hover:text-cblue hover:scale-95 transition-all duration-200"
                                    onClick={() => joinThisCommunity(community.id)}
                                  >
                                    Join Now
                                  </Button>
                                </div>
                                <Link to={`/community/discover/${community.id}`}>
                                  <div className="flex items-center gap-1 my-2">
                                    <span className="text-sm text-cblack ml-1">
                                      <span className="font-semibold">{community.total_user_joined}</span>{" "}
                                      {community.total_user_joined <= 1 ? "Member" : "Members"}
                                    </span>
                                  </div>
                                  <p className="text-cblack text-sm line-clamp-2 font-normal w-1/2">
                                    {stripHtmlTags(community.description)}
                                  </p>
                                </Link>
                              </div>
                            </Card>
                          ))
                        ) : (
                          <div className="text-center text-cblack mt-4 py-16">
                            Great job
                            You’ve joined all available communities. Stay tuned for new ones
                          </div>
                        )}
                      </>
                    );
                  })()}
                </>
              )}


            </div>
          </div>
          {/* Right Column - Sidebar */}
          <div className="w-full md:w-[30%]">
            <div className='space-y-5'>
              {/* Trending Tags */}
              <WeeklyCalendar />
              <OpinionPoll />
              <Pined />
              {/* <Cat /> */}
            </div>
          </div>
        </div>
      </div>
    </CommunityLayout>
  );
};

export default Discover;

//  {filter === 'communities' && (
//               <>
//                 {filteredCommunities && filteredCommunities?.map((community, index) => (
//                   !community?.user_joined_id && <Card key={community.id} className="flex flex-col sm:flex-row gap-4 overflow-hidden border-none shadow-none mb-6">
//                     <Link key={index} to={`/community/discover/${community.id}`}>
//                       <div className="w-full sm:w-32 h-32 flex-shrink-0 overflow-hidden rounded-md">
//                         <img
//                           src={community?.image}
//                           alt={community?.title}
//                           className="w-full h-full object-cover object-top border rounded-md"
//                           onError={(e) => {
//                             e.currentTarget.src = `https://ui-avatars.com/api/?name=${community?.title}&background=random&size=400`;
//                           }}
//                         />
//                       </div>
//                     </Link>
//                     <div className="flex-1 flex flex-col">
//                       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
//                         <Link key={index} to={`/community/discover/${community.id}`}>
//                           <div className='flex flex-col gap-0'>
//                             <h3 className="font-bold text-lg mb-0 pb-0 text-cblack">{community?.title}</h3>
//                             <p className="text-cblack text-sm mt-0 pt-0 font-medium">{community?.domain_name}</p>
//                           </div>
//                         </Link>
//                         {
//                           !community?.user_joined_id &&
//                           <Button type='button' size={"sm"} variant="ghost" className="text-cblue !rounded-button whitespace-nowrap hover:bg-[#009bd8]/10 hover:text-cblue hover:scale-95 transition-all duration-200"
//                             onClick={() => joinThisCommunity(community.id)}
//                           >
//                             Join Now
//                           </Button>
//                         }
//                         {
//                           community?.user_joined_id &&
//                           <Button type='button' size={"sm"} variant="ghost" className="text-red-500 !rounded-button whitespace-nowrap hover:bg-[#e60086]/10 hover:text-red-600 hover:scale-95 transition-all duration-200"
//                             onClick={() => leaveThisCommunity(community.id)}
//                           >
//                             Leave
//                             <span className="sr-only">Leave Community</span>
//                           </Button>
//                         }

//                       </div>
//                       <Link key={index} to={`/community/discover/${community.id}`}>
//                         <div className="flex items-center gap-1 my-2">
//                           <span className="text-sm text-cblack ml-1"><span className="font-semibold">{community.total_user_joined}</span> {community.total_user_joined <= 1 ? 'Member' : 'Members'}</span>
//                         </div>
//                         <p className="text-cblack text-sm line-clamp-2 font-normal w-1/2">{stripHtmlTags(community.description)}</p>
//                       </Link>
//                     </div>
//                   </Card>
//                 ))}
//                 {
//                   filteredCommunities.length === 0 && (
//                     <div className="text-center text-cblack mt-4 py-16">
//                       No communities found for the selected categories.
//                     </div>
//                   )
//                 }
//                 {/* <div className="flex justify-end">
//                   <Link to={`/community/discover/viewall`}>
//                     <Button variant="link" className="text-cblue whitespace-nowrap">View All</Button>
//                   </Link>
//                 </div>
//                 <div className='border-x-0 border-t-0 border-b-[1px] border-[#FFDCF0] rounded-none py-6 px-0'>
//                   <div className='mt-4'>
//                     <h1 className='text-xl font-semibold text-cblack mb-5'>Communities Recommended for you</h1>
//                     <div className='mt-4'>
//                       {
//                         RecommandedCommunities?.map((community, index) => (
//                           <Card key={index} className="flex flex-col sm:flex-row gap-4 overflow-hidden border-none shadow-none mb-6">
//                             <Link key={community.id} to={`/community/discover/${community.id}`}>
//                               <div className="w-full sm:w-32 h-32 flex-shrink-0 overflow-hidden rounded-md">
//                                 <img
//                                   src={community.image}
//                                   alt={''}
//                                   className="w-full h-full object-cover object-top border rounded-md"
//                                 />

//                               </div>
//                             </Link>
//                             <div className="flex-1 flex flex-col">
//                               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
//                                 <Link key={community.id} to={`/community/discover/${community.id}`}>
//                                   <div className='flex flex-col gap-0'>
//                                     <h3 className="font-bold text-lg mb-0 pb-0 text-cblack">{community.title}</h3>
//                                     <p className="text-cblack text-sm mt-0 pt-0 font-medium">{community.domain_name}</p>
//                                   </div>
//                                 </Link>
//                                 {
//                                   <Button type='button' size={"sm"} variant="ghost" className="text-cblue !rounded-button whitespace-nowrap hover:bg-[#009bd8]/10 hover:text-cblue hover:scale-95 transition-all duration-200"
//                                     onClick={() => joinThisCommunity(community.id)}
//                                   >
//                                     Join Now
//                                   </Button>
//                                 }
//                               </div>
//                               <Link key={community.id} to={`/community/discover/${community.id}`}>
//                                 <div className="flex items-center gap-1 my-2">
//                                   <div className="flex -space-x-2">
//                                     {[...Array(4)].map((_, i) => (
//                                       <Avatar key={i} className="w-6 h-6 border-2 border-white">
//                                         <AvatarFallback className="bg-gray-200 text-[8px]">
//                                           {String.fromCharCode(65 + i)}
//                                         </AvatarFallback>
//                                       </Avatar>
//                                     ))}
//                                   </div>
//                                   <span className="text-sm text-cblack ml-1"><span className="font-semibold">{community.total_user_joined}</span> Members</span>
//                                 </div>
//                               </Link>
//                               <Link key={community.id} to={`/community/discover/${community.id}`}>
//                                 <p className="text-cblack text-sm line-clamp-2 font-normal">{stripHtmlTags(community.description)}</p>
//                               </Link>
//                             </div>
//                           </Card>
//                         ))
//                       }
//                     </div>
//                   </div>
//                   {RecommandedCommunities.length > 3 && (
//                     <div className="flex justify-end">
//                       <Button variant="link" className="text-cblue whitespace-nowrap">View All</Button>
//                     </div>
//                   )}
//                 </div>
//                 <div>
//                   <div className='mt-4'>
//                     <h1 className='text-xl font-semibold text-cblack mb-5'>Explore Featured Communities</h1>
//                     <div className="mt-4">
//                       {
//                         exploreMoreCommunities?.map((community) => (
//                           <Card key={community.id} className="flex flex-col sm:flex-row gap-4 overflow-hidden border-none shadow-none mb-6">
//                             <div className="w-full sm:w-32 h-32 flex-shrink-0 overflow-hidden rounded-md">
//                               <img
//                                 src={community.imageUrl}
//                                 alt={community.name}
//                                 className="w-full h-full object-cover object-top border rounded-md"
//                               />
//                             </div>
//                             <div className="flex-1 flex flex-col">
//                               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
//                                 <div className='flex flex-col gap-0'>
//                                   <h3 className="font-bold text-lg mb-0 pb-0 text-cblack">{community.name}</h3>
//                                   <p className="text-cblack text-sm mt-0 pt-0 font-medium">{community.category}</p>
//                                 </div>
//                                 <Button size={"sm"} variant="ghost" className="text-cblue !rounded-button whitespace-nowrap hover:bg-[#009bd8]/10 hover:text-cblue hover:scale-95 transition-all duration-200">
//                                   Join Now
//                                 </Button>
//                               </div>
//                               <div className="flex items-center gap-1 my-2">
//                                 <div className="flex -space-x-2">
//                                   {[...Array(4)].map((_, i) => (
//                                     <Avatar key={i} className="w-6 h-6 border-2 border-white">
//                                       <AvatarFallback className="bg-gray-200 text-[8px]">
//                                         {String.fromCharCode(65 + i)}
//                                       </AvatarFallback>
//                                     </Avatar>
//                                   ))}
//                                 </div>
//                                 <span className="text-sm text-cblack ml-1"><span className="font-semibold">{community.members}</span> Members</span>
//                               </div>
//                               <p className="text-cblack text-sm line-clamp-2 font-normal">{community.description}</p>
//                             </div>
//                           </Card>
//                         ))
//                       }
//                     </div>
//                   </div>
//                   {exploreMoreCommunities.length > 3 && (
//                     <div className="flex justify-end">
//                       <Button variant="link" className="text-cblue whitespace-nowrap">View All</Button>
//                     </div>
//                   )}
//                 </div> */}
//               </>
//             )}