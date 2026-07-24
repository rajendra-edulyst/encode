import IndustryCard from '@/components/IndustryCard';
import LoadingSection from '@/components/LoadingSection';
import { useIndustries } from '@/hooks/data/collaborate/useIndustry';
import React from 'react'

const Industries = () => {

    const { data: industries = [], isLoading } = useIndustries();

    return (
        <>
            <LoadingSection isLoading={isLoading} title="Industries" />
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {
                    industries.map((industry) => (
                        industry?.type === 'industry' && <IndustryCard key={industry.id} industry={industry} />
                    ))
                }
            </div>
        </>
    )
}

export default Industries