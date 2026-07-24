import React, { useEffect, useState } from 'react'

import { Assignment, AssignmentLearner, AssignmentSubmission } from '@/@types/faculty/assignment';
import { useAssignmentSubmissionStore } from '@/store/faculty/AssignmentStore';
import { File, Download, Eye, Reply, Loader } from 'lucide-react';
import { Button } from '@/components/ui/ShadcnButton';
import { useSidebar } from '@/components/ui/sidebar';
import { useThemeStore } from '@/store/themeStore';
import Review from './review';
import PdfRender from '@/views/player/pdf';
import { Tooltip, TooltipTrigger } from '@/components/ui/shadcnTooltip';
import { TooltipContent } from '@radix-ui/react-tooltip';

interface SubmissionsProps {
    learner: AssignmentLearner;
    assignment: Assignment
}

const Submissions: React.FC<SubmissionsProps> = ({ learner, assignment }) => {

    const { assignmentSubmission, loading, error, fetchUserAssignmentSubmission } = useAssignmentSubmissionStore();
    const { setContent, setOpen, setTitle, setDescription } = useSidebar();
    const { setSideNavCollapse } = useThemeStore((state) => state);
    const [selectedViewAssignmentSubmission, setSelectedViewAssignmentSubmission] = useState<AssignmentSubmission | null>(null);

    const [selectedAssignment, setSelectedAssignment] = useState<{
        index: number;
        assignment: AssignmentSubmission;
    } | null>(null);

    useEffect(() => {
        fetchUserAssignmentSubmission(assignment.id, learner.user_id);
    }, [assignment.id, learner.user_id, fetchUserAssignmentSubmission]);


    if (assignmentSubmission.length === 0) {
        return (
            <div className="flex flex-col h-full">
                <h1 className="text-xl font-bold">No Submissions</h1>
                <p className="text-gray-500">
                    Assignment {assignment.title} not Submitted By <span className='font-bold capitalize'>{learner.user_name}</span>
                </p>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full px-3">
                <Loader className="animate-spin h-10 w-10 text-blue-500" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full px-3">
                <h1 className="text-xl font-bold text-red-500">Error</h1>
                <p className="text-gray-500">{error}</p>
            </div>
        )
    }

    const reviewAssignment = (assignmentSubmission: AssignmentSubmission, index: number) => {
        setSelectedAssignment({
            index,
            assignment: assignmentSubmission
        });
        setContent(<Review learner={learner} assignment={assignment} submission={assignmentSubmission} />);
        setOpen(true);
        setTitle('Assignment ' + (index + 1) + ' Review');
        setDescription(assignment?.title);
        setSideNavCollapse(true);
    }

    return (
        <div>
            <div className='mb-2'>
                <h2 className="text-lg font-semibold">Submission List</h2>
                <p className="text-gray-500">
                    Assignment {assignment.title} Submitted By <span className='font-bold capitalize'>{learner.user_name}</span>
                </p>
            </div>
            {
                !selectedViewAssignmentSubmission && <div>
                    {
                        assignmentSubmission.map((submission, index) => (
                            <div key={submission.id}>
                                <div className="flex items-center justify-between p-2 border rounded-md shadow-sm bg-white mb-1">
                                    <div className='flex gap-2 items-center'>
                                        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                                            <File className='text-red-500' />
                                        </div>
                                        <div>
                                            <p className='text-sm font-bold'>Assignment {index + 1}</p>
                                            <p className={`text-xs ${submission.review_status === 1 ? 'text-green-500' : 'text-red-500'}`}>{submission.review_status === 1 ? 'Reviewed' : 'Not Reviewed'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Button variant="outline" size="sm" className={`px-2 hover:bg-primary hover:text-white`} onClick={() => reviewAssignment(submission, index)}><Reply size={6} /></Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <div className='p-2 bg-white border rounded-lg mb-1'>Review Assignment</div>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Button variant="outline" size="sm" className='px-2 hover:bg-primary hover:text-white' onClick={() => setSelectedViewAssignmentSubmission(submission)}><Eye size={6} /></Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            }
            {
                selectedViewAssignmentSubmission && (<div className='mt-2'>
                    <div className='flex justify-end mt-2 mb-2'>
                        <Button variant="outline" size="sm" className='px-2 mr-2' onClick={() => setSelectedViewAssignmentSubmission(null)}><span>Close</span></Button>
                        <Button variant="default" size="sm" className='px-2 text-white' onClick={() => window.open(selectedViewAssignmentSubmission?.file, '_blank')}><span className='flex items-center gap-1'><Download size={12} /> Download</span></Button>
                    </div>
                    <PdfRender fileUrl={selectedViewAssignmentSubmission?.file} />
                </div>
                )
            }
        </div>
    )
}
export default Submissions