import React, { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/ShadcnButton";
import { Input } from "@/components/ui/ShadcnInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, CalendarClock, Eye, FileText, MapPin, MessageCircle, Repeat2, Route, Search, ThumbsUp, Ticket, UserCheck, Users } from 'lucide-react';
import { useAnalyticsStore } from '../store/analyticsStore';
import { TabsContent } from '@radix-ui/react-tabs';
import { formatApiDate } from '../utils/dateFormat';
import { Badge } from '@/components/ui/badge';
import { usePostsStore } from '../store/postStore';
import { Link } from 'react-router-dom';
import Attendance from '@/views/learner/analytics/attendance';
import ActivityHours from '@/views/learner/analytics/activityHours';
import CommunityStatistics from '@/views/learner/analytics/community';
import EventStatistics from '@/views/learner/analytics/events';
import CourseStatics from '@/views/learner/analytics/course';
import { useScrollToSection } from '../@hooks/useScrollToSection';
import { useEvents } from '@/hooks/data/collaborate/useEvents';


const App: React.FC = () => {


  const { fetchGraphData, analytics, fetchUserCommunityAnalytics, fetchImpressionsData, fetchMyActivityData, likedPosts, fetchLikedPosts, commentPosts, fetchCommentPosts, Internship, fetchInternship } = useAnalyticsStore();
  const [durationRange] = useState<'weekly' | 'monthly'>('weekly');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [metric, setMetric] = useState<'views' | 'likes'>('views');
  const [showAll, setShowAll] = useState(false);


  // and so on...


  const postsToShow = showAll ? likedPosts : likedPosts.slice(0, 3);
  const postToShow = showAll ? commentPosts : commentPosts.slice(0, 3);
  const Internships = showAll ? Internship : Internship.slice(0, 3);


  // const Analytics = showAll ? Analytic : Analytic.slice(0, 3);


  const urlParams = new URLSearchParams();
  urlParams.append("is_assigned", '1');
  const { data: events = [] } = useEvents(urlParams);
  const Event = showAll ? events : events.slice(0, 3);


  useEffect(() => {
    fetchGraphData(durationRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationRange]);

  useEffect(() => {
    fetchUserCommunityAnalytics();
    fetchImpressionsData();
    fetchMyActivityData();
    fetchLikedPosts();
    fetchCommentPosts();
    fetchInternship();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [, setOpen] = useState(false);
  const dropdownRef = useRef(null);


  // Optional: Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  function timeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    const units: [number, Intl.RelativeTimeFormatUnit][] = [
      [60, 'second'],
      [60, 'minute'],
      [24, 'hour'],
      [30, 'day'],
      [12, 'month'],
      [Infinity, 'year'],
    ];

    let unitIndex = 0;
    let time = seconds;

    while (unitIndex < units.length - 1 && time >= units[unitIndex][0]) {
      time /= units[unitIndex][0];
      unitIndex++;
    }

    return rtf.format(-Math.floor(time), units[unitIndex][1]);
  }

  function stripTags(html: string): string {
    return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
  }
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const { myPosts: data, fetchMyPosts } = usePostsStore();
  const { data: posts } = data || {};

  useEffect(() => {
    fetchMyPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);





  const Analyticspostcount = posts?.length || 0;
  const Internshipcount = Internship?.length || 0;
  const EventCount = events?.length || 0;
  const LikeCount = likedPosts?.length || 0;
  const CommentCount = commentPosts?.length || 0;
  const [searchterm, setSearchTerm] = useState('');

  const filterPosts = [...(posts || [])].sort((a, b) => {
    const term = searchterm.trim().toLowerCase();

    const aTitle = a.title?.toLowerCase() || '';
    const bTitle = b.title?.toLowerCase() || '';

    const aStarts = aTitle.startsWith(term) ? 0 : 1;
    const bStarts = bTitle.startsWith(term) ? 0 : 1;

    return aStarts - bStarts;
  });

  const visiblePosts = showAll ? filterPosts : filterPosts.slice(0, 3);

  const repostedPosts = posts?.filter(post => post.repost_id !== null) || [];
  const postShow = showAll ? repostedPosts : repostedPosts.slice(0, 3);

  const Repostcount = repostedPosts?.length || 0;
  const mapvalue: Record<string, string> = {
    '1': 'Notes',
    '2': 'Video',
    '3': 'Banner',
    '4': 'Image',
    '5': 'Meeting',
    '6': 'Contact',
    '7': 'Advertisement',
    '8': 'Announcement',
    '9': 'Study Board',
    '10': 'Template',
    '11': 'Activity',
    '12': 'Survey',
    '13': 'Scorm',
    '14': 'Tip of the day',
    '15': 'Assessment Activity',
    '16': 'Post',
    '17': 'Assignment',
    '18': 'News',
    '19': 'Poll',
    '20': 'Text',
  }

  const createSectionRef = useRef<HTMLDivElement | null>(null);

  const connectSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = useScrollToSection();


  return (
    <>

      <div className="grid gap-4 md:grid-cols-12 px-6 py-8">
        <div className="col-span-12 md:col-span-9">

          <div className="flex  items-center mb-4 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold cursor-pointer"
                onClick={() => scrollToSection(createSectionRef, 20)}
              >Create Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold cursor-pointer"
                onClick={() => scrollToSection(connectSectionRef, 20)}
              >Connect Analytics</span>
            </div>
          </div>
          <div ref={createSectionRef} className="grid gap-4 md:grid-cols-2 mt-5">
            <CourseStatics />
            <Attendance />
            <ActivityHours />
            <CommunityStatistics />
            <EventStatistics />
          </div>
        </div>
      </div>
      <div ref={connectSectionRef} className="px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold"> Connect Analytics</span>
          </div>
          <Button variant="outline" className="!rounded-button">
            June 2025 <i className="fas fa-chevron-down ml-2"></i>
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="text-cblue" />
              </div>
              <div>
                <div className="text-2xl font-bold">6</div>
                <div className="text-sm text-gray-600">Tribe Member</div>
                <div className="text-xs text-green-500">+15% increase</div>
              </div>
            </div>
          </Card>

          {/* Similar cards for other metrics */}
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-pink-100 p-2 rounded-lg">
                <Users className="text-cblue" />
              </div>
              <div>
                <div className="text-2xl font-bold">{analytics?.communities_created?.count}</div>
                <div className="text-sm text-gray-600">My Communities</div>
                <div className="text-xs text-green-500">{analytics?.communities_created?.percentat}</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <FileText className="text-cblue" />
              </div>
              <div>
                <div className="text-2xl font-bold">{analytics?.posts_created?.count}</div>
                <div className="text-sm text-gray-600">Total Posts</div>
                <div className="text-xs text-green-500">{analytics?.posts_created?.percentat}</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Route className="text-cgreen" />
              </div>
              <div>
                <div className="text-2xl font-bold">{analytics?.points_earned?.count}</div>
                <div className="text-sm text-gray-600">Points Earned</div>
                <div className="text-xs text-green-500">{analytics?.points_earned?.percentat}</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Award className="text-cblue" />
              </div>
              <div>
                <div className="text-2xl font-bold">{analytics?.badge?.count || '0'}</div>
                <div className="text-sm text-gray-600">Your Badges</div>
                <div className="text-xs">Earn {analytics?.badge?.count || '0'} badges this month</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Second Row Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <Eye className="text-cblue" />
              </div>
              <div>
                <div className="text-2xl font-bold">{analytics?.post_view_count?.count || '0'}</div>
                <div className="text-sm text-gray-600">Total Views</div>
                <div className="text-xs text-green-500">{analytics?.post_view_count?.percentat || '0'}</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <ThumbsUp className="text-cgreen" />
              </div>
              <div>
                <div className="text-2xl font-bold">{analytics?.post_like_count?.count || '0'}</div>
                <div className="text-sm text-gray-600">Total Likes</div>
                <div className="text-xs text-green-500">{analytics?.post_like_count?.percentat || '0'}</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <MessageCircle className="text-cblue" />
              </div>
              <div>
                <div className="text-2xl font-bold">{analytics?.post_comment_count?.count || '0'}</div>
                <div className="text-sm text-gray-600">Total Comments</div>
                <div className="text-xs text-green-500">{analytics?.post_comment_count?.percentat || '0'}</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <UserCheck className="text-cblue" />
              </div>
              <div>
                <div className="text-2xl font-bold">{analytics?.follower_count?.count || '0'}</div>
                <div className="text-sm text-gray-600">Total Followers</div>
                <div className="text-xs text-green-500">{analytics?.follower_count?.percentat || '0'}</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Repeat2 className="text-cblue" />
              </div>
              <div>
                <div className="text-2xl font-bold">{analytics?.repost_count?.count || '0'}</div>
                <div className="text-sm text-gray-600">Total Repost</div>
                <div className="text-xs text-green-500">{analytics?.repost_count?.percentat || '0'}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* My Activity */}
        <Card

        >
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">My Activity</h3>
            <Tabs defaultValue="likes">
              <ScrollArea className="w-full">
                <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground mb-4">
                  <TabsTrigger value="likes" className="!rounded-button whitespace-nowrap">
                    Likes ({LikeCount || 0})
                  </TabsTrigger>
                  <TabsTrigger value="comments" className="!rounded-button whitespace-nowrap">
                    Comments ({CommentCount || 0})
                  </TabsTrigger>
                  <TabsTrigger value="repost" className="!rounded-button whitespace-nowrap">
                    Repost ({Repostcount || 0})
                  </TabsTrigger>
                  <TabsTrigger value="events" className="!rounded-button whitespace-nowrap">
                    Events ({EventCount || 0})
                  </TabsTrigger>
                  <TabsTrigger value="internships" className="!rounded-button whitespace-nowrap">
                    Internships ({Internshipcount || 0})
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="!rounded-button whitespace-nowrap">
                    Analytics ({Analyticspostcount || 0})
                  </TabsTrigger>
                </TabsList>
              </ScrollArea>
              <TabsContent value='likes'>
                <div className="space-y-4">
                  {postsToShow.map((post, index) => (
                    <Link key={index} to={`/community/analytics/post/${post.id}`} className='block mb-4'>
                      <Card className="p-4 shadow-sm border rounded-lg bg-white">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {post.resource_path_thumbnail &&
                            post.resource_path_thumbnail !== "https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/ev/default.png" ? (
                            <img
                              src={post.resource_path_thumbnail}
                              alt={post.title}
                              className="w-28 h-[140px] object-cover rounded-lg shrink-0"
                              onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                          ) : null}


                          <div className="flex flex-col justify-between flex-1 space-y-1">
                            <div className="className">
                              <div className="flex items-center gap-2 mb-3">
                                <ThumbsUp className="text-red-500 w-4 h-4" />
                                <span className='text-sm font-semibold text-cblack'>You have liked this post</span>
                              </div>
                            </div>
                            <div className="className">
                              <div className="flex gap-2  mb-2 rounded-lg overflow-hidden cursor-pointer">
                                <img src='/img/icons/people.png' className='w-5 h-5' /> {post?.category_name || 'Community Name'}
                              </div>
                              <div className="flex items-center text-sm text-gray-500 mb-1">
                                {post.post_created_by_profile_image ? (
                                  <img
                                    src={post.post_created_by_profile_image}
                                    alt="avatar"
                                    className="w-5 h-5 rounded-full mr-2 object-cover"
                                  />
                                ) : (
                                  <div className="w-6 h-6  text-cblack rounded-full bg-gray-300 text-gray-800 font-medium text-xs flex items-center justify-center mr-2 uppercase">
                                    {post.post_created_by_name?.slice(0, 2) || 'NA'}
                                  </div>
                                )}

                                <span className="font-medium text-gray-700">{post.post_created_by_name}</span>
                                <span className="mx-1">•</span>
                                <span>{timeAgo(post?.created_at || ' ')}</span>
                              </div>

                              <h3 className="text-lg font-semibold text-gray-900 mb-1 text-cblack">{post?.title || " "}</h3>
                              <p className="text-sm text-gray-600 line-clamp-1 w-1/2 text-cblack">
                                {stripTags(post?.description || ' ')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>

                  ))}

                </div>
                {likedPosts.length > 3 && (
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="link"
                      className="text-blue-500 !rounded-button"
                      onClick={() => setShowAll(prev => !prev)}
                    >
                      {showAll ? 'View Less' : 'View All'}
                    </Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value='comments'>
                <div className="space-y-4">
                  {postToShow.map((post, index) => (
                    <Link key={index} to={`/community/analytics/post/${post.id}`} className='block mb-4'>
                      <Card className="p-4 shadow-sm border rounded-lg bg-white">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {post.resource_path_thumbnail &&
                            post.resource_path_thumbnail !== "https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/ev/default.png" ? (
                            <img
                              src={post.resource_path_thumbnail}
                              alt={post.title}
                              className="w-28 h-[140px] object-cover rounded-lg shrink-0"
                              onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                          ) : null}

                          <div className="flex flex-col justify-between flex-1 space-y-1">
                            <div className="className">
                              <div className="flex items-center gap-2 mb-3">
                                <MessageCircle className="text-red-500 w-4 h-4" />
                                <span className='text-sm font-semibold text-cblack'>You have commented on this post</span>
                              </div>
                            </div>
                            <div className="className">
                              <div className="flex gap-2  mb-2 rounded-lg overflow-hidden cursor-pointer">
                                <img src='/img/icons/people.png' className='w-5 h-5' /> {post?.category_name || 'Community Name'}
                              </div>
                              <div className="flex items-center text-sm text-gray-500 mb-1">
                                {post.post_created_by_profile_image ? (
                                  <img
                                    src={post.post_created_by_profile_image}
                                    alt="avatar"
                                    className="w-5 h-5 rounded-full mr-2 object-cover"
                                  />
                                ) : (
                                  <div className="w-6 h-6  text-cblack rounded-full bg-gray-300 text-gray-800 font-medium text-xs flex items-center justify-center mr-2 uppercase">
                                    {post.post_created_by_name?.slice(0, 2) || 'NA'}
                                  </div>
                                )}

                                <span className="font-medium text-gray-700">{post.post_created_by_name}</span>
                                <span className="mx-1">•</span>
                                <span>{timeAgo(post?.created_at || 'NA')}</span>
                              </div>

                              <h3 className="text-lg font-semibold text-gray-900 mb-1 text-cblack">{post?.title || 'NA'}</h3>
                              <p className="text-sm text-gray-600 line-clamp-1 w-1/2 text-cblack">
                                {stripTags(post?.description || 'NA')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
                {likedPosts.length > 1 && (
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="link"
                      className="text-blue-500 !rounded-button"
                      onClick={() => setShowAll(prev => !prev)}
                    >
                      {showAll ? 'View Less' : 'View All'}
                    </Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value='repost'>
                <div className="space-y-4">
                  {postShow.map((post, index) => (
                    <Link key={index} to={`/community/analytics/post/${post.id}`} className='block mb-4'>

                      <Card key={index} className="p-4 shadow-sm border rounded-lg bg-white">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {post.thumbnail_url &&
                            post.thumbnail_url !== "https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/ev/default.png" ? (
                            <img
                              src={post.thumbnail_url}
                              alt={post.title}
                              className="w-28 h-[140px] object-cover rounded-lg shrink-0"
                              onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                          ) : null}
                          <div className="flex flex-col justify-between flex-1 space-y-1">
                            <div className="className">
                              <div className="flex items-center gap-2 mb-3">
                                <Repeat2 className="text-red-500 w-4 h-4" />
                                <span className='text-sm font-semibold text-cblack'>You&apos;ve reposted this post</span>
                              </div>
                            </div>
                            <div className="className">
                              <div className="flex gap-2  mb-2 rounded-lg overflow-hidden cursor-pointer">
                                <img src='/img/icons/people.png' className='w-5 h-5' /> {post?.category_name || 'Community Name'}
                              </div>
                              <div className="flex items-center text-sm text-gray-500 mb-1">
                                {post.repost_user_profile_image ? (
                                  <img
                                    src={post.repost_user_profile_image}
                                    alt="avatar"
                                    className="w-5 h-5 rounded-full mr-2 object-cover"
                                  />
                                ) : (
                                  <div className="w-6 h-6  text-cblack rounded-full bg-gray-300 text-gray-800 font-medium text-xs flex items-center justify-center mr-2 uppercase">
                                    {post.repost_user_name?.slice(0, 2) || 'NA'}
                                  </div>
                                )}

                                <span className="font-medium text-gray-700">{post?.repost_user_name || 'NA'}</span>
                                <span className="mx-1">•</span>
                                <span>{timeAgo(post?.repost_created_at)}</span>
                              </div>

                              <h3 className="text-lg font-semibold text-gray-900 mb-1 text-cblack">{post?.title || 'NA'}</h3>
                              <p className="text-sm text-gray-600 line-clamp-1 w-1/2 text-cblack">
                                {stripTags(post?.repost_description || 'NA')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}

                </div>
                {
                  repostedPosts.length > 3 && (
                    <div className="flex justify-end mt-4">
                      <Button
                        variant="link"
                        className="text-blue-500 !rounded-button"
                        onClick={() => setShowAll(prev => !prev)}
                      >
                        {showAll ? 'View Less' : 'View All'}
                      </Button>
                    </div>
                  )
                }
              </TabsContent>
              <TabsContent value='events'>
                <div className="space-y-4">
                  {Event.map((post, index) => (
                    <Link key={index} to={`/event-activity/${post.id}`} className='block mb-4'>
                      <Card className="p-4 shadow-sm border rounded-xl bg-white w-full">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <img
                            src={post.image || '/placeholder-event.png'}
                            alt=""
                            className="w-28 h-28 rounded-lg object-cover bg-gray-100 shrink-0"
                          />
                          <div className="flex flex-col justify-between flex-1 space-y-1">
                            <div className="className">
                              <div className="flex items-center gap-2 text-red-500 text-sm font-semibold">
                                <Ticket className="w-4 h-4" />
                                <span className='text-sm font-semibold text-cblack'>You requested to join this event.</span>
                              </div>
                            </div>
                            <div className="className">
                              <div>
                                <h3 className="text-lg font-semibold text-cblack">{post?.name || 'Community Name'}</h3>
                                {/* <p className="text-sm text-gray-600">LayerStack</p> */}
                              </div>
                              <div className="flex items-center gap-9 text-sm text-gray-700 font-medium mt-1">
                                <div className="flex items-center gap-1">
                                  <CalendarClock size={14} strokeWidth={1.5} className='text-cblack' />
                                  <span>
                                    {post?.start_date && <span>{formatApiDate(post.start_date, "created_at", {
                                      day: 'numeric',
                                      month: 'short',
                                    })}</span>}
                                  </span>
                                  <span className="mx-1">-</span>
                                  <span>
                                    {new Date(post.end_date).toLocaleDateString("en-US", {
                                      day: "numeric",
                                      month: "short",
                                    })}
                                  </span>
                                  <span className="mx-1">|</span>
                                  <span>{post?.start_date && <span>{new Date(post?.start_date).toLocaleString(
                                    'en-IN',
                                    {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    }
                                  )}</span>}</span>
                                  <span className="mx-1">-</span>
                                  <span>{post?.end_date && <span>{new Date(post?.end_date).toLocaleString(
                                    'en-IN',
                                    {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    }
                                  )}</span>}</span>
                                </div>
                                {/* <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <span>Online</span>
                            </div> */}
                              </div>
                              <div>
                                {/* <span className="text-sm">{post?.com_status?.program_status}</span> */}
                                <Badge className={`mt-2 ${post?.com_status?.program_status === 'Upcoming' ? 'bg-cgreen text-orange-500' : post?.com_status?.program_status === 'Ongoing' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                  {post?.com_status?.program_status}
                                </Badge>

                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
                {events.length > 1 && (
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="link"
                      className='text-blue-500 !rounded-button'
                      onClick={() => setShowAll(prev => !prev)}
                    >
                      {showAll ? 'View Less' : 'View All'}
                    </Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value='internships'>
                <div className="space-y-4">
                  {Internships.map((post, index) => (
                    <Link key={index} to={`/internship/${post.id}`} className='block mb-4'>
                      <Card className='p-4 shadow-sm border rounded-lg bg-white'>
                        <div className="flex gap-4 items-start">
                          <img
                            src={post.image || '/'}
                            alt=''
                            className='w-28 h-30 rounded-lg object-cover bg-gray-100 shrink-0'
                          />
                          <div className="flex flex-col justify-between flex-1 space-y-2">
                            <div className="text-cblack text-lg font-semibold">
                              <span>{post?.name || "Community Name"}</span>
                            </div>
                            {/* <div className="flex items-center text-sm text-gray-500 mb-1 gap-2">
                            <span className='font-medium text-gray-700'>Infosys</span>
                            <span className='mx-1'>•</span>
                            <span>Part - Time</span>
                          </div> */}

                            <div className="flex items-center text-sm text-gray-500 gap-7">
                              <div className="flex items-center text-sm text-gray-500 gap-2">
                                <CalendarClock size={16} strokeWidth={1.5} className="text-cblack" />
                                <span>Posted on {formatDate(post?.start_date || 'NA')}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span>{post?.location || 'Gurugram'}</span>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 line-clamp-1 w-1/2 text-cblack">
                              <span>{stripTags(post?.description)}</span>
                            </div>
                          </div>

                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>


                {Internship.length > 1 && (
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="link"
                      className='text-blue-500 !rounded-button'
                      onClick={() => setShowAll(prev => !prev)}
                    >
                      {showAll ? 'View Less' : 'View All'}
                    </Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="analytics">
                <Card className="mb-8 !shadow-none bg-transparent border-none">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Post Analytics</h3>
                    <div className="flex justify-between items-center mb-4">
                      <div className="relative w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search post name"
                          value={searchterm}
                          className="pl-10 border-gray-300"
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>

                      {/* <Button variant="outline" className="!rounded-button">
                      Filter <i className="fas fa-filter ml-2"></i>
                    </Button> */}
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full" >
                        <thead>
                          <tr className="border-b">
                            <th className="text-center py-3 px-4">Post type</th>
                            <th className="text-center py-3 px-4">Post</th>
                            <th className="text-center py-3 px-4">Upload date</th>
                            <th className="text-center py-3 px-4">Like</th>
                            <th className="text-center py-3 px-4">Comment</th>
                            <th className="text-center py-3 px-4">Repost</th>
                            {/* <th className="text-center py-3 px-4">Views</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {visiblePosts?.map((post, idx) => (
                            <tr key={idx} className="border-b" >
                              {post?.repost_id ? (
                                <>
                                  <td className="text-center py-4 px-4">
                                    {mapvalue[`${post?.content_type}`] || "N/A"} (Repost)
                                  </td>
                                  <td className=" text-center py-4 px-4 truncate max-w-[250px]">
                                    {post?.repost_description?.split(new RegExp(`(${searchterm})`, 'gi')).map((part, index) =>
                                      part.toLowerCase() === searchterm.toLowerCase() ? (
                                        <span key={index}>{part}</span>
                                      ) : (
                                        part
                                      )
                                    )}
                                  </td>
                                  <td className="text-center py-4 px-4">
                                    {/* {post?.created_at ? new Date(post.created_at).toLocaleDateString() : "--"} */}
                                    {post?.created_at
                                      ? new Date(parseInt(post.created_at.toString(), 10) * 1000).toLocaleDateString()
                                      : "--"}

                                  </td>
                                  <td className="text-center py-4 px-4">{post?.repost_like ?? 0}</td>
                                  <td className="text-center py-4 px-4">{post?.repost_comments ?? 0}</td>
                                  <td className="text-center py-4 px-4">NA</td>
                                  {/* <td className="text-center py-4 px-4">{post?.view_count ?? 0}</td> */}
                                </>
                              ) : (
                                <>
                                  <td className="text-center py-4 px-4">{mapvalue[`${post?.content_type}`] || "N/A"}</td>
                                  <td className=" text-center py-4 px-4 truncate max-w-[250px]">
                                    {post?.title?.split(new RegExp(`(${searchterm})`, 'gi')).map((part, index) =>
                                      part.toLowerCase() === searchterm.toLowerCase() ? (
                                        <span key={index}>{part}</span>
                                      ) : (
                                        part
                                      )
                                    )}
                                  </td>
                                  <td className="text-center py-4 px-4">
                                    {/* {post?.created_at ? new Date(post.created_at).toLocaleDateString() : "--"} */}
                                    {post?.created_at
                                      ? new Date(parseInt(post.created_at.toString(), 10) * 1000).toLocaleDateString()
                                      : "--"}

                                  </td>
                                  <td className="text-center py-4 px-4">{post?.like_count ?? 0}</td>
                                  <td className="text-center py-4 px-4">{post?.comment_count ?? 0}</td>
                                  <td className="text-center py-4 px-4">{post?.repost_count ?? 0}</td>
                                  {/* <td className="text-center py-4 px-4">{post?.view_count ?? 0}</td> */}
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {filterPosts.length > 3 && (
                      <div className="text-right mt-2">
                        <Button
                          variant="link"
                          className="text-primary text-sm font-medium"
                          onClick={() => setShowAll((prev) => !prev)}
                        >
                          {showAll ? 'View Less' : 'View All'}
                        </Button>
                      </div>
                    )}

                  </div>
                </Card>
              </TabsContent>


            </Tabs>
          </div>
        </Card>
      </div>
    </>
  );
};

export default App;