import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { Button } from "@/components/ui/ShadcnButton";
import { Input } from "@/components/ui/ShadcnInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/shadcnAlert";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Upload, X } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { JoEditConfig } from '@/utils/joeditConfig';
import JoditEditor from 'jodit-react';
import CommunityLayout from '../../layouts';
import { useCommunitiesStore } from '../../store/communityStore';
import { toast } from 'sonner';
import { addCommunityPost, fetchPostDetail, updateCommunityPost } from '../../services/CommunityService';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import nlp from 'compromise';
import { stripHtmlTags } from '@/utils/stripHtmlTags';
import { Badge } from '@/components/ui/badge';
import { Hints, Post, Suggestion } from '../../types/community';
import { usePostsStore } from '../../store/postStore';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import type { IJodit } from 'jodit/esm/types';


// Define the form schema using zod
const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    postType: z.enum(['text', 'image', 'video'], {
        required_error: 'Post type is required',
    }),
    description: z.string().optional(),
    communityIds: z.array(z.string()).optional(),
    tags: z.string().optional(),
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
    // term checkbox
    terms: z.boolean().optional()

})

type FormData = z.infer<typeof formSchema>;

const CreatePostPage: React.FC = () => {
    const editorConfig = useMemo(() => ({
        ...JoEditConfig,
        height: 250,
    }), []);

    const imageFileRef = useRef<HTMLInputElement>(null);
    const videoFileRef = useRef<HTMLInputElement>(null);
    const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
    const [videoPreview, setVideoPreview] = React.useState<string | null>(null);
    const { communities, fetchCommunities } = useCommunitiesStore();
    const [tagInput, setTagInput] = React.useState('');
    const [tags, setTags] = React.useState<string[]>([]);
    const [post, setPost] = React.useState<Post | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [createLoading, setCreateLoading] = React.useState(false);
    const { communityId } = location.state || {};
    const editorRef = useRef<IJodit | null>(null);
    const [showMentionBox, setShowMentionBox] = useState(false);
    const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
    const [mentionList, setMentionList] = useState<Hints[]>([]);
    const [mentionSearch, setMentionSearch] = useState("");
    const [searchTerm, setSearchTerm] = useState("");


    const { myPosts: myPostData, fetchMyPosts } = usePostsStore();
    const { data: myposts } = myPostData;


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
            communityIds: [],
            tags: '',
            imageFiles: [],
            videoFile: undefined,
        },
    });

    const postType = watch('postType');

    // Fetch communities on mount
    React.useEffect(() => {
        fetchCommunities();
        fetchMyPosts();
    }, [fetchCommunities]);

    useEffect(() => {
        if (communityId) {
            setValue("communityIds", [String(communityId)]);
        }
    }, [communityId, setValue]);


    // Cleanup URL object URLs
    React.useEffect(() => {
        return () => {
            imagePreviews.forEach(url => URL.revokeObjectURL(url));
            if (videoPreview) URL.revokeObjectURL(videoPreview);
        };
    }, [imagePreviews, videoPreview]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const currentFiles = watch('imageFiles') || [];
        if (e.target.files) {
            const files = Array.from(e.target.files).slice(0, 5);
            const newFiles = [...currentFiles, ...files];
            // check if newFiles exceeds 5 then slice it
            const validFiles = newFiles.slice(0, 5);
            setValue('imageFiles', validFiles);
            // create object URLs for previews
            setImagePreviews(validFiles.map(file => URL.createObjectURL(file)));
        }
    };

    const fetchMentionList = async (search: string) => {
        try {
            const response = await fetch(
                `https://elastic.edulystventures.com/search?org_key=1345643162&query=${encodeURIComponent(search)}`
            );
            const data = await response.json();
            if (data?.suggestions) {
                setMentionList([]);
                // get persons where type is person
                const persons = data.suggestions.filter((item: Suggestion) => item.type === 'person')[0]?.hits;
                setMentionList(persons || []);
            }
        } catch (error) {
            console.error("Error fetching mention list:", error);
        }
    };


    useEffect(() => {
        if (!mentionSearch.trim()) return;

        const delayDebounce = setTimeout(() => {
            fetchMentionList(mentionSearch);
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [mentionSearch]);


    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setValue('videoFile', file);
            if (videoPreview) URL.revokeObjectURL(videoPreview);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data: FormData) => {

        if (postType === 'text' && !data.description) {
            toast.error('Description is required for text posts');
            return;
        }

        if (postType === 'image' && (!data.imageFiles || data.imageFiles.length === 0)) {
            toast.error('At least one image is required for image posts');
            return;
        }

        if (postType === 'video' && !data.videoFile) {
            toast.error('Video file is required for video posts');
            return;
        }

        // check image file length and format
        if (data.imageFiles && data.imageFiles.length > 5) {
            toast.error('You can only upload a maximum of 5 images');
            return;
        }

        if (data.imageFiles && data.imageFiles.some(file => file.size > 10 * 1024 * 1024)) {
            toast.error('Each image must be less than 10MB');
            return;
        }

        // image format validation
        const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (data.imageFiles && data.imageFiles.some(file => !validImageTypes.includes(file.type))) {
            toast.error('Invalid image format. Supported formats: JPG, PNG, Webp');
            return;
        }

        if (data.videoFile && data.videoFile.size > 50 * 1024 * 1024) {
            toast.error('Video must be less than 50MB');
            return;
        }

        if (data.videoFile && !['video/mp4', 'video/avi', 'video/mov'].includes(data.videoFile.type)) {
            toast.error('Invalid video format. Supported formats: MP4, AVI, MOV');
            return;
        }

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('post_type', data.postType);
        formData.append('description', data.description ?? '');
        formData.append('category_id', data.communityIds?.map(String).join(',') || '');
        formData.append('status', 'Active');
        // video 2, image 4 and text 16
        if (data.postType === 'video') {
            formData.append('content_type', '2');
        } else if (data.postType === 'image') {
            formData.append('content_type', '4');
        } else {
            formData.append('content_type', '20');
        }
        formData.append('aspect_ratio', '16:9');
        formData.append('dimension', '');
        formData.append('thumbnail', data.imageFiles?.[0] ? data.imageFiles[0] : '');
        if (data.tags) {
            formData.append('tag', data.tags);
        }
        if (data.imageFiles) {
            if (data.imageFiles.length == 1) {
                formData.append('file', data.imageFiles[0]);
            }
            else {
                data.imageFiles.forEach((file, index) => {
                    formData.append(`file[${index}]`, file);
                });
            }
        }

        if (data.videoFile) {
            formData.append('file', data.videoFile);
        }

        setCreateLoading(true);
        const queryParams = new URLSearchParams(location.search);
        const postId = queryParams.get('id');

        try {
            if (postId) {
                await updateCommunityPost(postId, formData);
                toast.success('Post updated successfully');
            } else {
                await addCommunityPost(formData);
                toast.success('Post created successfully');
            }
            navigate(`/connect`);
        } catch (error) {
            console.error('Error creating post:', error);
            toast.error(postId ? 'Failed to update post' : 'Failed to create post');
        } finally {
            setCreateLoading(false);
        }
    };

    // const text = "Elon Musk founded SpaceX and Tesla in the early 2000s.";
    // const doc = nlp(text);
    // const nouns = doc.nouns().out('array');
    // console.log(nouns);
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const postId = queryParams.get('id');

        async function fetchAndPrefill() {
            if (!postId) return;
            try {
                const post = await fetchPostDetail(postId);
                if (post) {
                    setPost(post);
                    console.log('Fetched post:', post);
                    setValue('title', post.title || '');
                    setValue('description', post.description || '');
                    setValue('postType', post.resource_type === 'video' ? 'video' : 'text');
                }
            } catch (err) {
                console.error('Error fetching post:', err);
            }
        }

        if (postId) fetchAndPrefill();
    }, [location.search, setValue]);


    const titleLenght = watch('title')?.length;

    const memoizedEditorConfig = useMemo(() => ({
        ...editorConfig,
        placeholder: '',

    }), [editorConfig]);

    const getCaretCoordinates = (): { top: number; left: number } => {
        const editorInstance = editorRef.current;
        if (!editorInstance) return { top: 0, left: 0 };
        const editorDocument = editorInstance?.editor?.ownerDocument || document;
        const selection = editorDocument.getSelection();

        if (!selection || selection.rangeCount === 0) return { top: 0, left: 0 };

        const range = selection.getRangeAt(0).cloneRange();
        range.collapse(true);

        const marker = editorDocument.createElement("span");
        marker.id = "cursor-marker";
        marker.style.position = "absolute";
        marker.style.width = "1px";
        marker.style.height = "1px";
        marker.style.background = "transparent";

        try {
            range.insertNode(marker);
        } catch (err) {
            console.warn("No valid native range found in Jodit.", err);
            return { top: 0, left: 0 };
        }

        const rect = marker.getBoundingClientRect();
        const coords = {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
        };

        marker.remove();
        return coords;
    };



    const handleEditorChange = useCallback((newValue: string) => {
        const content = stripHtmlTags(newValue);
        const lastChar = content.slice(-1);
        if (lastChar === "@") {
            setShowMentionBox(true);
            setMentionSearch("");

            requestAnimationFrame(() => {
                const { top, left } = getCaretCoordinates();
                setMentionPosition({ top, left });
            });
        } else if (showMentionBox) {
            setShowMentionBox(false);
            setMentionSearch("");
        }
    }, [showMentionBox]);



    const handleMentionClick = (mention: string) => {
        const editorInstance = editorRef.current;

        if (!editorInstance) return;

        const sel = editorInstance?.selection;

        if (!sel) return;

        const range = sel.range;

        if (!range) return;


        const mentionRegex = /@(\w*)$/;
        const match = mentionRegex.exec(editorInstance.value);

        if (match) {
            const fullMention = match[0];
            const mentionStartPos = editorInstance.value.lastIndexOf(fullMention);
            const before = editorInstance.value.slice(0, mentionStartPos);
            const after = editorInstance.value.slice(mentionStartPos + fullMention.length);
            const updated = before + `${mention} ` + after;

            editorInstance.value = updated;
        } else {
            editorInstance.selection.insertHTML(`${mention} `);
        }

        setShowMentionBox(false);
        setMentionSearch("");
    };

    return (
        <CommunityLayout>
            {
                createLoading && (
                    <div className="fixed top-0 left-0 w-full h-screen z-50 flex items-center justify-center bg-white/50">
                        <div className="flex flex-col items-center justify-center space-x-2">
                            <Loader2 className="animate-spin text-[--IndexBlue] w-10 h-10" />
                            <span className="ml-2 text-[--IndexBlue]">Creating post...</span>
                        </div>
                    </div>
                )
            }
            <div className="container px-4 py-8 bg-card text-card-foreground p-4 shadow-none border-[0.5px] rounded-lg mt-5">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className='pb-6 mb-6'>
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-cblack">{post ? 'Edit Post' : 'Create Post'}</h1>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <Label htmlFor="post-title" className="block mb-2 font-medium">
                                    Title<span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="post-title"
                                    placeholder="Enter post title"
                                    maxLength={150}
                                    className="focus:outline-none focus:ring-0 focus-visible:ring-0"
                                    {...register('title')}
                                />
                                <div className=''>
                                    {titleLenght}/150
                                </div>
                                {errors.title && (
                                    <p className="text-red-500 text-sm">{errors.title.message}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="post-type" className="block mb-2 font-medium">
                                    Post Type<span className="text-red-500">*</span>
                                </Label>
                                <Controller
                                    name="postType"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="focus:outline-none focus:ring-0 focus-visible:ring-0">
                                                <SelectValue placeholder="Select post type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="text">Text</SelectItem>
                                                <SelectItem value="image">Image</SelectItem>
                                                <SelectItem value="video">Video</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.postType && (
                                    <p className="text-red-500 text-sm">{errors.postType.message}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="community-ids" className="block mb-2 font-medium">
                                    Communities
                                </Label>

                                <Controller
                                    name="communityIds"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={(value) => {
                                                const currentValues = field.value || [];
                                                if (!currentValues.includes(value)) {
                                                    field.onChange([...currentValues, value]);
                                                }
                                                setSearchTerm("");
                                            }}
                                        >
                                            <SelectTrigger className="focus:outline-none focus:ring-0 focus-visible:ring-0">
                                                <div className="text-left text-sm text-muted-foreground">
                                                    {field.value?.length === 0
                                                        ? "Select communities"
                                                        : "Select more communities"}
                                                </div>
                                            </SelectTrigger>

                                            <SelectContent>
                                                <div className="px-3 py-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Search communities..."
                                                        value={searchTerm}
                                                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                    />
                                                </div>
                                                {communities
                                                    .filter((c) => c?.user_mapping_id)
                                                    .filter((c) =>
                                                        c.title.toLowerCase().includes(searchTerm.toLowerCase())
                                                    )
                                                    .sort((a, b) => a.title.localeCompare(b.title))
                                                    .map((community) => (
                                                        <SelectItem key={community.id} value={String(community.id)}>
                                                            {community.title}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.communityIds && (
                                    <p className="text-red-500 text-sm">{errors.communityIds.message}</p>
                                )}
                                {(watch("communityIds") ?? []).length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {(watch("communityIds") ?? []).map((id) => {
                                            const community = communities.find((c) => String(c.id) === id);
                                            return (
                                                <div
                                                    key={id}
                                                    className="bg-gray-100 px-2 py-1 rounded flex items-center"
                                                >
                                                    <span>{community?.title}</span>
                                                    <button
                                                        type="button"
                                                        className="ml-2 text-red-500"
                                                        onClick={() => {
                                                            const updatedIds = (watch("communityIds") ?? []).filter(
                                                                (cid) => cid !== id
                                                            );
                                                            setValue("communityIds", updatedIds);
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                        </div>
                        {(postType === 'image' || postType === 'video') && (
                            <div className="space-y-4 mt-4">
                                {postType === 'image' && (
                                    <div>
                                        <Label className="block mb-2 font-medium">
                                            Images (Max 5, 10MB each)
                                        </Label>
                                        <div className="border-2 border-dashed border-[--IndexBlue] rounded-lg p-4 text-center">
                                            {
                                                imagePreviews?.length === 0 && <div
                                                    className="flex flex-col items-center justify-center space-y-4"
                                                    onClick={() => imageFileRef.current?.click()}
                                                >
                                                    <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                                                        <Upload className="text-[--IndexBlue]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-medium text-[--IndexBlue]">Upload Images</p>
                                                        <p className="text-sm text-gray-500 mt-1">Max 5 images, 10MB each</p>
                                                        <p className="text-sm text-gray-500 mt-1">Drag and drop or click to browse</p>
                                                        <p className="text-sm text-gray-500 mt-1">Supported formats: JPG, PNG, Webp</p>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="mt-4 cursor-pointer whitespace-nowrap !rounded-button"
                                                    >
                                                        Browse Images
                                                    </Button>
                                                </div>
                                            }
                                            {imagePreviews.length > 0 && (
                                                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-2">
                                                    {imagePreviews.map((preview, index) => (
                                                        <div key={index} className="relative border rounded-lg overflow-hidden">
                                                            <img
                                                                src={preview}
                                                                alt={`Preview ${index + 1}`}
                                                                className="w-full h-48 object-cover rounded-lg"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="link"
                                                                className="absolute top-1 right-1 bg-red-500 text-white w-6 h-7 flex items-center justify-center"
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
                                                            <div className="absolute bottom-1 right-1 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                                                {Math.round((watch('imageFiles')?.[index]?.size || 0) / 1024)} KB
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {
                                                        imagePreviews.length > 0 && imagePreviews.length < 5 && (
                                                            <div
                                                                className="flex flex-col items-center justify-center space-y-4 border border-dashed border-[--IndexBlue] rounded-lg cursor-pointer"
                                                                onClick={() => imageFileRef.current?.click()}
                                                            >
                                                                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                                                                    <Plus className="text-[--IndexBlue]" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-lg font-medium text-[--IndexBlue]">Add More</p>
                                                                    <p className="text-xs text-gray-500 mt-1">Max 5 images, 10MB each</p>
                                                                    <p className="text-xs text-gray-500 mt-1">Drag and drop or click to browse</p>
                                                                    <p className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, Webp</p>
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
                                            accept="image/*"
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
                                        <Label className="block mb-2 font-medium">
                                            Video (Max 50MB)
                                        </Label>
                                        <div className="border-2 border-dashed border-[--IndexBlue] rounded-lg p-8 text-center">
                                            {!videoPreview && (
                                                <div
                                                    className="flex flex-col items-center justify-center space-y-4"
                                                    onClick={() => videoFileRef.current?.click()}
                                                >
                                                    <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                                                        <Upload className="text-[--IndexBlue]" />
                                                    </div>
                                                    <div

                                                    >
                                                        <p className="text-lg font-medium text-[--IndexBlue]">Upload Video</p>
                                                        <p className="text-sm text-gray-500 mt-1">Max 50MB</p>
                                                        <p className="text-sm text-gray-500 mt-1">Drag and drop or click to browse</p>
                                                        <p className="text-sm text-gray-500 mt-1">Supported formats: MP4, AVI, MOV</p>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="mt-4 cursor-pointer whitespace-nowrap !rounded-button"
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
                            <Label htmlFor="description">
                                Description
                                {postType == 'text' && <span className="text-red-500">*</span>}
                            </Label>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <div className='relative'>
                                        <JoditEditor
                                            ref={(instance) => {
                                                if (instance) {
                                                    editorRef.current = instance;
                                                }
                                            }}
                                            value={field.value || ""}
                                            config={memoizedEditorConfig}
                                            onBlur={(newValue) => field.onChange(newValue)}
                                            onChange={(newValue) => {
                                                //  field.onChange(newValue);
                                                handleEditorChange(newValue);

                                                const doc = nlp(stripHtmlTags(newValue));
                                                const extractedTags = [
                                                    ...doc.people().out("array"),
                                                    ...doc.places().out("array"),
                                                ];
                                                const uniqueTags = Array.from(new Set(extractedTags.map((tag) => tag.toLowerCase())));
                                                setTags((prevTags) => {
                                                    const newTags = [...new Set([...prevTags, ...uniqueTags])];
                                                    setValue("tags", newTags.join(", "));
                                                    return newTags;
                                                });
                                                setValue("tags", uniqueTags.join(", "));
                                            }}
                                        />
                                        {/* <JoditEditor
                                            ref={(instance) => {
                                                if (instance) {
                                                    editorRef.current = instance;
                                                }
                                            }}
                                            config={memoizedEditorConfig}
                                            value={field.value || ""}  
                                            onBlur={(newValue) => field.onChange(newValue)} 
                                            onChange={(newValue) => {
                                                handleEditorChange(newValue);

                                                const doc = nlp(stripHtmlTags(newValue));
                                                const extractedTags = [
                                                    ...doc.people().out("array"),
                                                    ...doc.places().out("array"),
                                                ];
                                                const uniqueTags = Array.from(new Set(extractedTags.map((tag) => tag.toLowerCase())));

                                                setTags((prevTags) => {
                                                    const newTags = [...new Set([...prevTags, ...uniqueTags])];
                                                    setValue("tags", newTags.join(", "));
                                                    return newTags;
                                                });

                                                setValue("tags", uniqueTags.join(", "));
                                            }}
                                        /> */}
                                        {/* <JoditEditor
                                            ref={(instance) => {
                                                if (instance) {
                                                editorRef.current = instance;
                                                }
                                            }}
                                            config={memoizedEditorConfig}
                                            value={field.value || ""}
                                            onBlur={(newValue) => field.onChange(newValue)}
                                            onChange={(newValue) => {
                                                handleEditorChange(newValue);   
                                                debouncedExtractTags(newValue); 
                                            }}
                                            /> */}


                                        {showMentionBox && (
                                            <div
                                                className="absolute z-100 bg-white border shadow rounded"
                                                style={{
                                                    top: mentionPosition.top + 40,
                                                    left: mentionPosition.left,
                                                }}
                                            >
                                                <Command>
                                                    <CommandInput placeholder="Search users..." value={mentionSearch}
                                                        onValueChange={(value) => setMentionSearch(value)}
                                                    />
                                                    <CommandList>
                                                        {mentionList.length > 0 ? (
                                                            mentionList.map((person, index) => (
                                                                <CommandItem
                                                                    key={index}
                                                                    className="cursor-pointer"
                                                                    value={person?.name}
                                                                    onSelect={() => handleMentionClick(person?.name ?? '')}
                                                                >
                                                                    {person?.name}
                                                                </CommandItem>
                                                            ))
                                                        ) : (
                                                            <CommandEmpty>No results found.</CommandEmpty>
                                                        )}
                                                    </CommandList>
                                                </Command>

                                            </div>
                                        )}
                                    </div>
                                )}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm">{errors.description.message}</p>
                            )}
                        </div>
                        <div className='mt-4'>
                            <Label htmlFor="tags" className="block mb-2 font-medium">
                                Tags
                            </Label>

                            <Input
                                id="tags"
                                placeholder="Enter tags (comma-separated)"
                                className="focus:outline-none focus:ring-0 focus-visible:ring-0"
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
                            <div className="text-sm text-gray-500 mt-1">
                                {tags.length}/10
                            </div>

                            {errors.tags && (
                                <p className="text-red-500 text-sm">{errors.tags.message}</p>
                            )}
                            {tags.length !== 0 && <div className='mt-3'>
                                <div className='flex items-center justify-between mb-2'>
                                    <p className="text-sm text-gray-500 mb-2">Extracted Tags:</p>
                                    <Badge variant="outline" className="px-2 py-1 rounded gap-2 cursor-pointer"
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
                                                <Badge key={index} className="bg-[--IndexBlue] text-white gap-1 px-0.5 pl-1">
                                                    {tag} <span className="text-gray-300 bg-white rounded-full"
                                                        onClick={() => {
                                                            const newTags = tags.filter((_, i) => i !== index);
                                                            setTags(newTags);
                                                            setValue('tags', newTags.join(', '));
                                                        }}>
                                                        <X strokeWidth={1.5} size={17} className='text-[--IndexBlue]' /></span>
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-gray-500">No tags extracted yet</span>
                                    )
                                }
                            </div>}
                            {errors.tags && (
                                <p className="text-red-500 text-sm">{errors.tags.message}</p>
                            )}
                        </div>
                    </div>

                    {(watch("communityIds") ?? []).length > 0 && (
                        <>
                            <hr />
                            <Alert className="bg-[--IndexBlue]/50 border-[--IndexBlue] text-[--IndexBlue] mb-8">
                                <div className="flex items-center">
                                    <i className="fas fa-circle-info mr-2 text-[--IndexBlue]"></i>
                                    <AlertDescription>
                                        Post will be reviewed before being published to selected communities.
                                    </AlertDescription>
                                </div>
                            </Alert>
                        </>
                    )}
                    {/* <div className="flex items-start gap-3">
                        <Checkbox id="terms-2" className="bg-white data-[state=checked]:bg-white data-[state=checked]:text-white data-[state=checked]:bg-blue-500" />
                        <div className="grid gap-1">
                            <Label htmlFor="terms-2">Accept terms and conditions</Label>
                            <p className="text-muted-foreground text-sm">
                                By clicking this checkbox, you agree to the terms and conditions.
                            </p>
                        </div>
                    </div> */}

                    {myposts?.length == 0 && (
                        <div className="flex items-start gap-3">
                            <Controller
                                name="terms"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        id="terms-2"
                                        checked={field.value}
                                        className="bg-white  data-[state=checked]:text-white data-[state=checked]:bg-blue-500"
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />

                            <div className="grid gap-1">
                                <Label htmlFor="terms-2">Accept terms and conditions</Label>
                                <p className="text-muted-foreground text-sm">
                                    By clicking this checkbox, you agree to the{" "}
                                    <a
                                        href="/community/terms"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-cblue hover:underline"
                                    >
                                        Terms and Conditions
                                    </a>
                                </p>
                                {errors.terms && (
                                    <p className="text-red-500 text-sm">{errors.terms.message}</p>
                                )}
                            </div>

                        </div>
                    )}

                    <div className="flex justify-end space-x-2 mt-8">
                        {/* <Link to={`/community/myposts`}>
                        <Button
                            variant="outline"
                            disabled={createLoading}
                            className="cursor-pointer whitespace-nowrap !rounded-button border border-[--IndexBlue] text-[--IndexBlue]"
                        >
                            Cancel
                        </Button>
                        </Link> */}
                        {!createLoading ? (
                            <Link to={`/community`}>
                                <Button
                                    variant="outline"
                                    className="cursor-pointer whitespace-nowrap !rounded-button border border-[--IndexBlue] text-[--IndexBlue]"
                                >
                                    Cancel
                                </Button>
                            </Link>
                        ) : (
                            <Button
                                variant="outline"
                                disabled
                                className="cursor-pointer whitespace-nowrap !rounded-button border border-[--IndexBlue] text-[--IndexBlue]"
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            type="submit"
                            disabled={createLoading}
                            className="bg-[--IndexBlue] text-white cursor-pointer whitespace-nowrap !rounded-button"
                        >
                            {post ? 'Edit Post' : 'Create Post'}
                        </Button>
                    </div>
                </form>
            </div>
        </CommunityLayout>
    );
};

export default CreatePostPage;