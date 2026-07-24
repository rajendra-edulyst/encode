import React, { useState, useEffect } from 'react';
import JobCard from './JobCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useEventJobs } from '@/hooks/data/collaborate/useEvents';
import LoadingSection from '@/components/LoadingSection';
import { useSessionUser } from '@/store/authStore';

const RecommendedJobs = () => {
    const { id } = useParams<{ id: string }>();
    const { data: eventJobs, isLoading: isEventJobsLoading } = useEventJobs(id);
    const user = useSessionUser((state) => state.user);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCompanies, setSelectedCompanies] = useState<any[]>([]);
    const [isApiLoading, setIsApiLoading] = useState(false);

    useEffect(() => {
        const fetchSelectedCompanies = async () => {
            const enrollmentNumber = user?.enrollment_number || user?.mec_regd_id || localStorage.getItem('enrollment_number') || localStorage.getItem('mec_regd_id');

            if (!enrollmentNumber) return;

            setIsApiLoading(true);
            try {
                const response = await fetch('https://encodeapi.codeedu.co/api/selected-company-list');
                const result = await response.json();

                if (result.status === 1 && result.data) {
                    const cleanEnrollment = String(enrollmentNumber).trim().toLowerCase();

                    // Filter by enrollment_number
                    const matchedData = result.data.filter(
                        (item: any) => item.enrollment_number && String(item.enrollment_number).trim().toLowerCase() === cleanEnrollment
                    );
                    setSelectedCompanies(matchedData);
                }
            } catch (error) {
                console.error("Failed to fetch selected companies:", error);
            } finally {
                setIsApiLoading(false);
            }
        };

        fetchSelectedCompanies();
    }, [user?.enrollment_number, user?.mec_regd_id]);

    const uniqueJobsData = Array.from(new Map(eventJobs?.map(job => [job.id, job]) || []).values());

    const filteredAndSortedJobs = (() => {
        // 1. Filter event jobs to only those present in the selected-company-list for this student
        let list = uniqueJobsData.filter(job => {
            return selectedCompanies.some(sc => {
                const scCompanyName = (sc.company || sc.company_details?.name || '').toLowerCase();
                const jobCompanyName = (job.company_name || '').toLowerCase();
                return scCompanyName && jobCompanyName && scCompanyName === jobCompanyName;
            });
        });

        // 2. Apply search text filter
        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            list = list.filter(job =>
                job.name?.toLowerCase().includes(searchLower) ||
                job.company_name?.toLowerCase().includes(searchLower) ||
                job.location?.toLowerCase().includes(searchLower)
            );
        }

        // 3. Mark as Selected
        return list.map(job => ({
            ...job,
            job_status: 'Selected',
            job_status_numeric: 1
        }));
    })();

    const isLoading = isEventJobsLoading || isApiLoading;

    if (isLoading) return <LoadingSection isLoading={true} title="Finding selected companies..." description="Please wait..." />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h3 className="text-white font-bold text-xl">Selected Company</h3>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-[2] md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="search by company or location"
                            className="bg-[#2A2A2A] border-gray-700 pl-10 text-white placeholder:text-gray-500 rounded-lg focus-visible:ring-[#8cc63f] focus-visible:border-[#8cc63f]"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredAndSortedJobs.map((job) => (
                    <JobCard key={job.id} job={job as any} />
                ))}
                {filteredAndSortedJobs.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-[#2A2A2A] rounded-2xl border border-dashed border-[#8cc63f]">
                        <p className="text-gray-500">No selected companies found for this drive.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecommendedJobs;
