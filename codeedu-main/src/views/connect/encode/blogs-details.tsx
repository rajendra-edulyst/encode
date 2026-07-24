// import { Card, CardContent } from "@/components/ui/card";
// import { Helmet } from "react-helmet-async";
// import { useEffect, useState, lazy, useCallback, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
// import ConnectLayout from "../layouts";
// import RightSidePanel from "../layouts/right-side-panel";
// import PostActions from "../components/post-card/PostActions";
// import PostInteractionBar from "../components/post-card/PostInteractionBar";
// import CommentsList from "../components/post-card/CommentsList";
// import SEO from "@/components/SEO/SEO";
// import { useFetchPostComments, useLikePost, usePostDetails, useSendComment, useDeletePost } from "@/hooks/data/connect/usePosts";
// import LoadingSection from "@/components/LoadingSection";
// import formatRelativeOrLong from "@/utils/formatDate";
// import { mergeBlogDescriptionWithServerUploads } from "@/utils/blogPostHtmlUpload";
// import { getBlogFAQs } from "@/utils/blogFaqs";
// import { EllipsisVertical, Pin } from 'lucide-react';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// import { toast } from 'sonner';
// import appConfig from '@/configs/app.config';
// import { useAuth } from '@/auth';
// import Swal from 'sweetalert2';
// import { useQueryClient } from '@tanstack/react-query';
// import { pinPost } from '@/services/connect/PostService';
// import { isPinnedForUser } from '@/utils/postUtils';


// const RepostDialog = lazy(() => import('../components/RepostDialog'));

// // Utility function to strip HTML tags for meta descriptions
// const stripHtml = (html: string) => {
//     return html.replace(/<[^>]*>?/gm, '').trim();
// };

// const generateKeywords = (title: string, description: string) => {
//     const combined = `${title} ${stripHtml(description)}`;
//     const words = combined.toLowerCase().split(/\W+/);
//     const keywords = [...new Set(words)]
//         .filter(word => word.length > 4) // Filter out short words
//         .slice(0, 10); // Limit to 10 keywords
//     return keywords.join(', ');
// };

// const truncateDescription = (description?: string) => {
//     const plainText = stripHtml(description || '');
//     return plainText.substring(0, 160) || 'Read this amazing article.';
// };

// /** Collect src URLs from inline <img> tags in rich-text HTML */
// const extractImgSrcsFromHtml = (html: string): string[] => {
//     if (!html) return [];
//     const srcs: string[] = [];
//     const re = /<img[^>]+src=["']([^"']+)["']/gi;
//     let m: RegExpExecArray | null;
//     while ((m = re.exec(html)) !== null) {
//         srcs.push(m[1]);
//     }
//     return srcs;
// };

// const BlogDetails = () => {

//     const { postId: paramPostId, slug } = useParams<{ postId: string; slug: string }>();
//     const { search } = window.location;
//     const isPublicBlogView = window.location.pathname.startsWith('/blogs/');

//     // extract pid from query if paramPostId is not set
//     let queryPostId = parseInt(search.replace('?', '').replace('pid=', ''));
//     if (isNaN(queryPostId)) {
//         queryPostId = parseInt(new URLSearchParams(search).get('pid') ?? '0');
//     }
//     const finalPostId = paramPostId || (queryPostId ? queryPostId.toString() : undefined);

//     const navigate = useNavigate();
//     const { user } = useAuth();
//     const { mutate: deletePostMutation, isPending: isDeleting } = useDeletePost();
//     const profileServiceid = appConfig?.organization?.profileServiceid;

//     const { data: fetchedPost, isLoading: loading } = usePostDetails(finalPostId);

//     const post = useMemo(() => {
//         if (!fetchedPost) return null;
//         const searchParams = new URLSearchParams(window.location.search);
//         const url_created_at = searchParams.get('created_at');
//         if (url_created_at) {
//             return {
//                 ...fetchedPost,
//                 created_at: url_created_at,
//             };
//         }
//         return fetchedPost;
//     }, [fetchedPost]);

//     // Enforce strict slug matching
//     useEffect(() => {
//         if (post && post.title) {
//             const expectedSlug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
//             if (slug && slug !== expectedSlug) {
//                 const basePath = window.location.pathname.startsWith('/connect') ? '/connect/blogs' : '/blogs';
//                 navigate(`${basePath}/${expectedSlug}/pid${window.location.search}`, { replace: true });
//             }
//         }
//     }, [post, slug, navigate]);

//     const [comment, setComment] = useState('');
//     const [toggleShowComments, setToggleShowComments] = useState(true);
//     const [visibleCommentsCount, setVisibleCommentsCount] = useState(3);
//     const [showRepostDialog, setShowRepostDialog] = useState(false);

//     const [api, setApi] = useState<CarouselApi>()
//     const [current, setCurrent] = useState(0)
//     const [count, setCount] = useState(0)

//     // Use optimized hooks from post-card
//     const { data: fetchedComments = [] } = useFetchPostComments(Number(finalPostId), toggleShowComments);
//     const likeMutation = useLikePost();
//     const sendCommentMutation = useSendComment();
//     const isBlogPost = post ? (String(post.content_type) === '21' || String(post.content_type) === '1') : false;

//     // Callback handlers for post interactions
//     const handleCopyPostLink = useCallback(() => {
//         if (!post) return;
//         const slug = post?.title ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'post';
//         const postUrl = `${window.location.origin}/blogs/${slug}/pid?pid=${post.id}`;
//         navigator.clipboard.writeText(postUrl);
//         toast.success('Post link copied to clipboard!');
//     }, [post]);

//     const isPinnedByCurrentUser = post ? isPinnedForUser(post, user) : false;

//     const queryClient = useQueryClient();
//     const handlePinPost = useCallback(async () => {
//         if (!post) return;
//         try {
//             const newPinStatus = isPinnedByCurrentUser ? 0 : 1;
//             await pinPost({ joy_content_id: post.id, is_pin: newPinStatus });
//             toast.success(newPinStatus === 1 ? 'Post pinned successfully!' : 'Post unpinned successfully!');
//             queryClient.invalidateQueries({ queryKey: ['posts'] });
//             queryClient.invalidateQueries({ queryKey: ['pinned-posts'] });
//         } catch (error) {
//             toast.error('Failed to pin post.');
//         }
//     }, [post, isPinnedByCurrentUser, queryClient]);

//     const createdById = post ? Number(post.created_by) : 0;

//     const handleViewProfile = useCallback(() => {
//         if (createdById) {
//             navigate(`/portfolio/${profileServiceid}/${createdById}`);
//         }
//     }, [navigate, profileServiceid, createdById]);

