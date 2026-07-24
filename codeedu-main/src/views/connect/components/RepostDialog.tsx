import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/shadcnAvatar";
import { Button } from "@/components/ui/ShadcnButton";
import { Textarea } from "@/components/ui/textarea";
import { useSessionUser } from "@/store/authStore";
import { stripHtmlTags } from "@/utils/stripHtmlTags";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Post } from "@/@types/connect/posts";
import { useCreateRepost, useUpdateRepost } from "@/hooks/data/connect/usePosts";
import formatRelativeOrLong from "@/utils/formatDate";
import { Facebook, Linkedin, Loader } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { BsWhatsapp } from "react-icons/bs";

interface RepostDialogProps {
    post: Post;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isEdit?: boolean;
    repostId?: number;
}

const formSchema = z.object({
    description: z.string().min(1, "Please share your thoughts").max(500, "Maximum 500 characters allowed"),
});

type FormData = z.infer<typeof formSchema>;

const RepostDialog = ({ post, open, onOpenChange, isEdit = false, repostId }: RepostDialogProps) => {


    const [postInCommunity] = useState(false);
    const { profile_image, name } = useSessionUser((state) => state.user);
    const repostMutation = useCreateRepost();
    const updateRepostMutation = useUpdateRepost(repostId || 0);

    const { handleSubmit, control, watch, reset, setValue } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: '',
        },
    });

    // Set initial description when editing
    useEffect(() => {
        if (isEdit && post?.repost_description) {
            setValue('description', post.repost_description);
        }
    }, [isEdit, post?.repost_description, setValue]);

    const onSubmit = async (data: FormData) => {
        try {
            console.log("Repost data:", post);
            console.log("Repost data:", post?.category_id);

            const repostData = {
                joy_content_id: post.id,
                description: data.description,
                category_id: post?.category_id?.toString() || "", // Empty for wall posts
            };

            if (isEdit && repostId) {
                // Update existing repost
                await updateRepostMutation.mutateAsync(repostData);
            } else {
                // Create new repost
                await repostMutation.mutateAsync(repostData);
            }

            reset();
            onOpenChange(false);
        } catch (err) {
            console.error("Repost error:", err);
            const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again.";
            toast.error(isEdit ? "Update failed" : "Re-Buzz failed", {
                description: errorMessage,
            });
        }
    };

    const handleClose = () => {
        reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-full md:max-w-4xl bg-[#1a1a1a] dark:bg-[#1a1a1a] border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-primary">{isEdit ? 'Edit Re-Buzz' : 'Re-Buzz'}</DialogTitle>
                </DialogHeader>
                <DialogDescription className="max-h-[80vh] overflow-y-auto">
                    <form className="mx-auto" onSubmit={handleSubmit(onSubmit)}>
                        {/* Header Section */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <img
                                    src={profile_image || `https://ui-avatars.com/api/?name=${name}`}
                                    alt={name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <h2 className="text-lg font-semibold text-white">{name}</h2>
                                </div>
                            </div>
                        </div>

                        {/* Post Options - Hidden for now, always post to wall */}
                        {postInCommunity && (
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-white mb-2">Post to?</h3>
                                <RadioGroup className="flex space-x-6 focus:ring-0 focus-visible:ring-0" value="your-wall">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="your-wall" id="your-wall" className="focus:ring-0 focus-visible:ring-0 border-gray-500" />
                                        <Label htmlFor="your-wall" className="text-gray-300 cursor-pointer">Your Wall</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        )}

                        {/* Content Input Area */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-white mb-3">Share with your thought</h3>
                            <div className="relative">
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <>
                                            <Textarea
                                                {...field}
                                                placeholder="What's on your mind..."
                                                className="min-h-32 resize-none border-gray-600 bg-[#2a2a2a] text-white placeholder-gray-500 text-sm ring-0 focus:ring-0 focus-visible:ring-1 focus-visible:ring-primary"
                                                maxLength={500}
                                            />
                                            {error && (
                                                <p className="text-red-500 text-xs mt-1">{error.message}</p>
                                            )}
                                        </>
                                    )}
                                />
                                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                                    {watch("description")?.length || 0}/500
                                </div>
                            </div>
                        </div>

                        {/* Shared Content Preview */}
                        <div className="bg-[#2a2a2a] rounded-lg p-4 mb-6 border border-gray-700">
                            <div className='flex-1'>
                                <div>
                                    <div className='flex items-center text-primary gap-2 mb-2'>
                                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" className="w-5 h-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"></path></svg>
                                        <span className='text-primary text-sm font-bold'>{post?.organization_name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={post?.created_by_profile_image ?? `https://ui-avatars.com/api/?name=${post?.name}`} alt={post?.name} />
                                            <AvatarFallback>{post?.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex items-center text-xs text-gray-400">
                                            <span className='capitalize text-white'>{post?.name}</span>
                                            {post?.created_at && (
                                                <>
                                                    <span className="mx-1">•</span>
                                                    <span>{formatRelativeOrLong(post?.created_at)}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <h3 className="text-lg font-semibold mb-1 text-white">{post?.title}</h3>
                                    <p className="text-sm line-clamp-2 text-gray-300">{stripHtmlTags(post?.description) || ''}</p>
                                </div>
                                <div className='mb-3'>
                                    {post?.thumbnail_url && (
                                        <img src={post?.thumbnail_url} alt={post?.title} className="w-full object-cover rounded-lg h-48" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogDescription>
                <DialogFooter className="block">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-gray-300 font-medium">You can also share on</p>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    className="w-11 h-11 bg-[#2a2a2a] rounded-full flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors"
                                    onClick={() => {
                                        const text = encodeURIComponent(`${post?.title}\n\n${stripHtmlTags(post?.description).substring(0, 100)}...`);
                                        window.open(`https://wa.me/?text=${text}`, '_blank');
                                    }}
                                >
                                    <BsWhatsapp className="w-6 h-6" />
                                </button>
                                <button
                                    type="button"
                                    className="w-11 h-11 bg-[#2a2a2a] rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
                                    onClick={() => {
                                        const url = window.location.href;
                                        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                                    }}
                                >
                                    <Linkedin className="w-6 h-6" />
                                </button>
                                <button
                                    type="button"
                                    className="w-11 h-11 bg-[#2a2a2a] rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors"
                                    onClick={() => {
                                        const text = encodeURIComponent(`${post?.title}`);
                                        const url = window.location.href;
                                        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank');
                                    }}
                                >
                                    <FaXTwitter className="w-6 h-6" />
                                </button>
                                <button
                                    type="button"
                                    className="w-11 h-11 bg-[#2a2a2a] rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors"
                                    onClick={() => {
                                        const url = window.location.href;
                                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                                    }}
                                >
                                    <Facebook className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                        <Button
                            className="bg-primary text-white px-6 py-2 !rounded-button whitespace-nowrap cursor-pointer hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            disabled={repostMutation.isPending || updateRepostMutation.isPending}
                            type="submit"
                            onClick={handleSubmit(onSubmit)}
                        >
                            {(repostMutation.isPending || updateRepostMutation.isPending) && <Loader className="w-4 h-4 animate-spin" />}
                            {(repostMutation.isPending || updateRepostMutation.isPending)
                                ? (isEdit ? 'Updating...' : 'Re-Buzzing...')
                                : (isEdit ? 'Update' : 'Re-Buzz')
                            }
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default RepostDialog
