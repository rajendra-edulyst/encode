// import { Card } from "@/components/ui/card";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/shadcnAvatar";
// import { usePostDetailsStore, usePostsStore } from "@community/store/communityStore";
// import { lazy, useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { useSessionUser } from "@/store/authStore";
// import { ChevronLeft, Dot, EllipsisVertical, MessageCircle, SendHorizontal, ThumbsUp } from "lucide-react";
// import Loading from "@/components/shared/Loading";
// import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
// import { Button } from "@/components/ui/ShadcnButton";
// import CommunityLayout from "@community/layouts";
// import { BiSolidLike } from "react-icons/bi";
// import Swal from "sweetalert2";
// import Poppin from "../../../components/post/poppin";
// import { formatApiDate } from "../../../utils/dateFormat";
// import FullPreview from "./fullPreview";
// import WeeklyCalendar from "@/views/faculty/dashboard/Calendar";

// const Pined = lazy(() => import('@community/components/post/pined'));
// const MyCommunities = lazy(() => import('@community/components/post/mycommunites'));
// const OpinionPoll = lazy(() => import('../poll/index'));


// const PostDetails = () => {

//     const { postId } = useParams<{ postId: string }>();
//     const { fetchPost, post, loading, fetchPostComments, comments, likePost, sendComment } = usePostDetailsStore();
//     const { profile_image, name } = useSessionUser((state) => state.user)
//     const [comment, setComment] = useState('');

//     const [api, setApi] = useState<CarouselApi>()
//     const [current, setCurrent] = useState(0)
//     const [count, setCount] = useState(0)
//     const isDiscover = location.pathname.includes('/community/analytics');
//     const [openDialog, setOpenDialog] = useState(false);
//     const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
//     const [initialIndex, setInitialIndex] = useState(0);
//     const navigate = useNavigate();


//     const { deletePost } = usePostsStore();

//     useEffect(() => {
//         if (postId) {
//             fetchPost(postId);
//         }
//     }, [postId, fetchPost, fetchPostComments]);

//     useEffect(() => {
//         if (!api) {
//             return
//         }
//         setCount(api.scrollSnapList().length)
//         setCurrent(api.selectedScrollSnap() + 1)
//         api.on("select", () => {
//             setCurrent(api.selectedScrollSnap() + 1)
//         })
//     }, [api])

//     if (loading && post?.id !== postId) {
//         return <Loading loading={loading} />;
//     }

//     const handleImageClick = (files: string[], index: number) => {
//         setSelectedFiles(files);
//         setInitialIndex(index);
//         setOpenDialog(true);
//     };


//     const deleteMyPost = (postId: number) => {
//         Swal.fire({
//             title: 'Are you sure?',
//             text: "You won't be able to revert this!",
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonColor: '#d33',
//             cancelButtonColor: '#3085d6',
//             confirmButtonText: 'Yes, delete it!'
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 await deletePost(postId);
//                 Swal.fire(
//                     'Deleted!',
//                     'Your post has been deleted.',
//                     'success'
//                 );
//                 setTimeout(() => {
//                     navigate('/community');
//                 }, 1500);
//             }
//         });
//     };


//     return (
//         <CommunityLayout active='mywall'>
//             <div className="w-full flex flex-col md:flex-row py-6 gap-5">
//                 <div className="w-full md:w-[75%] space-y-6">
//                     <Card className="shadow-none border-none rounded-lg pb-6 px-2 py-2">
//                         <div className="flex items-center gap-2 mb-4">
//                             <Button asChild variant="outline">
//                                 <Link to={isDiscover ? '/community/analytics' : "/community"}>
//                                     <ChevronLeft size={24} className="text-cblack cursor-pointer" /> Back
//                                 </Link>
//                             </Button>
//                         </div>
//                         <div className='flex gap-4 items-start'>
//                             <div className='flex-1'>
//                                 <div className="flex justify-between items-start mb-2">
//                                     <div>
//                                         {post?.category_name && <Link to={`/community/mycommunities/${post?.category_id}`}>
//                                             <div className="flex gap-2 mb-2 rounded-lg overflow-hidden cursor-pointer">
//                                                 <img src="/img/icons/people.png" className="w-5 h-5" alt="Community Icon" />
//                                                 <span>{post?.category_name}</span>
//                                             </div>
//                                         </Link>}
//                                         <div className="flex justify-between items-start">
//                                             <div className="flex items-center gap-2">
//                                                 <Avatar className="h-6 w-6">
//                                                     <AvatarImage src={post?.created_by_image ?? `https://ui-avatars.com/api/?name=${post?.created_by_name}`} alt={post?.name} />
//                                                     <AvatarFallback>{post?.name?.charAt(0)}</AvatarFallback>
//                                                 </Avatar>
//                                                 <div>
//                                                     <div className="flex items-center text-xs text-cblack">
//                                                         <span className='capitalize'>{post?.created_by_name}</span>
//                                                         <span className="mx-1">•</span>
//                                                         <span>{post?.created_at && <span>{formatApiDate(post.created_at)}</span>}</span>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <DropdownMenu>
//                                         <DropdownMenuTrigger><EllipsisVertical className="h-4 w-4 text-cblack" /></DropdownMenuTrigger>
//                                         <DropdownMenuContent className='w-40' side='left' align='start'>
//                                             <Link to={`/community/myposts/createpost?id=${post?.id}`} className="w-full">
//                                                 <DropdownMenuItem className="cursor-pointer">
//                                                     Edit Post
//                                                 </DropdownMenuItem>
//                                             </Link>

