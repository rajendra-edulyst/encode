import { Link, useParams } from "react-router-dom";
import { usePostDetailsStore } from "@community/store/communityStore";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/shadcnAvatar";
// import { stripHtmlTags } from "@/utils/stripHtmlTags";
import { Calendar, ChevronLeft, Dot, EllipsisVertical, MessageCircle, Pin, SendHorizontal, SlidersHorizontal, ThumbsUp } from "lucide-react";
import { useSessionUser } from "@/store/authStore";
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/ShadcnButton";
import { BiSolidLike } from "react-icons/bi";
import CommunityLayout from "../../layouts";
import { IoClose } from "react-icons/io5";
import Loading from "@/components/shared/Loading";
import { formatApiDate } from "../../utils/dateFormat";

const PostDetails = () => {

    const { postId } = useParams<{ postId: string }>();
    const { fetchPost, post, loading, fetchPostComments, comments, likePost, sendComment } = usePostDetailsStore();
    const { profile_image, name } = useSessionUser((state) => state.user)
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (postId) {
            fetchPost(postId);
        }
    }, [postId, fetchPost, fetchPostComments]);


    if (loading && post?.id !== postId) {
        return <Loading loading={loading} />;
    }

    return (
        <CommunityLayout active='myposts'>
            <div className="w-full flex flex-col md:flex-row py-6 gap-5">
                <div className="w-full md:w-[75%] space-y-6">
                    <Card className="shadow-none border-none rounded-none pb-6 px-0">
                        <div className="flex items-center gap-2 mb-4">
                            <Button asChild variant="outline">
                                <Link to="/community/myposts">
                                    <ChevronLeft size={24} className="text-cblack cursor-pointer" /> Back
                                </Link>
                            </Button>
                        </div>
                        <div className='flex gap-4 items-start'>
                            <div className='flex-1'>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="flex items-center gap-2 text-[#2E75A2] mb-1 text-xs">
                                            <img src='/img/icons/people.png' className='w-5 h-5' /> {post?.category_name || 'Community Name'}
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={post?.profile_image ?? `https://ui-avatars.com/api/?name=${post?.name}`} alt={post?.name} />
                                                    <AvatarFallback>{post?.name?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center text-xs text-cblack">
                                                        <span className='capitalize'>{post?.name}</span>
                                                        <span className="mx-1">•</span>
                                                        <span>{post?.created_at && <span>{formatApiDate(post.created_at)}</span>}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger><EllipsisVertical className="h-4 w-4 text-cblack" /></DropdownMenuTrigger>
                                        <DropdownMenuContent className='w-40' side='left' align='start'>
                                            <DropdownMenuItem>Follow @{post?.name}</DropdownMenuItem>
                                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                                            <DropdownMenuItem>Copy Profile link</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                <span className='text-[#FF0000]'>Report</span></DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="mb-3">
                                    <h3 className="text-lg font-semibold mb-1 text-cblack">{post?.title}</h3>
                                    {/* <p className="text-sm text-cblack">{stripHtmlTags(post?.description ?? '') || 'No description provided.'}</p> */}
                                    <p
                                        className="text-sm text-cblack prose" dangerouslySetInnerHTML={{ __html: post?.description ?? '' }}
                                    />
                                </div>
                                <div className='mb-3 border'>
                                    {post?.thumbnail_url && (
                                        <img src={post?.thumbnail_url} alt={post?.title} className="w-full object-cover rounded-lg h-96" />
                                    )}
                                </div>
                                <div className="flex items-center text-sm text-cblack gap-4">
                                    <div className="flex items-center gap-1 cursor-pointer">
                                        <Button variant="ghost" size="sm" onClick={() => likePost(post?.user_liked ? 'unlike' : 'like')}>
                                            {post?.user_liked ? <BiSolidLike size={20} strokeWidth={1} className='text-primary' /> : <ThumbsUp size={20} strokeWidth={1.5} />}
                                            {post?.like_count} Likes
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-1 cursor-pointer">
                                        <a href="#comments-section" className="flex items-center gap-1 cursor-pointer">
                                            <MessageCircle size={20} strokeWidth={1.5} />
                                            <span>{comments?.length || '0'} comments</span>
                                        </a>
                                    </div>
                                    {/* <div className="flex items-center gap-1 cursor-pointer">
                            <Repeat2 size={20} strokeWidth={1.5} />
                            <span>{post?.repost_count || '0'} repost</span>
                        </div> */}
                                </div>
                            </div>
                        </div>
                        <div className="mt-6" id="comments-section">
                            <div>
                                <h1 className="text-cblack text-base font-normal">{comments?.length} Comments</h1>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={profile_image ?? `https://ui-avatars.com/api/?name=${name}`} alt={name} />
                                    <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="relative w-full border-b border-gray-300 pb-1">
                                    <input type="text" placeholder="Add a comment..." className="w-full h-10 px-3 rounded-none focus:outline-none focus:ring-0" value={comment} onChange={(e) => setComment(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && comment.trim()) {
                                                sendComment(comment);
                                                setComment('');
                                            }
                                        }}
                                    />
                                    <Button variant={'ghost'} className="absolute right-1 text-cblue"
                                        disabled={!comment.trim()} onClick={() => sendComment(comment)}><SendHorizontal /></Button>
                                </div>
                            </div>
                            {/* comment design below */}
                            <div className="space-y-2 mt-6">
                                {
                                    comments && comments.length > 0 && comments.map((comment, index) => (
                                        <div key={index} className="flex justify-between items-start gap-4 pb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-1 mb-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={comment?.profile_image ?? `https://ui-avatars.com/api/?name=Ayushri+Verma`} alt="Ayushri Verma" />
                                                        <AvatarFallback>A</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex items-center text-xs text-cblack">
                                                        <p>{comment?.name ?? 'Anonymous'}</p><Dot /><span>1h ago</span>
                                                    </div>
                                                </div>
                                                <div className="mt-3">
                                                    <p className="text-sm">{comment?.content ?? 'No content'}</p>
                                                    {/* <div className="mt-2 ml-5">
                                            <div>
                                                <div className="flex items-center gap-4 text-cblack">
                                                    <div className="flex items-center gap-1 cursor-pointer">
                                                        <ThumbsUp size={16} strokeWidth={1.5} className="cursor-pointer" />
                                                        <span className="cursor-pointer">54 Like</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 cursor-pointer">
                                                        <Repeat2 size={20} strokeWidth={1.5} className="cursor-pointer" />
                                                        <span className="cursor-pointer">2 repost</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => setShowReplyInput(true)}>
                                                        <span className="cursor-pointer">Reply</span>
                                                    </div>
                                                </div>
                                                <Collapsible open={showReplyInput} onOpenChange={setShowReplyInput}>
                                                    <CollapsibleContent className="w-full mt-2">
                                                        <div className="flex items-center gap-1 w-full">
                                                            <Avatar className="h-6 w-6">
                                                                <AvatarImage src="https://ui-avatars.com/api/?name=Ayushri+Verma" alt="Ayushri Verma" />
                                                                <AvatarFallback>A</AvatarFallback>
                                                            </Avatar>
                                                            <input type="text" name="reply" placeholder="Add a reply..." className="w-full h-10 px-3 border-b border-gray-300 rounded-none focus:outline-none focus:ring-0" value={'@Ayushi Verma\n\n'} />
                                                        </div>
                                                    </CollapsibleContent>
                                                </Collapsible>
                                            </div>
                                            <div className="mt-4">
                                                <Collapsible>
                                                    <CollapsibleTrigger className="flex items-center gap-1 text-[#00A8E9]">
                                                        <ChevronDown size={16} className="cursor-pointer" />56 comments</CollapsibleTrigger>
                                                    <CollapsibleContent>
                                                        <div className="flex items-center gap-1 mb-2 mt-4">
                                                            <Avatar className="h-6 w-6">
                                                                <AvatarImage src="https://ui-avatars.com/api/?name=Ayushri+Verma" alt="Ayushri Verma" />
                                                                <AvatarFallback>A</AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex items-center text-xs text-cblack">
                                                                <p>Ayushi Verma</p><Dot /><span>1h ago</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-start gap-3">
                                                            <p className="text-sm">Totally agree! Thumbnails are basically the new movie posters — first impressions matter more than ever</p>
                                                            <div className="mt-2 ml-5 w-full">
                                                                <div className="flex items-center gap-4 text-cblack">
                                                                    <div className="flex items-center gap-1 cursor-pointer">
                                                                        <ThumbsUp size={16} strokeWidth={1.5} className="cursor-pointer" />
                                                                        <span className="cursor-pointer">54 Like</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1 cursor-pointer">
                                                                        <span className="cursor-pointer" onClick={() => setShowReplyInput(true)}>Reply</span>
                                                                    </div>
                                                                </div>
                                                                <Collapsible open={showReplyInput} onOpenChange={setShowReplyInput}>
                                                                    <CollapsibleContent className="w-full mt-2">
                                                                        <div className="flex items-center gap-1 w-full">
                                                                            <Avatar className="h-6 w-6">
                                                                                <AvatarImage src="https://ui-avatars.com/api/?name=Ayushri+Verma" alt="Ayushri Verma" />
                                                                                <AvatarFallback>A</AvatarFallback>
                                                                            </Avatar>
                                                                            <input type="text" name="reply" placeholder="Add a reply..." className="w-full h-10 px-3 border-b border-gray-300 rounded-none focus:outline-none focus:ring-0" value={'@Ayushi Verma\n\n'} />
                                                                        </div>
                                                                    </CollapsibleContent>
                                                                </Collapsible>
                                                            </div>
                                                        </div>
                                                    </CollapsibleContent>
                                                </Collapsible>
                                            </div>
                                        </div> */}
                                                </div>
                                            </div>
                                            <div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger><EllipsisVertical size={20} className="text-cblack" /></DropdownMenuTrigger>
                                                    <DropdownMenuContent className='w-40' side='left' align='start'>
                                                        <DropdownMenuItem>Follow @{post?.name}</DropdownMenuItem>
                                                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                        <DropdownMenuItem>Copy Profile link</DropdownMenuItem>
                                                        <DropdownMenuItem>Hide this post</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem>
                                                            <span className='text-[#FF0000]'>Report</span></DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            {/* <div>
                    <div className="flex justify-between items-start gap-4 pb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-1 mb-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src="https://ui-avatars.com/api/?name=Ayushri+Verma" alt="Ayushri Verma" />
                                    <AvatarFallback>A</AvatarFallback>
                                </Avatar>
                                <div className="flex items-center text-xs text-cblack">
                                    <p>Ayushi Verma</p><Dot /><span>1h ago</span>
                                </div>
                            </div>
                            <div className="mt-3">
                                <p className="text-sm">Totally agree! Thumbnails are basically the new movie posters — first impressions matter more than ever</p>
                                <div className="mt-2 ml-5">
                                    <div>
                                        <div className="flex items-center gap-4 text-cblack">
                                            <div className="flex items-center gap-1 cursor-pointer">
                                                <ThumbsUp size={16} strokeWidth={1.5} className="cursor-pointer" />
                                                <span className="cursor-pointer">54 Like</span>
                                            </div>
                                            <div className="flex items-center gap-1 cursor-pointer">
                                                <Repeat2 size={20} strokeWidth={1.5} className="cursor-pointer" />
                                                <span className="cursor-pointer">2 repost</span>
                                            </div>
                                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => setShowReplyInput(true)}>
                                                <span className="cursor-pointer">Reply</span>
                                            </div>
                                        </div>
                                        <Collapsible open={showReplyInput} onOpenChange={setShowReplyInput}>
                                            <CollapsibleContent className="w-full mt-2">
                                                <div className="flex items-center gap-1 w-full">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src="https://ui-avatars.com/api/?name=Ayushri+Verma" alt="Ayushri Verma" />
                                                        <AvatarFallback>A</AvatarFallback>
                                                    </Avatar>
                                                    <input type="text" name="reply" placeholder="Add a reply..." className="w-full h-10 px-3 border-b border-gray-300 rounded-none focus:outline-none focus:ring-0" value={'@Ayushi Verma\n\n'} />
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </div>
                                    <div className="mt-4">
                                        <Collapsible>
                                            <CollapsibleTrigger className="flex items-center gap-1 text-[#00A8E9]">
                                                <ChevronDown size={16} className="cursor-pointer" />56 comments</CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <div className="flex items-center gap-1 mb-2 mt-4">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src="https://ui-avatars.com/api/?name=Ayushri+Verma" alt="Ayushri Verma" />
                                                        <AvatarFallback>A</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex items-center text-xs text-cblack">
                                                        <p>Ayushi Verma</p><Dot /><span>1h ago</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-start gap-3">
                                                    <p className="text-sm">Totally agree! Thumbnails are basically the new movie posters — first impressions matter more than ever</p>
                                                    <div className="mt-2 ml-5 w-full">
                                                        <div className="flex items-center gap-4 text-cblack">
                                                            <div className="flex items-center gap-1 cursor-pointer">
                                                                <ThumbsUp size={16} strokeWidth={1.5} className="cursor-pointer" />
                                                                <span className="cursor-pointer">54 Like</span>
                                                            </div>
                                                            <div className="flex items-center gap-1 cursor-pointer">
                                                                <span className="cursor-pointer" onClick={() => setShowReplyInput(true)}>Reply</span>
                                                            </div>
                                                        </div>
                                                        <Collapsible open={showReplyInput} onOpenChange={setShowReplyInput}>
                                                            <CollapsibleContent className="w-full mt-2">
                                                                <div className="flex items-center gap-1 w-full">
                                                                    <Avatar className="h-6 w-6">
                                                                        <AvatarImage src="https://ui-avatars.com/api/?name=Ayushri+Verma" alt="Ayushri Verma" />
                                                                        <AvatarFallback>A</AvatarFallback>
                                                                    </Avatar>
                                                                    <input type="text" name="reply" placeholder="Add a reply..." className="w-full h-10 px-3 border-b border-gray-300 rounded-none focus:outline-none focus:ring-0" value={'@Ayushi Verma\n\n'} />
                                                                </div>
                                                            </CollapsibleContent>
                                                        </Collapsible>
                                                    </div>
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger><EllipsisVertical size={20} className="text-cblack" /></DropdownMenuTrigger>
                                <DropdownMenuContent className='w-40' side='left' align='start'>
                                    <DropdownMenuItem>Follow @{post?.name}</DropdownMenuItem>
                                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                                    <DropdownMenuItem>Copy Profile link</DropdownMenuItem>
                                    <DropdownMenuItem>Hide this post</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <span className='text-[#FF0000]'>Report</span></DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div className="flex justify-between items-start gap-4 pb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-1 mb-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src="https://ui-avatars.com/api/?name=Rhea+Sharma" alt="Rhea Sharma" />
                                    <AvatarFallback>A</AvatarFallback>
                                </Avatar>
                                <div className="flex items-center text-xs text-cblack">
                                    <p>Rhea Sharma</p><Dot /><span>1h ago</span>
                                </div>
                            </div>
                            <div className="mt-3">
                                <p className="text-sm">Totally agree! Thumbnails are basically the new movie posters — first impressions matter more than ever</p>
                                <div className="mt-2 ml-5">
                                    <div className="flex items-center gap-4 text-cblack">
                                        <div className="flex items-center gap-1 cursor-pointer">
                                            <ThumbsUp size={16} strokeWidth={1.5} className="cursor-pointer" />
                                            <span className="cursor-pointer">54 Like</span>
                                        </div>
                                        <div className="flex items-center gap-1 cursor-pointer">
                                            <Repeat2 size={20} strokeWidth={1.5} className="cursor-pointer" />
                                            <span className="cursor-pointer">2 repost</span>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <Collapsible>
                                            <CollapsibleTrigger className="flex items-center gap-1 text-[#00A8E9]">
                                                <ChevronDown size={16} className="cursor-pointer" />56 comments</CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <div className="flex items-center gap-1 mb-2 mt-4">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src="https://ui-avatars.com/api/?name=Rhea+Sharma" alt="Rhea Sharma" />
                                                        <AvatarFallback>A</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex items-center text-xs text-cblack">
                                                        <p>Rhea Sharma</p><Dot /><span>1h ago</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-start gap-3">
                                                    <p className="text-sm">Totally agree! Thumbnails are basically the new movie posters — first impressions matter more than ever</p>
                                                    <div className="mt-2 ml-5 w-full">
                                                        <div className="flex items-center gap-4 text-cblack">
                                                            <div className="flex items-center gap-1 cursor-pointer">
                                                                <ThumbsUp size={16} strokeWidth={1.5} className="cursor-pointer" />
                                                                <span className="cursor-pointer">54 Like</span>
                                                            </div>
                                                            <div className="flex items-center gap-1 cursor-pointer">
                                                                <span className="cursor-pointer" onClick={() => setShowReplyInput(true)}>Reply</span>
                                                            </div>
                                                        </div>
                                                        <Collapsible open={showReplyInput} onOpenChange={setShowReplyInput}>
                                                            <CollapsibleContent className="w-full mt-2">
                                                                <div className="flex items-center gap-1 w-full">
                                                                    <Avatar className="h-6 w-6">
                                                                        <AvatarImage src="https://ui-avatars.com/api/?name=Rhea+Sharma" alt="Rhea Sharma" />
                                                                        <AvatarFallback>A</AvatarFallback>
                                                                    </Avatar>
                                                                    <input type="text" name="reply" placeholder="Add a reply..." className="w-full h-10 px-3 border-b border-gray-300 rounded-none focus:outline-none focus:ring-0" value={'@Rhea Sharma\n\n'} />
                                                                </div>
                                                            </CollapsibleContent>
                                                        </Collapsible>
                                                    </div>
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger><EllipsisVertical size={20} className="text-cblack" /></DropdownMenuTrigger>
                                <DropdownMenuContent className='w-40' side='left' align='start'>
                                    <DropdownMenuItem>Follow @{post?.name}</DropdownMenuItem>
                                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                                    <DropdownMenuItem>Copy Profile link</DropdownMenuItem>
                                    <DropdownMenuItem>Hide this post</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <span className='text-[#FF0000]'>Report</span></DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div> */}
                        </div>
                    </Card>
                </div>
                <div className="w-full md:w-[25%]">
                    <div className='sticky top-20 space-y-5'>
                        <div className="bg-white rounded-xl p-4 shadow-sm border glowConnectCard">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-cblack"><span className='text-[#00A8e9] font-bold text-2xl '>Blog</span> Buzz...</h2>
                                <DropdownMenu>
                                    <DropdownMenuTrigger><SlidersHorizontal strokeWidth={1.5} className='text-cblack' /></DropdownMenuTrigger>
                                    <DropdownMenuContent className='w-40' side='left' align='start'>
                                        <DropdownMenuItem>All</DropdownMenuItem>
                                        <DropdownMenuItem>Events</DropdownMenuItem>
                                        <DropdownMenuItem>Industries</DropdownMenuItem>
                                        <DropdownMenuItem>Workshops</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="space-y-4">
                                <EventCard
                                    icon="https://readdy.ai/api/search-image?query=Colorful%20abstract%20Raksha%20Bandhan%20festival%20design%20with%20traditional%20Indian%20patterns%20and%20celebration%20elements%20on%20vibrant%20background%20with%20modern%20minimal%20style%20perfect%20for%20holiday%20notice%20and%20cultural%20event%20announcement&width=60&height=60&seq=12351&orientation=squarish"
                                    title="Raksha bandhan Holiday Notice"
                                    organization="CodeEdu Holidays"
                                    date="09/08/2025"
                                    isHighlighted={true}
                                    isLast={false}
                                />

                                <EventCard
                                    icon="https://readdy.ai/api/search-image?query=Innovation%20event%20logo%20with%20spark%20of%20creativity%20and%20modern%20tech%20elements%20on%20red%20background%20with%20abstract%20digital%20patterns%20representing%20innovation%20catalyst%20and%20forward%20thinking%20design%20for%20tech%20conference%20branding&width=60&height=60&seq=12352&orientation=squarish"
                                    title="Ignite Innovation: Join the Upc..."
                                    organization="VGU Events"
                                    date="09/08/2025"
                                    isHighlighted={true}
                                    isLast={false}
                                />

                                <EventCard
                                    icon="https://readdy.ai/api/search-image?query=Photography%20event%20promotional%20graphic%20with%20camera%20elements%20and%20frame%20motifs%20on%20colorful%20background%20with%20modern%20design%20aesthetics%20for%20creative%20workshop%20announcement%20and%20visual%20arts%20education%20program&width=60&height=60&seq=12353&orientation=squarish"
                                    title="Frame the Moment – Photogra..."
                                    organization="CodeEdu Events"
                                    date="09/08/2025"
                                    isHighlighted={true}
                                    isLast={true}
                                />

                                <div className="text-right">
                                    <Button variant="link" className="text-[#00A8E9] p-0 h-auto !rounded-button whitespace-nowrap">View All</Button>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm border glowConnectCard">
                            <div className="flex items-center mb-4">
                                <h2 className="text-lg font-semibold text-cblack">My&nbsp;</h2>
                                <h2 className="font-bold text-cblue text-2xl">Communities</h2>
                            </div>
                            <div className="space-y-4">
                                <CommunityCard
                                    title='Dezigners'
                                    logo="https://i.pinimg.com/736x/2d/27/39/2d2739775afaa612b3b93a4e2168e5cb.jpg"
                                    category="UX/UI Design"
                                    isLast={false}
                                    members="1.2k"
                                />
                                <CommunityCard
                                    title='CodeFLix'
                                    logo="https://i.pinimg.com/736x/ac/f6/77/acf6778868690a3b355667c45e8d7567.jpg"
                                    category="Frontend Developer"
                                    isLast={true}
                                    members="800"
                                />
                                <div className="text-right">
                                    <Button variant="link" className="text-[#00A8E9] p-0 h-auto !rounded-button whitespace-nowrap">View All</Button>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm border glowConnectCard">
                            <div className="flex items-center mb-4">
                                <h2 className="text-lg font-semibold text-cblack">{`What's`}&nbsp;</h2>
                                <h2 className="font-bold text-cgreen text-2xl">Poppin&nbsp;</h2>
                            </div>
                            <div className="space-y-4">
                                <PoppinCard
                                    tag="#Textile&Fashion"
                                    category='Fashion'
                                    isLast={false}
                                    posts="1.2k"
                                />
                                <PoppinCard
                                    tag="#ArchitectureDesign"
                                    category='Architecture'
                                    posts="800"
                                    isLast={false}
                                />
                                <PoppinCard
                                    tag="#DesignEducator"
                                    category='Education'
                                    posts="600"
                                    isLast={false}
                                />
                                <PoppinCard
                                    tag="#DesignEducator"
                                    category='Education'
                                    posts="600"
                                    isLast={true}
                                />
                                <div className="text-right">
                                    <Button variant="link" className="text-[#00A8E9] p-0 h-auto !rounded-button whitespace-nowrap">View All</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CommunityLayout>
    );
}

export default PostDetails;



interface EventCardProps {
    icon: string;
    title: string;
    organization: string;
    date: string;
    isHighlighted?: boolean;
    isLast?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
    icon, title, organization, date, isHighlighted, isLast = false
}) => {
    return (
        <div className={`flex items-start gap-3 ${!isLast ? 'border-b-[0.5px] border-[#b6b6b6]/40 pb-3 mb-3' : ''}`}>
            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border">
                <img src={icon} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
                <div className="flex justify-between">
                    <h3 className="font-semibold text-sm text-cblack mb-[2px]">{title}</h3>
                    {isHighlighted && (
                        <Pin size={20} strokeWidth={1.5} className="text-[#FF0000]" />
                    )}
                </div>
                <p className="text-xs text-cblack">{organization}</p>
                <div className="flex items-center text-xs text-cblack mt-1">
                    <Calendar strokeWidth={1.5} size={14} className="mr-1" />
                    <span>{date}</span>
                </div>
            </div>
        </div>
    );
};

interface CommunityCardProps {
    logo: string;
    title: string;
    category: string;
    members: string;
    isLast?: boolean;
}

const CommunityCard: React.FC<CommunityCardProps> = ({
    logo, title, category, members, isLast
}) => {
    return (
        <div className={`flex items-start gap-3 ${!isLast ? 'border-b-[0.5px] border-[#b6b6b6]/40 pb-3 mb-3' : ''}`}>
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center border">
                <img src={logo} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
                <h3 className="font-semibold text-sm">{title}</h3>
                <p className="text-xs text-gray-500">{category}</p>
                <p className="text-xs text-gray-500">{members} Members</p>
            </div>
        </div>
    );
};

interface PoppinCardProps {
    tag: string;
    category: string;
    posts: string;
    isLast?: boolean;
}

const PoppinCard: React.FC<PoppinCardProps> = ({
    tag, category, posts, isLast
}) => {
    return (
        <div className={`flex items-start gap-3 ${!isLast ? 'border-b-[0.5px] border-[#b6b6b6]/40 pb-3 mb-3' : ''}`}>
            <div className="flex-1">
                <h3 className="font-semibold text-sm text-cblack">{tag}</h3>
                <p className="text-xs text-cblack">{category}</p>
                <p className="text-xs text-cblack mt-1">{posts} Posts</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
                <IoClose className="text-xl" />
            </button>
        </div>
    )
};


// const PostDetails = () => {

//     const { profile_image, name } = useSessionUser((state) => state.user)
//     // const [showReplyInput, setShowReplyInput] = useState(false);
//     const { setSelectedPost, selectedPost: post, fetchPostComments, selectedPostComments: comments, sendComment, likePost } = usePostsStore();
//     const [comment, setComment] = useState("");

//     useEffect(() => {
//         if (!post) return;
//         // Fetch comments for the selected post when it changes
//         fetchPostComments();
//         // setShowReplyInput(false);
//     }, [post, fetchPostComments]);


//     if (!post) {
//         setSelectedPost(null);
//         return null;
//     }

//     return (
//         <CommunityLayout active='mywall'>
//             <Card className="shadow-none border-none rounded-none pb-6 px-0">
//                 <div className="flex items-center gap-2 mb-4">
//                     <Button variant="outline" onClick={() => setSelectedPost(null)}>
//                         <ChevronLeft size={24} className="text-cblack cursor-pointer" /> Back
//                     </Button>
//                 </div>
//                 <div className='flex gap-4 items-start'>
//                     <div className='flex-1'>
//                         <div className="flex justify-between items-start mb-2">
//                             <div>
//                                 <div className="flex items-center gap-2 text-[#2E75A2] mb-1 text-xs">
//                                     <img src='./img/icons/people.png' className='w-5 h-5' /> {post?.category_name || 'Community Name'}
//                                 </div>
//                                 <div className="flex justify-between items-start">
//                                     <div className="flex items-center gap-2">
//                                         <Avatar className="h-6 w-6">
//                                             <AvatarImage src={post?.profile_image ?? `https://ui-avatars.com/api/?name=${post?.name}`} alt={post?.name} />
//                                             <AvatarFallback>{post?.name.charAt(0)}</AvatarFallback>
//                                         </Avatar>
//                                         <div>
//                                             <div className="flex items-center text-xs text-cblack">
//                                                 <span className='capitalize'>{post?.name}</span>
//                                                 <span className="mx-1">•</span>
//                                                 <span>{post?.created_at && <span>{new Date(post?.created_at * 1000).toLocaleString(
//                                                     'en-IN',
//                                                     {
//                                                         year: 'numeric',
//                                                         month: 'short',
//                                                         day: 'numeric',
//                                                     }
//                                                 )}</span>}</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <DropdownMenu>
//                                 <DropdownMenuTrigger><EllipsisVertical className="h-4 w-4 text-cblack" /></DropdownMenuTrigger>
//                                 <DropdownMenuContent className='w-40' side='left' align='start'>
//                                     <DropdownMenuItem>Follow @{post?.name}</DropdownMenuItem>
//                                     <DropdownMenuItem>View Profile</DropdownMenuItem>
//                                     <DropdownMenuItem>Copy Profile link</DropdownMenuItem>
//                                     <DropdownMenuItem>Hide this post</DropdownMenuItem>
//                                     <DropdownMenuSeparator />
//                                     <DropdownMenuItem>
//                                         <span className='text-[#FF0000]'>Report</span></DropdownMenuItem>
//                                 </DropdownMenuContent>
//                             </DropdownMenu>
//                         </div>
//                         <div className="mb-3">
//                             <h3 className="text-lg font-semibold mb-1 text-cblack">{post?.title}</h3>
//                             {/* <p className="text-sm text-cblack">{stripHtmlTags(post?.description ?? '') || 'No description provided.'}</p> */}
//                             <p
//                                 className="text-sm text-cblack prose" dangerouslySetInnerHTML={{ __html: post?.description ?? '' }}
//                             />
//                         </div>
//                         <div className='mb-3 border'>
//                             {post?.thumbnail_url && (
//                                 <img src={post?.thumbnail_url} alt={post?.title} className="w-full object-cover rounded-lg h-96" />
//                             )}
//                         </div>
//                         <div className="flex items-center text-sm text-cblack gap-4">
//                             <div className="flex items-center gap-1 cursor-pointer">
//                                 <Button variant="ghost" size="sm" onClick={() => likePost(post.id, post?.user_liked ? 'unlike' : 'like')}>
//                                     {post.user_liked ? <BiSolidLike size={20} strokeWidth={1} className='text-primary' /> : <ThumbsUp size={20} strokeWidth={1.5} />}
//                                     {post?.like_count} Likes
//                                 </Button>
//                             </div>
//                             <div className="flex items-center gap-1 cursor-pointer">
//                                 <a href="#comments-section" className="flex items-center gap-1 cursor-pointer">
//                                     <MessageCircle size={20} strokeWidth={1.5} />
//                                     <span>{comments?.length || '0'} comments</span>
//                                 </a>
//                             </div>
//                             {/* <div className="flex items-center gap-1 cursor-pointer">
//                             <Repeat2 size={20} strokeWidth={1.5} />
//                             <span>{post?.repost_count || '0'} repost</span>
//                         </div> */}
//                         </div>
//                     </div>
//                 </div>
//                 <div className="mt-6" id="comments-section">
//                     <div>
//                         <h1 className="text-cblack text-base font-normal">{comments?.length} Comments</h1>
//                     </div>
//                     <div className="mt-4 flex items-center gap-2">
//                         <Avatar className="h-10 w-10">
//                             <AvatarImage src={profile_image ?? `https://ui-avatars.com/api/?name=${name}`} alt={name} />
//                             <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
//                         </Avatar>
//                         <div className="relative w-full border-b border-gray-300 pb-1">
//                             <input type="text" placeholder="Add a comment..." className="w-full h-10 px-3 rounded-none focus:outline-none focus:ring-0" value={comment} onChange={(e) => setComment(e.target.value)}
//                                 onKeyDown={(e) => {
//                                     if (e.key === 'Enter' && comment.trim()) {
//                                         sendComment(comment);
//                                         setComment('');
//                                     }
//                                 }}
//                             />
//                             <Button variant={'ghost'} className="absolute right-1 text-cblue"
//                                 disabled={!comment.trim()} onClick={() => sendComment(comment)}><SendHorizontal /></Button>
//                         </div>
//                     </div>
//                     {/* comment design below */}
//                     <div className="space-y-2 mt-6">
//                         {
//                             comments && comments.length > 0 && comments.map((comment, index) => (
//                                 <div key={index} className="flex justify-between items-start gap-4 pb-4">
//                                     <div className="flex-1">
//                                         <div className="flex items-center gap-1 mb-2">
//                                             <Avatar className="h-6 w-6">
//                                                 <AvatarImage src={comment?.profile_image ?? `https://ui-avatars.com/api/?name=Ayushri+Verma`} alt="Ayushri Verma" />
//                                                 <AvatarFallback>A</AvatarFallback>
//                                             </Avatar>
//                                             <div className="flex items-center text-xs text-cblack">
//                                                 <p>{comment?.name ?? 'Anonymous'}</p><Dot /><span>1h ago</span>
//                                             </div>
//                                         </div>
//                                         <div className="mt-3">
//                                             <p className="text-sm">{comment?.content ?? 'No content'}</p>
//                                             {/* <div className="mt-2 ml-5">
//                                             <div>
//                                                 <div className="flex items-center gap-4 text-cblack">
//                                                     <div className="flex items-center gap-1 cursor-pointer">
//                                                         <ThumbsUp size={16} strokeWidth={1.5} className="cursor-pointer" />
//                                                         <span className="cursor-pointer">54 Like</span>
//                                                     </div>
//                                                     <div className="flex items-center gap-1 cursor-pointer">
//                                                         <Repeat2 size={20} strokeWidth={1.5} className="cursor-pointer" />
//                                                         <span className="cursor-pointer">2 repost</span>
//                                                     </div>
//                                                     <div className="flex items-center gap-1 cursor-pointer" onClick={() => setShowReplyInput(true)}>
//                                                         <span className="cursor-pointer">Reply</span>
//                                                     </div>
//                                                 </div>
//                                                 <Collapsible open={showReplyInput} onOpenChange={setShowReplyInput}>
//                                                     <CollapsibleContent className="w-full mt-2">
//                                                         <div className="flex items-center gap-1 w-full">
//                                                             <Avatar className="h-6 w-6">
//                                                                 <AvatarImage src="https://ui-avatars.com/api/?name=Ayushri+Verma" alt="Ayushri Verma" />
//                                                                 <AvatarFallback>A</AvatarFallback>
//                                                             </Avatar>
//                                                             <input type="text" name="reply" placeholder="Add a reply..." className="w-full h-10 px-3 border-b border-gray-300 rounded-none focus:outline-none focus:ring-0" value={'@Ayushi Verma\n\n'} />
//                                                         </div>
//                                                     </CollapsibleContent>
//                                                 </Collapsible>
//                                             </div>
//                                             <div className="mt-4">
//                                                 <Collapsible>
//                                                     <CollapsibleTrigger className="flex items-center gap-1 text-[#00A8E9]">
//                                                         <ChevronDown size={16} className="cursor-pointer" />56 comments</CollapsibleTrigger>
//                                                     <CollapsibleContent>
//                                                         <div className="flex items-center gap-1 mb-2 mt-4">
//                                                             <Avatar className="h-6 w-6">
//                                                                 <AvatarImage src="https://ui-avatars.com/api/?name=Ayushri+Verma" alt="Ayushri Verma" />
//                                                                 <AvatarFallback>A</AvatarFallback>
//                                                             </Avatar>
//                                                             <div className="flex items-center text-xs text-cblack">
//                                                                 <p>Ayushi Verma</p><Dot /><span>1h ago</span>
//                                                             </div>
//                                                         </div>
//                                                         <div className="flex flex-col items-start gap-3">
//                                                             <p className="text-sm">Totally agree! Thumbnails are basically the new movie posters — first impressions matter more than ever</p>
//                                                             <div className="mt-2 ml-5 w-full">
//                                                                 <div className="flex items-center gap-4 text-cblack">
//                                                                     <div className="flex items-center gap-1 cursor-pointer">
//                                                                         <ThumbsUp size={16} strokeWidth={1.5} className="cursor-pointer" />
//                                                                         <span className="cursor-pointer">54 Like</span>
//                                                                     </div>
//                                                                     <div className="flex items-center gap-1 cursor-pointer">
//                                                                         <span className="cursor-pointer" onClick={() => setShowReplyInput(true)}>Reply</span>
//                                                                     </div>
//                                                                 </div>
//                                                                 <Collapsible open={showReplyInput} onOpenChange={setShowReplyInput}>
//                                                                     <CollapsibleContent className="w-full mt-2">
//                                                                         <div className="flex items-center gap-1 w-full">
//                                                                             <Avatar className="h-6 w-6">
//                                                                                 <AvatarImage src="https://ui-avatars.com/api/?name=Ayushri+Verma" alt="Ayushri Verma" />
//                                                                                 <AvatarFallback>A</AvatarFallback>
//                                                                             </Avatar>
//                                                                             <input type="text" name="reply" placeholder="Add a reply..." className="w-full h-10 px-3 border-b border-gray-300 rounded-none focus:outline-none focus:ring-0" value={'@Ayushi Verma\n\n'} />
//                                                                         </div>
//                                                                     </CollapsibleContent>
//                                                                 </Collapsible>
//                                                             </div>
//                                                         </div>
//                                                     </CollapsibleContent>
//                                                 </Collapsible>
//                                             </div>
//                                         </div> */}
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <DropdownMenu>
//                                             <DropdownMenuTrigger><EllipsisVertical size={20} className="text-cblack" /></DropdownMenuTrigger>
//                                             <DropdownMenuContent className='w-40' side='left' align='start'>
//                                                 <DropdownMenuItem>Follow @{post?.name}</DropdownMenuItem>
//                                                 <DropdownMenuItem>View Profile</DropdownMenuItem>
//                                                 <DropdownMenuItem>Copy Profile link</DropdownMenuItem>
//                                                 <DropdownMenuItem>Hide this post</DropdownMenuItem>
//                                                 <DropdownMenuSeparator />
//                                                 <DropdownMenuItem>
//                                                     <span className='text-[#FF0000]'>Report</span></DropdownMenuItem>
//                                             </DropdownMenuContent>
//                                         </DropdownMenu>
//                                     </div>
//                                 </div>
//                             ))
//                         }
//                     </div>
//                     {/* <div>
//                     <div className="flex justify-between items-start gap-4 pb-4">
//                         <div className="flex-1">
//                             <div className="flex items-center gap-1 mb-2">
//                                 <Avatar className="h-6 w-6">
//                                     <AvatarImage src="https://ui-avatars.com/api/?name=Ayushri+Verma" alt="Ayushri Verma" />
//                                     <AvatarFallback>A</AvatarFallback>
//                                 </Avatar>
//                                 <div className="flex items-center text-xs text-cblack">
//                                     <p>Ayushi Verma</p><Dot /><span>1h ago</span>
//                                 </div>
//                             </div>
//                             <div className="mt-3">
//                                 <p className="text-sm">Totally agree! Thumbnails are basically the new movie posters — first impressions matter more than ever</p>
//                                 <div className="mt-2 ml-5">
//                                     <div>
//                                         <div className="flex items-center gap-4 text-cblack">
//                                             <div className="flex items-center gap-1 cursor-pointer">
//                                                 <ThumbsUp size={16} strokeWidth={1.5} className="cursor-pointer" />
//                                                 <span className="cursor-pointer">54 Like</span>
//                                             </div>
//                                             <div className="flex items-center gap-1 cursor-pointer">
//                                                 <Repeat2 size={20} strokeWidth={1.5} className="cursor-pointer" />
//                                                 <span className="cursor-pointer">2 repost</span>
//                                             </div>
//                                             <div className="flex items-center gap-1 cursor-pointer" onClick={() => setShowReplyInput(true)}>
//                                                 <span className="cursor-pointer">Reply</span>
//                                             </div>
//                                         </div>
//                                         <Collapsible open={showReplyInput} onOpenChange={setShowReplyInput}>
//                                             <CollapsibleContent className="w-full mt-2">
//                                                 <div className="flex items-center gap-1 w-full">
//                                                     <Avatar className="h-6 w-6">
//                                                         <AvatarImage src="https://ui-avatars.com/api/?name=Ayushri+Verma" alt="Ayushri Verma" />
//                                                         <AvatarFallback>A</AvatarFallback>
//                                                     </Avatar>
//                                                     <input type="text" name="reply" placeholder="Add a reply..." className="w-full h-10 px-3 border-b border-gray-300 rounded-none focus:outline-none focus:ring-0" value={'@Ayushi Verma\n\n'} />
//                                                 </div>
//                                             </CollapsibleContent>
//                                         </Collapsible>
//                                     </div>
//                                     <div className="mt-4">
//                                         <Collapsible>
//                                             <CollapsibleTrigger className="flex items-center gap-1 text-[#00A8E9]">
//                                                 <ChevronDown size={16} className="cursor-pointer" />56 comments</CollapsibleTrigger>
//                                             <CollapsibleContent>
//                                                 <div className="flex items-center gap-1 mb-2 mt-4">
//                                                     <Avatar className="h-6 w-6">
//                                                         <AvatarImage src="https://ui-avatars.com/api/?name=Ayushri+Verma" alt="Ayushri Verma" />
//                                                         <AvatarFallback>A</AvatarFallback>
//                                                     </Avatar>
//                                                     <div className="flex items-center text-xs text-cblack">
//                                                         <p>Ayushi Verma</p><Dot /><span>1h ago</span>
//                                                     </div>
//                                                 </div>
//                                                 <div className="flex flex-col items-start gap-3">
//                                                     <p className="text-sm">Totally agree! Thumbnails are basically the new movie posters — first impressions matter more than ever</p>
//                                                     <div className="mt-2 ml-5 w-full">
//                                                         <div className="flex items-center gap-4 text-cblack">
//                                                             <div className="flex items-center gap-1 cursor-pointer">
//                                                                 <ThumbsUp size={16} strokeWidth={1.5} className="cursor-pointer" />
//                                                                 <span className="cursor-pointer">54 Like</span>
//                                                             </div>
//                                                             <div className="flex items-center gap-1 cursor-pointer">
//                                                                 <span className="cursor-pointer" onClick={() => setShowReplyInput(true)}>Reply</span>
//                                                             </div>
//                                                         </div>
//                                                         <Collapsible open={showReplyInput} onOpenChange={setShowReplyInput}>
//                                                             <CollapsibleContent className="w-full mt-2">
//                                                                 <div className="flex items-center gap-1 w-full">
//                                                                     <Avatar className="h-6 w-6">
//                                                                         <AvatarImage src="https://ui-avatars.com/api/?name=Ayushri+Verma" alt="Ayushri Verma" />
//                                                                         <AvatarFallback>A</AvatarFallback>
//                                                                     </Avatar>
//                                                                     <input type="text" name="reply" placeholder="Add a reply..." className="w-full h-10 px-3 border-b border-gray-300 rounded-none focus:outline-none focus:ring-0" value={'@Ayushi Verma\n\n'} />
//                                                                 </div>
//                                                             </CollapsibleContent>
//                                                         </Collapsible>
//                                                     </div>
//                                                 </div>
//                                             </CollapsibleContent>
//                                         </Collapsible>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div>
//                             <DropdownMenu>
//                                 <DropdownMenuTrigger><EllipsisVertical size={20} className="text-cblack" /></DropdownMenuTrigger>
//                                 <DropdownMenuContent className='w-40' side='left' align='start'>
//                                     <DropdownMenuItem>Follow @{post?.name}</DropdownMenuItem>
//                                     <DropdownMenuItem>View Profile</DropdownMenuItem>
//                                     <DropdownMenuItem>Copy Profile link</DropdownMenuItem>
//                                     <DropdownMenuItem>Hide this post</DropdownMenuItem>
//                                     <DropdownMenuSeparator />
//                                     <DropdownMenuItem>
//                                         <span className='text-[#FF0000]'>Report</span></DropdownMenuItem>
//                                 </DropdownMenuContent>
//                             </DropdownMenu>
//                         </div>
//                     </div>
//                     <div className="flex justify-between items-start gap-4 pb-4">
//                         <div className="flex-1">
//                             <div className="flex items-center gap-1 mb-2">
//                                 <Avatar className="h-6 w-6">
//                                     <AvatarImage src="https://ui-avatars.com/api/?name=Rhea+Sharma" alt="Rhea Sharma" />
//                                     <AvatarFallback>A</AvatarFallback>
//                                 </Avatar>
//                                 <div className="flex items-center text-xs text-cblack">
//                                     <p>Rhea Sharma</p><Dot /><span>1h ago</span>
//                                 </div>
//                             </div>
//                             <div className="mt-3">
//                                 <p className="text-sm">Totally agree! Thumbnails are basically the new movie posters — first impressions matter more than ever</p>
//                                 <div className="mt-2 ml-5">
//                                     <div className="flex items-center gap-4 text-cblack">
//                                         <div className="flex items-center gap-1 cursor-pointer">
//                                             <ThumbsUp size={16} strokeWidth={1.5} className="cursor-pointer" />
//                                             <span className="cursor-pointer">54 Like</span>
//                                         </div>
//                                         <div className="flex items-center gap-1 cursor-pointer">
//                                             <Repeat2 size={20} strokeWidth={1.5} className="cursor-pointer" />
//                                             <span className="cursor-pointer">2 repost</span>
//                                         </div>
//                                     </div>
//                                     <div className="mt-4">
//                                         <Collapsible>
//                                             <CollapsibleTrigger className="flex items-center gap-1 text-[#00A8E9]">
//                                                 <ChevronDown size={16} className="cursor-pointer" />56 comments</CollapsibleTrigger>
//                                             <CollapsibleContent>
//                                                 <div className="flex items-center gap-1 mb-2 mt-4">
//                                                     <Avatar className="h-6 w-6">
//                                                         <AvatarImage src="https://ui-avatars.com/api/?name=Rhea+Sharma" alt="Rhea Sharma" />
//                                                         <AvatarFallback>A</AvatarFallback>
//                                                     </Avatar>
//                                                     <div className="flex items-center text-xs text-cblack">
//                                                         <p>Rhea Sharma</p><Dot /><span>1h ago</span>
//                                                     </div>
//                                                 </div>
//                                                 <div className="flex flex-col items-start gap-3">
//                                                     <p className="text-sm">Totally agree! Thumbnails are basically the new movie posters — first impressions matter more than ever</p>
//                                                     <div className="mt-2 ml-5 w-full">
//                                                         <div className="flex items-center gap-4 text-cblack">
//                                                             <div className="flex items-center gap-1 cursor-pointer">
//                                                                 <ThumbsUp size={16} strokeWidth={1.5} className="cursor-pointer" />
//                                                                 <span className="cursor-pointer">54 Like</span>
//                                                             </div>
//                                                             <div className="flex items-center gap-1 cursor-pointer">
//                                                                 <span className="cursor-pointer" onClick={() => setShowReplyInput(true)}>Reply</span>
//                                                             </div>
//                                                         </div>
//                                                         <Collapsible open={showReplyInput} onOpenChange={setShowReplyInput}>
//                                                             <CollapsibleContent className="w-full mt-2">
//                                                                 <div className="flex items-center gap-1 w-full">
//                                                                     <Avatar className="h-6 w-6">
//                                                                         <AvatarImage src="https://ui-avatars.com/api/?name=Rhea+Sharma" alt="Rhea Sharma" />
//                                                                         <AvatarFallback>A</AvatarFallback>
//                                                                     </Avatar>
//                                                                     <input type="text" name="reply" placeholder="Add a reply..." className="w-full h-10 px-3 border-b border-gray-300 rounded-none focus:outline-none focus:ring-0" value={'@Rhea Sharma\n\n'} />
//                                                                 </div>
//                                                             </CollapsibleContent>
//                                                         </Collapsible>
//                                                     </div>
//                                                 </div>
//                                             </CollapsibleContent>
//                                         </Collapsible>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div>
//                             <DropdownMenu>
//                                 <DropdownMenuTrigger><EllipsisVertical size={20} className="text-cblack" /></DropdownMenuTrigger>
//                                 <DropdownMenuContent className='w-40' side='left' align='start'>
//                                     <DropdownMenuItem>Follow @{post?.name}</DropdownMenuItem>
//                                     <DropdownMenuItem>View Profile</DropdownMenuItem>
//                                     <DropdownMenuItem>Copy Profile link</DropdownMenuItem>
//                                     <DropdownMenuItem>Hide this post</DropdownMenuItem>
//                                     <DropdownMenuSeparator />
//                                     <DropdownMenuItem>
//                                         <span className='text-[#FF0000]'>Report</span></DropdownMenuItem>
//                                 </DropdownMenuContent>
//                             </DropdownMenu>
//                         </div>
//                     </div>
//                 </div> */}
//                 </div>
//             </Card>
//         </CommunityLayout>
//     );
// };

// export default PostDetails;