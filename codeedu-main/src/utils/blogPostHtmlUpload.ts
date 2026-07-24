const VIDEO_EXT_RE = /\.(mp4|webm|ogg|mov|avi|mkv)(\?.*)?$/i;

const isVideoUrl = (url: string): boolean => {
    if (!url) return false;
    if (VIDEO_EXT_RE.test(url)) return true;
    return /\/video\//i.test(url);
};

/**
 * Option 1 (encode API): keep `description` as text/HTML without huge base64 blobs,
 * and send inline editor media (images/videos) as real files via `multi_file_uploads[]`.
 */
export async function extractDataUrlImagesFromBlogHtml(html: string): Promise<{
    html: string;
    files: File[];
}> {
    if (!html || (!html.includes('data:image') && !html.includes('data:video') && !html.includes('blob:'))) {
        return { html, files: [] };
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const nodes = Array.from(
        doc.querySelectorAll('img[src^="data:image"], video[src], video source[src]')
    );
    const files: File[] = [];
    const handledVideoNodes = new WeakSet<Element>();
    let index = 0;
    for (const node of nodes) {
        const src = node.getAttribute('src') || '';
        const tag = node.tagName.toLowerCase();
        let kind: 'image' | 'video' | '' = '';
        if (tag === 'img' && src.startsWith('data:image')) {
            kind = 'image';
        } else if (tag === 'video' || tag === 'source') {
            if (src.startsWith('data:video') || src.startsWith('blob:')) {
                kind = 'video';
            }
        }
        if (!kind) continue;

        const replaceTarget =
            node.tagName.toLowerCase() === 'source' ? node.parentElement ?? node : node;
        if (kind === 'video') {
            if (handledVideoNodes.has(replaceTarget)) continue;
            handledVideoNodes.add(replaceTarget);
        }

        try {
            const res = await fetch(src);
            const blob = await res.blob();
            const ext = blob.type.split('/')[1]?.split('+')[0] || (kind === 'video' ? 'mp4' : 'jpeg');
            const file = new File([blob], `${kind}-${index}.${ext}`, {
                type: blob.type || (kind === 'video' ? 'video/mp4' : 'image/jpeg'),
            });
            files.push(file);
            const marker = doc.createElement('span');
            marker.setAttribute('data-blog-media-index', String(index));
            marker.setAttribute('data-blog-media-kind', kind);
            replaceTarget.replaceWith(marker);
            index++;
        } catch {
            /* keep node if conversion fails */
        }
    }
    return { html: doc.body.innerHTML, files };
}

/**
 * Merge uploaded media URLs back into author-defined placeholders in blog HTML.
 * Supports images + videos.
 */
export function mergeBlogDescriptionWithServerUploads(
    description: string,
    uploads: string[] | undefined | null
): string {
    if (!uploads?.length) return description;
    const safe = uploads.filter((u) => typeof u === 'string' && u.trim().length > 0);
    if (!safe.length) return description;
    const html = description || '';
    const hasLegacyTextPlaceholders = /\[\[BLOG_IMAGE_\d+]]/.test(html);
    const hasMediaNodePlaceholders = /data-blog-media-index="/.test(html);
    const hasLegacyNodePlaceholders = /data-blog-image-index="/.test(html);
    const toMediaHtml = (url: string, kind?: 'image' | 'video') => {
        const resolvedKind = kind ?? (isVideoUrl(url) ? 'video' : 'image');
        if (resolvedKind === 'video') {
            return `<p><video controls preload="metadata" playsinline class="w-full"><source src="${url.replace(/"/g, '&quot;')}" /></video></p>`;
        }
        return `<p><img src="${url.replace(/"/g, '&quot;')}" alt="" loading="lazy" decoding="async" /></p>`;
    };

    // Robust mode: placeholder nodes keep author's exact media position.
    if (hasMediaNodePlaceholders) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        let usedUploadCount = 0;
        const markers = Array.from(doc.querySelectorAll('[data-blog-media-index]'));
        markers.forEach((marker) => {
            const raw = marker.getAttribute('data-blog-media-index') || '';
            const kindAttr = marker.getAttribute('data-blog-media-kind');
            const kind = kindAttr === 'video' ? 'video' : kindAttr === 'image' ? 'image' : undefined;
            const idx = Number.parseInt(raw, 10);
            const uploadUrl = Number.isFinite(idx) ? safe[idx] : undefined;
            if (!uploadUrl) {
                marker.remove();
                return;
            }
            usedUploadCount = Math.max(usedUploadCount, idx + 1);
            const wrap = doc.createElement('div');
            wrap.innerHTML = toMediaHtml(uploadUrl, kind);
            marker.replaceWith(...Array.from(wrap.childNodes));
        });
        let merged = doc.body.innerHTML;
        if (usedUploadCount < safe.length) {
            const extras = safe.slice(usedUploadCount).map((url) => toMediaHtml(url)).join('');
            merged = `${merged}${extras}`;
        }
        return merged;
    }

    // Legacy node placeholders (image-only) from older implementation.
    if (hasLegacyNodePlaceholders) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        let usedUploadCount = 0;
        const markers = Array.from(doc.querySelectorAll('[data-blog-image-index]'));
        markers.forEach((marker) => {
            const raw = marker.getAttribute('data-blog-image-index') || '';
            const idx = Number.parseInt(raw, 10);
            const uploadUrl = Number.isFinite(idx) ? safe[idx] : undefined;
            if (!uploadUrl) {
                marker.remove();
                return;
            }
            usedUploadCount = Math.max(usedUploadCount, idx + 1);
            const wrap = doc.createElement('div');
            wrap.innerHTML = toMediaHtml(uploadUrl, 'image');
            marker.replaceWith(...Array.from(wrap.childNodes));
        });
        let merged = doc.body.innerHTML;
        if (usedUploadCount < safe.length) {
            const extras = safe.slice(usedUploadCount).map((url) => toMediaHtml(url)).join('');
            merged = `${merged}${extras}`;
        }
        return merged;
    }

    // Legacy text placeholders support (already-stored data before node placeholders).
    if (hasLegacyTextPlaceholders) {
        let usedUploadCount = 0;
        const base = html.replace(/\[\[BLOG_IMAGE_(\d+)]]/g, (_, rawIdx: string) => {
            const idx = Number.parseInt(rawIdx, 10);
            const uploadUrl = Number.isFinite(idx) ? safe[idx] : undefined;
            if (!uploadUrl) return '';
            usedUploadCount = Math.max(usedUploadCount, idx + 1);
            return toMediaHtml(uploadUrl, 'image');
        });
        if (usedUploadCount < safe.length) {
            const extras = safe.slice(usedUploadCount).map((url) => toMediaHtml(url)).join('');
            return `${base}${extras}`;
        }
        return base;
    }

    // Backward compatibility for very old posts that never had placeholders.
    // If content already has media, trust authored order and do not append.
    if (/<img\b|<video\b/i.test(html)) {
        return html;
    }
    if (!hasMediaNodePlaceholders && !hasLegacyNodePlaceholders && !hasLegacyTextPlaceholders) {
        const appended = safe.map((url) => toMediaHtml(url)).join('');
        return `${html}${appended}`;
    }
    return html;
}