//     const handleCopyProfileLink = useCallback(() => {
//         const profileUrl = `${window.location.origin}/portfolio/${profileServiceid}/${createdById}`;
//         navigator.clipboard.writeText(profileUrl);
//         toast.success('Profile link copied to clipboard!');
//     }, [profileServiceid, createdById]);

//     const handleEditPost = useCallback(() => {
//         if (!post) return;
//         const composer = isBlogPost ? 'blog' : '';
//         navigate(`/connect/add-buzz/${post.id}${composer ? `?composer=${composer}` : ''}`);
//     }, [navigate, post]);


//     const handleDeletePost = useCallback(async () => {
//         if (!post) return;
//         const result = await Swal.fire({
//             title: `Delete ${isBlogPost ? 'Blog' : 'Post'}?`,
//             text: `Are you sure you want to delete this ${isBlogPost ? 'blog' : 'post'}? This action cannot be undone.`,
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonColor: '#ef4444',
//             cancelButtonColor: '#6b7280',
//             confirmButtonText: 'Yes, delete it!',
//             cancelButtonText: 'Cancel'
//         });

//         if (result.isConfirmed) {
//             deletePostMutation(post.id);
//         }
//     }, [deletePostMutation, post]);

//     const handleLikeClick = useCallback(() => {
//         if (post) {
//             likeMutation.mutate(post);
//         }
//     }, [likeMutation, post]);

//     const handleCommentClick = useCallback(() => {
//         setToggleShowComments(prev => !prev);
//     }, []);

//     const handleRepostClick = useCallback(() => {
//         setShowRepostDialog(true);
//     }, []);

//     const sendCommentHandler = useCallback(() => {
//         if (comment.trim() === '' || !post) return;
//         sendCommentMutation.mutate({
//             post: post,
//             content: comment,
//         });
//         setComment('');
//     }, [comment, post, sendCommentMutation]);

//     const loadMoreComments = useCallback(() => {
//         setVisibleCommentsCount(prev => prev + 3);
//     }, []);

//     const handleCommentChange = useCallback((value: string) => {
//         setComment(value);
//     }, []);

//     const hasMoreComments = (fetchedComments?.length || 0) > visibleCommentsCount;
//     const mediaUrls = [
//         ...(post?.thumbnail_url ? [post.thumbnail_url] : []),
//         ...(post?.multi_file_uploads ?? []),
//         ...(post?.resource_path ? [post.resource_path] : []),
//     ].filter(Boolean);
//     const uniqueMediaUrls = Array.from(new Set(mediaUrls));
//     const primaryImage = uniqueMediaUrls[0];
//     const inlineImgSrcs = post?.description ? extractImgSrcsFromHtml(post.description) : [];
//     const uniqueInlineImgSrcs = Array.from(new Set(inlineImgSrcs.filter(Boolean)));
//     /** Multiple files from API (thumbnail + multi_file_uploads) */
//     const showBlogCarouselFromServer =
//         isBlogPost && uniqueMediaUrls.length > 1;
//     /** Multiple inline <img> in body HTML (e.g. two data URLs) while API did not attach a multi-image gallery */
//     const showBlogCarouselFromInlineOnly =
//         isBlogPost &&
//         uniqueMediaUrls.length <= 1 &&
//         uniqueInlineImgSrcs.length > 1;
//     const showBlogImageGallery = showBlogCarouselFromServer || showBlogCarouselFromInlineOnly;
//     const blogCarouselImages = showBlogCarouselFromServer
//         ? uniqueMediaUrls
//         : showBlogCarouselFromInlineOnly
//             ? uniqueInlineImgSrcs
//             : [];
//     const rawDescription =
//         isBlogPost
//             ? mergeBlogDescriptionWithServerUploads(
//                 post?.description ?? '',
//                 post?.multi_file_uploads
//             )
//             : (post?.description ?? '');
//     const descriptionHtmlForBlog = rawDescription;
//     const authorName = post ? `enCODE : ${post.name || post.created_by_name || "CODE Edu"}` : "enCODE : CODE Edu";
//     const authorImage = post?.created_by_profile_image || post?.created_by_image;

//     const isAeoBlog = useMemo(() => {
//         return (
//             slug?.toLowerCase() === 'aeo' ||
//             post?.title?.toLowerCase() === 'aeo'
//         );
//     }, [slug, post]);

//     const aeoSummaryText = "Summary Section: AI loves summaries. Key Takeaways: ✔ Speak confidently. ✔ Smile. ✔ Introduce yourself. ✔ Grab attention. ✔ End with a call to action.";

//     const seoDescription = isAeoBlog
//         ? `${aeoSummaryText} ${truncateDescription(post?.description || '')}`
//         : truncateDescription(post?.description || '');

//     const articleBodyText = isAeoBlog
//         ? `${aeoSummaryText} ${stripHtml(post?.description || '')}`
//         : stripHtml(post?.description || '');

//     const seoKeywords = post?.tag
//         ? post.tag.split(',').map(tag => tag.trim().replace(/^#+/, '')).join(', ')
//         : generateKeywords(post?.title || '', post?.description || '');
//     const shareUrl = window.location.href;
//     const publishDate = post?.created_at ? new Date(Number(post.created_at) * 1000).toISOString().split('T')[0] : undefined;
//     const faqs = useMemo(() => getBlogFAQs(post), [post]);


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


