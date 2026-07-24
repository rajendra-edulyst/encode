import React, { useEffect, useState, lazy } from "react";
import { Button } from "@/components/ui/ShadcnButton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Alert } from "@/components/ui";
import Loading from "@/components/shared/Loading";
import { useJobDetailsStore } from "../../store/jobStore";
import { deleteJob, fetchJobDetails } from "../../services/jobDetailService";
import { Briefcase, MapPin, Users2, Plus } from "lucide-react";
import { BiMoney } from "react-icons/bi";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Breadcrumb from "@/components/breadcrumb";
import AddApplicantModal from "./components/AddApplicantModal";

const MatchingCandidates = lazy(() => import("./candidates/matching"));

const JobDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { jobDetails, setJobDetails, error, setError, loading, setLoading } = useJobDetailsStore();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAddApplicantModalOpen, setIsAddApplicantModalOpen] = useState(false);

    useEffect(() => {
        if (!id || isNaN(Number(id))) {
            toast.error("Something went wrong, Job not found");
            navigate("/industry/jobs");
        }
    }, [id, navigate]);

    if (!id || isNaN(Number(id))) {
        return null;
    }

    useEffect(() => {
        setError('');
        setLoading(true);
        fetchJobDetails(id)
            .then((data) => {
                setJobDetails(data);
            })
            .catch((err) => {
                setError('Failed to fetch job details');
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [setJobDetails, setError, setLoading, id]);

    const keywords = jobDetails?.keywords ? jobDetails.keywords.split(',').map((k: string) => k.trim()) : [];
    const skills = jobDetails?.skills ? jobDetails.skills.split(',').map((s: string) => s.trim()) : [];

    const toggleExpanded = () => {
        setIsExpanded(prev => !prev);
    };

    const getTruncatedHtml = (html: string) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        const text = div.textContent || div.innerText || '';
        return text?.length > 500 ? text?.substring(0, 500) + '...' : text;
    };


    const deleteJobMutation = useMutation({
        mutationFn: deleteJob,
        onSuccess: () => {
            toast('Job Deleted Successfully.');
            navigate('/industry/jobs');
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
            toast("Something went wrong while deleting job.");
            console.error('Job deletion error:', err);
        },
    });


    const deleteJobHandler = () => {
        // Implement delete job functionality here
        if (!jobDetails?.job_id) {
            toast.error("Job ID is not available for deletion.");
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteJobMutation.mutate(jobDetails?.job_id);
            }
        });
    };


    if (loading) {
        return <Loading loading={loading} />;
    }

    if (error) {
        return <Alert title={error} type="danger" />;
    }


    const breadcrumbItems = [
        { label: 'Jobs', path: '/industry/jobs' },
        { label: jobDetails?.job_designation || '', path: '' },
    ];


    return (
        <div className="min-h-screen">
            <Breadcrumb items={breadcrumbItems} />
            <Card className="mb-8 py-5">
                <div className="px-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                        <div>
                            <h2 className="text-3xl font-bold dark:text-white mb-2">
                                {jobDetails?.job_designation}
                            </h2>
                            <div className="flex flex-wrap gap-3 mt-3">
                                {(jobDetails?.location || jobDetails?.City || jobDetails?.State || jobDetails?.Country) && (
                                    <div className="flex items-center dark:text-white">
                                        <MapPin className="mr-2 dark:text-white" />
                                        {jobDetails?.location || [jobDetails?.City, jobDetails?.State, jobDetails?.Country].filter(Boolean).join(', ')}
                                    </div>
                                )}
                                {jobDetails?.job_role && (
                                    <div className="flex items-center dark:text-white">
                                        <Briefcase className="mr-2 dark:text-white" />
                                        {jobDetails?.job_role}
                                    </div>
                                )}
                                {(jobDetails?.min_Salary || jobDetails?.max_Salary) && (
                                    <div className="flex items-center dark:text-white">
                                        <BiMoney className="mr-2 dark:text-white" size={18} />
                                        {jobDetails?.min_Salary && jobDetails?.max_Salary 
                                            ? `${jobDetails.min_Salary} - ${jobDetails.max_Salary}` 
                                            : (jobDetails?.min_Salary || jobDetails?.max_Salary)}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex gap-2">
                            <Button 
                                variant="outline" 
                                className="border-primary text-primary hover:bg-primary hover:text-black whitespace-nowrap"
                                onClick={() => setIsAddApplicantModalOpen(true)}
                            >
                                <Plus className="mr-2" size={16} /> Add Applicant
                            </Button>
                            <Button asChild className="text-white whitespace-nowrap">
                                <a href={`#matchingCandidates`}><Users2 /> View Profiles</a>
                            </Button>
                            <Button variant="outline" className="text-gray-700 dark:text-white whitespace-nowrap" onClick={deleteJobHandler}>Delete Job</Button>
                        </div>
                    </div>
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                    Job Description
                                </h3>
                                <div>
                                    <div
                                        className="text-gray-700 dark:text-white leading-relaxed"
                                        dangerouslySetInnerHTML={{
                                            __html: isExpanded ? jobDetails?.description : getTruncatedHtml(jobDetails?.description),
                                        }}
                                    />
                                    {jobDetails?.description?.length > 500 && (
                                        <button
                                            className="mt-2 underline"
                                            onClick={toggleExpanded}
                                        >
                                            {isExpanded ? 'See less' : 'See more'}
                                        </button>
                                    )}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                                    Key Responsibilities
                                </h3>
                                <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-white">
                                    {keywords?.length > 0 ? (
                                        keywords?.map((item: React.ReactNode, index: number) => (
                                            item && <li key={index} className="leading-relaxed">
                                                {item}
                                            </li>
                                        ))
                                    ) : (
                                        <p className="text-gray-600 dark:text-white">No responsibilities listed</p>
                                    )}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                    Required Skills
                                </h3>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {skills.length > 0 ? (
                                        skills.map((skill: React.ReactNode, index: number) => (
                                            skill && <Badge
                                                key={index}
                                                variant="secondary"
                                                className="px-3 py-1"
                                            >
                                                {skill}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-gray-600 dark:text-white">No skills listed</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            <MatchingCandidates jobId={jobDetails?.job_id?.toString() || id || ''} programId={jobDetails?.program_ids?.toString() || ''} />
            <AddApplicantModal 
                isOpen={isAddApplicantModalOpen} 
                onClose={() => setIsAddApplicantModalOpen(false)} 
                jobId={jobDetails?.job_id?.toString() || id} 
            />
        </div>
    );
};

export default JobDetails;