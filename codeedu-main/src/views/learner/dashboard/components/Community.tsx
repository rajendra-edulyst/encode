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
            setError('Failed to fetch communities');
            console.log(error);
        }).finally(() => {
            setLoading(false);
        });
    }, [setCommunities, setError, setLoading]);


    if (loading && communities.length <= 0) return <div className='h-96 flex items-center justify-center'>
        <Loading loading={loading} /></div>

    if (error) {
        return <Alert type="danger" title={error} />
    }


    return (
        <div className="bg-white rounded-lg shadow-md p-3 mt-5">
            <div>
                <h1 className="text-2xl font-bold">
                    Communities
                </h1>
                <p>Join our community and get access to exclusive content, resources, and more.</p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mt-5'>
                {
                    communities?.map((community, index) => {
                        if (index > 2) return null;
                        return (
                            <Link key={`community-${community?.id}`} to={`/communities/${community?.id}`} className='md:col-span-1 dark:bg-gray-900 shadow-lg transition border duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-105
                                rounded-lg'>
                                <div className="rounded overflow-hidden">
                                    <img className="w-full h-48" src={community?.image} alt="Sunset in the mountains" />
                                    <div className="px-3 py-4">
                                        <div className="font-bold text-xl">
                                            {community?.title}
                                        </div>
                                        <p className="text-gray-400 line-clamp-2">
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