//     return (
//         <ConnectLayout active='encode'>
//             <div className="w-full flex flex-col md:flex-row pb-6 gap-5">
//                 <div className="w-full md:w-[75%] space-y-6">
//                     <LoadingSection isLoading={loading} title="Post Details" />
//                     {post && (
//                         <>
//                             <SEO
//                                 title={`${post.title} | enCODE Blog`}
//                                 description={seoDescription}
//                                 author={authorName}
//                                 url={shareUrl}
//                                 canonical={shareUrl}
//                                 image={primaryImage || post.thumbnail_url || 'https://encode.codeedu.co/img/logo/logo-light-full.png'}
//                                 type="article"
//                                 publishDate={publishDate}
//                                 twitterHandle="@codeeduofficial"
//                                 aeoType="BlogPosting"
//                                 authorDetails={{
//                                     type: 'Person',
//                                     name: post.name || post.created_by_name || "CODE Edu",
//                                     profilePhoto: authorImage || undefined
//                                 }}
//                                 breadcrumbs={[
//                                     { name: window.location.pathname.startsWith('/connect') ? "Connect Blogs" : "Blogs", path: window.location.pathname.startsWith('/connect') ? '/connect/blogs' : '/blogs' },
//                                     { name: post.title }
//                                 ]}
//                                 speakableSelectors={[".blog-title", ".blog-content"]}
//                                 articleBody={articleBodyText}
//                                 keywords={seoKeywords}
//                                 articleSection={post?.tag?.split(',')[0]?.trim().replace(/^#+/, '') || undefined}
//                                 faqData={faqs}
//                                 readingTime={post.read_time ? `${post.read_time} minutes` : "4 minutes"}
//                             />
//                             <Helmet>
//                                 {/* Preload critical LCP image */}
//                                 {primaryImage && (
//                                     <link
//                                         rel="preload"
//                                         as="image"
//                                         href={primaryImage}
//                                         fetchPriority="high"
//                                     />
//                                 )}
//                             </Helmet>
//                         </>
//                     )}
//                     {post && <Card className="shadow-none rounded-lg bg-[#1b1b1f] border border-[#2c2c35]">
//                         <CardContent className="p-4 md:p-5">
//                             <div className='flex gap-4 items-start'>
//                                 <div className='flex-1'>
//                                     <div className="mb-5 relative">
//                                         <h1 className="text-xl md:text-[30px] font-semibold mb-3 text-white leading-tight text-center px-10 md:px-16 blog-title">
//                                             {post?.title}
//                                         </h1>
//                                         <div className="absolute top-0 right-0">
//                                             <div className="flex items-center gap-2">
//                                                 {isPinnedByCurrentUser && <Pin size={20} strokeWidth={1.5} className="text-[#FF0000] cursor-pointer" onClick={handlePinPost} />}
//                                                 <DropdownMenu>
//                                                     <DropdownMenuTrigger className="p-2 hover:bg-gray-800 rounded-full transition-colors">
//                                                         <EllipsisVertical className="w-5 h-5 text-gray-400" />
//                                                     </DropdownMenuTrigger>
//                                                     <DropdownMenuContent align="end" className="w-48">
//                                                         {Number(user?.id) !== Number(createdById) ? (
//                                                             <>
//                                                                 <DropdownMenuItem className="cursor-pointer" onClick={handleViewProfile}>
//                                                                     View Profile
//                                                                 </DropdownMenuItem>
//                                                                 <DropdownMenuItem className="cursor-pointer" onClick={handleCopyProfileLink}>
//                                                                     Copy Profile Link
//                                                                 </DropdownMenuItem>
//                                                                 <DropdownMenuItem className="cursor-pointer" onClick={handleCopyPostLink}>
//                                                                     Copy Blog URL
//                                                                 </DropdownMenuItem>
//                                                                 <DropdownMenuItem className="cursor-pointer" onClick={handlePinPost}>
//                                                                     {isPinnedByCurrentUser ? 'Unpin Post' : 'Pin Post'}
//                                                                 </DropdownMenuItem>
//                                                             </>
//                                                         ) : (
//                                                             <>
//                                                                 <DropdownMenuItem className="cursor-pointer" onClick={handleCopyPostLink}>
//                                                                     Copy Blog URL
//                                                                 </DropdownMenuItem>
//                                                                 <DropdownMenuItem className="cursor-pointer" onClick={handlePinPost}>
//                                                                     {isPinnedByCurrentUser ? 'Unpin Post' : 'Pin Post'}
//                                                                 </DropdownMenuItem>
//                                                                 <DropdownMenuItem className="cursor-pointer" onClick={handleEditPost}>
//                                                                     Edit {isBlogPost ? 'Blog' : 'Post'}
//                                                                 </DropdownMenuItem>
//                                                                 <DropdownMenuSeparator />
//                                                                 <DropdownMenuItem
//                                                                     className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
//                                                                     disabled={isDeleting}
//                                                                     onClick={handleDeletePost}
//                                                                 >
//                                                                     {isDeleting ? 'Deleting...' : `Delete ${isBlogPost ? 'Blog' : 'Post'}`}
//                                                                 </DropdownMenuItem>
//                                                             </>
//                                                         )}
//                                                     </DropdownMenuContent>
//                                                 </DropdownMenu>
//                                             </div>
//                                         </div>
//                                         <div className="mb-5 flex items-center justify-center gap-2 text-center">
//                                             <div className="flex items-center justify-center gap-2">
//                                                 {authorImage ? (
//                                                     <img
//                                                         src={authorImage}
//                                                         alt={authorName}
//                                                         className="w-7 h-7 rounded-full object-cover"
//                                                     />
//                                                 ) : (
//                                                     <div className="w-7 h-7 rounded-full bg-gray-500/30 flex items-center justify-center">
//                                                         <span className="text-xs font-semibold text-white">
//                                                             {authorName.replace('enCODE : ', '').charAt(0).toUpperCase()}
//                                                         </span>
//                                                     </div>
//                                                 )}
//                                                 <span className="text-sm md:text-base font-medium text-gray-200">{authorName}</span>
//                                             </div>
//                                             {post?.created_at ? (
//                                                 <span className="text-sm md:text-base text-gray-300">• {formatRelativeOrLong(post.created_at)}</span>
//                                             ) : null}
//                                         </div>
//                                         <div
//                                             className={`text-[14px] md:text-[15px] leading-7 text-gray-200 prose prose-invert max-w-none
//                                             prose-p:my-0 prose-div:my-0 prose-br:leading-7
//                                             prose-strong:font-semibold prose-strong:text-white
//                                             prose-headings:text-white prose-headings:font-semibold
//                                             prose-h1:text-2xl prose-h1:md:text-3xl prose-h1:text-center prose-h1:mb-4
//                                             prose-h2:text-xl prose-h2:md:text-2xl prose-h2:mt-6 prose-h2:mb-3
//                                             prose-h3:text-lg prose-h3:md:text-xl prose-h3:mt-5 prose-h3:mb-2
//                                             prose-ul:list-disc prose-ul:pl-5 prose-ul:my-2
//                                             prose-ol:list-decimal prose-ol:pl-5 prose-ol:my-2
//                                             prose-li:my-1 prose-a:text-[#00A8E9]
//                                             [&>div]:leading-7 [&>div]:text-gray-200 [&>div]:mb-3
//                                             [&>p]:leading-7 [&>p]:text-gray-200 [&>p]:mb-3
//                                             blog-img-prose blog-img-prose--detail blog-content`}
//                                             dangerouslySetInnerHTML={{ __html: descriptionHtmlForBlog }}
//                                         />
//                                         {post?.tag && (
//                                             <div className="flex flex-wrap gap-x-4 gap-y-2 mt-8 mb-4">
//                                                 {post.tag.split(',').map((tag, index) => (
//                                                     <span key={index} className="text-primary font-medium hover:underline cursor-pointer transition-colors">
//                                                         {tag.trim().replace(/^#+/, '')}
//                                                     </span>
//                                                 ))}
//                                             </div>
//                                         )}
//                                         {faqs && faqs.length > 0 && (
//                                             <div className="mt-12 pt-8 border-t border-gray-800 faq-section">
//                                                 <h2 className="text-2xl font-bold font-jacques mb-6 text-white">Frequently Asked Questions</h2>
//                                                 <div className="space-y-6">
//                                                     {faqs.map((faq, index) => (
//                                                         <div key={index} className="space-y-2">
//                                                             <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
//                                                             <p className="text-gray-300 text-sm leading-relaxed">{faq.answer}</p>
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                     <div className='mb-3'>
//                                         {!isBlogPost && showBlogImageGallery && blogCarouselImages.length > 0 && (
//                                             <Carousel setApi={setApi} className="relative">
//                                                 <CarouselContent>
//                                                     {blogCarouselImages.map((src, index) => (
//                                                         <CarouselItem key={`blog-img-${index}`}>
//                                                             <div className="mb-2 border rounded-lg overflow-hidden bg-[#23232a] border-[#3a3a45] aspect-video">
//                                                                 <img
//                                                                     src={src}
//                                                                     alt={
//                                                                         index === 0
//                                                                             ? post?.title || 'Blog image'
//                                                                             : `${post?.title || 'Blog'} — image ${index + 1}`
//                                                                     }
//                                                                     className="w-full h-full object-contain rounded-lg"
//                                                                     loading={index === 0 ? 'eager' : 'lazy'}
//                                                                     width={1200}
//                                                                     height={675}
//                                                                 />
//                                                             </div>
//                                                         </CarouselItem>
//                                                     ))}
//                                                 </CarouselContent>
//                                                 {blogCarouselImages.length > 1 && (
//                                                     <>
//                                                         <div className="absolute bottom-2 left-0 right-0 p-2">
//                                                             <div className="flex justify-center items-center gap-2 mt-2">
//                                                                 {Array.from({ length: blogCarouselImages.length }).map(
//                                                                     (_, index) => (
//                                                                         <button
//                                                                             key={index}
//                                                                             type="button"
//                                                                             className={`h-3 rounded-full ${current === index + 1 ? 'bg-[#00A8E9] w-10' : 'w-3 bg-gray-300'}`}
//                                                                             onClick={() => api?.scrollTo(index)}
//                                                                         />
//                                                                     )
//                                                                 )}
//                                                             </div>
//                                                         </div>
//                                                         <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 text-cblue border border-[#00A8E9]" />
//                                                         <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cblue border border-[#00A8E9]" />
//                                                     </>
//                                                 )}
//                                             </Carousel>
//                                         )}

