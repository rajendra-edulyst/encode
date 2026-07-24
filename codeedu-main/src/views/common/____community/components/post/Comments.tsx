import Loading from "@/components/shared/Loading";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/shadcnAvatar";
import { Button } from "@/components/ui/ShadcnButton";
import { Dot, SendHorizontal } from "lucide-react";
import { useState } from "react";
import { PostComment } from "../../types/community";
import { formatApiDate } from "../../utils/dateFormat";
import { useSessionUser } from "@/store/authStore";

interface CommentSectionProps {
    postId: number;
    loading: boolean;
    comments: PostComment[];
    sendComment: (postId: number, comment: string, isRepost?: boolean) => void;
    repost_id?: number | null;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, loading, comments, sendComment, repost_id }) => {

    const [loadMoreComment, setLoadMoreComment] = useState(2);
    const [comment, setComment] = useState("");
    const { profile_image, name } = useSessionUser((state) => state.user);

    const post_id = repost_id ? repost_id : postId;
    const isRepost = repost_id ? true : false || repost_id !== null || repost_id !== undefined;

    return (
        <>
            {loading && <Loading loading={loading} />}
            <AnimatePresence>
                {comments && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
                        <div className="mt-6" id="comments-section">
                            <h1 className="text-cblack text-base font-normal">{comments.length} Comments</h1>
                            <div className="mt-4 flex items-center gap-2">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={profile_image ?? `https://ui-avatars.com/api/?name=${name}`} alt={name} />
                                    <AvatarFallback>{name?.charAt(0) ?? "U"}</AvatarFallback>
                                </Avatar>
                                <div className="relative w-full border-b border-gray-300 pb-1">
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        className="w-full h-10 px-3 rounded-none focus:outline-none focus:ring-0"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && comment.trim()) {
                                                e.preventDefault();
                                                sendComment(post_id, comment.trim(), isRepost);
                                                setComment("");
                                            }
                                        }}
                                    />
                                    <Button
                                        variant="ghost"
                                        className="absolute right-1 text-cblue"
                                        disabled={!comment.trim()}
                                        onClick={() => { sendComment(post_id, comment.trim(), isRepost); setComment(""); }}
                                    >
                                        <SendHorizontal />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2 mt-6">
                                {comments.slice(0, loadMoreComment).map((comment, index) => (
                                    <div key={index} className="flex justify-between items-start gap-4 pb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-1 mb-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={comment.profile_image ?? `https://ui-avatars.com/api/?name=${comment.name}`} alt={comment.name} />
                                                    <AvatarFallback>{comment.name?.charAt(0) ?? "A"}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex items-center text-xs text-cblack">
                                                    <p>{comment.name ?? "Anonymous"}</p>
                                                    <Dot />
                                                    <span>{formatApiDate(comment?.created_at?.toString() || '')}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm">{comment.content ?? "No content"}</p>
                                        </div>
                                    </div>
                                ))}
                                {comments.length > loadMoreComment && (
                                    <Button variant="ghost" size="sm" onClick={() => setLoadMoreComment(loadMoreComment + 2)}>
                                        Load more comments
                                    </Button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CommentSection;