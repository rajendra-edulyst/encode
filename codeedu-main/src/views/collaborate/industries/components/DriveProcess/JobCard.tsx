import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/ShadcnButton';
import { Bookmark, MapPin, Briefcase, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Job } from '@/@types/collaborate/jobs';
import { formatDate } from '@/utils/commonDateFormat';
import { Link, useLocation } from 'react-router-dom';

interface JobCardProps {
    job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');
    return (
        <Card className="relative bg-[#2A2A2A] border-none rounded-2xl overflow-visible min-h-[280px] h-full w-full p-6">
            {(job.table_no && String(job.table_no).trim() !== '' && String(job.table_no).trim().toLowerCase() !== 'null') && (
                <div className="absolute top-0 right-0 bg-[#fde047] text-black text-xs font-bold px-3 py-1 rounded-tr-2xl rounded-bl-xl z-10">
                    Table No: #{job.table_no}
                </div>
            )}
            <CardContent className="p-0 flex flex-col h-full space-y-4">
                {/* Header Section */}
                <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl bg-white p-3 flex items-center justify-center shrink-0">
                        <img src={job.company_logo} alt={job.company_name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1">
                        <Link
                            to={`/internship/${job.id}`}
                            state={{
                                from: location.pathname + location.search,
                                breadcrumbLabel: location.pathname.includes('/industries/')
                                    ? 'Industry Details'
                                    : location.pathname.includes('/must-attend')
                                        ? (category || 'Must Attend')
                                        : 'Jobs',
                                type: location.pathname.includes('/industries/')
                                    ? 'industry'
                                    : location.pathname.includes('/must-attend')
                                        ? 'must-attend'
                                        : 'jobs'
                            }}
                            className="hover:underline text-[#8cc63f] decoration-[#8cc63f] underline-offset-2 outline-none"
                        >
                            <h3 className="text-xl font-bold leading-tight mb-1">{job.name}</h3>
                        </Link>
                        <p className="text-white text-base font-medium mb-1">{job.company_name}</p>
                    </div>
                </div>

                {/* Job Details Section */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <Briefcase size={16} className="text-gray-400" />
                        <span>{job.experience ? String(job.experience).replace(/\.00/g, '').replace(/\s*-\s*/g, '-').replace(/\s*y(?:ears?)?/i, '').trim() + ' year' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <div className="w-4 h-4 flex items-center justify-center">
                            <div className="w-2 h-2 bg-gray-400 rotate-45"></div>
                        </div>
                        <span className="capitalize">{job.job_type}</span>
                    </div>
                    {job.location && (
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <MapPin size={16} className="text-gray-400" />
                            <span>{job.location}</span>
                        </div>
                    )}
                    <p className="text-gray-500 text-xs">
                        Posted On: {formatDate(job.created_at, 'MMM DD, YYYY')}
                    </p>
                </div>

                {/* Tags & Apply Button Section */}
                <div className="flex justify-between items-end mt-auto">
                    <div className="flex flex-wrap gap-2">
                        {job.skill_names && (typeof job.skill_names === 'string' ? job.skill_names.split(',') : (Array.isArray(job.skill_names) ? job.skill_names : [])).filter(Boolean).slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="border border-gray-600 text-gray-300 text-[10px] px-3 py-1 rounded-full bg-transparent">
                                {typeof skill === 'string' ? skill.trim() : skill}
                            </span>
                        ))}
                    </div>

                    <Link
                        to={`/internship/${job.id}`}
                        state={{
                            from: location.pathname + location.search,
                            breadcrumbLabel: location.pathname.includes('/industries/')
                                ? 'Industry Details'
                                : location.pathname.includes('/must-attend')
                                    ? (category || 'Must Attend')
                                    : 'Jobs',
                            type: location.pathname.includes('/industries/')
                                ? 'industry'
                                : location.pathname.includes('/must-attend')
                                    ? 'must-attend'
                                    : 'jobs'
                        }}
                        className={`rounded-xl w-[90px] h-[80px] flex flex-col items-center justify-center font-bold text-sm transition-all duration-300 no-underline shadow-lg ml-2 shrink-0 ${job.job_status || (job.job_status_numeric && job.job_status_numeric > 0)
                            ? 'bg-[#5A5A5A] text-white/90 opacity-80'
                            : 'bg-[#8cc63f] hover:bg-[#7db436] text-black transform hover:scale-105'
                            }`}
                    >
                        {!(job.job_status || (job.job_status_numeric && job.job_status_numeric > 0)) && (
                            <ArrowRight className="w-5 h-5 mb-0.5" />
                        )}
                        <span className="leading-tight text-center mt-1">
                            {job.job_status || (job.job_status_numeric && job.job_status_numeric > 0) ? (
                                'Applied'
                            ) : (
                                <>Apply<br />Now</>
                            )}
                        </span>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};

export default JobCard;
