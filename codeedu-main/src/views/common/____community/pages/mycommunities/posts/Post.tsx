import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/shadcnAvatar";
import { stripHtmlTags } from "@/utils/stripHtmlTags";
import { EllipsisVertical} from "lucide-react";
import { Post as PostType } from "@community/types/community";
// import { Button } from "@/components/ui/ShadcnButton";
// import { useCommunitiesStore } from "@community/store/communityStore";
// import { BiSolidLike } from "react-icons/bi";
import { Link } from "react-router-dom";
import { formatApiDate } from "../../../utils/dateFormat";

interface PostProps {
    post: PostType,
}

const Post: React.FC<PostProps> = ({ post }) => {

    if (!post) {
        return null;
    }

    // const { likePost } = useCommunitiesStore();


    return (
        <Card className="p-4 shadow-none border-x-0 border-t-0 border-b-[1px] border-[#FFDCF0] rounded-none py-6 px-0">
            <div className='flex gap-4 items-start'>
               
                <Link to={`/community/mycommunities/${post?.category_id}/post/${post?.id}`} className='flex-shrink-0 border rounded-lg overflow-hidden cursor-pointer'>
                    {post.thumbnail_url && (
                        <img src={post.thumbnail_url} alt={post.title} className="w-28 object-cover rounded-lg" />
                    )}
                </Link>
                <div className='flex-1'>
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            {post?.category_name && <Link to={`/community/mycommunities/${post?.category_id}`}>
                                <div className='flex gap-2  mb-2 rounded-lg overflow-hidden cursor-pointer'>
                                    <img src='/img/icons/people.png' className='w-5 h-5' /> {post?.category_name || 'Community Name'}
                                </div>
                            </Link>}
                            <Link to={`/community/mycommunities/${post?.category_id}/post/${post?.id}`}>
                                <div className="flex justify-between items-start cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={post.profile_image ?? `https://ui-avatars.com/api/?name=${post?.created_by_name}`} alt={post.name} />
                                            <AvatarFallback>{post?.created_by_name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center text-xs text-cblack">
                                                <span className='capitalize'>{post?.created_by_name}</span>
                                                <span className="mx-1">•</span>
                                                <span>{post?.created_at && formatApiDate(post?.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger><EllipsisVertical className="h-4 w-4 text-cblack" /></DropdownMenuTrigger>
                            <DropdownMenuContent className='w-40' side='left' align='start'>
                                <DropdownMenuItem>Follow @{post?.created_by_name}</DropdownMenuItem>
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                <DropdownMenuItem>Copy Profile link</DropdownMenuItem>
                                <DropdownMenuItem>Hide this post</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <span className='text-[#FF0000]'>Report</span></DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="mb-3 cursor-pointer">
                        <Link to={`/community/mycommunities/${post?.category_id}/post/${post?.id}`}>
                            <h3 className="text-lg font-semibold mb-1 text-cblack">{post.title}</h3>
                            <p className="text-sm line-clamp-2 text-cblack">{stripHtmlTags(post.description) || ''}</p>
                        </Link>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default Post;