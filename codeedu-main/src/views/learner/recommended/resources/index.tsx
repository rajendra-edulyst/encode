import Breadcrumb from '@/components/breadcrumb';
import Heading from '@/components/heading';
import ToolCard from '@/components/___ToolCard';
import { useRecommendedResources } from '@/hooks/data/create/useResource';
import { mapResourceIds } from '@/services/create/ResourceService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { FiSearch, FiFolder } from 'react-icons/fi';
import { toast } from 'sonner';

const Resources = () => {

    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");

    const params = new URLSearchParams();
    const { data: items = [] } = useRecommendedResources(params);

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        const paid_status = item.paid_status === 'free';
        return matchesSearch && paid_status;
    });


    filteredItems.sort((a, b) => a.name.localeCompare(b.name));


    const mapResourceMutation = useMutation({
        mutationFn: mapResourceIds,
        onSuccess: (data) => {
            console.log("Mapped resources:", data);
            queryClient.invalidateQueries({ queryKey: ['resource'] });
            queryClient.invalidateQueries({ queryKey: ['myresource'] });
            toast.success('My Resources Updated successfully');
        },
        onError: (error) => {
            console.error("Error mapping resources:", error);
        }
    });


    const mapResource = (id: number) => {
        mapResourceMutation.mutate([id]);
    }

    const breadcrumbItems = [
        { label: 'Recommended Resources' }
    ];

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />


            <div className='flex flex-col md:flex-row md:items-start md:justify-between mb-6 gap-4'>
                <div className='flex-1'>
                    <Heading
                        title="Recommended Resources"
                        description="Discover the best AI tools, development resources, and productivity apps to supercharge your workflow and creativity."
                    />
                </div>


                <div className='relative w-full md:w-72'>
                    <span className='absolute left-3 top-2.5 text-gray-400'>
                        <FiSearch />
                    </span>
                    <input
                        type="text"
                        placeholder='Search tools & resources'
                        value={search}
                        className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-black'
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className='mt-4'>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredItems.map(item => (
                        <ToolCard key={item.id} item={item} mapResource={mapResource} showRemove={true} />
                    ))}
                </div>


                {filteredItems.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="bg-gray-100 p-6 rounded-full mb-4">
                            <FiFolder className="text-gray-400 text-4xl" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No resources found</h3>
                        <p className="text-gray-500 max-w-md">
                            {search ? `No resources match your search for "${search}". Try a different search term.` : 'No resources available at the moment. Check back later.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
export default Resources;