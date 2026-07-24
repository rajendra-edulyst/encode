import { Avatar } from '@/components/ui/shadcnAvatar'
import { Button } from '@/components/ui/ShadcnButton'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/ShadcnInput'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/shadcnTooltip'
import { CloudAlert, Eye, FileDown, RefreshCw, Search, ClipboardList } from 'lucide-react'
import React, { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchAppliedStudentsByJob, AppliedStudent } from '@/services/create/AssessmentService'
import SurveyModal from './SurveyModal'

interface MatchingCandidatesProps {
    jobId: string;
    programId: string;
}

const MatchingCandidates: React.FC<MatchingCandidatesProps> = ({ jobId, programId }) => {

    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // Survey Modal state
    const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
    const [surveyUserId, setSurveyUserId] = useState<number | null>(null);
    const [selectedCandidate, setSelectedCandidate] = useState<AppliedStudent | null>(null);

    const openSurveyModal = (candidate: AppliedStudent) => {
        setSurveyUserId(candidate.user_id);
        setSelectedCandidate(candidate);
        setIsSurveyModalOpen(true);
    };

    // Status badge color mapping
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Interview Scheduled":
                return "bg-blue-100 text-blue-800";
            case "Application Received":
                return "bg-gray-100 text-gray-800";
            case "Assessment Sent":
                return "bg-amber-100 text-amber-800";
            case "Rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-[#323232] text-gray-200 border border-gray-600";
        }
    };

    const { data: matchingJobCandidates, isLoading: loading, isError: error, refetch } = useQuery<AppliedStudent[]>({
        queryKey: ['appliedStudentsByJob', jobId],
        queryFn: () => fetchAppliedStudentsByJob(jobId),
        enabled: !!jobId,
    });

    return (
        <>
            {/* Filter and Search */}
            {/* Matching Candidates Section */}
            <div id="matchingCandidates">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Applied Candidates
                        </h2>
                        <p className="text-gray-600 dark:text-white mt-1">
                            Found {matchingJobCandidates?.length} candidates applied for this job
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex space-x-3">
                        <Button
                            variant="outline"
                            className="!rounded-button whitespace-nowrap"
                        >
                            <FileDown size={16} className="mr-2" /> Export
                        </Button>
                        {loading &&
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger className="border p-1.5 rounded-md">
                                        <RefreshCw size={16} className="animate-spin" />
                                    </TooltipTrigger>
                                    <TooltipContent>Syncing resumes...</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        }
                        {error &&
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger className="border p-1.5 rounded-md"><CloudAlert size={16} className="text-red-700" /></TooltipTrigger>
                                    <TooltipContent>{error}</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        }
                    </div>
                </div>
            </div>
            <div className="rounded-lg shadow-sm dark:border-gray-700 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Input
                            type="text"
                            placeholder="Search candidates..."
                            className="pl-10 border-gray-700"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2 text-gray-400" />
                    </div>
                    <div className="w-full md:w-48">
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-full border-gray-700">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="unable_to_offer_position">Unable to offer position</SelectItem>
                                <SelectItem value="application_under_process">Application Under Process</SelectItem>
                                <SelectItem value="application_shortlised">Application Shortlisted</SelectItem>
                                <SelectItem value="congratulations_selected_for_the_position">Selected for the position</SelectItem>
                                <SelectItem value="round_2">Round 2</SelectItem>
                                <SelectItem value="round_3">Round 3</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            {/* Candidates Table */}
            <Card className="overflow-hidden py-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center w-[60px]">#</TableHead>
                                <TableHead className="text-center w-[250px]">Candidate</TableHead>
                                <TableHead className="text-center">Email</TableHead>
                                <TableHead className="text-center">Mobile Number</TableHead>
                                <TableHead className="text-center">Resume</TableHead>
                                <TableHead className="text-center">Employment Type</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(() => {
                                const filteredCandidates = matchingJobCandidates?.filter(candidate => {
                                    const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                                          candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
                                    const matchesStatus = filterStatus === 'all' || candidate.job_status_text === filterStatus;
                                    return matchesSearch && matchesStatus;
                                }) || [];

                                if (filteredCandidates.length === 0) {
                                    return (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center">
                                                No candidates found.
                                            </TableCell>
                                        </TableRow>
                                    );
                                }

                                return filteredCandidates.map((candidate, index) => (
                                <TableRow
                                    key={candidate.user_id}
                                    className="cursor-pointer"
                                >
                                    <TableCell className="font-medium text-center">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center justify-center space-x-3">
                                            <Avatar>
                                                <img
                                                    src={candidate.profile_image || `https://ui-avatars.com/api/?name=${candidate.name}&background=random`}
                                                    alt={candidate.name}
                                                    className="object-cover"
                                                />
                                            </Avatar>
                                            <div className="text-left">
                                                <div className="font-semibold text-gray-900 dark:text-white">
                                                    {candidate.name}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="text-sm">{candidate.email}</div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="text-sm">{candidate.mobile_no || 'N/A'}</div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {candidate.document_url ? (
                                            <a
                                                href={candidate.document_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-primary hover:underline text-sm flex items-center justify-center gap-1"
                                            >
                                                <FileDown size={14} />
                                                {candidate.name.replace(/\s+/g, '').toLowerCase()}.pdf
                                            </a>
                                        ) : (
                                            <span className="text-sm text-gray-500">Not provided</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {candidate.employ_type || candidate.employment_type || 'N/A'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                candidate.job_status_text ? candidate.job_status_text.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Applied'
                                            )}`}
                                        >
                                            {candidate.job_status_text
                                                ? candidate.job_status_text.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                                                : 'Applied'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center space-x-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Link
                                                            to={`/portfolio/codeedu-dae124fa/${candidate.user_id}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="!rounded-button flex items-center justify-center p-1.5 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                                        >
                                                            <Eye size={16} />
                                                        </Link>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>View Profile</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className="!rounded-button flex items-center gap-1 h-8 px-3 bg-primary text-white"
                                                onClick={() => openSurveyModal(candidate)}
                                            >
                                                <ClipboardList size={14} />
                                                Feedback
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                ))
                            })()}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <SurveyModal
                isOpen={isSurveyModalOpen}
                onClose={() => setIsSurveyModalOpen(false)}
                onSuccess={() => {
                    refetch();
                    setIsSurveyModalOpen(false);
                }}
                userId={surveyUserId}
                mecRegdId={selectedCandidate?.mec_regd_id}
                employType={selectedCandidate?.employ_type}
                programId={programId}
                jobId={jobId}
            />
        </>
    )
}

export default memo(MatchingCandidates)