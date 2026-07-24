import React from 'react'
import { TrendingUp, TrendingDown, FileUser, List, User, Plus } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import { useInstituteJobsStats } from '@/hooks/data/collaborate/useJobs'

interface MetricCardProps {
    title: string
    value: string | number
    change: number
    trend: 'up' | 'down'
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, trend }) => {
    return (
        <div className="rounded-2xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-3">{title}</div>
            <div className="flex items-end justify-between">
                <div className="text-3xl font-bold text-white">{value}</div>
                {/* <div className={`flex items-center gap-1 text-sm font-semibold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    <span>{change > 0 ? '+' : ''}{change}%</span>
                    {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                </div> */}
            </div>
        </div>
    )
}

interface JobsProps {
    filter?: string
}

const Jobs: React.FC<JobsProps> = ({ filter }) => {
    const { data: jobStats } = useInstituteJobsStats(filter || 'yearly');

    const metrics = [
        {
            title: 'Published Job',
            value: jobStats?.published_jobs ?? 0,
            change: 0,
            trend: 'up' as const
        },
        {
            title: 'Placed',
            value: jobStats?.placed ?? 0,
            change: 0,
            trend: 'up' as const
        },
        {
            title: 'Under Process',
            value: jobStats?.under_process ?? 0,
            change: 0,
            trend: 'up' as const
        },
        {
            title: 'Rejected',
            value: jobStats?.rejected ?? 0,
            change: 0,
            trend: 'up' as const
        },
        {
            title: 'Applied',
            value: jobStats?.applied ?? 0,
            change: 0,
            trend: 'up' as const
        },
        {
            title: 'Placement %',
            value: jobStats?.placement_per ?? 0,
            change: 0,
            trend: 'up' as const
        },
        {
            title: 'Total Profiles',
            value: jobStats?.total_profiles ?? 0,
            change: 0,
            trend: 'up' as const
        }
    ]


    const navigate = useNavigate();

    return (
        <div className="space-y-8">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {metrics.map((metric, index) => (
                    <MetricCard key={index} {...metric} />
                ))}
            </div>
            {/* Jobs/Placement Section */}
            <div>
                <h2 className="text-3xl font-bold text-white mb-6">Jobs/Placement</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3'>
                    <Card className='gap-2'>
                        <CardHeader>
                            <CardTitle className='text-white'>Jobs/Placement</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                                <Card className='bg-[#323232] p-2 flex flex-col h-full'>
                                    <CardContent className='p-2 flex-1 pb-0'>
                                        <FileUser className='text-white' />
                                        <h3 className='text-white text-sm text-nowrap mt-2'>Resume Management</h3>
                                    </CardContent>
                                    <CardFooter className='mt-auto pt-0'>
                                        <div className='h-[64px] w-[64px] bg-primary text-center p-3 text-center rounded-lg flex flex-col items-center justify-center mx-auto cursor-pointer' onClick={() => navigate('/industry/talent-pool')}>
                                            <div>
                                                <List className='text-black' size={16} />
                                            </div>
                                            <p className='text-black text-[10px]'>Profile Listing</p>
                                        </div>
                                    </CardFooter>
                                </Card>
                                <Card className='bg-[#323232] p-2 flex flex-col h-full'>
                                    <CardContent className='p-2 flex-1 pb-0'>
                                        <User className='text-white' />
                                        <h3 className='text-white text-sm text-nowrap mt-2'>Job Management</h3>
                                    </CardContent>
                                    <CardFooter className='mt-auto pt-0 flex justify-center gap-1'>
                                        <div className='h-[64px] w-full bg-gray-600 text-center p-3 text-center rounded-lg flex flex-col items-center justify-center mx-auto cursor-pointer' onClick={() => navigate('/industry/jobs')}>
                                            <div>
                                                <List className='text-white' size={16} />
                                            </div>
                                            <p className='text-white text-[10px]'>Job Listing</p>
                                        </div>
                                        <div className='h-[64px] w-full bg-primary text-center p-3 text-center rounded-lg flex flex-col items-center justify-center mx-auto cursor-pointer' onClick={() => navigate('/industry/jobs/add')}>
                                            <div>
                                                <Plus className='text-black' size={16} />
                                            </div>
                                            <p className='text-black text-[10px]'>Create Job</p>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Jobs