//                                         {!isBlogPost &&
//                                             !showBlogImageGallery &&
//                                             primaryImage &&
//                                             inlineImgSrcs.length === 0 && (
//                                                 <div className="mb-2 border rounded-lg overflow-hidden bg-[#23232a] border-[#3a3a45]">
//                                                     <img
//                                                         src={primaryImage}
//                                                         alt={post?.title || 'Blog image'}
//                                                         className="w-full max-h-[420px] object-contain rounded-lg"
//                                                         loading="eager"
//                                                         width={1200}
//                                                         height={675}
//                                                     />
//                                                 </div>
//                                             )}

//                                         {post?.content_type === '4' && (
//                                             <Carousel setApi={setApi} className="relative">
//                                                 <CarouselContent>
//                                                     <CarouselItem>
//                                                         <div className="mb-2 border rounded-lg overflow-hidden bg-gray-900 border-gray-800 aspect-video">
//                                                             <img
//                                                                 src={primaryImage || post?.thumbnail_url}
//                                                                 className="w-full h-full object-cover rounded-lg"
//                                                                 {...({ fetchpriority: "high" } as Record<string, unknown>)}
//                                                                 loading="eager"
//                                                                 width={1200}
//                                                                 height={675}
//                                                             />
//                                                         </div>
//                                                     </CarouselItem>

//                                                     {post?.multi_file_uploads?.slice(1, 5)?.map((file, index) => (
//                                                         <CarouselItem key={index}>
//                                                             <div className="mb-2 border rounded-lg overflow-hidden cursor-pointer bg-gray-900 border-gray-800 aspect-video">
//                                                                 <img
//                                                                     src={file}
//                                                                     alt={`Post image ${index + 1}`}
//                                                                     className="w-full h-full object-cover rounded-lg"
//                                                                     loading="lazy"
//                                                                     width={1200}
//                                                                     height={675}
//                                                                 />
//                                                             </div>
//                                                         </CarouselItem>
//                                                     ))}
//                                                 </CarouselContent>
//                                                 {(post?.multi_file_uploads?.length ?? 0) > 1 && (
//                                                     <>
//                                                         <div className="absolute bottom-2 left-0 right-0 p-2">
//                                                             <div className="flex justify-center items-center gap-2 mt-2">
//                                                                 {Array.from({ length: count }).map((_, index) => (
//                                                                     <button
//                                                                         key={index}
//                                                                         className={`h-3 rounded-full ${current === index + 1 ? 'bg-[#00A8E9] w-10' : 'w-3 bg-gray-300'}`}
//                                                                         onClick={() => api?.scrollTo(index)}
//                                                                     />
//                                                                 ))}
//                                                             </div>
//                                                         </div>

//                                                         <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 text-cblue border border-[#00A8E9]" />
//                                                         <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cblue border border-[#00A8E9]" />
//                                                     </>
//                                                 )}
//                                             </Carousel>
//                                         )}

