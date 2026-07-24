// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState } from 'react'
import { Button } from '@/components/ui/ShadcnButton'
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from '@/components/ui/shadcnAvatar'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Post as PostType } from '@/@types/learner/community'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { IoIosPeople } from "react-icons/io";
import { IoMdThumbsUp } from 'react-icons/io'
import { IoChatbubbleSharp } from 'react-icons/io5'
import { FaCircle } from 'react-icons/fa6'
import {
    likeCommunity,
    unlikeCommunity,
} from '@/services/learner/CommunityService'
import { Link } from 'react-router-dom'
import { timeAgo } from '@/utils/hooks/timeAgo'
import { EllipsisVertical } from 'lucide-react'
import EditPost from './EditPost'

interface PostProps {
    post: PostType
    canDelete?: boolean
    handleDeleteDialogOpen: (post: PostType) => void
}

const Post: React.FC<PostProps> = ({ post, canDelete, handleDeleteDialogOpen }) => {
    const [likes, setLikes] = useState<number>(post?.like_count || 0) // Initialize with post like count
    const [liked, setLiked] = useState<boolean>(!!post?.user_liked) // Convert 0/1 to boolean
    const [editPostDialogOpen, setEditPostDialogOpen] = useState(false)
    const [editSelectedPost, setEditSelectedPost] = useState<PostType | null>(null)


    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href)
    }

    const toggleLike = async () => {
        try {
            if (liked) {
                await unlikeCommunity(post.id)
                setLikes((prev) => Math.max(prev - 1, 0))
            } else {
                await likeCommunity(post.id)
                setLikes((prev) => prev + 1)
            }

            setLiked((prev) => !prev)
        } catch (error) {
            console.error('Failed to toggle like:', error)
        }
    }


    return (
        <>
            {/* <Card className="w-full p-4 mb-4 border border-gray-200 rounded-md shadow-sm">
                <div className="flex items-start justify-between">
                    <Link to={`/portfolio/${post?.created_by?.id}`} className="flex gap-4">
                        <Avatar className="h-14 w-14">
                            <AvatarImage src={post?.created_by?.profile_image ?? ''} alt={post?.created_by?.name} />
                            <AvatarFallback>{post?.created_by?.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className='text-sm text-gray-500 flex items-center gap-2 mb-1'>
                            <span className='font-semibold text-blue-600'>
                            </span>
                            <div className="flex items-center gap-2">
                                <span>•</span>
                                {post?.created_by?.name}

                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-2">
                                <span>•</span>
                                <span>
                                    {timeAgo(post?.created_at ?? '')}
                                </span>

                            </div>
                        </div>
                    </Link>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer"
                        >
                            <i className="fas fa-bookmark text-gray-600"></i>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="cursor-pointer"
                                >
                                    <EllipsisVertical size={20} className="text-gray-600" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                {
                                    canDelete && canDelete && (
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={() => {
                                                setEditPostDialogOpen(true)
                                                setEditSelectedPost(post)
                                            }}
                                        >
                                            Edit Post
                                        </DropdownMenuItem>
                                    )
                                }
                                {
                                    canDelete && canDelete && (
                                        <DropdownMenuItem
                                            className="cursor-pointer text-red-600"
                                            onClick={() => handleDeleteDialogOpen(post)}
                                        >
                                            Delete Post
                                        </DropdownMenuItem>
                                    )
                                }
                                {!canDelete && (
                                    <DropdownMenuItem className="cursor-pointer">
                                        <i className="fas fa-flag mr-2"></i>Report
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={handleCopyLink}
                                >
                                    Copy Link
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <Link to={`/communities/content/${post?.id}`}>
                    <div className="space-y-4 mt-3">
                        <h1 className="text-xl font-semibold mb-0">
                        </h1>
                        {post?.resource_path_thumbnail && <div className="">
                            <img src={post?.resource_path_thumbnail} className='w-28 h-28 object-cover rounded-md' alt={post?.title} />
                        </div>}
                        <div className="space-y-2 !mt-2 line-clamp-5 porse">
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: post?.description,
                                }}
                            />
                        </div>
                    </div>
                </Link>
                <div className="flex">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div
                            className="flex hover:bg-slate-300 p-1 cursor-pointer rounded-sm px-2 items-center gap-2"
                            onClick={toggleLike}
                        >
                            <div className="bg-primary p-1 rounded-md">
                                <IoMdThumbsUp size={16} className="text-white" />
                            </div>
                            <span>
                                {likes} <>Likes</>
                            </span>{' '}
                        </div>

                        <span>
                            <FaCircle size={5} />
                        </span>
                        <Link
                            to={`/communities/content/${post?.id}`}
                            className="flex items-center gap-2 hover:bg-slate-300 p-1 cursor-pointer rounded-sm px-2"
                        >
                            <div className="bg-primary p-1 rounded-md">
                                <IoChatbubbleSharp
                                    size={16}
                                    className="text-white"
                                />
                            </div>
                            <span>
                                {post?.comment_count} <>Comments</>
                            </span>
                        </Link>
                    </div>
                    {!canDelete && (
                        <Button size="sm" className="bg-primary ms-2 text-white justify-center flex rounded-full text-xs px-3">
                            Subscribe
                        </Button>
                    )}
                </div>

                <Separator />
            </div> 
            </Card> */}
            <Card className="w-full p-4 mb-4 border border-gray-200 rounded-md shadow-sm">
                <div className="flex gap-4">
                    {/* Thumbnail on Left */}
                    {post?.resource_path_thumbnail && (
                        <img
                            src={post.resource_path_thumbnail}
                            alt={post?.title}
                            className="w-[125px] object-cover rounded-md"
                        />
                    )}

                    {/* Right side content */}
                    <div className="flex-1">
                        <div className="mb-2">
                            {/* <span className="font-semibold text-blue-600">
                            {post?.community_name ?? "Community"} 
                            </span> 
                            <span className="font-semibold text-blue-600">Graphixx</span> */}
                            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                                <IoIosPeople className="text-blue-600 w-5 h-5" />
                                <span>Graphixx</span>
                            </div>

                            <div className='flex items-center gap-2 text-sm text-gray-500 mt-1'>

                                <Link to={`/portfolio/codeedu-dae124fa/${post?.created_by?.id}`} className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={post?.created_by?.profile_image ?? ''} alt={post?.created_by?.name} />
                                        <AvatarFallback>{post?.created_by?.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <span>{post?.created_by?.name}</span>
                                    <span>•</span>
                                    <span>{timeAgo(post?.created_at ?? '')}</span>
                                </Link>
                            </div>
                        </div>

                        {/* Post title */}
                        <Link to={`/communities/content/${post?.id}`}>
                            <h2 className="text-lg text-gray-900 hover:underline mb-1">
                                {post?.title}
                            </h2>
                        </Link>

                        {/* Short Description (2 lines) */}
                        <div
                            className="text-sm text-gray-700 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: post?.description }}
                        />

                        {/* Metrics Row */}
                        <div className="flex items-center gap-6 text-sm text-gray-500 mt-2">
                            <div
                                className="flex hover:bg-slate-300 p-1 cursor-pointer rounded-sm px-2 items-center gap-2"
                                onClick={toggleLike}
                            >
                                <div className="bg-primary p-1 rounded-md">
                                    <IoMdThumbsUp size={16} className="text-white" />
                                </div>
                                <span>
                                    {likes} <>Like</>
                                </span>{' '}
                                {/* Use state instead of post.like_count */}
                            </div>

                            <span>
                                <FaCircle size={5} />
                            </span>
                            <Link
                                to={`/communities/content/${post?.id}`}
                                className="flex items-center gap-2 hover:bg-slate-300 p-1 cursor-pointer rounded-sm px-2"
                            >
                                <div className="bg-primary p-1 rounded-md">
                                    <IoChatbubbleSharp
                                        size={16}
                                        className="text-white"
                                    />
                                </div>
                                <span>
                                    {post?.comment_count} <>Comment</>
                                </span>
                            </Link>
                            <div className="flex items-center gap-2">
                                {!canDelete && (
                                    <Button size="sm" className="bg-primary ms-2 text-white justify-center flex rounded-full text-xs px-3">
                                        Subscribe
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Dropdown Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <EllipsisVertical size={20} className="text-gray-600" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            {canDelete && (
                                <>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setEditPostDialogOpen(true);
                                            setEditSelectedPost(post);
                                        }}
                                    >
                                        Edit Post
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={() => handleDeleteDialogOpen(post)}
                                    >
                                        Delete Post
                                    </DropdownMenuItem>
                                </>
                            )}
                            {!canDelete && (
                                <DropdownMenuItem>
                                    <i className="fas fa-flag mr-2"></i>Report
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={handleCopyLink}>
                                Copy Link
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </Card>
            <EditPost show={editPostDialogOpen} onClose={setEditPostDialogOpen} post={editSelectedPost} />
        </>
    )
}
export default Post
