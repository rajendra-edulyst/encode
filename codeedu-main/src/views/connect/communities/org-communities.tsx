import ConnectLayout from '../layouts'
import { useOrgCommunities } from '@/hooks/data/connect/useCommunity';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import CommunityCard from '@/components/CommunityCard';
import { useParams } from 'react-router-dom';
import RightSidePanel from '../layouts/right-side-panel';

const OrgCommunities = () => {

    const { orgId } = useParams<{ orgId: string }>();

    const params = new URLSearchParams();
    params.append('org_id', orgId || '');
    const { data: orgCommunities = [] } = useOrgCommunities(params);

    return (
        <ConnectLayout active="communities">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-x-8 gap-y-6">
                <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
                    {orgCommunities.map((org, index) => (
                        <Card key={index} className='gap-0'>
                            <CardHeader className='pb-0'>
                                <CardHeader className='text-2xl font-bold text-primary px-0'>{org.org_name} Communities</CardHeader>
                            </CardHeader>
                            <CardContent>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                                    {org.communities.map((community, index) => (
                                        <div key={index}>
                                            <CommunityCard community={community} org_name={org.org_name} org_logo={org.org_logo} />
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

export default OrgCommunities;