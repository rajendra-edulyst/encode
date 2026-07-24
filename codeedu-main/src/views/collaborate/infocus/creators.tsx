import { Button } from '@/components/ui/ShadcnButton';
import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import PortfolioCard from '../components/PortfolioCard';
import { Link } from 'react-router-dom';
import { useInFocus } from '@/hooks/data/collaborate/useFocus';
import LoadingSection from '@/components/LoadingSection';

const Infocusdetails = () => {
    const { data: inFocusData = [], isLoading: isLoadingInFocus, isError: isInFocusError } = useInFocus();

    const profiles = inFocusData?.filter(item => item.type === 'profile').filter(item => item.profiles && item.profiles.length > 0).map(item => ({
        name: item.profiles[0]?.name || 'Unknown',
        email: item.profiles[0]?.email || 'No email available',
        description: (item.profiles[0] as any)?.bio || item.placeholder || 'No description available',
        designation: item.profiles[0]?.role || 'Creative Professional',
        skills: item.profiles[0]?.skills?.map(skill => skill.name) || [],
        role: item.profiles[0]?.role || 'Designer',
        profile_image: item.profiles[0]?.profile_image || 'https://ui-avatars.com/api/?name=User',
        id: String(item.id),
        type: item.type,
        profiles: item.profiles[0] || null
    }));

    if (isLoadingInFocus) return <LoadingSection isLoading={isLoadingInFocus} title="Loading In Focus data..." />

    if (isInFocusError) {
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
                        </div>
                    </CardHeader>
                    <CardContent className="w-full min-w-0 max-w-full overflow-hidden">
                        <div className="flex items-center justify-center h-64">
                            <p className="text-red-500">Error loading In Focus data. Please try again later.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

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
                            <Button asChild variant={'outline'} className={`w-full rounded-none rounded-l-md border`}>
                                <Link to="/collaborate/infocus">All</Link>
                            </Button>
                            <Button asChild className={`w-full rounded-none border text-white`}>
                                <Link to="/infocus/creators">Creators</Link>
                            </Button>
                            <Button asChild variant={'outline'} className={`w-full rounded-none rounded-r-md border`}>
                                <Link to="/infocus/creative-directory">Creative Directory</Link>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="w-full min-w-0 max-w-full overflow-hidden">
                    {profiles.length === 0 ? (
                        <div className="flex items-center justify-center h-64">
                            <p>No In Focus data available at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {profiles.filter((item) => item.type !== 'Portfolio').map((item, index) => (
                                <div key={`${item.type}-${item.profiles?.name}-${index}`}>
                                    <PortfolioCard data={item} />
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