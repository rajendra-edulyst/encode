import Breadcrumb from '@/components/breadcrumb';
import Heading from '@/components/heading';
import LoadingSection from '@/components/LoadingSection';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/ShadcnInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMyResource } from '@/hooks/data/create/useResource';
import { mapResourceIds } from '@/services/create/ResourceService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, Loader, Search } from 'lucide-react';
import React from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const Tools = () => {

    const { category } = useParams<{ category: string }>();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = React.useState('');
    const params = new URLSearchParams();
    params.append('type', category ? category : '');
    const { data: items = [], isLoading } = useMyResource(params);

    const breadcrumbItems = [
        { label: 'Resource Hub' }
    ];

    const type = Array.from(new Set(items.map(item => item.type)));

    // Filter items based on search term
    const filteredItems = items.filter(item =>
        item.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        item.purpose?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm?.toLowerCase())
    );


    const mapResourceMutation = useMutation({
        mutationFn: mapResourceIds,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resource'] });
            queryClient.invalidateQueries({ queryKey: ['myresource'] });
            queryClient.invalidateQueries({ queryKey: ['recommended-resources'] });
            toast.success('My Resources Updated successfully');
        },
        onError: (error) => {
            console.error("Error mapping resources:", error);
        }
    });

    const mapResource = (id: number) => {
        mapResourceMutation.mutate([id]);
    }


    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />
            <div className='flex justify-between items-center mb-6'>
                <Heading title="Resource Hub" description="Explore a curated list of resources tailored for your needs." className='mb-0' />
                <div className='relative'>
                    <Input
                        type="text"
                        placeholder="Search resources..."
                        className="w-full rounded-xl ps-12 text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-white" size={20} />
                </div>
            </div>
            <LoadingSection isLoading={isLoading} title='Resource Hub Loading...' />
            {
                (items && !isLoading) && (
                    <Tabs defaultValue="all">
                        <TabsList className='mb-5 rounded-xl p-0 h-auto bg-gray-200 dark:bg-[#4d4d4d] divide-x divide-gray-300 dark:divide-gray-500 border border-gray-300 dark:border-gray-500 overflow-hidden'>
                            <TabsTrigger value="all" className="capitalize px-4 rounded-none py-2 text-sm font-normal text-white data-[state=active]:font-semibold">All</TabsTrigger>
                            {
                                type.map((subtype, index) => (
                                    <TabsTrigger key={`tab-${index}`} value={subtype?.toLowerCase()?.replace(/\s+/g, '-')} className={`capitalize px-4 rounded-none py-2 text-sm font-normal text-white data-[state=active]:font-semibold`}>{subtype}</TabsTrigger>
                                ))
                            }
                        </TabsList>
                        {
                            ['all', ...type.map(subtype => subtype?.toLowerCase()?.replace(/\s+/g, '-'))].map((tabValue, index) => {
                                const tabItems = filteredItems.filter(item =>
                                    tabValue === 'all' ? true : item?.sub_type?.toLowerCase()?.replace(/\s+/g, '-') === tabValue
                                );
                                return (
                                    <TabsContent key={`tab-content-${index}`} value={tabValue}>
                                        {tabItems.length > 0 ? (
                                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                                                {tabItems.map((item, idx) => (
                                                    <Card key={`resource-item-${idx}`} className='relative overflow-hidden hover:shadow-lg transition-shadow rounded-3xl pb-3 flex flex-col'>
                                                        <CardHeader>
                                                            <div className="flex justify-between items-center gap-2">
                                                                <img src={item.logo_url ?? `https://ui-avatars.com/api/?name=${item.name}&background=random&size=64`} alt={item.name} className="w-20 h-16 object-cover rounded-lg"
                                                                    onError={(e) => {
                                                                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${item.name}&background=random&size=64`;
                                                                    }}
                                                                />
                                                                <div className="flex flex-col w-full">
                                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                                                                    <p className="text-cblack dark:text-primary">{item.category}</p>
                                                                </div>
                                                            </div>
                                                            <Badge className="text-xs absolute top-0 right-0 px-2 py-1 rounded-lg rounded-br-none rounded-tl-none rounded-tr-none bg-codepink dark:text-white">
                                                                {item.paid_status ?? 'Free'}
                                                            </Badge>
                                                        </CardHeader>
                                                        <CardContent className='flex-grow'>
                                                            <p className='text-sm dark:text-[#848484] mt-2'>{item.purpose}</p>
                                                        </CardContent>
                                                        <CardFooter className='flex justify-end items-center gap-3 mt-auto'>
                                                            <a href={`${item.official_url}`} target="_blank" rel="noopener noreferrer" className='bg-gray-500 p-3 rounded-lg h-[96px] w-[90px] flex flex-col justify-center items-center text-center text-white mb-3 cursor-pointer'>
                                                                <ExternalLink />
                                                                Visit <br /> Now
                                                            </a>
                                                            {item.saved !== 0 && <div className='border text-white border-primary p-3 rounded-lg h-[96px] w-[126px] flex flex-col justify-center items-center text-center text-black mb-3 cursor-pointer' onClick={() => mapResource(item.id)}>
                                                                {mapResourceMutation.isPending && mapResourceMutation.variables?.[0] === item.id ? <Loader className="w-5 h-5 text-black animate-spin" /> : "Remove"}<br />
                                                                Resources
                                                            </div>}
                                                        </CardFooter>
                                                    </Card>
                                                ))}
                                            </div>
                                        ) : (
                                            <Card>
                                                <CardContent className='text-center py-20'>
                                                    <div className='flex flex-col items-center gap-4'>
                                                        <div className='w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </div>
                                                        <h3 className='text-2xl font-semibold text-gray-900 dark:text-white mb-2'>No resources found</h3>
                                                        <p className='text-muted-foreground dark:text-gray-400 max-w-md'>
                                                            {searchTerm
                                                                ? `No results match "${searchTerm}" in this category. Try adjusting your search or check another tab.`
                                                                : `No resources available in this category at the moment.`
                                                            }
                                                        </p>
                                                        {searchTerm && (
                                                            <button
                                                                className='mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors'
                                                                onClick={() => setSearchTerm('')}
                                                            >
                                                                Clear Search
                                                            </button>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </TabsContent>
                                );
                            })
                        }
                    </Tabs>
                )
            }
        </div >
    )
}

export default Tools