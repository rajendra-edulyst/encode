import { Button } from '@/components/ui/ShadcnButton';
import formatRelativeOrLong from '@/utils/formatDate';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import appConfig from '@/configs/app.config';

interface PostComment {
    id: number;
    profile_image: string | null;
    user_name: string;
    name: string;
    content: string;
    created_at: string | Date | null;
    user_id: number;
}

interface CommentsListProps {
    comments: PostComment[];
    visibleCount: number;
    hasMore: boolean;
    onLoadMore: () => void;
}

const CommentsList: React.FC<CommentsListProps> = React.memo(({
    comments,
    visibleCount,
    hasMore,
    onLoadMore
}) => {
    const navigate = useNavigate();
    const profileServiceid = appConfig?.organization?.profileServiceid || 'codeedu-dae124fa';
    const visibleComments = comments.slice(0, visibleCount);

    if (comments.length === 0) {
        return (
            <div className='text-gray-400 dark:text-gray-500'>
                No comments yet. Be the first to comment!
            </div>
        );
    }

    return (
        <div className='flex flex-col gap-6'>
            {visibleComments.map(comment => (
                <div key={comment.id} className='flex items-start justify-between'>
                    <div className='flex items-start'>
                        {comment.profile_image ? (
                            <img
                                src={comment.profile_image}
                                alt={comment.user_name}
                                className='w-12 h-12 rounded-full mr-2 border border-gray-600 dark:border-gray-700 object-cover cursor-pointer'
                                onClick={() => navigate(`/user-portfolio/${profileServiceid}/${comment.user_id}`)}
                            />
                        ) : (
                            <div
                                className='w-12 h-12 rounded-full mr-2 border border-gray-600 dark:border-gray-700 bg-gray-300 dark:bg-gray-600 flex items-center justify-center cursor-pointer'
                                onClick={() => navigate(`/user-portfolio/${profileServiceid}/${comment.user_id}`)}
                            >
                                <span className='text-lg font-bold text-gray-600 dark:text-gray-300'>
                                    {comment.name?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                            </div>
                        )}
                        <div
                            className='flex flex-col cursor-pointer'
                            onClick={() => navigate(`/user-portfolio/${profileServiceid}/${comment.user_id}`)}
                        >
                            <span className='text-base font-bold text-white dark:text-gray-200'>
                                {comment.name}
                            </span>
                            <span className='text-sm text-white dark:text-gray-300'>
                                {comment.content}
                            </span>
                        </div>
                    </div>
                    <div className='text-gray-400 dark:text-gray-500 text-sm'>
                        {formatRelativeOrLong(comment.created_at)}
                    </div>
                </div>
            ))}
            {hasMore && (
                <div className='flex justify-center'>
                    <Button
                        variant='outline'
                        className='text-white dark:text-gray-200 bg-transparent border-none h-7 rounded-lg bg-[#535353] dark:bg-gray-700 hover:bg-[#636363] dark:hover:bg-gray-600'
                        onClick={onLoadMore}
                    >
                        Load More
                    </Button>
                </div>
            )}
        </div>
    );
});

CommentsList.displayName = 'CommentsList';

export default CommentsList;
