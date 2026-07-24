import { memo, useState } from "react";
import { Post } from "../../types/community";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/shadcnAvatar";
import { formatApiDate } from "../../utils/dateFormat";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Pin } from "lucide-react";
import { toast } from "sonner";
import RePost from "../repost";

interface PostHeaderProps {
    post: Post;
    isRepost?: boolean;
    userId: number | null;
    onDelete: (postId: number) => void;
}

const PostHeader: React.FC<PostHeaderProps> = ({ post, isRepost, userId, onDelete }) => {

    const categoryId = isRepost ? post.repost_category_id : post.category_id;
    const categoryName = isRepost ? post.repost_category_name : post.category_name;
    const userName = isRepost ? post.repost_user_name : post.name;
    const profileImage = isRepost ? post.repost_user_profile_image : post.user_profile_image;
    const createdBy = isRepost ? post.repost_user_id : post.created_by;
    const createdAt = isRepost ? post.repost_created_at : post.created_at;
    const [editRepostOpen, setEditRepostOpen] = useState(false);

    const { useQueryClient } = require('@tanstack/react-query');
    const queryClient = useQueryClient();
    const handlePinPost = async () => {
        try {
            const { pinPost } = await import('@/services/connect/PostService');
            const newPinStatus = Number(post?.is_pin) === 1 ? 0 : 1;
            await pinPost({ joy_content_id: post.id, is_pin: newPinStatus });
            toast.success(newPinStatus === 1 ? 'Post pinned successfully!' : 'Post unpinned successfully!');
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['pinned-posts'] });
        } catch (error) {
            toast.error('Failed to pin post.');
        }
    };

    return (
        <>
            <div className="flex justify-between items-start mb-2">
                <div>
                    {categoryName && <Link to={`/community/mycommunities/${categoryId}`}>
                        <div className="flex gap-2 mb-2 rounded-lg overflow-hidden cursor-pointer">
                            <img src="/img/icons/people.png" className="w-5 h-5" alt="Community Icon" />
                            <span>{categoryName}</span>
                        </div>
                    </Link>
                    }
                    <Link to={`/portfolio/${createdBy}`}>
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={profileImage ?? `https://ui-avatars.com/api/?name=${userName}`} alt={userName ?? "User"} className="object-cover" />
                                <AvatarFallback>{userName?.charAt(0) ?? "U"}</AvatarFallback>
                            </Avatar>
                            <div className="flex items-center text-xs text-cblack">
                                <span className="capitalize">{userName ?? "Anonymous"}</span>
                                <span className="mx-1">•</span>
                                <span>{createdAt && formatApiDate(createdAt)}</span>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    {Number(post?.is_pin) === 1 && <Pin size={20} strokeWidth={1.5} className="text-[#FF0000] cursor-pointer" onClick={handlePinPost} />}
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <EllipsisVertical className="h-4 w-4 text-cblack" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40" side="left" align="start">
                            {userId !== Number(createdBy) ? (
                                <>
                                    <DropdownMenuItem>
                                        <Link to={`/portfolio/${createdBy}`}>View Profile</Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() => {
                                            navigator.clipboard.writeText(`${window.location.origin}/portfolio/${createdBy}`);
                                            toast.success("Profile link copied successfully!", {
                                                position: "bottom-right",
                                            });
                                        }}
                                    >
                                        Copy Profile link
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {/* <DropdownMenuItem className="cursor-pointer" onClick={handlePinPost}>
                                        {Number(post?.is_pin) === 1 ? 'Unpin Post' : 'Pin Post'}
                                    </DropdownMenuItem> */}
                                </>
                            ) : (
                                <>
                                    {/* <DropdownMenuItem className="cursor-pointer" onClick={handlePinPost}>
                                        {Number(post?.is_pin) === 1 ? 'Unpin Post' : 'Pin Post'}
                                    </DropdownMenuItem> */}
                                    {!isRepost && (
                                        <Link to={`/community/myposts/createpost?id=${post.id}`} className="w-full">
                                            <DropdownMenuItem className="cursor-pointer">
                                                Edit Post
                                            </DropdownMenuItem>
                                        </Link>
                                    )}
                                    {isRepost && (
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={() => setEditRepostOpen(true)}
                                        >
                                            Edit Repost
                                        </DropdownMenuItem>
                                    )}

                                    <DropdownMenuItem className="cursor-pointer" onClick={() => onDelete(post.id)}>
                                        <span className="text-[#FF0000]">{isRepost ? "Delete Repost" : "Delete Post"}</span>
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            {isRepost && (
                <RePost
                    post={post}
                    open={editRepostOpen}
                    isEdit={true}
                    onOpenChange={setEditRepostOpen}
                />
            )}
        </>
    );
};

export default memo(PostHeader);