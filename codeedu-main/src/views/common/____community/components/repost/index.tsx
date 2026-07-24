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
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/shadcnAvatar";
import { Button } from "@/components/ui/ShadcnButton";
import { Textarea } from "@/components/ui/textarea";
import { useSessionUser } from "@/store/authStore";
import { stripHtmlTags } from "@/utils/stripHtmlTags";
import { useCommunitiesStore } from "@/views/common/community/store/communityStore";
import { Post } from "@/views/common/community/types/community"
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { usePostsStore } from "../../store/postStore";
import { toast } from "sonner";

interface RePostProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
}

const formSchema = z.object({
  description: z.string(),
});

type FormData = z.infer<typeof formSchema>;

const RePost = ({ post, open, onOpenChange, isEdit= false }: RePostProps) => {
  const [postInCommunity, setPostInCommunity] = useState(false);
  const [selectedCommunities, setSelectedCommunities] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { profile_image, name } = useSessionUser((state) => state.user)
  


  const { repost, updateRepost } = usePostsStore();

  const { communities } = useCommunitiesStore();

  const { handleSubmit, control, watch, setValue } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
    },
  });


  // Filter out selected communities from available options
  const filteredCommunities = communities?.filter(
    community => !selectedCommunities.includes(community.id)
  );

  const handleCommunitySelect = (value: number) => {
    setSelectedCommunities(prev => [...prev, value]);
  };

  const handleRemoveCommunity = (community: number) => {
    setSelectedCommunities(prev => prev.filter(c => c !== community));
  };
