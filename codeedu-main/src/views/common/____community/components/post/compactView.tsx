import React, { useCallback, useState } from 'react'
import { Post, PostComment } from '@community/types/community';
import { Card } from '@/components/ui/card';
import { stripHtmlTags } from '@/utils/stripHtmlTags';
import { usePostsStore } from '@community/store/postStore';
import { Button } from '@/components/ui/ShadcnButton';
import { Link } from 'react-router-dom';
import { fetchPostComments } from '../../services/CommunityService';
import { toast } from 'sonner';
import { useSessionUser } from '@/store/authStore';
import RePost from '../repost';
import PostHeader from './PostHeader';
import Comments from './Comments';
import PostActions from './PostActions';

interface PostCompactViewProps {
    post: Post
    is_repost?: boolean;
}

const PostCompactView: React.FC<PostCompactViewProps> = ({ post, is_repost }) => {

    const { likeDislikePost, deletePost, sendComment } = usePostsStore();


    const [openRepostDialog, setOpenRepostDialog] = useState(false);
    const [viewMore, setViewMore] = useState(false);
    const [comments, setComments] = useState<PostComment[]>([]);
    const [loading, setLoading] = useState(false);
    const [showComments, setShowComments] = useState(false);

    const sendPostComment = (postId: number, comment: string) => {
        if (!comment.trim()) return;
        sendComment(postId, comment.trim());
        getPostComments();
    }

    const getPostComments = useCallback(async () => {
        if (!post.id) return;
        try {
            setLoading(true);
            const response = await fetchPostComments(post.repost_id || post.id);
            setComments(response);
        } catch (error) {
            console.error("Error fetching comments:", error);
            toast.error("Failed to fetch comments. Please try again later.");
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [post.id, post.repost_id, fetchPostComments, setComments]);

    const { id } = useSessionUser((state) => state.user)

    return (
        <>
            <Card className="p-4 shadow-none border-x-0 border-t-0 border-b-[1px] border-[#FFDCF0] rounded-none py-6 px-0">
                <div className='flex gap-4 items-start'>
                    <Link to={`/community/wall/post/${post.id}`} className='flex-shrink-0 border rounded-lg overflow-hidden cursor-pointer' onClick={() => window.scrollTo(0, 0)}>
                        {post.thumbnail_url && (
                            <img src={post.thumbnail_url} alt={post.title} className="w-44 h-40 object-cover rounded-lg" />
                        )}
                    </Link>
                    <div className='flex-1'>
                        <PostHeader post={post} isRepost={is_repost} userId={id} onDelete={deletePost} />
                        <Link to={`/community/wall/post/${post.id}`} className="cursor-pointer mb-1" onClick={() => window.scrollTo(0, 0)}>
                            <h3 className="text-lg font-semibold mb-1 text-cblack">{post.title}</h3>
                        </Link>
                        {!viewMore && <p className="text-sm line-clamp-2 text-cblack">{stripHtmlTags(post.description)}</p>}
                        {viewMore && (
                            <p className="text-sm text-cblack" dangerouslySetInnerHTML={{ __html: post.description}}></p>
                        )}
                        {
                            stripHtmlTags(post.description).length > 320 &&
                            <Button variant="link" size="sm" className="text-primary hover:underline px-0 py-0" onClick={() => setViewMore(!viewMore)}>
                                {viewMore ? 'Show less' : 'Read more'}
                            </Button>
                        }
                        <PostActions
                            post={post}
                            onLike={() => likeDislikePost(post)}
                            onCommentToggle={() => {
                                setShowComments(!showComments);
                                if (!comments.length) {
                                    getPostComments();
                                }
                            }}
                            onRepost={() => setOpenRepostDialog(true)}
                        />
                    </div>
                </div>
                {comments && showComments && <Comments
                    postId={post.id}
                    loading={loading}
                    comments={comments}
                    sendComment={sendPostComment}
                />}
            </Card>
            <RePost post={post} open={openRepostDialog} onOpenChange={setOpenRepostDialog} />
        </>

    )
}

export default PostCompactView