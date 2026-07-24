import { Post } from '@/@types/connect/posts';
import { User } from '@/@types/auth';

export const isPinnedForUser = (post: Post, user?: User | null): boolean => {
    if (Number(post?.is_pin) !== 1) return false;

    // Admin pins are globally visible to everyone
    if (post?.pin_by_role?.toLowerCase() === 'admin') return true;

    // Otherwise, only the user who pinned it sees it as pinned
    return post?.pin_by_id != null &&
        Number(post?.pin_by_id) === Number(user?.id) && 
        post?.pin_by_role?.toLowerCase() === user?.role?.toLowerCase();
};
