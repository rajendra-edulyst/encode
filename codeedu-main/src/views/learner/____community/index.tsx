import { Eye, ThumbsUp } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { IoIosMore } from 'react-icons/io'
import Post from './components/Post'
import { Link, useLocation } from 'react-router-dom'
import { fetchCommunityPosts, fetchCommunityTrending, deleteCommunityPost } from '@/services/public/CommunityService'
import { useCommunityDetailsStore } from '@/store/learner/____communityStore'
import { useEffect, useState } from 'react'
import { Post as PostType } from '@/@types/learner/community';
import Loading from '@/components/shared/Loading'
import MyPosts from './MyPosts'
import { useAuth } from '@/auth'
import { toast } from 'sonner'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import CommunityList from './CommunityLists'
import SearchInput from './SearchInput'
import Event from '@/views/learner/dashboard/components/Events';
import Internship from '@/views/learner/dashboard/components/Internship';


function index() {

    const { setCommunity, communityContent, setCommunityContent, error, setError, loading, setLoading } = useCommunityDetailsStore();
    const [trandingPosts, setTrandingPosts] = useState<PostType[]>([]);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab'); // Access 'tab' from URL
    const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const defaultTab = tab === 'posts' ? 'posts' : 'mywall';

    const fetchCommunityDetails = async () => {
        setError('');
        setLoading(true);
        try {
            const response = await fetchCommunityPosts('209')
            setCommunity(response?.data?.community);
            setCommunityContent(response?.data?.posts);
        } catch (error) {
            console.log('Error:', error)
            setError('Failed to load community details.');
        } finally {
            setLoading(false);
        }
    }

    const fetchTrendingPosts = async () => {
        try {
            const response = await fetchCommunityTrending('209');
            setTrandingPosts(response?.data?.posts);
        }
        catch (error) {
            console.log('Error:', error);
        }
    }

    useEffect(() => {
        fetchCommunityDetails();
        fetchTrendingPosts();
    }, []);

    if (loading) {
        return <Loading loading={loading} />
    }

    if (error) {
        return <p>{error}</p>
    }


    const handleDeleteDialogOpen = (post: PostType) => {
        setSelectedPost(post);
        setShowDeleteDialog(true);
    }

    const handleDelete = () => {
        if (!selectedPost) return;
        deleteCommunityPost(selectedPost.id).then(() => {
            toast.success('Post deleted successfully')
            const newCommunityContent = communityContent.filter((item: PostType) => item.id !== selectedPost.id);
            setCommunityContent(newCommunityContent);
            setSelectedPost(null);
        }).catch(() => {
            toast.error('Failed to delete post')
        });
        setShowDeleteDialog(false)
    }

    const { user } = useAuth();
    return (
        <div>
            <div className='relative'>
                {/* <img src="https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/community_banner.png" alt="Community Banner" className='w-full rounded-t-lg' /> */}
                <div>
                    <div className='absolute top-1/2 left-[60%] transform -translate-x-1/2 -translate-y-1/2'>
                        {/* <h1 className='text-white font-bold uppercase text-lg md:text-2xl xl:text-5xl xxl:text-7xl mt-10'>Community</h1> */}
                        {/* <h6 className='text-white text-sm md:text-lg xl:text-3xl'>CODE DESIGN FOUNDATION</h6> */}
                        {/* <div className='flex items-center mt-1 gap-1'>
                            <Users size={15} color='white' />
                            <span className='text-white'>20 Members</span>
                        </div> */}
                        {/* <p className='text-xs md:text-lg text-white mt-2'>Connect, collaborate, and create with fellow developers and designers. Share ideas, build projects, and level up your skills together!</p> */}
                    </div>
                    {/* <Link to="/communities/209" className='bg-pink-800 text-white px-3 py-1 rounded-lg absolute top-20 right-[1%] transform -translate-x-1/2 -translate-y-1/2'>Old Communities</Link> */}
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-12 gap-4'>
                <div className='md:col-span-8'>
                    <Tabs defaultValue={defaultTab} className='mt-3'>
                        <div className='flex justify-between items-center border-b border-gray-200 relative'>
                            <TabsList className='rounded-none w-full block px-0 py-0 h-auto'>
                                <TabsTrigger className='rounded-t px-5 rounded-b-none bg-transparent' value="mywall">Wall</TabsTrigger>
                                <TabsTrigger className='rounded-t px-5 rounded-b-none bg-transparent' value="posts">My Posts</TabsTrigger>
                                <TabsTrigger className='rounded-t px-5 rounded-b-none bg-transparent' value="mycommunities">My Communities</TabsTrigger>
                                <TabsTrigger className='rounded-t px-5 rounded-b-none bg-transparent' value="clubs">Discover</TabsTrigger>
                            </TabsList>
                            <SearchInput />
                            {/* <Input placeholder="Search club, people, tags" className='-mt-3 !py-1 !rounded-2xl !bg-gray-50 h-auto border focus-visible:ring-0 focus-visible:ring-offset-0' /> */}
                        </div>
                        <TabsContent value="mywall">
                            {Array.isArray(communityContent) &&
                                communityContent.map((communityItem: PostType, index) => (
                                    <Post key={index} post={communityItem} canDelete={communityItem?.created_by?.id == user.id} handleDeleteDialogOpen={handleDeleteDialogOpen} />
                                ))
                            }
                        </TabsContent>
                        <TabsContent value="posts">
                            <div className='flex justify-between items-center p-1'>
                                <h4>My Posts</h4>
                                <Link to="/communities/create-post" className='bg-primary text-white px-3 py-1 rounded-lg'>Create Post</Link>
                            </div>
                            <div className='mt-4'>
                                <MyPosts handleDeleteDialogOpen={handleDeleteDialogOpen} />
                            </div>
                        </TabsContent>
                        <TabsContent value="mycommunities">
                            <div className='flex justify-between items-center p-1'>
                                <h4>My Communities <span className='text-sm text-gray-400'>(Sample)</span></h4>
                            </div>
                            <CommunityList />

                        </TabsContent>
                        <TabsContent value="clubs">
                            <div className='flex justify-between items-center p-1'>
                                <h4>Explore Clubs & Communities</h4>
                            </div>
                            <CommunityList />

                        </TabsContent>
                    </Tabs>
                </div>
                <div className='md:col-span-4 pt-10'>
                    <div className='bg-white rounded-lg p-4 border border-gray-200'>
                        <h1 className='text-xl font-bold text-primary'>Design Buzz...</h1>
                        <ul className='list-inside mt-4 p-3 list-none border rounded-lg border-gray-200'>
                            {
                                trandingPosts.length > 0 ? (
                                    trandingPosts.slice(0, 4).map((item: PostType, index: number) => (
                                        <li key={index} className='border-b py-3'>
                                            <div className='flex items-center gap-2 justify-between'>
                                                <div>
                                                    <h6 className='text-sm'>{item.title}</h6>
                                                    <p className='text-gray-500 custom-prose'
                                                        dangerouslySetInnerHTML={{ __html: item.description && item.description.length > 50 ? item.description.slice(0, 50) + '...' : item.description }}
                                                    ></p>
                                                    <div className='flex items-center gap-2 mt-2'>
                                                        <p className='text-gray-500 flex gap-2 items-center'><ThumbsUp size={15} /> {item.like_count}</p>
                                                        <p className='text-gray-500 flex gap-2 items-center'><Eye size={15} />{item.view_count}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <p>No trending posts available</p>
                                )
                            }
                        </ul>
                        {/* <p>Not Available</p> */}
                    </div>

                    {/*  */}
                    <Internship />
                    <Event />

                </div>
            </div>
            <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure you want to delete this post?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will
                            permanently delete your post and remove it
                            from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={handleDelete}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default index