//                                         {post?.content_type === '2' && (
//                                             <div className="mb-4 border rounded-lg overflow-hidden relative">
//                                                 <video controls src={post?.resource_path} className="w-full rounded-lg" />
//                                             </div>
//                                         )}
//                                     </div>
//                                     <div className="border-t border-[#35353f] pt-4 mt-5">
//                                         <PostActions
//                                             post={{
//                                                 ...post,
//                                                 comment_count: fetchedComments?.length || 0
//                                             }}
//                                             onCommentClick={handleCommentClick}
//                                             onRepostClick={handleRepostClick}
//                                         />
//                                         <div className="mt-4">
//                                             <PostInteractionBar
//                                                 post={post}
//                                                 comment={comment}
//                                                 isSubmitting={sendCommentMutation.isPending}
//                                                 onCommentChange={handleCommentChange}
//                                                 onCommentSubmit={sendCommentHandler}
//                                                 onLikeClick={handleLikeClick}
//                                                 onRepostClick={handleRepostClick}
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Comments Section */}
//                             {toggleShowComments && fetchedComments && fetchedComments.length > 0 && (
//                                 <div className="mt-6 border-t border-gray-600 dark:border-gray-700 pt-6" id="comments-section">
//                                     <CommentsList
//                                         comments={fetchedComments}
//                                         visibleCount={visibleCommentsCount}
//                                         hasMore={hasMoreComments}
//                                         onLoadMore={loadMoreComments}
//                                     />
//                                 </div>
//                             )}
//                         </CardContent>
//                     </Card>}
//                     {post && isPublicBlogView && (
//                         <div className="w-full px-3 md:px-4 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
//                             <h4 className="text-white text-[26px] md:text-[40px] font-semibold leading-[1.08] tracking-[-0.01em] w-[330px] md:w-[360px] ml-1 md:ml-2 shrink-0">
//                                 Join the Creative Community!
//                             </h4>
//                             <div className="w-full md:w-[640px] md:max-w-[60%] shrink-0 rounded-2xl bg-[#1b1d23] border border-[#2f3038] p-2.5 flex items-center gap-2">
//                                 <input
//                                     type="email"
//                                     placeholder="Enter your Email"
//                                     className="h-12 md:h-14 flex-1 rounded-lg bg-[#2e3036] border border-[#3a3d45] px-4 md:px-5 text-sm md:text-[18px] text-white placeholder:text-gray-400 outline-none"
//                                 />
//                                 <button
//                                     type="button"
//                                     className="h-12 md:h-14 min-w-[120px] md:min-w-[170px] px-5 rounded-lg bg-[#1fb8ff] text-white text-sm md:text-[32px] font-semibold hover:bg-[#12a8ee] transition-colors whitespace-nowrap border border-[#38c3ff] leading-none"
//                                 >
//                                     Subscribe
//                                 </button>
//                             </div>
//                         </div>
//                     )}
//                     {
//                         !loading && !post && (
//                             <div className="text-center py-10">
//                                 <p className="text-gray-500 dark:text-gray-400">Post not found.</p>
//                             </div>
//                         )
//                     }
//                 </div>

//                 <div className="w-full md:w-[25%]">
//                     <RightSidePanel />
//                 </div>
//             </div>
//             {/* Repost Dialog */}
//             {post && (
//                 <RepostDialog
//                     post={post}
//                     open={showRepostDialog}
//                     onOpenChange={setShowRepostDialog}
//                 />
//             )}
//         </ConnectLayout>


//     );
// }

// export default BlogDetails;

import { Card, CardContent } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";
import { useEffect, useState, lazy, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import ConnectLayout from "../layouts";
import RightSidePanel from "../layouts/right-side-panel";
import PostActions from "../components/post-card/PostActions";
import PostInteractionBar from "../components/post-card/PostInteractionBar";
import CommentsList from "../components/post-card/CommentsList";
import SEO from "@/components/SEO/SEO";
import { useFetchPostComments, useLikePost, usePostDetails, useSendComment, useDeletePost } from "@/hooks/data/connect/usePosts";
import LoadingSection from "@/components/LoadingSection";
import formatRelativeOrLong from "@/utils/formatDate";
import { mergeBlogDescriptionWithServerUploads } from "@/utils/blogPostHtmlUpload";
import { getBlogFAQs } from "@/utils/blogFaqs";
import { EllipsisVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import appConfig from '@/configs/app.config';
import { useAuth } from '@/auth';
import Swal from 'sweetalert2';

const RepostDialog = lazy(() => import('../components/RepostDialog'));

// Utility function to strip HTML tags for meta descriptions
const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '').trim();
};

const generateKeywords = (title: string, description: string) => {
    const combined = `${title} ${stripHtml(description)}`;
    const words = combined.toLowerCase().split(/\W+/);
    const keywords = [...new Set(words)]
        .filter(word => word.length > 4) // Filter out short words
        .slice(0, 10); // Limit to 10 keywords
    return keywords.join(', ');
};

const truncateDescription = (description?: string) => {
    const plainText = stripHtml(description || '');
    return plainText.substring(0, 160) || 'Read this amazing article.';
};

/** Collect src URLs from inline <img> tags in rich-text HTML */
const extractImgSrcsFromHtml = (html: string): string[] => {
    if (!html) return [];
    const srcs: string[] = [];
    const re = /<img[^>]+src=["']([^"']+)["']/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) !== null) {
        srcs.push(m[1]);
    }
    return srcs;
};

