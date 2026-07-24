import { Community } from '@/@types/connect/community';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { useJoinCommunity } from '@/hooks/data/connect/useCommunity';
import { Link } from 'react-router-dom';
import { useAuth } from '@/auth';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mixpanelService } from '@/services/mixpanel/MixpanelService';

interface CommunityCardProps {
    community: Community;
    org_logo: string;
    org_name: string;
    org_id?: string;
    /** Merged onto root Card (e.g. max-width, footer padding for overlay actions). */
    className?: string;
}

const CommunityCard = ({ community, org_logo, org_name, org_id, className }: CommunityCardProps) => {

    const { user } = useAuth();
    const isSameOrg = user?.organization_id?.toString() === org_id?.toString();
    const targetLink = isSameOrg ? `/connect/communities/${community.id}` : `/collaborate/industries/${org_id}`;

    return (
        <Card className={cn('dark:bg-[#323232] pt-0 flex flex-col h-full relative', className)}>

            <CardHeader className="p-0 rounded-t-lg overflow-hidden h-40 bg-background flex items-center justify-center">
                <img src={org_logo} alt={org_name} className="object-contain" />
            </CardHeader>
            <CardContent className="pt-2 flex-1">
                <div className="flex items-center space-x-3">
                    <img
                        src={community.image}
                        alt={community.title}
                        className="w-10 h-10 rounded-lg object-cover border"
                    />
                    <Link 
                        to={targetLink}
                        onClick={() => mixpanelService.track('Connect Community Clicked', { 
                            community_name: community.title,
                            community_id: community.id,
                            org_name: org_name
                        })}
                    >
                        <h1 className="text-lg hover:underline font-bold text-foreground">{community.title}</h1>
                    </Link>
                </div>
                <p className="text-sm dark:text-white mt-2 break-words">
                    {community.description}
                </p>
            </CardContent>
            <CardFooter className="flex justify-between items-start mt-auto">
                <div className="flex dark:text-white items-center">
                    <Users className="mr-2" size={20} />
                    <span className="text-xs">
                        {community.total_user_joined}{" "}
                        {community.total_user_joined <= 1 ? "member" : "members"}
                    </span>
                </div>
                <Link to={`/collaborate/industries/${org_id}`}>
                </Link>
                {/* <div>
                    {
                        community.user_joined_id === null && <CodeButton
                            name="Join Now"
                            icon={<MoveRight size={40} className="mb-1" />}
                            isLoading={isPending}
                            disabled={community.user_joined_id !== null}
                            onClick={handleJoinCommunity}
                        />
                    }

                </div> */}
            </CardFooter>
        </Card>
    )
}

export default CommunityCard