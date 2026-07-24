import React from 'react';
import { usePostDetails } from '@/hooks/data/connect/usePosts';
import { isBlogStyleFeedPost } from './blogStylePost';
import { mergeBlogDescriptionWithServerUploads } from '@/utils/blogPostHtmlUpload';

interface PostContentProps {
    post: {
        id: number;
        title?: string;
        description?: string;
        multi_file_uploads?: string[];
        /** '1' = blog — description is rich HTML with optional inline images; must not strip `<img>` */
        content_type?: string;
        content_type_id?: string | number;
        resource_type?: string;
        post_type?: string;
    };
    /** When true (blog + left-column slider), body shows text only — no duplicate images. */
    omitDescriptionImages?: boolean;
    /**
     * Feed cards: short snippet + no detail fetch (full body on `/connect/post/:id` only).
     * Set false only if you need merged detail HTML in this component (e.g. future reuse).
     */
    feedPreview?: boolean;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onTitleClick: () => void;
}

const PostContent: React.FC<PostContentProps> = React.memo(({
    post,
    omitDescriptionImages = false,
    feedPreview = true,
    isExpanded,
    onToggleExpand,
    onTitleClick
}) => {
    const isBlogPost = isBlogStyleFeedPost(post);
    /** In feed we skip detail fetch and list-only `description` so the card stays a short preview. */
    const { data: detail } = usePostDetails(
        isBlogPost && !feedPreview ? String(post.id) : undefined
    );

    const removeImagesFromHtml = (html: string) => {
        if (!html) return '';

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const images = doc.querySelectorAll('img');
        images.forEach((img) => img.remove());

        return doc.body.innerHTML;
    };

    const bodyHtml = isBlogPost
        ? (() => {
            const rawDesc = feedPreview
                ? (post?.description ?? '')
                : (detail?.description?.length ?? 0) > (post?.description?.length ?? 0)
                    ? (detail?.description ?? '')
                    : (post?.description ?? '');
            const uploads =
                omitDescriptionImages
                    ? []
                    : feedPreview
                        ? post?.multi_file_uploads
                        : detail?.multi_file_uploads?.length
                            ? detail.multi_file_uploads
                            : post?.multi_file_uploads;
            let merged = mergeBlogDescriptionWithServerUploads(rawDesc, uploads);
            if (omitDescriptionImages) merged = removeImagesFromHtml(merged);
            return merged;
        })()
        : post?.post_type === 'event' && feedPreview
            ? (() => {
                const parser = new DOMParser();
                // Add newlines after block elements to prevent text squishing
                const preProcessedHtml = (post?.description ?? '').replace(/<\/(p|div|section|h[1-6]|li)>/gi, '\n');
                const doc = parser.parseFromString(preProcessedHtml, 'text/html');
                const text = doc.body.textContent || '';
                const p = document.createElement('p');
                p.textContent = text.trim();
                return p.innerHTML.replace(/\n+/g, '<br/>');
            })()
            : removeImagesFromHtml(post?.description ?? '');

    const clampClass = isBlogPost
        ? feedPreview
            ? 'line-clamp-5 overflow-hidden break-words'
            : ''
        : post?.post_type === 'event'
            ? feedPreview
                ? 'line-clamp-[5] overflow-hidden break-words'
                : ''
            : isExpanded
                ? ''
                : 'line-clamp-4';
    const bodyClassName = `text-sm text-cblack dark:text-white prose-xl max-w-none prose-a:text-blue-600 dark:prose-p:!bg-transparent dark:prose-p:!text-white dark:prose-strong:!bg-transparent dark:prose-strong:!text-white dark:prose-ul:!bg-transparent dark:prose-ul:!text-white ${clampClass} ${isBlogPost ? 'blog-img-prose blog-img-prose--feed' : ''}`;

    return (
        <>
            <div className="mb-3">
                <h3
                    className="text-lg font-semibold mb-1 text-cblack dark:text-white cursor-pointer hover:underline underline-offset-2"
                    onClick={onTitleClick}
                >
                    {post?.title}
                </h3>
                <div className="text-gray-300 dark:text-white border-b border-gray-600 dark:border-gray-700 pb-4 mb-4 min-w-0 w-full">
                    <div
                        className={`${bodyClassName} ${isBlogPost ? `w-full min-w-0 min-h-0 ${feedPreview ? '' : 'overflow-x-auto'}` : ''}`}
                        dangerouslySetInnerHTML={{
                            __html: bodyHtml,
                        }}
                    />
                    {(isBlogPost || post?.post_type === 'event') && feedPreview && (
                        <button
                            type="button"
                            className="text-primary dark:text-primary/90 font-semibold mt-2 hover:underline"
                            onClick={onTitleClick}
                        >
                            Read more
                        </button>
                    )}
                </div>
            </div>
        </>
    );
});

PostContent.displayName = 'PostContent';

export default PostContent;
