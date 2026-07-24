import type { Post } from '@/@types/connect/posts';

function getCleanFilename(url: string): string {
    const parts = url.split('/');
    const filename = parts[parts.length - 1] || '';
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
    return nameWithoutExt.replace(/^(thumb_|thumbnail_|thumb-|thumbnail-)/, '').toLowerCase();
}

/**
 * Build ordered, de-duplicated image URLs for the feed carousel: thumbnail first, then
 * `multi_file_uploads`, then `http(s)` / `//` images from description HTML (skips `data:` blobs).
 */
export function getGalleryImageUrls(post: Post): string[] {
    const out: string[] = [];
    const seen = new Set<string>();

    const add = (u: string | undefined | null) => {
        const raw = typeof u === 'string' ? u.trim() : '';
        if (!raw || raw === 'null' || raw === 'undefined') return;
        let s = raw;
        try { s = decodeURIComponent(raw); } catch { /* ignore */ }
        if (seen.has(s)) return;
        seen.add(s);
        
        // Encode unencoded spaces and `?` if they are part of the filename
        let sanitized = raw.replace(/ /g, '%20');
        if (sanitized.includes('?') && !sanitized.match(/\?(sv|alt|token|X-Amz-)=/i)) {
            const lastSlash = sanitized.lastIndexOf('/');
            if (lastSlash !== -1) {
                const pathPart = sanitized.substring(0, lastSlash + 1);
                let filePart = sanitized.substring(lastSlash + 1);
                filePart = filePart.replace(/\?/g, '%3F');
                sanitized = pathPart + filePart;
            }
        }
        
        out.push(sanitized);
    };



    // If multi_file_uploads contains the original version of the thumbnail,
    // we should skip adding the thumbnail to prioritize the high-res upload.
    let shouldAddThumbnail = !!post.thumbnail_url;
    if (post.thumbnail_url && post.multi_file_uploads?.length) {
        const thumbName = getCleanFilename(post.thumbnail_url);
        const hasOriginalInUploads = post.multi_file_uploads.some(
            (u) => getCleanFilename(u) === thumbName
        );
        if (hasOriginalInUploads) {
            shouldAddThumbnail = false;
        }
    }

    if (shouldAddThumbnail && post.thumbnail_url) {
        add(post.thumbnail_url);
    }
    
    if (post.resource_path && typeof post.resource_path === 'string') {
        const rp = post.resource_path.toLowerCase();
        if (/\.(jpg|jpeg|png|gif|webp|mp4|webm|ogg|mov|avi|mkv)/.test(rp)) {
            add(post.resource_path);
        }
    }

    if (post.multi_file_uploads?.length) {
        post.multi_file_uploads.forEach((u) => add(u));
    }

    const html = post.description;
    if (html && typeof html === 'string') {
        try {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            doc.querySelectorAll('img[src]').forEach((img) => {
                const src = img.getAttribute('src')?.trim() || '';
                if (!src || src.startsWith('data:')) return;
                if (src.startsWith('http') || src.startsWith('//')) add(src);
            });
        } catch {

        }
    }

    return out;
}