//                                             <DropdownMenuItem className="cursor-pointer"
//                                                 onClick={() => {
//                                                     if (post?.id) {
//                                                         deleteMyPost(post.id);
//                                                     }
//                                                 }}>
//                                                 <span className="text-[#FF0000]">Delete Post</span>
//                                             </DropdownMenuItem>
//                                         </DropdownMenuContent>
//                                     </DropdownMenu>
//                                 </div>
//                                 <div className="mb-3">
//                                     <h3 className="text-lg font-semibold mb-1 text-cblack">{post?.title}</h3>
//                                     <p className="text-sm text-cblack prose-xl  prose-a:text-blue-600" dangerouslySetInnerHTML={{ __html: post?.description ?? '' }} />
//                                 </div>
//                                 <div className='mb-3'>
//                                     {post?.content_type === '4' && (
//                                         <Carousel setApi={setApi} className="relative">
//                                             <CarouselContent>
//                                                 <CarouselItem>
//                                                     <div className="mb-2 border rounded-lg overflow-hidden cursor-pointer">
//                                                         <img
//                                                             src={post?.thumbnail_url}
//                                                             className="w-full object-cover rounded-lg h-96"
//                                                             onClick={() => handleImageClick(post?.multi_file_uploads, 0)}
//                                                         />
//                                                     </div>
//                                                 </CarouselItem>

//                                                 {post?.multi_file_uploads?.slice(1, 5)?.map((file: string, index: number) => (
//                                                     <CarouselItem key={index}>
//                                                         <div className="mb-2 border rounded-lg overflow-hidden cursor-pointer">
//                                                             <img
//                                                                 src={file}
//                                                                 alt={`Post image ${index + 1}`}
//                                                                 className="w-full object-cover rounded-lg h-96"
//                                                                 onClick={() => handleImageClick(post?.multi_file_uploads, index + 1)}
//                                                             />
//                                                         </div>
//                                                     </CarouselItem>
//                                                 ))}
//                                             </CarouselContent>

//                                             {(post?.multi_file_uploads?.length ?? 0) > 1 && (
//                                                 <>
//                                                     <div className="absolute bottom-2 left-0 right-0 p-2">
//                                                         <div className="flex justify-center items-center gap-2 mt-2">
//                                                             {Array.from({ length: count }).map((_, index) => (
//                                                                 <button
//                                                                     key={index}
//                                                                     className={`h-3 rounded-full ${current === index + 1 ? 'bg-[#00A8E9] w-10' : 'w-3 bg-gray-300'}`}
//                                                                     onClick={() => api?.scrollTo(index)}
//                                                                 />
//                                                             ))}
//                                                         </div>
//                                                     </div>

//                                                     <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 text-cblue border border-[#00A8E9]" />
//                                                     <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cblue border border-[#00A8E9]" />
//                                                 </>
//                                             )}
//                                         </Carousel>
//                                     )}

