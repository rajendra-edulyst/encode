import { Card, CardContent } from '@/components/ui/card'
import { usePublishedJobs } from '@/views/learner/@hooks/useJobs'
import { Program } from '@/@types/learner/Jobs'
import LoadingSection from '@/components/LoadingSection'
import JobCard from './components/DriveProcess/JobCard'
import { Job } from '@/@types/collaborate/jobs'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Link } from 'react-router-dom'

interface IndustriesJobsProps {
    org_id: string
}

const mapToJob = (p: Program): Job => ({
    id: p.id,
    name: p.name,
    description: p.description,
    image: p.image,
    start_date: p.start_date,
    end_date: p.end_date,
    organization_id: p.organization_id,
    is_job: p.is_job,
    is_internship: p.is_internship,
    location: p.location,
    experience: p.experience,
    venue: '',
    job_status: p.job_status || '',
    job_in_org_name: p.job_in_org_name,
    job_in_org_logo: p.job_in_org_logo,
    job_type: p.job_type || '',
    domain_name: p.domain_name || '',
    company_name: p.job_in_org_name,
    company_logo: p.job_in_org_logo,
    created_at: p.start_date || p.created_at,
    job_status_numeric: p.job_status_numeric || 0,
    skill_matching_percentage: 0,
    skill_names: p.skill_names || '',
    table_no: p.table_no || null
});

const IndustriesJobs = ({ org_id }: IndustriesJobsProps) => {
    const params = new URLSearchParams()
    params.append('org_id', org_id.toString())
    const { data: jobs = [], isLoading } = usePublishedJobs(params)

    const availableJobs = jobs.filter((j: Program) => j.is_job === 1).map(mapToJob);
    const availableInternships = jobs.filter((j: Program) => j.is_internship === 1).map(mapToJob);

    return (
        <div className="space-y-6">
            <LoadingSection
                isLoading={isLoading}
                title="Loading opportunities..."
                description="Please wait while we fetch the latest job openings."
            />

            {!isLoading && availableJobs.length > 0 && (
                <div className="w-full">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-white text-2xl font-bold">Available Jobs</h2>
                        <Link to={`/opportunities`} className="text-[#8cc63f] hover:text-[#7db436] font-medium transition-colors text-sm underline-offset-4 hover:underline">
                            View All
                        </Link>
                    </div>
                    
                    <div className="relative px-2">
                        <Carousel
                            opts={{
                                align: "start",
                                loop: false
                            }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-4">
                                {availableJobs.map((job) => (
                                    <CarouselItem key={job.id} className="pl-4 md:basis-1/2 lg:basis-1/3 flex">
                                        <JobCard job={job} />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="-left-4 sm:-left-6 lg:-left-8 bg-[#444] border-none text-white hover:bg-[#8cc63f] hover:text-black transition-colors" />
                            <CarouselNext className="-right-4 sm:-right-6 lg:-right-8 bg-[#444] border-none text-white hover:bg-[#8cc63f] hover:text-black transition-colors" />
                        </Carousel>
                    </div>
                </div>
            )}

            {!isLoading && availableInternships.length > 0 && (
                <div className="w-full">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-white text-2xl font-bold">Available Internships</h2>
                        <Link to={`/opportunities`} className="text-[#8cc63f] hover:text-[#7db436] font-medium transition-colors text-sm underline-offset-4 hover:underline">
                            View All
                        </Link>
                    </div>
                    
                    <div className="relative px-2">
                        <Carousel
                            opts={{
                                align: "start",
                                loop: false
                            }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-4">
                                {availableInternships.map((job) => (
                                    <CarouselItem key={job.id} className="pl-4 md:basis-1/2 lg:basis-1/3 flex">
                                        <JobCard job={job} />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="-left-4 sm:-left-6 lg:-left-8 bg-[#444] border-none text-white hover:bg-[#8cc63f] hover:text-black transition-colors" />
                            <CarouselNext className="-right-4 sm:-right-6 lg:-right-8 bg-[#444] border-none text-white hover:bg-[#8cc63f] hover:text-black transition-colors" />
                        </Carousel>
                    </div>
                </div>
            )}

            {!isLoading && availableJobs.length === 0 && availableInternships.length === 0 && (
                <Card className="py-16 bg-[#1a1a1a] border-none">
                    <CardContent className="text-center">
                        <h3 className="text-xl font-semibold mb-2 text-white">No opportunities found</h3>
                        <p className="text-gray-500">
                            Check back later for new openings
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default IndustriesJobs