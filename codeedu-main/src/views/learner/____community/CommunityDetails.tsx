import React, { useEffect, useState } from 'react'
import { fetchCommunityById } from '@/services/public/CommunityService'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useCommunityDetailsStore } from '@/store/learner/____communityStore'
import { FaPlus } from 'react-icons/fa6';
import { BsChat, BsHeart, BsPeople } from 'react-icons/bs';
import { CommunityCategory, Post } from '@/@types/learner/community';
import { formatDistanceToNow } from "date-fns";
import { fetchCreateContent } from '@/services/learner/CreateContentService';
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import { likeCommunity, unlikeCommunity } from '@/services/learner/CommunityService';
// import { useCommunityStore } from '@/store/public/communityStore';


function CommunityDetails() {

    const { id = '209' } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { community, setCommunity, communityContent, setCommunityContent, error, setError, loading, setLoading } = useCommunityDetailsStore();
    const [likedCommunities, setLikedCommunities] = useState<{ [key: number]: boolean }>({})
    // const { communities, setCommunities } = useCommunityStore();

    const [showModal, setShowModal] = React.useState<boolean>(false);
    const fetchCommunityDetails = async () => {
        setError('');
        setLoading(true);
        if (!id) {
            setError('Community not found.')
            return
        }
        try {
            const response = await fetchCommunityById(id ?? '209')
            setCommunity(response?.category);
            setCommunityContent(response?.list);
        } catch (error) {
            console.log('Error:', error)
            setError('Failed to load community details.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCommunityDetails();
    }, [id]);



    const [formData, setFormData] = useState({
        category_id: id,
        title: '',
        description: '',
        content_type: 'carvaan',
        post_type: '',
        status: 1,
        aspect_ratio: '',
        dimension: { height: 0, width: 0 },
        thumbnail: null,
        file: null
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, file: e.target.files[0] })
        }
    }

    const toggleModal = () => {
        setShowModal(!showModal)
    }

    const handleCommunityContent = (communityItem: Post) => {
        navigate(`/communities/content/${communityItem.id}`, {
            state: { content: communityItem },
        })
    }

    const handleSubmit = async () => {
        console.log('Form Data:', formData)
        toggleModal()

        if (!formData) {
            setError('Community not found.')
            return
        }

        try {
            setLoading(true)
            await fetchCreateContent(formData)
            fetchCommunityDetails();
        } catch (err) {
            setError('Failed to load community details.')
            console.log(err)
        } finally {
            setLoading(false)
        }
    }


    const handleAddCommunityPostContent = (community: CommunityCategory) => {
        navigate(`/communities/create-post/`, {
            state: { community: community },
        })
    }

    if (loading) {
        return <Loading loading={loading} />
    }

    if (error) {
        return <Alert type="danger" showIcon={true} title={error} />
    }

    const toggleLike = async (id: number) => {
        try {
            if (likedCommunities[id]) {
                await unlikeCommunity(id)
            } else {
                await likeCommunity(id)
            }
            const updatedCommunities = communityContent.map((communityItem) => {
                if (communityItem.id === id) {
                    return {
                        ...communityItem,
                        like_count: likedCommunities[id]
                            ? communityItem.like_count - 1
                            : communityItem.like_count + 1,
                    }
                }
                return communityItem;
            })
            setCommunityContent(updatedCommunities);
            setLikedCommunities((prev) => ({
                ...prev,
                [id]: !prev[id],
            }))
        } catch (error) {
            console.error('Failed to toggle like:', error)
        }
    }

    return (
        <>
            <div>
                <div className="relative h-[300px] md:h-[400px] bg-[#1A1D29] overflow-hidden rounded-lg">
                    <div className="absolute inset-0">
                        <img
                            src={community?.image || "https://default-image-url.com"}
                            alt={community?.title}
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
                <div className='rounded-lg shadow -mt-72 w-[90%] mx-auto bg-white relative'>
                    <div className="relative p-3 flex justify-between">
                        <div>
                            <h3 className="text-dark w-full">
                                {community?.title}
                            </h3>
                            <div className="flex items-center">
                                <BsPeople className="text-dark" />
                                <span className="text-dark ml-2">
                                    {community?.total_user_joined} Members
                                </span>
                            </div>
                        </div>
                        <div className='flex gap-3'>
                            <div>
                                <div className="bg-primary text-white px-3 flex items-center gap-2 p-2 rounded-md cursor-pointer" onClick={() => handleAddCommunityPostContent(community)}>
                                    <FaPlus />
                                    <button
                                    >Create Post</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='p-3'>
                        <p className='text-lg text-justify'>
                            {community?.description}
                        </p>
                    </div>
                </div>
                {/* communitie content */}
                <div className="relative  w-[90%] mx-auto">
                    {Array.isArray(communityContent) &&
                        communityContent.map((communityItem: Post) => (
                            <div key={`communitylist-${communityItem.id}`}
                                className="dark:bg-gray-900 bg-white mt-5 transition-transform rounded-lg shadow p-4"
                            >
                                <div className='flex justify-start items-center gap-2 mb-3'>
                                    <img src={`https://ui-avatars.com/api/?name=PrakashSolanki&background=random&color=fff`} alt={communityItem.created_by_name} className='w-10 h-10 rounded-full' />
                                    <div>
                                        <h3 className='font-bold text-sm dark:text-white'>{communityItem.created_by_name}</h3>
                                        <p className='text-sm dark:text-gray-200'>
                                            {typeof communityItem?.created_at === 'number' && communityItem.created_at > 0
                                                ? formatDistanceToNow(new Date(communityItem.created_at * 1000), { addSuffix: true })
                                                : 'Loading...'}
                                        </p>

                                    </div>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 cursor-pointer' onClick={() => handleCommunityContent(communityItem)}>
                                    <img
                                        src={communityItem.thumbnail_url}
                                        alt={communityItem.title}
                                        className="object-cover w-full h-[300px] rounded"
                                    />
                                    <div className="">
                                        <h2 className="font-bold text-xl dark:text-white">{communityItem.title}</h2>
                                        <p
                                            className="text-sm dark:text-gray-200 line-clamp-[8]"
                                            dangerouslySetInnerHTML={{
                                                __html: communityItem.description,
                                            }}
                                        />
                                        <div className="mt-3">
                                            <a className="text-primary"
                                                onClick={() => handleCommunityContent(communityItem)}
                                            >Read More ...</a>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex justify-between items-center pt-3'>
                                    <div className='flex gap-4'>
                                        <div className='flex gap-1 items-center'>
                                            <button className='text-primary flex items-center gap-1 text-base' onClick={() => toggleLike(communityItem.id)}>
                                                <BsHeart /> {communityItem.like_count}
                                            </button>
                                        </div>
                                        <div className='flex gap-1 items-center' onClick={() => handleCommunityContent(communityItem)}>
                                            <button className='text-primary flex items-center gap-1 text-base'>
                                                <BsChat />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
                {communityContent.length === 0 && (
                    <div className="flex items-center ">
                        {/* no post avilable add first post */}
                        <div>
                            <p className="text-gray-400">No content found, You can add first content to click on create content button</p>
                        </div>
                    </div>
                )}

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-bold mb-4">Create Content</h2>
                            <div>
                                <label className="block mb-2">Title</label>
                                <input type="text" name="title" placeholder='title' value={formData.title} onChange={handleInputChange} className="w-full p-2 border rounded" />

                                <label className="block mt-4 mb-2">Description</label>
                                <textarea name="description" placeholder='description' value={formData.description} onChange={handleInputChange} className="w-full p-2 border rounded" />



                                <label className="block mt-4 mb-2">Post Type </label>
                                <input type="text" name="post_type" placeholder='post type' value={formData.post_type} onChange={handleInputChange} className="w-full p-2 border rounded" />



                                <label className="block mt-4 mb-2">Thumbnail</label>
                                <input type="file" name="thumbnail" onChange={handleFileChange} className="w-full p-2 border rounded" />

                                <label className="block mt-4 mb-2">File (Image/Video)</label>
                                <input type="file" accept="image/*,video/*" onChange={(e) => setFormData({ ...formData, file: e.target.files ? e.target.files[0] : null })} className="w-full p-2 border rounded" />
                            </div>
                            <div className="flex justify-end mt-4">
                                <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={toggleModal}>
                                    Cancel
                                </button>
                                <button className="bg-primary text-white px-4 py-2 rounded" onClick={handleSubmit}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* <div className="fixed right-0 bottom-[20%]">
                <Link to="/communities" className="bg-primary text-white p-3 rounded-l-full py-5 flex flex-col items-center gap-2 cursor-pointer">
                    <h6 className='text-white'>E</h6>
                    <h6 className='text-white'>x</h6>
                    <h6 className='text-white'>p</h6>
                    <h6 className='text-white'>l</h6>
                    <h6 className='text-white'>o</h6>
                    <h6 className='text-white'>r</h6>
                    <h6 className='text-white'>e</h6>
                    <br />
                    <h6 className='text-white'>M</h6>
                    <h6 className='text-white'>o</h6>
                    <h6 className='text-white'>r</h6>
                    <h6 className='text-white'>e</h6>
                </Link>
            </div> */}
        </>

    )
}

export default CommunityDetails