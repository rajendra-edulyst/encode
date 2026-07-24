import { Button } from "@/components/ui/ShadcnButton";
import { MessageCircle, Repeat2, Share, ThumbsUp } from "lucide-react";
import { memo, useState } from "react";
import { BiSolidLike } from "react-icons/bi";
import { Post } from "../../types/community";
import ShareData from "../ShareData";
import { useLikePost } from "../../@hooks/usePost";

interface PostActionsProps {
    post: Post;
    onCommentToggle: () => void;
    onRepost: () => void;
}

// Post Actions Component
const PostActions: React.FC<PostActionsProps> = ({ post, onCommentToggle, onRepost }) => {

    const is_repost = post?.repost_id !== null;
    const [shareOpen, setShareOpen] = useState(false);

    const likeMutation = useLikePost();


    return (
        <div className="border-t-[0.5px] border-gray-200 pt-3">
            {!is_repost && (
                <div className="flex items-center gap-6 text-sm text-[#273454]">
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => likeMutation.mutate(post)}>
                        {post?.user_liked ? (
                            <BiSolidLike size={20} className="text-primary" />
                        ) : (
                            <ThumbsUp size={20} strokeWidth={1.5} />
                        )}
                        <p>{post?.like_count} <span className="hidden md:inline">Like</span></p>
                    </div>

                    <div className="flex items-center gap-1 cursor-pointer" onClick={onCommentToggle}>
                        <MessageCircle size={20} strokeWidth={1.5} />
                        <p>{post?.comment_count} <span className="hidden md:inline">Comment</span></p>
                    </div>

                    <div className="flex items-center gap-1 cursor-pointer" onClick={onRepost}>
                        <Repeat2 size={20} strokeWidth={1.5} />
                        <p>{post?.repost_count} <span className="hidden md:inline">Repost</span></p>
                    </div>

                    <div className="flex items-center gap-1 cursor-pointer"
                        onClick={() => setShareOpen(true)}
                    >
                        <Share size={20} strokeWidth={1.5} />
                        <p>{post?.share_count} <span className="hidden md:inline">Share</span></p>
                    </div>
                </div>
            )}
            {is_repost && <div className="flex items-center text-sm text-cblack gap-1">
                <Button variant="ghost" size="sm" onClick={() => likeMutation.mutate(post)}>
                    {post?.is_user_repost_like ? <BiSolidLike size={20} className="text-primary" /> : <ThumbsUp size={20} strokeWidth={1.5} />}
                    {post?.repost_like} Like
                </Button>
                <Button variant="ghost" size="sm" onClick={onCommentToggle}>
                    <MessageCircle size={20} strokeWidth={1.5} />
                    {post?.repost_comments} Comment
                </Button>
                <div className="flex items-center gap-1 cursor-pointer"
                    onClick={() => setShareOpen(true)}
                >
                    <Share size={20} strokeWidth={1.5} />
                    <span>{post?.share_count} Share</span>
                </div>
            </div>
            }
            <ShareData
                content={`${window.location.origin}/community/wall/post/${post.id}`}
                open={shareOpen}
                onOpenChange={setShareOpen}
            />
        </div>
    );
};

export default memo(PostActions);