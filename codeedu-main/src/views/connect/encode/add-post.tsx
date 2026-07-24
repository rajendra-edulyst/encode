import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { Button } from "@/components/ui/ShadcnButton";
import { Input } from "@/components/ui/ShadcnInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/shadcnAlert";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Upload, X } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import ConnectLayout from '../layouts';
import RightSidePanel from '../layouts/right-side-panel';
import { usePostDetails, useAddCommunityPost, useUpdateCommunityPost } from '@/hooks/data/connect/usePosts';
import { useOrgCommunities } from '@/hooks/data/connect/useCommunity';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { stripHtmlTags } from '@/utils/stripHtmlTags';
import { extractDataUrlImagesFromBlogHtml } from '@/utils/blogPostHtmlUpload';
import StageDetails from '@/views/ccat/stage-2/components/StageDetails';
import { ArrowLeft } from 'lucide-react';

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    postType: z.enum(['text', 'image', 'video', 'blog'], {
        required_error: 'Post type is required',
    }),
    description: z.string().optional(),
    communityIds: z.array(z.string()).optional(),
    tags: z.string().optional(),
    publishedAt: z.string().optional(),
    imageFiles: z.array(z.instanceof(File)).max(5, 'Maximum 5 images allowed').optional().refine(
        (files) => !files || files.every(file => file.size <= 10 * 1024 * 1024),
        { message: 'Each image must be less than 10MB' }
    ),
    videoFile: z
        .instanceof(File)
        .optional()
        .refine(
            (file) => !file || file.size <= 50 * 1024 * 1024,
            { message: 'Video must be less than 50MB' }
        ),
    terms: z.boolean().optional()
})

type FormData = z.infer<typeof formSchema>;

