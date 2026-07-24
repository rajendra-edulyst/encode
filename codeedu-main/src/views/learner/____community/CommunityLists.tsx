import React from 'react';
import { Link } from 'react-router-dom';
import { fetchCommunity } from '@/services/public/CommunityService';
import { useCommunityStore } from '@/store/public/communityStore';
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';

const CommunityList: React.FC = () => {
    const {
        communities,
        setCommunities,
        error,
        setError,
        loading,
        setLoading,
    } = useCommunityStore();

    React.useEffect(() => {
        setLoading(true);
        setError('');
        fetchCommunity()
            .then(setCommunities)
            .catch((err) => {
                console.error(err);
                setError('Something went wrong while fetching communities.');
            })
            .finally(() => setLoading(false));
    }, [setCommunities, setError, setLoading]);

    if (loading) return <Loading loading={loading} />;
    if (error) return <Alert type="danger" title={error} />;

    return (
        <div className="p-3">
            {communities?.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {communities.map((community) => (
                        <Link
                            key={`community-${community?.id}`}
                            to={`/communities/${community?.id}`}
                            className="bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transform transition duration-200 hover:-translate-y-1 hover:scale-105"
                        >
                            <img
                                src={community?.image}
                                alt={community?.title}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <div className="p-4">
                                <h5 className="text-sm font-semibold mb-2 text-gray-800 dark:text-white">
                                    {community?.title}
                                </h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                                    {community?.short_description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <p className="text-gray-500 dark:text-gray-300">No community found.</p>
                </div>
            )}
        </div>
    );
};

export default CommunityList;
