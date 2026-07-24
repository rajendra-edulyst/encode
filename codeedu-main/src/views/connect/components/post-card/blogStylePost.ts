/**
 * Feed cards need the same “blog / rich HTML” rules as PostService normalization.
 * When the list API mis-labels `content_type` but the body is HTML with inline images,
 * stripping `<img>` for “non-blog” leaves an empty body.
 */
export function isBlogStyleFeedPost(post: {
    description?: string;
    content_type?: string;
    content_type_id?: string | number;
    resource_type?: string;
    post_type?: string;
}): boolean {
    if (Number(post?.content_type) === 21 || Number(post?.content_type) === 1) return true;
    if (Number(post?.content_type_id) === 21 || Number(post?.content_type_id) === 1) return true;
    if (post?.post_type?.toLowerCase() === 'blog') return true;
    
    // Fallback: sniff the HTML for blog-specific media markers
    const html = post?.description || '';
    if (html.includes('data-blog-media-index') || html.includes('data-blog-image-index') || /\[\[BLOG_IMAGE_\d+\]\]/.test(html)) {
        return true;
    }
    
    return false;
}