const AddBuzz: React.FC = () => {
    const navigate = useNavigate();
    const { id: editPostId } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const composerMode = searchParams.get('composer');
    const cciParam = searchParams.get('is_cci');
    const isStartComposer = composerMode === 'start';
    const isMediaComposer = composerMode === 'media';
    const isBlogComposer = composerMode === 'blog';
    const { mutate: createPost, isPending: isCreating } = useAddCommunityPost();
    const { mutate: updatePost, isPending: isUpdating } = useUpdateCommunityPost();
    const isSubmitting = isCreating || isUpdating;
    const imageFileRef = useRef<HTMLInputElement>(null);
    const videoFileRef = useRef<HTMLInputElement>(null);
    const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
    const [videoPreview, setVideoPreview] = React.useState<string | null>(null);
    const [tagInput, setTagInput] = React.useState('');
    const [tags, setTags] = React.useState<string[]>([]);
    const [showTermsModal, setShowTermsModal] = React.useState(false);
    const { data: postData } = usePostDetails(editPostId || undefined);
    const { data: orgCommunities } = useOrgCommunities();

    const allCommunities = useMemo(() => {
        return orgCommunities?.flatMap(org => org.communities) || [];
    }, [orgCommunities]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        watch,
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            postType: 'text',
            description: '',
            communityIds: ['356'],
            tags: '',
            publishedAt: '',
            imageFiles: [],
            videoFile: undefined,
        },
    });

    const postType = watch('postType');
    const screenTitle = editPostId
        ? (postType === 'blog' || postData?.content_type === '21' || postData?.content_type === '1' ? 'Edit Blog' : 'Edit Buzz')
        : isMediaComposer
            ? 'Photos & Video'
            : isBlogComposer
                ? 'Add Blog'
                : 'Start a Buzz';

    const goToCommunityFeed = useCallback(() => {
        if (cciParam === '1') {
            navigate('/cci-stage-2/all-buzz', { replace: true });
        } else {
            navigate('/connect', { replace: true });
        }
    }, [navigate, cciParam]);

    const onPostSuccess = useCallback(() => {
        if (cciParam === '1') {
            navigate('/cci-stage-2/all-buzz', { replace: true });
        } else {
            navigate('/connect', { replace: true });
        }
    }, [navigate, cciParam]);

    useEffect(() => {
        if (editPostId) return;
        if (isMediaComposer) {
            const currentType = watch('postType');
            if (currentType !== 'image' && currentType !== 'video') {
                setValue('postType', 'image');
            }
            return;
        }
        if (isBlogComposer) {
            setValue('postType', 'blog');
            return;
        }
        setValue('postType', 'text');
    }, [editPostId, isBlogComposer, isMediaComposer, setValue, watch]);

    React.useEffect(() => {
        return () => {
            imagePreviews.forEach(url => URL.revokeObjectURL(url));
            if (videoPreview) URL.revokeObjectURL(videoPreview);
        };
    }, [imagePreviews, videoPreview]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            if (isMediaComposer) {
                const firstVideo = selectedFiles.find((file) => file.type.startsWith('video/'));
                if (firstVideo) {
                    setValue('postType', 'video');
                    setValue('videoFile', firstVideo);
                    setValue('imageFiles', []);
                    setImagePreviews([]);
                    if (videoPreview) URL.revokeObjectURL(videoPreview);
                    setVideoPreview(URL.createObjectURL(firstVideo));
                    return;
                }
                setValue('postType', 'image');
                setValue('videoFile', undefined);
                if (videoPreview) URL.revokeObjectURL(videoPreview);
                setVideoPreview(null);
            }

            const currentFiles = watch('imageFiles') || [];
            const files = Array.from(e.target.files).slice(0, 5);
            const newFiles = [...currentFiles, ...files];
            const validFiles = newFiles.slice(0, 5);
            setValue('imageFiles', validFiles);
            setImagePreviews(validFiles.map(file => URL.createObjectURL(file)));
        }
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setValue('videoFile', file);
            if (videoPreview) URL.revokeObjectURL(videoPreview);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = useCallback(async (data: FormData) => {
        if (!editPostId && !data.terms) {
            toast.error('Please accept the terms and conditions');
            return;
        }

        const descriptionHasText = (html: string | undefined) =>
            stripHtmlTags(html || '').length > 0;

        /** Option 1: pull `data:image/*` out of blog HTML into `multi_file_uploads[]`; keep description as text/HTML only. */
        let descriptionPayload = data.description ?? '';
        let blogInlineFiles: File[] = [];
        if (data.postType === 'blog') {
            const extracted = await extractDataUrlImagesFromBlogHtml(descriptionPayload);
            descriptionPayload = extracted.html;
            blogInlineFiles = extracted.files;
            if (blogInlineFiles.length > 10) {
                toast.error('Maximum 10 inline media files allowed in blog content');
                return;
            }
            if (blogInlineFiles.some((f) => f.type.startsWith('image/') && f.size > 10 * 1024 * 1024)) {
                toast.error('Each inline image must be less than 10MB');
                return;
            }
            if (blogInlineFiles.some((f) => f.type.startsWith('video/') && f.size > 50 * 1024 * 1024)) {
                toast.error('Each inline video must be less than 50MB');
                return;
            }
            if (!descriptionHasText(descriptionPayload) && blogInlineFiles.length === 0) {
                toast.error('Description or at least one media file is required for blog posts');
                return;
            }
        }

        const typeRequirements: Record<string, { isValid: (d: FormData) => boolean; error: string }> = {
            text: {
                isValid: (d) => descriptionHasText(d.description),
                error: 'Description is required for text posts'
            },
            image: {
                isValid: (d) => !!d.imageFiles && d.imageFiles.length > 0,
                error: 'At least one image is required for image posts'
            },
            video: {
                isValid: (d) => !!d.videoFile,
                error: 'Video file is required for video posts'
            }
        };

        if (data.postType !== 'blog') {
            const requirement = typeRequirements[data.postType];
            if (requirement && !requirement.isValid(data)) {
                toast.error(requirement.error);
                return;
            }
        }

        if (data.postType === 'text' && /<img\b/i.test(data.description ?? '')) {
            toast.error('Text Buzz supports text only. Please remove images.');
            return;
        }

        if (data.imageFiles) {
            if (data.imageFiles.length > 5) {
                toast.error('Maximum 5 images allowed');
                return;
            }
            if (data.imageFiles.some(file => file.size > 10 * 1024 * 1024)) {
                toast.error('Each image must be less than 10MB');
                return;
            }
            const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (data.imageFiles.some(file => !validImageTypes.includes(file.type))) {
                toast.error('Unsupported image format (use JPG, PNG, Webp)');
                return;
            }
        }

        if (data.videoFile) {
            if (data.videoFile.size > 50 * 1024 * 1024) {
                toast.error('Video must be less than 50MB');
                return;
            }
            if (!['video/mp4', 'video/avi', 'video/mov'].includes(data.videoFile.type)) {
                toast.error('Unsupported video format (use MP4, AVI, MOV)');
                return;
            }
        }
        const formData = new FormData();
        const appendIfExist = (key: string, value: string | Blob | null | undefined) => {
            if (value !== undefined && value !== null && value !== '') {
                formData.append(key, value);
            }
        };

        const pendingTagParts = tagInput
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        const formTagParts = (data.tags || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        const mergedTags = [...new Set([...tags, ...formTagParts, ...pendingTagParts])].slice(0, 10);
        const tagsPayload = mergedTags.join(', ');

        let createdAtPayload: string | undefined;
        if (data.publishedAt?.trim()) {
            const d = new Date(data.publishedAt);
            if (!Number.isNaN(d.getTime())) {
                createdAtPayload = d.toISOString();
            }
        }

        appendIfExist('title', data.title);
        appendIfExist('post_type', data.postType);
        formData.append('description', descriptionPayload);
        const finalCategoryId = data.postType === 'blog' ? '356' : (data.communityIds?.map(String).join(',') || '');
        appendIfExist('category_id', finalCategoryId);
        appendIfExist('status', 'Active');
        appendIfExist('created_at', createdAtPayload);
        appendIfExist('tag', tagsPayload);

        if (cciParam) {
            formData.append('is_cci', cciParam);
        }

        const contentTypeMap: Record<string, string> = {
            blog: '21',
            video: '2',
            image: '4',
            text: '20'
        };
        formData.append('content_type', contentTypeMap[data.postType] || '20');

        formData.append('aspect_ratio', '16:9');
        formData.append('dimension', '');


        // Thumbnail: image-picker file first; else first blog inline image only when blog has extracted files
        if (data.imageFiles?.[0]) {
            formData.append('thumbnail', data.imageFiles[0]);
        } else if (data.postType === 'blog' && blogInlineFiles.length > 0) {
            formData.append('thumbnail', blogInlineFiles[0]);
        }

        /**
         * Blog images: same multipart keys as **image** posts (`file` / `file[0]`…).
         * Encode often saves `thumbnail_url` from `thumbnail` but leaves `multi_file_uploads` null in
         * GET responses when only `multi_file_uploads[]` was sent — the create handler usually binds
         * `file` / `file[n]` like image posts. If your API still needs `multi_file_uploads[]` as well,
         * add: `blogInlineFiles.forEach((f) => formData.append('multi_file_uploads[]', f));`
         */
        if (data.postType === 'blog' && blogInlineFiles.length > 0) {
            if (blogInlineFiles.length === 1) {
                formData.append('file', blogInlineFiles[0]);
            } else {
                blogInlineFiles.forEach((file, index) => {
                    formData.append(`file[${index}]`, file);
                });
            }
        }

        if (data.imageFiles) {
            if (data.imageFiles.length === 1) {
                formData.append('file', data.imageFiles[0]);
            } else {
                data.imageFiles.forEach((file, index) => {
                    formData.append(`file[${index}]`, file);
                });
            }
        }

        if (data.videoFile) {
            formData.append('file', data.videoFile);
        }

        if (import.meta.env.DEV && data.postType === 'blog' && blogInlineFiles.length > 0) {
            for (const [key, value] of formData.entries()) {
                if (
                    key === 'thumbnail' ||
                    key === 'multi_file_uploads[]' ||
                    key === 'file' ||
                    key.startsWith('file')
                ) {
                    console.debug(
                        '[add-buzz]',
                        key,
                        value instanceof File ? `${value.name} (${value.size}b)` : value
                    );
                }
            }
        }

        const mutationOptions = {
            onSuccess: () => onPostSuccess(),
            onError: (err: unknown) => {
                const message =
                    err instanceof Error ? err.message : 'Something went wrong. Please try again.';
                toast.error(message);
            }
        };

        if (editPostId) {
            updatePost({ postId: editPostId, data: formData }, mutationOptions);
        } else {
            createPost(formData, mutationOptions);
        }
    }, [editPostId, createPost, updatePost, onPostSuccess, tags, tagInput]);

    useEffect(() => {
        if (postData) {
            setValue('title', postData.title || '');
            setValue('description', postData.description || '');
            const pt =
                (String(postData.content_type) === '21')
                    ? 'blog'
                    : postData.resource_type === 'video'
                        ? 'video'
                        : postData.resource_type === 'image'
                            ? 'image'
                            : 'text';
            setValue('postType', pt);
            setValue('tags', postData.tag || '');
            if (postData.tag) {
                const tagList = postData.tag.split(',').map((t: string) => t.trim()).filter(Boolean);
                setTags(tagList);
            }
            if (postData.category_id) {
                setValue('communityIds', [String(postData.category_id)]);
            }
        }
    }, [postData, setValue]);

    const titleLenght = watch('title')?.length;

    return (
        <ConnectLayout active='encode' isCCI={cciParam === '1'}>
            {cciParam === '1' && (
                <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-6 w-full font-jacques-pro">
                    <div className="mb-6">
                        <StageDetails />
                    </div>
                    <button
                        onClick={() => navigate('/cci-stage-2/all-buzz')}
                        className="w-full bg-[#1e1e1e] hover:bg-[#2a2a2a] transition-colors rounded-[10px] p-4 flex items-center gap-3 text-[15px] font-medium border border-transparent hover:border-[#5A5A5A] mb-8 text-white"
                        type="button"
                    >
                        <ArrowLeft size={18} />
                        Create the Buzz, Capture the Pulse
                    </button>
                </div>
            )}
            <div className={`grid grid-cols-1 ${cciParam === '1' ? 'lg:grid-cols-1 max-w-[1200px] mx-auto px-4 md:px-8' : 'lg:grid-cols-10'} gap-8 w-full`}>
                <div className={`col-span-1 ${cciParam === '1' ? 'lg:col-span-1' : 'lg:col-span-7'}`}>
                    {
                        isSubmitting && (
                            <div className="fixed top-0 left-0 w-full h-screen z-50 flex items-center justify-center bg-white/50 dark:bg-black/50">
                                <div className="flex flex-col items-center justify-center space-x-2">
                                    <Loader2 className="animate-spin text-primary w-10 h-10" />
                                    <span className="ml-2 text-primary">{editPostId ? 'Updating' : 'Creating'} Buzz...</span>
                                </div>
                            </div>
                        )
                    }
                    <div className="w-full px-4 py-8 bg-[#1D1D1D] text-white shadow-none border border-[#2A2A2A] rounded-lg">
                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <div className='pb-6 mb-6 relative'>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="absolute -top-[0px] right-0 cursor-pointer p-0 text-white hover:bg-transparent hover:text-white [&_svg]:!size-8"
                                    onClick={goToCommunityFeed}
                                >
                                    <X strokeWidth={1.8} className='text-white' />
                                </Button>
                                <div className="flex items-center mb-8 pr-14">
                                    <h1 className="text-3xl font-bold text-white">{screenTitle}</h1>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <Label htmlFor="post-title" className="block mb-2 font-medium text-white">
                                            Title<span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="post-title"
                                            placeholder={postType === 'blog' ? "Enter Blog title" : "Enter Buzz title"}
                                            maxLength={150}
                                            className="focus:outline-none focus:ring-0 w-full focus-visible:ring-0 bg-[#5A5A5A] text-white border-[#5A5A5A] placeholder:text-[#D2D2D2]"
                                            {...register('title')}
                                        />
                                        <div className='mt-1 text-xs ml-1 text-[#B9B9B9]'>
                                            {titleLenght}/150
                                        </div>
                                        {errors.title && (
                                            <p className="text-red-500 text-sm">{errors.title.message}</p>
                                        )}
                                    </div>
                                    {!isStartComposer && !isMediaComposer && !isBlogComposer && (
                                        <div>
                                            <Label htmlFor="post-type" className="block mb-2 font-medium text-white">
                                                Buzz Type<span className="text-red-500">*</span>
                                            </Label>
                                            <Controller
                                                name="postType"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger className="focus:outline-none focus:ring-0 focus-visible:ring-0 bg-[#5A5A5A] text-white border-[#5A5A5A]">
                                                            <SelectValue placeholder="Select post type" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-[#1D1D1D] border-[#5A5A5A] text-white">
                                                            <SelectItem value="text" className="text-white focus:bg-[#5A5A5A]">Text</SelectItem>
                                                            <SelectItem value="image" className="text-white focus:bg-[#5A5A5A]">Image</SelectItem>
                                                            <SelectItem value="video" className="text-white focus:bg-[#5A5A5A]">Video</SelectItem>
                                                            <SelectItem value="blog" className="text-white focus:bg-[#5A5A5A]">Blog</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.postType && (
                                                <p className="text-red-500 text-sm">{errors.postType.message}</p>
                                            )}
                                        </div>
                                    )}

                                </div>


                                {(!editPostId || postType === 'blog') && (
                                    <div className="mt-6">
                                        <Label htmlFor="published-at" className="block mb-2 font-medium text-white">
                                            Published At (Optional)
                                        </Label>
                                        <Controller
                                            name="publishedAt"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    id="published-at"
                                                    type="datetime-local"
                                                    className="focus:outline-none focus:ring-0 focus-visible:ring-0 bg-[#5A5A5A] text-white border-[#5A5A5A] [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-90 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                                    {...field}
                                                />
                                            )}
                                        />
                                        <p className="text-xs text-[#B9B9B9] mt-1">
                                            Leave empty to use current date and time
                                        </p>
                                        {errors.publishedAt && (
                                            <p className="text-red-500 text-sm">{errors.publishedAt.message}</p>
                                        )}
                                    </div>
                                )}
                                {(postType === 'image' || postType === 'video') && (
                                    <div className="space-y-4 mt-4">
                                        {postType === 'image' && (
                                            <div>
                                                <Label className="block mb-2 font-medium text-white">
                                                    Images (Max 5, 10MB each)
                                                </Label>
                                                <div className="border-2 border-dashed border-primary rounded-lg p-4 text-center bg-[#1D1D1D]">
                                                    {
                                                        imagePreviews?.length === 0 && <div
                                                            className="flex flex-col items-center justify-center space-y-4"
                                                            onClick={() => imageFileRef.current?.click()}
                                                        >
                                                            <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                                                                <Upload className="text-primary" />
                                                            </div>
                                                            <div>
                                                                <p className="text-lg font-medium text-primary">Upload Images or Videos</p>
                                                                <p className="text-sm text-[#B9B9B9] mt-1">Max 5 images, 10MB each</p>
                                                                <p className="text-sm text-[#B9B9B9] mt-1">Drag and drop or click to browse</p>
                                                                <p className="text-sm text-[#B9B9B9] mt-1">
                                                                    {isMediaComposer
                                                                        ? 'Supported formats: JPG, PNG, Webp, MP4, AVI, MOV'
                                                                        : 'Supported formats: JPG, PNG, Webp'}
                                                                </p>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                className="mt-4 cursor-pointer whitespace-nowrap !rounded-button bg-[#5A5A5A] text-white border-[#5A5A5A] hover:bg-[#676767]"
                                                            >
                                                                {isMediaComposer ? 'Browse Images / Videos' : 'Browse Images'}
                                                            </Button>
                                                        </div>
                                                    }
                                                    {imagePreviews.length > 0 && (
                                                        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-2">
                                                            {imagePreviews.map((preview, index) => (
                                                                <div key={index} className="relative border dark:border-gray-600 rounded-lg overflow-hidden">
                                                                    <img
                                                                        src={preview}
                                                                        alt={`Preview ${index + 1}`}
                                                                        className="w-full h-48 object-cover rounded-lg"
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="link"
                                                                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white w-6 h-7 flex items-center justify-center"
                                                                        onClick={() => {
                                                                            const newPreviews = imagePreviews.filter((_, i) => i !== index);
                                                                            setImagePreviews(newPreviews);
                                                                            setValue('imageFiles', watch('imageFiles')?.filter((_, i) => i !== index) || []);
                                                                            if (imageFileRef.current) {
                                                                                imageFileRef.current.value = '';
                                                                            }
                                                                        }}
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </Button>
                                                                    {/* size in bottom right */}
                                                                    <div className="absolute bottom-1 right-1 bg-gray-800 dark:bg-gray-900 text-white text-xs px-2 py-1 rounded">
                                                                        {Math.round((watch('imageFiles')?.[index]?.size || 0) / 1024)} KB
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {
                                                                imagePreviews.length > 0 && imagePreviews.length < 5 && (
                                                                    <div
                                                                        className="flex flex-col items-center justify-center space-y-4 border border-dashed border-primary dark:border-primary/70 rounded-lg cursor-pointer"
                                                                        onClick={() => imageFileRef.current?.click()}
                                                                    >
                                                                        <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                                                                            <Plus className="text-primary" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-lg font-medium text-primary">Add More</p>
                                                                            <p className="text-xs text-[#B9B9B9] mt-1">Max 5 images, 10MB each</p>
                                                                            <p className="text-xs text-[#B9B9B9] mt-1">Drag and drop or click to browse</p>
                                                                            <p className="text-xs text-[#B9B9B9] mt-1">Supported formats: JPG, PNG, Webp</p>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                                <input
                                                    ref={imageFileRef}
                                                    multiple
                                                    type="file"
                                                    accept={isMediaComposer ? 'image/*,video/*' : 'image/*'}
                                                    className="hidden"
                                                    onChange={handleImageChange}
                                                />
                                                {errors.imageFiles && (
                                                    <p className="text-red-500 text-sm">{errors.imageFiles.message}</p>
                                                )}
                                            </div>
                                        )}
                                        {postType === 'video' && (
                                            <div>
                                                <Label className="block mb-2 font-medium text-white">
                                                    Video (Max 50MB)
                                                </Label>
                                                <div className="border-2 border-dashed border-primary rounded-lg p-8 text-center bg-[#1D1D1D]">
                                                    {!videoPreview && (
                                                        <div
                                                            className="flex flex-col items-center justify-center space-y-4"
                                                            onClick={() => videoFileRef.current?.click()}
                                                        >
                                                            <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                                                                <Upload className="text-primary" />
                                                            </div>
                                                            <div>
                                                                <p className="text-lg font-medium text-primary">Upload Images or Videos</p>
                                                                <p className="text-sm text-[#B9B9B9] mt-1">Max 50MB</p>
                                                                <p className="text-sm text-[#B9B9B9] mt-1">Drag and drop or click to browse</p>
                                                                <p className="text-sm text-[#B9B9B9] mt-1">Supported formats: MP4, AVI, MOV</p>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                className="mt-4 cursor-pointer whitespace-nowrap !rounded-button bg-[#5A5A5A] text-white border-[#5A5A5A] hover:bg-[#676767]"
                                                            >
                                                                Browse Video
                                                            </Button>
                                                        </div>
                                                    )}
                                                    {videoPreview && (
                                                        <div className="mt-4">
                                                            <div className="flex justify-center py-1.5">
                                                                <video
                                                                    controls
                                                                    src={videoPreview}
                                                                    className="w-32 rounded-lg"
                                                                />
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="link"
                                                                className="dark:text-primary"
                                                                onClick={() => {
                                                                    setVideoPreview(null);
                                                                    setValue('videoFile', undefined);
                                                                    if (videoFileRef.current) {
                                                                        videoFileRef.current.value = '';
                                                                    }
                                                                }}
                                                            >
                                                                Click to change
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                                <input
                                                    ref={videoFileRef}
                                                    type="file"
                                                    accept="video/*"
                                                    className="hidden"
                                                    onChange={handleVideoChange}
                                                />
                                                {errors.videoFile && (
                                                    <p className="text-red-500 text-sm">{errors.videoFile.message}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="space-y-2 mt-3">
                                    <Label htmlFor="description" className="text-white">
                                        Description
                                        {(postType === 'text' || postType === 'blog') && <span className="text-red-500">*</span>}
                                    </Label>
                                    {postType === 'blog' && (
                                        <p className="text-xs text-[#B9B9B9] -mt-1 mb-1">
                                            Blog: up to 10 inline media files (images up to 10MB, videos up to 50MB).
                                        </p>
                                    )}

                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field }) => (
                                            <RichTextEditor
                                                value={field.value || ""}
                                                maxInlineImages={postType === 'blog' ? 10 : 0}
                                                maxImageFileBytes={10 * 1024 * 1024}
                                                allowInlineVideos={postType === 'blog'}
                                                maxInlineVideos={postType === 'blog' ? 3 : 0}
                                                maxVideoFileBytes={50 * 1024 * 1024}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                            />
                                        )}

                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-sm">{errors.description.message}</p>
                                    )}
                                </div>
                                <div className='mt-4'>
                                    <Label htmlFor="tags" className="block mb-2 font-medium text-white">
                                        Tags
                                    </Label>

                                    <Input
                                        id="tags"
                                        placeholder="Enter tags (comma-separated)"
                                        className="focus:outline-none focus:ring-0 focus-visible:ring-0 bg-[#5A5A5A] text-white border-[#5A5A5A] placeholder:text-[#D2D2D2]"
                                        value={tagInput}
                                        onChange={e => setTagInput(e.target.value)}
                                        onKeyDown={e => {
                                            if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
                                                e.preventDefault();
                                                const newTagValues = tagInput
                                                    .split(',')
                                                    .map(s => s.trim())
                                                    .filter(Boolean);

                                                setTags(prevTags => {
                                                    const mergedTags = [...prevTags, ...newTagValues];
                                                    const uniqueTags = [...new Set(mergedTags)];

                                                    if (uniqueTags.length > 10) {
                                                        return prevTags;
                                                    }

                                                    setValue('tags', uniqueTags.join(', '));
                                                    return uniqueTags;
                                                });

                                                setTagInput('');
                                            }
                                        }}

                                    />
                                    <div className="text-xs ml-1 text-[#B9B9B9] mt-1">
                                        {tags.length}/10
                                    </div>

                                    {errors.tags && (
                                        <p className="text-red-500 text-sm">{errors.tags.message}</p>
                                    )}
                                    {tags.length !== 0 && <div className='mt-3'>
                                        <div className='flex items-center justify-between mb-2'>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Extracted Tags:</p>
                                            <Badge variant="outline" className="px-2 py-1 rounded gap-2 cursor-pointer dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                                onClick={() => {
                                                    setTags([]);
                                                    setValue('tags', '');
                                                    if (imageFileRef.current) {
                                                        imageFileRef.current.value = '';
                                                    }
                                                }}
                                            >
                                                <X strokeWidth={1.5} size={17} /> Clear All Tags
                                            </Badge>
                                        </div>
                                        {
                                            tags.length > 0 ? (
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {tags.map((tag, index) => (
                                                        <Badge key={index} className="bg-primary dark:bg-primary/80 text-white gap-1 px-0.5 pl-1">
                                                            {tag} <span className="text-gray-300 bg-white dark:bg-gray-700 rounded-full"
                                                                onClick={() => {
                                                                    const newTags = tags.filter((_, i) => i !== index);
                                                                    setTags(newTags);
                                                                    setValue('tags', newTags.join(', '));
                                                                }}>
                                                                <X strokeWidth={1.5} size={17} className='text-primary' /></span>
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-500 dark:text-gray-400">No tags extracted yet</span>
                                            )
                                        }
                                    </div>}
                                </div>
                            </div>

                            {(watch("communityIds") ?? []).length > 0 && (
                                <>
                                    <hr className="dark:border-gray-700" />

                                    <div className="flex items-center space-x-2">
                                        <Controller
                                            name="terms"
                                            control={control}
                                            render={({ field }) => (
                                                <Checkbox
                                                    id="terms"
                                                    checked={field.value}
                                                    onCheckedChange={(checked) => {
                                                        if (checked && !field.value) {
                                                            // Open T&C modal first instead of checking directly
                                                            setShowTermsModal(true);
                                                        } else if (!checked) {
                                                            field.onChange(false);
                                                        }
                                                    }}
                                                    className="border-gray-400"
                                                />
                                            )}
                                        />
                                        <label
                                            htmlFor="terms"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-400 cursor-pointer"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const currentVal = watch('terms');
                                                if (!currentVal) {
                                                    setShowTermsModal(true);
                                                } else {
                                                    setValue('terms', false);
                                                }
                                            }}
                                        >
                                            I agree to the terms and conditions
                                        </label>
                                    </div>

                                    {/* Terms & Conditions Modal */}
                                    {showTermsModal && (
                                        <div
                                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
                                            onClick={(e) => e.target === e.currentTarget && setShowTermsModal(false)}
                                        >
                                            <div className="bg-[#1D1D1D] border border-[#3a3a3a] rounded-[16px] w-[560px] max-w-[95vw] max-h-[80vh] flex flex-col shadow-2xl text-white font-jacques-pro">
                                                {/* Header */}
                                                <div className="flex items-center justify-between px-6 py-4 border-b border-[#3a3a3a]">
                                                    <h2 className="text-lg font-bold">Terms &amp; Conditions</h2>
                                                    <button onClick={() => setShowTermsModal(false)} className="text-gray-400 hover:text-white transition-colors">
                                                        ✕
                                                    </button>
                                                </div>
                                                {/* Scrollable Content */}
                                                <div className="flex-1 overflow-y-auto px-6 py-4 text-sm text-gray-300 leading-relaxed space-y-3">
                                                    <p><strong className="text-white">1. Ownership of Content</strong><br />
                                                        By posting a Buzz, you confirm that the content is original and belongs to you. You grant CODE EDU the right to display and share it within the platform.</p>
                                                    <p><strong className="text-white">2. Appropriate Content</strong><br />
                                                        Your Buzz must not contain offensive, plagiarized, or misleading information. Any violation may result in content removal or account suspension.</p>
                                                    <p><strong className="text-white">3. CCI Assessment Rules</strong><br />
                                                        The Buzz you submit as part of Stage 2 will be used for evaluation. Once submitted as your final response, it cannot be edited or retracted.</p>
                                                    <p><strong className="text-white">4. Irreversibility</strong><br />
                                                        Once you click "Post Buzz" and submit your response, this action is final. Ensure your content accurately reflects your solution before proceeding.</p>
                                                    <p><strong className="text-white">5. Privacy</strong><br />
                                                        Your Buzz will be visible to other participants and assessors. Do not include personal or confidential information.</p>
                                                </div>
                                                {/* Footer Buttons */}
                                                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#3a3a3a]">
                                                    <button
                                                        onClick={() => setShowTermsModal(false)}
                                                        className="bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#4a4a4a] text-white text-sm font-medium px-5 py-2 rounded-[8px] transition-colors"
                                                    >
                                                        Decline
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setValue('terms', true);
                                                            setShowTermsModal(false);
                                                        }}
                                                        className="bg-[#f9038d] hover:bg-[#e0027a] text-black text-sm font-bold px-5 py-2 rounded-[8px] transition-colors"
                                                    >
                                                        I Agree &amp; Accept
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={goToCommunityFeed}
                                    className="bg-transparent text-white border-gray-600 hover:bg-gray-800"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-primary hover:bg-primary/90 text-white min-w-[120px]"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {editPostId ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        editPostId ? 'Update Post' : 'Post Buzz'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {cciParam !== '1' && (
                    <div className="col-span-1 lg:col-span-3">
                        <RightSidePanel />
                    </div>
                )}
            </div>
        </ConnectLayout>
    );
};

export default AddBuzz;