import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { MoveRight, Search } from 'lucide-react';
import LoadingSection from '@/components/LoadingSection';
import { Input } from '@/components/ui/ShadcnInput';
import { useState } from 'react';
import { useIndustries } from '@/hooks/data/collaborate/useIndustry';
import { Button } from '@/components/ui/ShadcnButton';
import { Link } from 'react-router-dom';
import { useEffect } from "react";
import { mixpanelService } from "@/services/mixpanel/MixpanelService";

const Industries = () => {

    const [search, setSearch] = useState('');
    const { data: industries, isLoading } = useIndustries();

    const filteredIndustries = industries?.filter((industry) =>
        industry.name.toLowerCase().includes(search.toLowerCase()) &&
        industry.type === 'industry'
    );
useEffect(() => {
  mixpanelService.track("Industries Page Viewed", {
    page_path: location.pathname,
    timestamp: new Date().toISOString(),
  });
}, []);
    return (
        <Card>
            <CardHeader>
                <div className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
                    <div className='min-w-0'>
                        <CardTitle className='dark:text-white font-bold text-2xl'>Industries({industries?.length})</CardTitle>
                        <CardDescription className='dark:text-gray-300'>
                            Explore various industries and their unique opportunities.
                        </CardDescription>
                    </div>
                    <div className='relative w-full md:w-[260px] md:flex-shrink-0'>
                        <Input
                            type='text'
                            placeholder='Search Industries...'
                            value={search}
                            className='pl-9'
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <LoadingSection isLoading={isLoading} title='Industries' />
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {
                        filteredIndustries?.map((industry) => (
                            <Card key={`industry-${industry.id}`} className='p-0 relative bg-[#323232] h-full flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 overflow-hidden'>
                                <CardHeader className='p-0 bg-white'>
                                    <div className='h-[183px] flex items-center justify-center rounded-t-lg'>
                                        <img src={industry.logo} alt={industry.name} className='max-h-full max-w-full object-contain p-4'></img>
                                    </div>
                                </CardHeader>
                                <CardContent className=''>
                                    <h4 className='mb-2 line-clamp-1 text-white'>{industry?.name}</h4>
                                </CardContent>
                                <CardFooter className='px-4 pb-6 flex flex-row gap-4 items-center justify-between'>
                                    <p className='text-white line-clamp-3'>{industry?.org_description}</p>
                                    <Button className='bg-[#7FBC42] hover:bg-[#7FBC42] text-black w-24 h-24 flex flex-col items-center justify-center gap-2 py-2'>
                                        <Link
                                            to={`/collaborate/industries/${industry?.id}`}
                                            className='flex flex-col items-center justify-center gap-2 text-center'
                                        >
                                            <MoveRight size={16} />
                                            View<br />Profile
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    }
                </div>
                {
                    !isLoading && filteredIndustries?.length === 0 && search.trim() !== '' && (
                        <p className='text-center text-gray-500 mt-8'>No industries found matching {'"' + search + '"'}.</p>
                    )
                }
                {
                    !isLoading && (!filteredIndustries || filteredIndustries.length === 0) && search.trim() === '' && (
                        <p className='text-center text-gray-500 mt-8'>No industries available at the moment.</p>
                    )
                }
            </CardContent>
        </Card>
    )
}

export default Industries