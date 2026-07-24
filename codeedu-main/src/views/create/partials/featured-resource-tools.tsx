
import LoadingSection from '@/components/LoadingSection'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useResource } from '@/hooks/data/create/useResource'
import { mapResourceIds } from '@/services/create/ResourceService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader, Plus } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useEffect } from 'react';
import { mixpanelService } from '@/services/mixpanel/MixpanelService';


const ResourceHub = () => {

    const params = new URLSearchParams();
    params.append('is_pinned', '1');

    const navigate = useNavigate();
    const { data: resources = [], isLoading } = useResource(params);
    const queryClient = useQueryClient();
    const [selectedTool, setSelectedTool] = useState<number | null>(null);

    const mapResourceMutation = useMutation({
        mutationFn: mapResourceIds,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resource'] });
            queryClient.invalidateQueries({ queryKey: ['myresource'] });
            toast.success('My Resources Updated successfully');
        },
        onError: (error) => {
            console.error("Error mapping resources:", error);
        }
    });

    const addToMyTools = (resourceId: number, isAdded: number) => {
        if (isAdded) return;
        setSelectedTool(resourceId);
        mapResourceMutation.mutate([resourceId]);
    }

    // Filter and sort resources to show only 2 tools
    const getTopTwoResources = () => {
        if (!resources || resources.length === 0) return [];

        // Separate saved and not saved resources
        const notSavedResources = resources.filter(r => r.saved === 0);
        const savedResources = resources.filter(r => r.saved === 1);

        // Sort both arrays alphabetically
        const sortedNotSaved = [...notSavedResources].sort((a, b) =>
            a.name.localeCompare(b.name)
        );
        const sortedSaved = [...savedResources].sort((a, b) =>
            a.name.localeCompare(b.name)
        );

        const result = [];

        // Add unsaved resources first (up to 2)
        result.push(...sortedNotSaved.slice(0, 2));

        // If we have less than 2 resources, fill with saved ones
        if (result.length < 2) {
            const needed = 2 - result.length;
            result.push(...sortedSaved.slice(0, needed));
        }

        return result;
    };

    const displayedResources = getTopTwoResources();

    return (
        <Card className="w-full gap-0 py-4">
            <CardHeader>
                <CardTitle className='text-xl text-white'><span className='text-cblue'>Resource</span> Hub</CardTitle>
                <CardAction>
<button
    className="text-sm text-primary font-medium"
    onClick={() => {
        mixpanelService.track("Resource Hub View All Clicked");
        navigate('/explore/resource-hub');
    }}
>
    View All
</button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <LoadingSection isLoading={isLoading} title="Resources" />
                {/* Resource List */}
                <div className="space-y-4">
                    {displayedResources?.map((resource) => (
                        <Card key={resource.id} className='dark:bg-[#323232] p-2 gap-0 cursor-pointer' onClick={() => resource?.saved ? window.open(`${resource?.official_url}`, '_blank') : null}>
                            <CardContent className="flex items-center justify-between px-0">
                                {/* Left Section - Logo and Info */}
                                <div className="flex items-center gap-3 justify-between w-full">
                                    {/* Logo */}
                                    <div className="flex items-center gap-4">
                                        <div className={`rounded-lg overflow-hidden w-12 h-12 flex items-center justify-center text-4xl`}>
                                            <img src={resource.logo_url} alt={resource.name} className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(resource.name)}&background=random&size=128`;
                                                }}
                                            />
                                        </div>
                                        {/* Text Info */}
                                        <div className="space-y-1">
                                            <h3 className="dark:text-white text-sm font-semibold">
                                                {resource.name}
                                            </h3>
                                            <p className="text-gray-400 text-xs">
                                                {resource.description}
                                            </p>
                                        </div>
                                    </div>
                                    {
                                        resource?.saved === 0 && <div>
                                            <div className={`text-black ${resource.saved ? 'bg-gray-500' : 'bg-primary'} rounded-lg px-3 py-1 flex flex-col justify-center items-center gap-2 text-sm font-medium h-full w-[64px]`} onClick={() => addToMyTools(resource.id, resource.saved)}>
                                                {(mapResourceMutation.isPending && selectedTool === resource.id) ? <Loader className="animate-spin h-4 w-4 text-white" /> : <Plus />}
                                                {resource.saved ? 'Added' : 'Add'}
                                            </div>
                                        </div>
                                    }
                                    {
                                        resource?.saved === 1 && <div className="text-sm font-medium pr-3">
                                            Added
                                        </div>
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default ResourceHub