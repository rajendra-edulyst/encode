import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/shadcnAvatar";
import { stripHtmlTags } from "@/utils/stripHtmlTags";
import { EllipsisVertical, MessageCircle, ThumbsUp } from "lucide-react";
import { Post } from "@community/types/community";
import { Button } from "@/components/ui/ShadcnButton";
import { useMyPostsStore } from "@community/store/communityStore";
import { BiSolidLike } from "react-icons/bi";
import { Link } from "react-router-dom";
import { formatApiDate } from "../../utils/dateFormat";

interface PostCardProps {
    post: Post
}

const PostView: React.FC<PostCardProps> = ({
    post
}) => {

    const { likePost, deletePost } = useMyPostsStore();

    return (
        <Card className="p-4 shadow-none border-x-0 border-t-0 border-b-[1px] border-[#FFDCF0] rounded-none px-0">
            <div className='flex gap-4 items-start'>
                <div className='flex-1'>
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <Link to={`/community/mycommunities/${post?.category_id}`}>
                                <div className='flex gap-2  mb-2 rounded-lg overflow-hidden cursor-pointer'>
                                    <img src='/img/icons/people.png' className='w-5 h-5' /> {post?.category_name || 'Community Name'}
                                </div>
                            </Link>
                            <Link to={`/community/myposts/${post.id}`} className="flex justify-between items-start cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={post.profile_image ?? `https://ui-avatars.com/api/?name=${post.name}`} alt={post.name} />
                                        <AvatarFallback>{post?.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center text-xs text-cblack">
                                            <span className='capitalize'>{post.name}</span>
                                            <span className="mx-1">•</span>
                                            <span>{post?.created_at && <span>{formatApiDate(post.created_at)}</span>}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger><EllipsisVertical className="h-4 w-4 text-cblack" /></DropdownMenuTrigger>
                            <DropdownMenuContent className='w-40' side='left' align='start'>
                                <DropdownMenuItem className='cursor-pointer' onClick={() => deletePost(post.id)}>
                                    <span className='text-[#FF0000]'>Delete Post</span></DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="mb-3 cursor-pointer">
                        <Link to={`/community/myposts/${post.id}`}>
                            <h3 className="text-lg font-semibold mb-1 text-cblack">{post.title}</h3>
                            <p className="text-sm line-clamp-2 text-cblack">{stripHtmlTags(post.description) || ''}</p>
                        </Link>
                    </div>
                    <div className='mb-3 cursor-pointer'>
                        <Link to={`/community/myposts/${post.id}`}>
                            {post.thumbnail_url && (
                                <img src={post.thumbnail_url} alt={post.title} className="w-full object-cover rounded-lg h-96" />
                            )}
                        </Link>
                    </div>
                    <div className="flex items-center text-sm text-cblack gap-1">
                        <Button variant="ghost" size="sm" onClick={() => likePost(post.id, post?.user_liked ? 'unlike' : 'like')}>
                            {post.user_liked ? <BiSolidLike size={20} strokeWidth={1} className='text-primary' /> : <ThumbsUp size={20} strokeWidth={1.5} />}
                            {post?.like_count} Like
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                            <Link to={`/community/myposts/${post.id}`}>
                                <MessageCircle size={20} strokeWidth={1.5} />
                                <span>{post.comment_count || '0'} comments</span>
                            </Link>
                        </Button>
                        {/* <div className="flex items-center gap-1 cursor-pointer">
                            <Repeat2 size={20} strokeWidth={1.5} />
                            <span>{post?.repost_count || '0'} repost</span>
                        </div> */}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default PostView;