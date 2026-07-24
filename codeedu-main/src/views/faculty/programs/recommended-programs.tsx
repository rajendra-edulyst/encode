import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/ShadcnInput'
import Breadcrumb from '@/components/breadcrumb'
import { Search } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import StatusIndicator from '@/components/StatusIndicator'
import { useFreeProgramStore } from '@/store/faculty/ProgramStore'
import { FreeProgram } from '@/@types/faculty/program'


const FreePrograms = () => {

    const { freePrograms, fetchFreePrograms, loading, error } = useFreeProgramStore();

    const [filters, setFilters] = useState({
        batch: '',
        subject: '',
        status: '',
        search: '',
    });

    useEffect(() => {
        fetchFreePrograms();
    }, [fetchFreePrograms]);

    const breadcrumbItems = [
        { label: 'Free Programs' },
    ]

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Recommended Courses</h1>
                    <p className="text-sm text-gray-500">
                        Explore our curated list of free courses tailored to your interests.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className='relative'>
                        <Input
                            type="text"
                            placeholder="Search title..."
                            value={filters.search}
                            className='pl-8'
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                        <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" size={16} />
                    </div>
                    <StatusIndicator error={error} loading={loading} loadingMessage={"Syncing Scheduled Sessions"} />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
                {freePrograms?.map((program, index) => (
                    <ProgramCard key={index} program={program} />
                ))}
            </div>
        </div>
    )
}

export default FreePrograms

const ProgramCard: React.FC<{ program: FreeProgram }> = ({ program }) => (
    <Card className="gap-0">
        <CardHeader className='gap-0 p-0'>
            <img src={program?.image} alt={program?.name} className="w-full h-36 object-cover rounded-t-lg" />
        </CardHeader>
        <CardContent className='pt-0 px-2 min-h-20'>
            <h2 className="text-[14px] text-primary mt-3 leading-normal">
                <Link to={`/subjects/${program.id}`} className='flex items-center'>
                    {program?.name}
                </Link>
            </h2>
            <p className="text-xs text-gray-500 mb-0">{new Date(program?.start_date).toLocaleDateString('en-US', {
                month: 'long',
                day: '2-digit',
                year: 'numeric',
            })} to {new Date(program?.end_date).toLocaleDateString('en-US', {
                month: 'long',
                day: '2-digit',
                year: 'numeric',
            })}</p>
        </CardContent>
    </Card>
);