//                                     {post?.content_type === '2' && (
//                                         <div className="mb-4 border rounded-lg overflow-hidden relative">
//                                             <video controls src={post?.resource_path} className="w-full rounded-lg" />
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/*  */}
//                                 <div className="flex items-center text-sm text-cblack gap-4">
//                                     <div className="flex items-center gap-1 cursor-pointer">
//                                         <Button variant="ghost" size="sm" onClick={() => likePost(post?.user_liked ? 'unlike' : 'like')}>
//                                             {post?.user_liked ? <BiSolidLike size={20} strokeWidth={1} className='text-primary' /> : <ThumbsUp size={20} strokeWidth={1.5} />}
//                                             {post?.like_count} Like
//                                         </Button>
//                                     </div>
//                                     <div className="flex items-center gap-1 cursor-pointer">
//                                         <a href="#comments-section" className="flex items-center gap-1 cursor-pointer">
//                                             <MessageCircle size={20} strokeWidth={1.5} />
//                                             <span>{comments?.length || '0'} comments</span>
//                                         </a>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="mt-6" id="comments-section">
//                             <div>
//                                 <h1 className="text-cblack text-base font-normal">{comments?.length} Comments</h1>
//                             </div>
//                             <div className="mt-4 flex items-center gap-2">
//                                 <Avatar className="h-10 w-10">
//                                     <AvatarImage src={profile_image ?? `https://ui-avatars.com/api/?name=${name}`} alt={name} />
//                                     <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
//                                 </Avatar>
//                                 <div className="relative w-full border-b border-gray-300 pb-1">
//                                     <input type="text" placeholder="Add a comment..." className="w-full h-10 px-3 rounded-none focus:outline-none focus:ring-0" value={comment} onChange={(e) => setComment(e.target.value)}
//                                         onKeyDown={(e) => {
//                                             if (e.key === 'Enter' && comment.trim()) {
//                                                 sendComment(comment);
//                                                 setComment('');
//                                             }
//                                         }}
//                                     />
//                                     <Button variant={'ghost'} className="absolute right-1 text-cblue"
//                                         disabled={!comment.trim()} onClick={() => sendComment(comment)}><SendHorizontal /></Button>
//                                 </div>
//                             </div>
//                             {/* comment design below */}
//                             <div className="space-y-2 mt-6">
//                                 {
//                                     comments && comments.length > 0 && comments.map((comment, index) => (
//                                         <div key={index} className="flex justify-between items-start gap-4 pb-4">
//                                             <div className="flex-1">
//                                                 <div className="flex items-center gap-1 mb-2">
//                                                     <Avatar className="h-6 w-6">
//                                                         <AvatarImage src={comment?.profile_image ?? `https://ui-avatars.com/api/?name=Ayushri+Verma`} alt="Ayushri Verma" />
//                                                         <AvatarFallback>A</AvatarFallback>
//                                                     </Avatar>
//                                                     <div className="flex items-center text-xs text-cblack">
//                                                         <p>{comment?.name ?? 'Anonymous'}</p><Dot /><span>1h ago</span>
//                                                     </div>
//                                                 </div>
//                                                 <div className="mt-3">
//                                                     <p className="text-sm">{comment?.content ?? 'No content'}</p>
//                                                 </div>
//                                             </div>
//                                             <div>
//                                                 <DropdownMenu>
//                                                     <DropdownMenuTrigger><EllipsisVertical size={20} className="text-cblack" /></DropdownMenuTrigger>
//                                                     <DropdownMenuContent className='w-40' side='left' align='start'>
//                                                         <DropdownMenuItem>Follow @{post?.name}</DropdownMenuItem>
//                                                         <DropdownMenuItem>View Profile</DropdownMenuItem>
//                                                         <DropdownMenuItem>Copy Profile link</DropdownMenuItem>
//                                                         <DropdownMenuItem>Hide this post</DropdownMenuItem>
//                                                         <DropdownMenuSeparator />
//                                                         <DropdownMenuItem>
//                                                             <span className='text-[#FF0000]'>Report</span></DropdownMenuItem>
//                                                     </DropdownMenuContent>
//                                                 </DropdownMenu>
//                                             </div>
//                                         </div>
//                                     ))
//                                 }
//                             </div>
//                         </div>
//                     </Card>
//                 </div>

//                 <div className="w-full md:w-[30%] overflow-hidden">
//                     <div className='sticky top-0 space-y-5'>

//                         <WeeklyCalendar />
//                         <OpinionPoll />
//                         <Pined />


//                     </div>
//                 </div>
//             </div>

//             <FullPreview
//                 open={openDialog}
//                 selectedFiles={selectedFiles}
//                 initialIndex={initialIndex}
//                 onClose={() => setOpenDialog(false)}
//             />

//         </CommunityLayout>


//     );
// }

// export default PostDetails;
