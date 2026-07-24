import React from 'react'
import ConnectLayout from '../layouts'
import { useOrgCommunities } from '@/hooks/data/connect/useCommunity';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import CommunityCard from '@/components/CommunityCard';
import { Link } from 'react-router-dom';
import RightSidePanel from '../layouts/right-side-panel';
import LoadingSection from '@/components/LoadingSection';
import { useAuth } from '@/auth';
import { mixpanelService } from '@/services/mixpanel/MixpanelService';

const Communities = () => {
    const { user } = useAuth();

    const trackedPageView = React.useRef(false);
    React.useEffect(() => {
        if (!trackedPageView.current) {
            mixpanelService.track('Connect Communities Viewed', {
                page_path: window.location.pathname,
                timestamp: new Date().toISOString()
            });
            trackedPageView.current = true;
        }
    }, []);

    const { data: orgCommunities = [], isLoading } = useOrgCommunities();
    const prioritizedOrgCommunities = React.useMemo(() => {
        const userOrgId = user?.organization_id?.toString();

        return [...orgCommunities].sort((a, b) => {
            const aId = a.org_id?.toString();
            const bId = b.org_id?.toString();

            if (userOrgId && aId === userOrgId) return -1;
            if (userOrgId && bId === userOrgId) return 1;

            const aName = (a.org_name ?? '').trim().toLowerCase();
            const bName = (b.org_name ?? '').trim().toLowerCase();
            if (aName === 'code') return -1;
            if (bName === 'code') return 1;

            return 0;
        });
    }, [orgCommunities, user]);

    return (
        <ConnectLayout active="communities">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-x-8 gap-y-6">
                <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
                    <div className='col-span-1 lg:col-span-3'>
                        <LoadingSection isLoading={isLoading} title="Communities" />
                    </div>
                    {prioritizedOrgCommunities.map((org, index) => (
                        <Card key={index} className='gap-0'>
                            <CardHeader className='pb-0'>
                                <CardHeader className='text-2xl font-bold text-primary px-0'>{org.org_name} Communities</CardHeader>
                                {(org.communities?.length ?? 0) > 2 && (
                                    <CardAction className='flex items-center gap-2 mt-2'>
                                        <Link to={`/connect/communities/org/${org.org_id}`} className='text-sm hover:underline text-primary'>View All</Link>
                                    </CardAction>
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    {org.communities.slice(0, 2).map((community, index) => (
                                        <div key={index} className='flex-shrink-0 w-full'>
                                            <CommunityCard community={community} org_name={org.org_name} org_logo={community.cover_image || community.image || org.org_logo} org_id={`${org.org_id}`} />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="col-span-1 lg:col-span-3 flex flex-col gap-6">
                    <RightSidePanel />
                </div>
            </div>
        </ConnectLayout>
    )
}

export default Communities