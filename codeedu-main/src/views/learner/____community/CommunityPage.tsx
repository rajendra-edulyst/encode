import React from 'react'
import { Link } from 'react-router-dom';
import { fetchCommunity } from '@/services/public/CommunityService';
import { useCommunityStore } from '@/store/public/communityStore';
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';

const Community: React.FC = () => {
    const { communities, setCommunities, error, setError, loading, setLoading } = useCommunityStore();
    React.useEffect(() => {
        setLoading(true);
        setError('');
        fetchCommunity().then((response) => {
            setCommunities(response);
        }).catch((error) => {
            setError('Something went wrong');
            console.log(error);
        }).finally(() => {
            setLoading(false);
        });
    }, [setCommunities, setError, setLoading]);


    if (loading) {
        return <Loading loading={loading} />
    }

    if (error) {
        return <Alert type="danger" title={error} />
    }

    return (
        <div>
            <div className="community__content">
                <div className="community__content__title">
                    <h1>Join our community</h1>
                    <p>Join our community and get access to exclusive content, resources, and more.</p>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-5 mt-10'>
                {
                    communities?.map((community) => {
                        return (
                            <Link key={`community-${community?.id}`} to={`/communities/${community?.id}`} className='md:col-span-1 dark:bg-gray-900 shadow-lg transition duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-105
                                rounded-lg'>
                                <div className="rounded overflow-hidden">
                                    <img className="w-full h-48" src={community?.image} alt="Sunset in the mountains" />
                                    <div className="px-3 py-4">
                                        <div className="font-bold text-xl">
                                            {community?.title}
                                        </div>
                                        <p className="text-gray-400 line-clamp-3">
                                            {community?.description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                }
                {
                    communities?.length === 0 && (
                        <div className="text-center col-span-4 bg-white p-4 rounded-lg shadow-lg">
                            <p className="text-gray-400">No community found</p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Community