const BlogDetails = () => {

    const { postId: paramPostId, slug } = useParams<{ postId: string; slug: string }>();
    const { search } = window.location;
    const isPublicBlogView = window.location.pathname.startsWith('/blogs/');

    // extract pid from query if paramPostId is not set
    let queryPostId = parseInt(search.replace('?', '').replace('pid=', ''));
    if (isNaN(queryPostId)) {
        queryPostId = parseInt(new URLSearchParams(search).get('pid') ?? '0');
    }
    const finalPostId = paramPostId || (queryPostId ? queryPostId.toString() : undefined);

    const navigate = useNavigate();
    const { user } = useAuth();
    const { mutate: deletePostMutation, isPending: isDeleting } = useDeletePost();
    const profileServiceid = appConfig?.organization?.profileServiceid;

    const { data: fetchedPost, isLoading: loading } = usePostDetails(finalPostId);

    const post = useMemo(() => {
        if (!fetchedPost) return null;
        const searchParams = new URLSearchParams(window.location.search);
        const url_created_at = searchParams.get('created_at');
        if (url_created_at) {
            return {
                ...fetchedPost,
                created_at: url_created_at,
            };
        }
        return fetchedPost;
    }, [fetchedPost]);

    // Enforce strict slug matching
    useEffect(() => {
        if (post && post.title) {
            const expectedSlug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            if (slug && slug !== expectedSlug) {
                const basePath = window.location.pathname.startsWith('/connect') ? '/connect/blogs' : '/blogs';
                navigate(`${basePath}/${expectedSlug}/pid${window.location.search}`, { replace: true });
            }
        }
    }, [post, slug, navigate]);

    const [comment, setComment] = useState('');
    const [toggleShowComments, setToggleShowComments] = useState(true);
    const [visibleCommentsCount, setVisibleCommentsCount] = useState(3);
    const [showRepostDialog, setShowRepostDialog] = useState(false);

    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    // Use optimized hooks from post-card
    const { data: fetchedComments = [] } = useFetchPostComments(Number(finalPostId), toggleShowComments);
    const likeMutation = useLikePost();
    const sendCommentMutation = useSendComment();
    const isBlogPost = post ? (String(post.content_type) === '21' || String(post.content_type) === '1') : false;

    // Callback handlers for post interactions
    const handleCopyPostLink = useCallback(() => {
        if (!post) return;
        const slug = post?.title ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'post';
        const postUrl = `${window.location.origin}/blogs/${slug}/pid?pid=${post.id}`;
        navigator.clipboard.writeText(postUrl);
        toast.success('Post link copied to clipboard!');
    }, [post]);

    const createdById = post ? Number(post.created_by) : 0;

    const handleViewProfile = useCallback(() => {
        if (createdById) {
            navigate(`/portfolio/${profileServiceid}/${createdById}`);
        }
    }, [navigate, profileServiceid, createdById]);

    const handleCopyProfileLink = useCallback(() => {
        const profileUrl = `${window.location.origin}/portfolio/${profileServiceid}/${createdById}`;
        navigator.clipboard.writeText(profileUrl);
        toast.success('Profile link copied to clipboard!');
    }, [profileServiceid, createdById]);

    const handleEditPost = useCallback(() => {
        if (!post) return;
        const composer = isBlogPost ? 'blog' : '';
        navigate(`/connect/add-buzz/${post.id}${composer ? `?composer=${composer}` : ''}`);
    }, [navigate, post]);


    const handleDeletePost = useCallback(async () => {
        if (!post) return;
        const result = await Swal.fire({
            title: `Delete ${isBlogPost ? 'Blog' : 'Post'}?`,
            text: `Are you sure you want to delete this ${isBlogPost ? 'blog' : 'post'}? This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            deletePostMutation(post.id);
        }
    }, [deletePostMutation, post]);

    const handleLikeClick = useCallback(() => {
        if (post) {
            likeMutation.mutate(post);
        }
    }, [likeMutation, post]);

    const handleCommentClick = useCallback(() => {
        setToggleShowComments(prev => !prev);
    }, []);

    const handleRepostClick = useCallback(() => {
        setShowRepostDialog(true);
    }, []);

    const sendCommentHandler = useCallback(() => {
        if (comment.trim() === '' || !post) return;
        sendCommentMutation.mutate({
            post: post,
            content: comment,
        });
        setComment('');
    }, [comment, post, sendCommentMutation]);

    const loadMoreComments = useCallback(() => {
        setVisibleCommentsCount(prev => prev + 3);
    }, []);

    const handleCommentChange = useCallback((value: string) => {
        setComment(value);
    }, []);

    const hasMoreComments = (fetchedComments?.length || 0) > visibleCommentsCount;
    const mediaUrls = [
        ...(post?.thumbnail_url ? [post.thumbnail_url] : []),
        ...(post?.multi_file_uploads ?? []),
        ...(post?.resource_path ? [post.resource_path] : []),
    ].filter(Boolean);
    const uniqueMediaUrls = Array.from(new Set(mediaUrls));
    const primaryImage = uniqueMediaUrls[0];
    const inlineImgSrcs = post?.description ? extractImgSrcsFromHtml(post.description) : [];
    const uniqueInlineImgSrcs = Array.from(new Set(inlineImgSrcs.filter(Boolean)));
    /** Multiple files from API (thumbnail + multi_file_uploads) */
    const showBlogCarouselFromServer =
        isBlogPost && uniqueMediaUrls.length > 1;
    /** Multiple inline <img> in body HTML (e.g. two data URLs) while API did not attach a multi-image gallery */
    const showBlogCarouselFromInlineOnly =
        isBlogPost &&
        uniqueMediaUrls.length <= 1 &&
        uniqueInlineImgSrcs.length > 1;
    const showBlogImageGallery = showBlogCarouselFromServer || showBlogCarouselFromInlineOnly;
    const blogCarouselImages = showBlogCarouselFromServer
        ? uniqueMediaUrls
        : showBlogCarouselFromInlineOnly
            ? uniqueInlineImgSrcs
            : [];
    const rawDescription =
        isBlogPost
            ? mergeBlogDescriptionWithServerUploads(
                post?.description ?? '',
                post?.multi_file_uploads
            )
            : (post?.description ?? '');
    const descriptionHtmlForBlog = rawDescription;
    const authorName = post ? `enCODE : ${post.name || post.created_by_name || "CODE Edu"}` : "enCODE : CODE Edu";
    const authorImage = post?.created_by_profile_image || post?.created_by_image;

    const isAeoBlog = useMemo(() => {
        return (
            slug?.toLowerCase() === 'aeo' ||
            post?.title?.toLowerCase() === 'aeo'
        );
    }, [slug, post]);

    const aeoSummaryText = "Summary Section: AI loves summaries. Key Takeaways: ✔ Speak confidently. ✔ Smile. ✔ Introduce yourself. ✔ Grab attention. ✔ End with a call to action.";

    const seoDescription = isAeoBlog
        ? `${aeoSummaryText} ${truncateDescription(post?.description || '')}`
        : truncateDescription(post?.description || '');

    const articleBodyText = isAeoBlog
        ? `${aeoSummaryText} ${stripHtml(post?.description || '')}`
        : stripHtml(post?.description || '');

    const seoKeywords = post?.tag
        ? post.tag.split(',').map(tag => tag.trim().replace(/^#+/, '')).join(', ')
        : generateKeywords(post?.title || '', post?.description || '');
    const shareUrl = window.location.href;
    const publishDate = post?.created_at ? new Date(Number(post.created_at) * 1000).toISOString().split('T')[0] : undefined;
    const faqs = useMemo(() => getBlogFAQs(post), [post]);


    useEffect(() => {
        if (!api) {
            return
        }
        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])


    return (
        <ConnectLayout active='encode'>
            <div className="w-full flex flex-col md:flex-row pb-6 gap-5">
                <div className="w-full md:w-[75%] space-y-6">
                    <LoadingSection isLoading={loading} title="Post Details" />
                    {post && (
                        <>
                            <SEO
                                title={`${post.title} | enCODE Blog`}
                                description={seoDescription}
                                author={authorName}
                                url={shareUrl}
                                canonical={shareUrl}
                                image={primaryImage || post.thumbnail_url || 'https://encode.codeedu.co/img/logo/logo-light-full.png'}
                                type="article"
                                publishDate={publishDate}
                                twitterHandle="@codeeduofficial"
                                aeoType="BlogPosting"
                                authorDetails={{
                                    type: 'Person',
                                    name: post.name || post.created_by_name || "CODE Edu",
                                    profilePhoto: authorImage || undefined
                                }}
                                breadcrumbs={[
                                    { name: window.location.pathname.startsWith('/connect') ? "Connect Blogs" : "Blogs", path: window.location.pathname.startsWith('/connect') ? '/connect/blogs' : '/blogs' },
                                    { name: post.title }
                                ]}
                                speakableSelectors={[".blog-title", ".blog-content"]}
                                articleBody={articleBodyText}
                                keywords={seoKeywords}
                                articleSection={post?.tag?.split(',')[0]?.trim().replace(/^#+/, '') || undefined}
                                faqData={faqs}
                                readingTime={post.read_time ? `${post.read_time} minutes` : "4 minutes"}
                            />
                            <Helmet>
                                {/* Preload critical LCP image */}
                                {primaryImage && (
                                    <link
                                        rel="preload"
                                        as="image"
                                        href={primaryImage}
                                        fetchPriority="high"
                                    />
                                )}
                            </Helmet>
                        </>
                    )}
                    {post && <Card className="shadow-none rounded-lg bg-[#1b1b1f] border border-[#2c2c35]">
                        <CardContent className="p-4 md:p-5">
                            <div className='flex gap-4 items-start'>
                                <div className='flex-1'>
                                    <div className="mb-5 relative">
                                        <h1 className="text-xl md:text-[30px] font-semibold mb-3 text-white leading-tight text-center px-10 md:px-16 blog-title">
                                            {post?.title}
                                        </h1>
                                        <div className="absolute top-0 right-0">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                                                    <EllipsisVertical className="w-5 h-5 text-gray-400" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    {Number(user?.id) !== Number(createdById) ? (
                                                        <>
                                                            <DropdownMenuItem className="cursor-pointer" onClick={handleViewProfile}>
                                                                View Profile
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="cursor-pointer" onClick={handleCopyProfileLink}>
                                                                Copy Profile Link
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="cursor-pointer" onClick={handleCopyPostLink}>
                                                                Copy Blog URL
                                                            </DropdownMenuItem>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <DropdownMenuItem className="cursor-pointer" onClick={handleCopyPostLink}>
                                                                Copy Blog URL
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="cursor-pointer" onClick={handleEditPost}>
                                                                Edit {isBlogPost ? 'Blog' : 'Post'}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                                                                disabled={isDeleting}
                                                                onClick={handleDeletePost}
                                                            >
                                                                {isDeleting ? 'Deleting...' : `Delete ${isBlogPost ? 'Blog' : 'Post'}`}
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <div className="mb-5 flex items-center justify-center gap-2 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {authorImage ? (
                                                    <img
                                                        src={authorImage}
                                                        alt={authorName}
                                                        className="w-7 h-7 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-7 h-7 rounded-full bg-gray-500/30 flex items-center justify-center">
                                                        <span className="text-xs font-semibold text-white">
                                                            {authorName.replace('enCODE : ', '').charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                                <span className="text-sm md:text-base font-medium text-gray-200">{authorName}</span>
                                            </div>
                                            {post?.created_at ? (
                                                <span className="text-sm md:text-base text-gray-300">• {formatRelativeOrLong(post.created_at)}</span>
                                            ) : null}
                                        </div>
                                        <div
                                            className={`text-[14px] md:text-[15px] leading-7 text-gray-200 prose prose-invert max-w-none
                                            prose-p:my-0 prose-div:my-0 prose-br:leading-7
                                            prose-strong:font-semibold prose-strong:text-white
                                            prose-headings:text-white prose-headings:font-semibold
                                            prose-h1:text-2xl prose-h1:md:text-3xl prose-h1:text-center prose-h1:mb-4
                                            prose-h2:text-xl prose-h2:md:text-2xl prose-h2:mt-6 prose-h2:mb-3
                                            prose-h3:text-lg prose-h3:md:text-xl prose-h3:mt-5 prose-h3:mb-2
                                            prose-ul:list-disc prose-ul:pl-5 prose-ul:my-2
                                            prose-ol:list-decimal prose-ol:pl-5 prose-ol:my-2
                                            prose-li:my-1 prose-a:text-[#00A8E9]
                                            [&>div]:leading-7 [&>div]:text-gray-200 [&>div]:mb-3
                                            [&>p]:leading-7 [&>p]:text-gray-200 [&>p]:mb-3
                                            blog-img-prose blog-img-prose--detail blog-content`}
                                            dangerouslySetInnerHTML={{ __html: descriptionHtmlForBlog }}
                                        />
                                        {post?.tag && (
                                            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-8 mb-4">
                                                {post.tag.split(',').map((tag, index) => (
                                                    <span key={index} className="text-primary font-medium hover:underline cursor-pointer transition-colors">
                                                        {tag.trim().replace(/^#+/, '')}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {/* {faqs && faqs.length > 0 && (
                                            <div className="mt-12 pt-8 border-t border-gray-800 faq-section">
                                                <h2 className="text-2xl font-bold font-jacques mb-6 text-white">Frequently Asked Questions</h2>
                                                <div className="space-y-6">
                                                    {faqs.map((faq, index) => (
                                                        <div key={index} className="space-y-2">
                                                            <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                                                            <p className="text-gray-300 text-sm leading-relaxed">{faq.answer}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )} */}
                                    </div>
                                    <div className='mb-3'>
                                        {!isBlogPost && showBlogImageGallery && blogCarouselImages.length > 0 && (
                                            <Carousel setApi={setApi} className="relative">
                                                <CarouselContent>
                                                    {blogCarouselImages.map((src, index) => (
                                                        <CarouselItem key={`blog-img-${index}`}>
                                                            <div className="mb-2 border rounded-lg overflow-hidden bg-[#23232a] border-[#3a3a45] aspect-video">
                                                                <img
                                                                    src={src}
                                                                    alt={
                                                                        index === 0
                                                                            ? post?.title || 'Blog image'
                                                                            : `${post?.title || 'Blog'} — image ${index + 1}`
                                                                    }
                                                                    className="w-full h-full object-contain rounded-lg"
                                                                    loading={index === 0 ? 'eager' : 'lazy'}
                                                                    width={1200}
                                                                    height={675}
                                                                    onError={(e) => {
                                                                        const target = e.target as HTMLImageElement;
                                                                        target.style.display = 'none';
                                                                        if (target.parentElement) target.parentElement.style.display = 'none';
                                                                    }}
                                                                />
                                                            </div>
                                                        </CarouselItem>
                                                    ))}
                                                </CarouselContent>
                                                {blogCarouselImages.length > 1 && (
                                                    <>
                                                        <div className="absolute bottom-2 left-0 right-0 p-2">
                                                            <div className="flex justify-center items-center gap-2 mt-2">
                                                                {Array.from({ length: blogCarouselImages.length }).map(
                                                                    (_, index) => (
                                                                        <button
                                                                            key={index}
                                                                            type="button"
                                                                            className={`h-3 rounded-full ${current === index + 1 ? 'bg-[#00A8E9] w-10' : 'w-3 bg-gray-300'}`}
                                                                            onClick={() => api?.scrollTo(index)}
                                                                        />
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                        <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 text-cblue border border-[#00A8E9]" />
                                                        <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cblue border border-[#00A8E9]" />
                                                    </>
                                                )}
                                            </Carousel>
                                        )}

                                        {!isBlogPost &&
                                            !showBlogImageGallery &&
                                            primaryImage &&
                                            inlineImgSrcs.length === 0 && (
                                                <div className="mb-2 border rounded-lg overflow-hidden bg-[#23232a] border-[#3a3a45]">
                                                    <img
                                                        src={primaryImage}
                                                        alt={post?.title || 'Blog image'}
                                                        className="w-full max-h-[420px] object-contain rounded-lg"
                                                        loading="eager"
                                                        width={1200}
                                                        height={675}
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                            if (target.parentElement) target.parentElement.style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                            )}

                                        {post?.content_type === '4' && (
                                            <Carousel setApi={setApi} className="relative">
                                                <CarouselContent>
                                                    <CarouselItem>
                                                        <div className="mb-2 border rounded-lg overflow-hidden bg-gray-900 border-gray-800 aspect-video">
                                                            <img
                                                                src={primaryImage || post?.thumbnail_url}
                                                                className="w-full h-full object-cover rounded-lg"
                                                                {...({ fetchpriority: "high" } as Record<string, unknown>)}
                                                                loading="eager"
                                                                width={1200}
                                                                height={675}
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.style.display = 'none';
                                                                    if (target.parentElement) target.parentElement.style.display = 'none';
                                                                }}
                                                            />
                                                        </div>
                                                    </CarouselItem>

                                                    {post?.multi_file_uploads?.slice(1, 5)?.map((file, index) => (
                                                        <CarouselItem key={index}>
                                                            {file && <div className="mb-2 border rounded-lg overflow-hidden cursor-pointer bg-gray-900 border-gray-800 aspect-video">
                                                                <img
                                                                    src={file}
                                                                    alt={`Post image ${index + 1}`}
                                                                    className="w-full h-full object-cover rounded-lg"
                                                                    loading="lazy"
                                                                    width={1200}
                                                                    height={675}
                                                                    onError={(e) => {
                                                                        const target = e.target as HTMLImageElement;
                                                                        target.style.display = 'none';
                                                                        if (target.parentElement) target.parentElement.style.display = 'none';
                                                                    }}
                                                                />
                                                            </div>}
                                                        </CarouselItem>
                                                    ))}
                                                </CarouselContent>
                                                {(post?.multi_file_uploads?.length ?? 0) > 1 && (
                                                    <>
                                                        <div className="absolute bottom-2 left-0 right-0 p-2">
                                                            <div className="flex justify-center items-center gap-2 mt-2">
                                                                {Array.from({ length: count }).map((_, index) => (
                                                                    <button
                                                                        key={index}
                                                                        className={`h-3 rounded-full ${current === index + 1 ? 'bg-[#00A8E9] w-10' : 'w-3 bg-gray-300'}`}
                                                                        onClick={() => api?.scrollTo(index)}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 text-cblue border border-[#00A8E9]" />
                                                        <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cblue border border-[#00A8E9]" />
                                                    </>
                                                )}
                                            </Carousel>
                                        )}

                                        {post?.content_type === '2' && (
                                            <div className="mb-4 border rounded-lg overflow-hidden relative">
                                                <video controls src={post?.resource_path} className="w-full rounded-lg" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="border-t border-[#35353f] pt-4 mt-5">
                                        <PostActions
                                            post={{
                                                ...post,
                                                comment_count: fetchedComments?.length || 0
                                            }}
                                            onCommentClick={handleCommentClick}
                                            onRepostClick={handleRepostClick}
                                        />
                                        <div className="mt-4">
                                            <PostInteractionBar
                                                post={post}
                                                comment={comment}
                                                isSubmitting={sendCommentMutation.isPending}
                                                onCommentChange={handleCommentChange}
                                                onCommentSubmit={sendCommentHandler}
                                                onLikeClick={handleLikeClick}
                                                onRepostClick={handleRepostClick}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Comments Section */}
                            {toggleShowComments && fetchedComments && fetchedComments.length > 0 && (
                                <div className="mt-6 border-t border-gray-600 dark:border-gray-700 pt-6" id="comments-section">
                                    <CommentsList
                                        comments={fetchedComments}
                                        visibleCount={visibleCommentsCount}
                                        hasMore={hasMoreComments}
                                        onLoadMore={loadMoreComments}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>}
                    {post && isPublicBlogView && (
                        <div className="w-full px-3 md:px-4 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
                            <h4 className="text-white text-[26px] md:text-[40px] font-semibold leading-[1.08] tracking-[-0.01em] w-[330px] md:w-[360px] ml-1 md:ml-2 shrink-0">
                                Join the Creative Community!
                            </h4>
                            <div className="w-full md:w-[640px] md:max-w-[60%] shrink-0 rounded-2xl bg-[#1b1d23] border border-[#2f3038] p-2.5 flex items-center gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your Email"
                                    className="h-12 md:h-14 flex-1 rounded-lg bg-[#2e3036] border border-[#3a3d45] px-4 md:px-5 text-sm md:text-[18px] text-white placeholder:text-gray-400 outline-none"
                                />
                                <button
                                    type="button"
                                    className="h-12 md:h-14 min-w-[120px] md:min-w-[170px] px-5 rounded-lg bg-[#1fb8ff] text-white text-sm md:text-[32px] font-semibold hover:bg-[#12a8ee] transition-colors whitespace-nowrap border border-[#38c3ff] leading-none"
                                >
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    )}
                    {
                        !loading && !post && (
                            <div className="text-center py-10">
                                <p className="text-gray-500 dark:text-gray-400">Post not found.</p>
                            </div>
                        )
                    }
                </div>

                <div className="w-full md:w-[25%]">
                    <RightSidePanel />
                </div>
            </div>
            {/* Repost Dialog */}
            {post && (
                <RepostDialog
                    post={post}
                    open={showRepostDialog}
                    onOpenChange={setShowRepostDialog}
                />
            )}
        </ConnectLayout>


    );
}

export default BlogDetails;
