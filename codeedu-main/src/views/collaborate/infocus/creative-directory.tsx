import { Button } from '@/components/ui/ShadcnButton';
import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useInFocus } from '@/hooks/data/collaborate/useFocus';
import CreativeDirectory from '../components/CreativeDirectory';
import LoadingSection from '@/components/LoadingSection';

const Infocusdetails = () => {
    const { data: inFocusData = [], isLoading: isLoadingInFocus, isError: isInFocusError, error } = useInFocus();

    const industries = inFocusData?.filter(item => item.type === 'industry' || item.type === 'institute').filter(item => item.profiles && item.profiles.length > 0).map(item => ({
        type: 'Industry',
        name: item.profiles[0]?.name || 'Unknown Industry',
        about: item.profiles[0]?.org_description || item.placeholder || 'No description available',
        banner: item.profiles[0]?.logo || '/img/placeholder-industry.png',
        profile: item.profiles[0],
        profiles: item.profiles,
        id: String(item.id),
        reference_id: item.reference_id
    }));

    if (isLoadingInFocus) return <LoadingSection isLoading={isLoadingInFocus} title='Gathering In Focus data...' description='Please wait while we fetch the latest collaboration opportunities.' />;

    if (isInFocusError) return <div className='p-5 flex flex-col gap-5'>
        <p>{error.message}</p>
    </div>;

    return (
        <div className='p-5 flex flex-col gap-5'>
            <Card>
                <CardHeader>
                    <div className='flex justify-between items-center mb-6'>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className='text-primary'>In Focus</h2>
                            </div>
                            <p className='text-lg mt-1'>Key collaboration opportunities within the Indian tech community</p>
                        </div>
                        <div className='justify-center items-center grid grid-cols-3'>
                            <Button asChild variant={'outline'} className={`w-full rounded-none rounded-l-md border `}>
                                <Link to="/collaborate/infocus">All</Link>
                            </Button>
                            <Button asChild variant={'outline'} className={`w-full rounded-none border`}>
                                <Link to="/infocus/creators">Creators</Link>
                            </Button>
                            <Button asChild className={`w-full rounded-none rounded-r-md border text-white`}>
                                <Link to="/infocus/creative-directory">Creative Directory</Link>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="w-full min-w-0 max-w-full overflow-hidden">
                    {industries.length === 0 ? (
                        <div className="flex items-center justify-center h-64">
                            <p>No In Focus data available at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {industries.filter((item) => item.type !== 'Portfolio').map((item, index) => (
                                <div key={`${item.type}-${index}`}>
                                    <CreativeDirectory data={item} />
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default Infocusdetails