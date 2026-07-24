import { mergeBlogDescriptionWithServerUploads } from './src/utils/blogPostHtmlUpload.js';

const html = '<span data-blog-media-index="0" data-blog-media-kind="image"></span><p></p>';
const uploads = ['https://codeedu.blob.core.windows.net/encode/media/encode/media/nlms_content/1783556100_image-0.png'];

console.log(mergeBlogDescriptionWithServerUploads(html, uploads));