const onSubmit = async (data: FormData) => {
  const categoryIds = selectedCommunities.join(",");

  if (isEdit) {
    const updateData = {
      description: data.description,
      category_id: categoryIds,
      status: "Active",
    };

    if (!post.repost_id) {
      toast.error("Cannot update repost. Missing repost ID.");
      return;
    }

    try {
      await updateRepost(post.repost_id, updateData); 
      toast.success("Repost updated successfully!");
      onOpenChange(false);
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  } else {
    const repostData = {
      joy_content_id: post.id,
      description: data.description,
      category_id: categoryIds,
    };

    try {
      await repost(post.id, repostData);
      toast.success("Repost successful!", {
        description: "Your post has been successfully reposted.",
      });
      onOpenChange(false);
    } catch (err) {
      console.error("Repost error:", err);
      toast.error("Repost failed. Please try again.");
    }
  }
};








useEffect(() => {
  if (open && isEdit && post) {
    setSelectedCommunities(post.repost_category_id ? [post.repost_category_id] : []);
    
    const cleanDescription = stripHtmlTags(post.repost_description || ""); 
    setValue("description", cleanDescription);

    setPostInCommunity(!!post.repost_category_id);
  }
}, [open, isEdit, post, setValue]);




  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full md:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-cblue">{isEdit ? "Edit Repost" : "Repost"}</DialogTitle>
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
                  <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
                  {/* <p className="text-sm text-gray-500">Visual Designer</p> */}
                </div>
              </div>
            </div>

            {/* Post Options */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Post to?</h3>
              <RadioGroup className="flex space-x-6 focus:ring-0 focus-visible:ring-0" value={postInCommunity ? "community" : "your-wall"} onValueChange={(value) => setPostInCommunity(value === "community")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="your-wall" id="your-wall" className="focus:ring-0 focus-visible:ring-0" />
                  <Label htmlFor="your-wall" className="text-gray-700 cursor-pointer">Your Wall</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="community" id="community" className="focus:ring-0 focus-visible:ring-0" />
                  <Label htmlFor="community" className="text-gray-700 cursor-pointer">Community</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Community Selector */}
            {postInCommunity && (
              <div className="mb-6">
                <Label className="text-lg font-medium text-gray-900 mb-3 block">
                  Community<span className="text-red-500 ml-1">*</span>
                </Label>
                <Select onValueChange={(value) => handleCommunitySelect(Number(value))}>
                  <SelectTrigger className="w-full focus:ring-0 focus-visible:ring-0">
                    <div className="py-2 text-sm text-gray-500">
                      {selectedCommunities.length === 0
                        ? "Select communities"
                        : `${selectedCommunities.length} selected`}
                    </div>
                  </SelectTrigger>

                  <SelectContent>
                    {/* Search Input */}
                    <div className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="Search community..."
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    {/* Filtered List */}
                    {[...filteredCommunities]
                      .filter((community) =>
                        community.title.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .sort((a, b) => a.title.localeCompare(b.title))
                      .map((community) => (
                        <SelectItem key={community.id} value={community.id.toString()}>
                          {community.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                {/* Selected Communities Chips */}
                {selectedCommunities.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedCommunities.map((communityId) => (
                      <div
                        key={communityId}
                        className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700"
                      >
                        {communities?.find((c) => c.id === communityId)?.title}
                        <button
                          className="ml-2 text-gray-500 hover:text-gray-700"
                          onClick={() => handleRemoveCommunity(communityId)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* Content Input Area */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Share with your thought</h3>
              <div className="relative">
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="What's on your mind..."
                      className="min-h-32 resize-none border-gray-200 text-sm ring-0 focus:ring-0 focus-visible:ring-0 text-gray-900"
                      maxLength={250}
                    />
                  )}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {watch("description")?.length || 0}/250
                </div>
              </div>
            </div>

            {/* Shared Content Preview */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
              <div className='flex-1'>
                <div>
                  <Link to={`/community/mycommunities/${post?.category_id}`}>
                    <div className='flex gap-2 mb-2 rounded-lg overflow-hidden cursor-pointer'>
                      <img src='/img/icons/people.png' className='w-5 h-5' /> {post?.category_name || 'Community Name'}
                    </div>
                  </Link>
                  <Link to={`/portfolio/${post?.created_by}`}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={post.profile_image ?? `https://ui-avatars.com/api/?name=${post.name}`} alt={post.name} />
                        <AvatarFallback>{post?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center text-xs text-cblack">
                          <span className='capitalize'>{post.name}</span>
                          <span className="mx-1">•</span>
                          <span>{post?.created_at && <span>{new Date(post?.created_at * 1000).toLocaleString(
                            'en-IN',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }
                          )}</span>}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="mb-3 cursor-pointer">
                  <Link to={`/community/wall/post/${post.id}`}>
                    <h3 className="text-lg font-semibold mb-1 text-cblack">{post.title}</h3>
                    <p className="text-sm line-clamp-2 text-cblack">{stripHtmlTags(post.description) || ''}</p>
                  </Link>
                </div>
                <div className='mb-3 cursor-pointer'>
                  <Link to={`/community/wall/post/${post.id}`}>
                    {post.thumbnail_url && (
                      <img src={post.thumbnail_url} alt={post.title} className="w-full object-cover rounded-lg h-48" />
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </DialogDescription>
        <DialogFooter className="block">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-cblack font-medium">You can also post on</p>
              <div className="flex space-x-3">
                <button className="w-11 h-11 bg-[#f1f1f1] rounded-full flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors">
                  <img src="https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/icons/whatsapp.png" alt="WhatsApp" className="w-6 h-6" />
                </button>
                <button className="w-11 h-11 bg-[#f1f1f1] rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                  <img src="https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/icons/linkedin.png" alt="LinkedIn" className="w-6 h-6" />
                </button>
                <button className="w-11 h-11 bg-[#f1f1f1] rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
                  <img src="https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/icons/twitter.png" alt="Twitter" className="w-6 h-6" />
                </button>
                <button className="w-11 h-11 bg-[#f1f1f1] rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                  <img src="https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/icons/facebook.png" alt="Facebook" className="w-6 h-6" />
                </button>
                <button className="w-11 h-11 bg-[#f1f1f1] rounded-full flex items-center justify-center cursor-pointer hover:from-purple-600 hover:to-pink-600 transition-colors">
                  <img src="https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/icons/instagram.png" alt="Instagram" className="w-6 h-6" />
                </button>
              </div>
            </div>
            <Button className="bg-[--IndexBlue] text-white px-6 py-2 !rounded-button whitespace-nowrap cursor-pointer" onClick={handleSubmit(onSubmit)}>
              {isEdit ? "Update" : "Repost"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default RePost

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/shadcnAvatar";
// import { Button } from "@/components/ui/ShadcnButton";
// import { Textarea } from "@/components/ui/textarea";
// import { JoEditConfig } from "@/utils/joeditConfig";
// import { stripHtmlTags } from "@/utils/stripHtmlTags";
// import { Post } from "@/views/common/community/types/community"
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMemo, useState } from "react";
// import { Controller, useForm } from "react-hook-form";

// import { Link } from "react-router-dom";
// import { z } from "zod";

// interface RePostProps {
//   post: Post;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }


// const formSchema = z.object({
//   description: z.string(),
//   communities: z.string().optional(),
// });

// type FormData = z.infer<typeof formSchema>;


// const RePost = ({ post, open, onOpenChange }: RePostProps) => {

//   const [postInCommunity, setPostInCommunity] = useState(false);

//   const editorConfig = useMemo(() => ({
//     ...JoEditConfig,
//     height: 250
//   }), []);

//   const { register, handleSubmit, formState: { errors }, control } = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: '',
//       description: '',
//     },
//   });

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="w-full md:max-w-4xl">
//         <DialogHeader>
//           <DialogTitle className="text-2xl text-cblue">Repost</DialogTitle>
//         </DialogHeader>
//         <DialogDescription className="max-h-[80vh] overflow-y-auto">
//           <div className="mx-auto">
//             {/* Header Section */}
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center space-x-3">
//                 <img
//                   src="https://readdy.ai/api/search-image?query=professional%20woman%20with%20dark%20hair%20smiling%20warmly%20wearing%20modern%20business%20attire%20against%20clean%20white%20background%20studio%20portrait%20photography&width=60&height=60&seq=profile001&orientation=squarish"
//                   alt="Ashima Malhotra"
//                   className="w-12 h-12 rounded-full object-cover"
//                 />
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-900">Ashima Malhotra</h2>
//                   <p className="text-sm text-gray-500">Visual Designer</p>
//                 </div>
//               </div>
//             </div>

//             {/* Post Options */}
//             <div className="mb-6">
//               <h3 className="text-lg font-medium text-gray-900 mb-2">Post to?</h3>
//               <RadioGroup className="flex space-x-6  focus:ring-0 focus-visible:ring-0" value={postInCommunity ? "community" : "your-wall"} onValueChange={(value) => setPostInCommunity(value === "community")}>
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="your-wall" id="your-wall" className=" focus:ring-0 focus-visible:ring-0" />
//                   <Label htmlFor="your-wall" className="text-gray-700 cursor-pointer">Your Wall</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="community" id="community" className=" focus:ring-0 focus-visible:ring-0" />
//                   <Label htmlFor="community" className="text-gray-700 cursor-pointer">Community</Label>
//                 </div>
//               </RadioGroup>
//             </div>

//             {/* Community Selector */}
//             {
//               postInCommunity &&
//               <div className="mb-6">
//                 <Label className="text-lg font-medium text-gray-900 mb-3 block">
//                   Community<span className="text-red-500 ml-1">*</span>
//                 </Label>
//                 <Select onValueChange={(value) => console.log(value)}>
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="Select a community" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="community1">Community 1</SelectItem>
//                     <SelectItem value="community2">Community 2</SelectItem>
//                     <SelectItem value="community3">Community 3</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             }

//             {/* Content Input Area */}
//             <div className="mb-6">
//               <h3 className="text-lg font-medium text-gray-900 mb-3">Share with your thought</h3>
//               <div className="relative">
//                 <Controller
//                   name="description"
//                   control={control}
//                   rules={{ required: true }}
//                   render={({ field }) => (
//                     <Textarea
//                       {...field}
//                       placeholder="What's on your mind..."
//                       className="min-h-32 resize-none border-gray-200 text-sm ring-0 focus:ring-0 focus-visible:ring-0"
//                       maxLength={250}
//                     />
//                   )}
//                 />
//                 <div className="absolute bottom-3 right-3 text-xs text-gray-400">
//                   100/250
//                 </div>
//               </div>
//             </div>

//             {/* Shared Content Preview */}
//             <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
//               <div className='flex-1'>
//                 <div>
//                   <Link to={`/community/mycommunities/${post?.category_id}`}>
//                     <div className='flex gap-2  mb-2 rounded-lg overflow-hidden cursor-pointer'>
//                       <img src='./img/icons/people.png' className='w-5 h-5' /> {post?.category_name || 'Community Name'}
//                     </div>
//                   </Link>
//                   <Link to={`/portfolio/${post?.created_by}`}>
//                     <div className="flex items-center gap-2">
//                       <Avatar className="h-6 w-6">
//                         <AvatarImage src={post.profile_image ?? `https://ui-avatars.com/api/?name=${post.name}`} alt={post.name} />
//                         <AvatarFallback>{post.name.charAt(0)}</AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <div className="flex items-center text-xs text-cblack">
//                           <span className='capitalize'>{post.name}</span>
//                           <span className="mx-1">•</span>
//                           <span>{post?.created_at && <span>{new Date(post?.created_at * 1000).toLocaleString(
//                             'en-IN',
//                             {
//                               year: 'numeric',
//                               month: 'short',
//                               day: 'numeric',
//                             }
//                           )}</span>}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </Link>
//                 </div>
//                 <div className="mb-3 cursor-pointer">
//                   <Link to={`/community/wall/post/${post.id}`}>
//                     <h3 className="text-lg font-semibold mb-1 text-cblack">{post.title}</h3>
//                     <p className="text-sm line-clamp-2 text-cblack">{stripHtmlTags(post.description) || 'No description provided.'}</p>
//                   </Link>
//                 </div>
//                 <div className='mb-3 cursor-pointer'>
//                   <Link to={`/community/wall/post/${post.id}`}>
//                     {post.thumbnail_url && (
//                       <img src={post.thumbnail_url} alt={post.title} className="w-full object-cover rounded-lg h-48" />
//                     )}
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </DialogDescription>
//         <DialogFooter className="block">
//           <div className="flex items-center justify-between">
//             <div className="flex flex-col gap-2">
//               <p className="text-sm text-cblack font-medium">You can also post on</p>
//               <div className="flex space-x-3">
//                 <button className="w-11 h-11 bg-[#f1f1f1] rounded-full flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors">
//                   <img src="https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/icons/whatsapp.png" alt="WhatsApp" className="w-6 h-6" />
//                 </button>
//                 <button className="w-11 h-11 bg-[#f1f1f1] rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
//                   <img src="https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/icons/linkedin.png" alt="LinkedIn" className="w-6 h-6" />
//                 </button>
//                 <button className="w-11 h-11 bg-[#f1f1f1] rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
//                   <img src="https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/icons/twitter.png" alt="Twitter" className="w-6 h-6" />
//                 </button>
//                 <button className="w-11 h-11 bg-[#f1f1f1] rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
//                   <img src="https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/icons/facebook.png" alt="Facebook" className="w-6 h-6" />
//                 </button>
//                 <button className="w-11 h-11 bg-[#f1f1f1] rounded-full flex items-center justify-center cursor-pointer hover:from-purple-600 hover:to-pink-600 transition-colors">
//                   <img src="https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/icons/instagram.png" alt="Instagram" className="w-6 h-6" />
//                 </button>
//               </div>
//             </div>
//             <Button className="bg-[--IndexBlue] text-white px-6 py-2 !rounded-button whitespace-nowrap cursor-pointer">
//               Repost
//             </Button>
//           </div>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog >
//   )
// }

// export default RePost

