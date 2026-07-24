import React, { useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/ShadcnButton';
import { Link } from 'react-router-dom';
import { useCommunitiesStore } from '@/views/common/community/store/communityStore';
import CommunityCard from '@/views/common/community/components/CommunityCard';

// Constants
const MAX_COMMUNITIES_TO_DISPLAY = 4;

const MyCommunities: React.FC = () => {
    const { communities, fetchCommunities, loading, error } = useCommunitiesStore();

    useEffect(() => {
        fetchCommunities(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Memoize sliced communities to avoid recomputation
    const displayedCommunities = useMemo(
        () => communities?.slice(0, MAX_COMMUNITIES_TO_DISPLAY) || [],
        [communities]
    );

    // Handle loading state
    if (loading) {
        return <div className="text-center text-gray-500 py-4">Loading...</div>;
    }

    // Handle error state
    if (error) {
        return <div className="text-center text-red-500 py-4">Error: {error}</div>;
    }

    // Handle empty or null communities
    if (!communities || communities.length === 0) {
        return (
            <div className="bg-white rounded-xl p-4 shadow-sm border glowConnectCard">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <h2 className="text-lg font-semibold text-cblack">Your <span className="font-bold text-cblue text-2xl">Communities</span></h2>
                    </div>
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="px-1.5 py-0 h-7 border-[--IndexBlue] text-[--IndexBlue] hover:bg-[--IndexBlue]/10 hover:text-[--IndexBlue] hover:scale-105 transition-all duration-200"
                        aria-label="Create a new community"
                    >
                        <Link to="/community/create">
                            <Plus strokeWidth={1.5} size={20} />
                        </Link>
                    </Button>
                </div>
                <div className="text-center text-gray-500 py-10">
                    To get started, create a community first.
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border glowConnectCard">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <h2 className="text-lg font-semibold text-cblack">Your <span className="font-bold text-cblue text-2xl">Communities</span></h2>
                </div>
                <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="px-1.5 py-0 h-7 border-[--IndexBlue] text-[--IndexBlue] hover:bg-[--IndexBlue]/10 hover:text-[--IndexBlue] hover:scale-105 transition-all duration-200"
                    aria-label="Create a new community"
                >
                    <Link to="/community/create">
                        <Plus strokeWidth={1.5} size={20} />
                    </Link>
                </Button>
            </div>
            <div className="space-y-4">
                {displayedCommunities.map((community, index) => (
                    <CommunityCard
                        key={community.id} // Use unique id instead of index
                        title={community.title}
                        logo={community.image}
                        // description={community.description}
                        description={community.description.slice(0,25)+ '...'}
                        members={community.total_user_joined}
                        isLast={index === displayedCommunities.length - 1}
                        id={community.id}
                    />
                ))}
                <div className="text-right">
                    <Button
                        asChild
                        variant="link"
                        className="text-[#00A8E9] p-0 h-auto rounded-none whitespace-nowrap"
                        aria-label="View all communities"
                    >
                        <Link to="/community">View All</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MyCommunities;