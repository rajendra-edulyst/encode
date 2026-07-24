import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { SubmittedAssignment } from '@/@types/learner/assignment';
import { RiFilePdfFill } from 'react-icons/ri';
import { Eye } from 'lucide-react';

interface ReviewAssignmentProps {
    show: boolean;
    onClose: () => void;
    assignment: SubmittedAssignment | null;
}

function ReviewAssignment({ show, onClose, assignment }: ReviewAssignmentProps) {
    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Review Assignment</DialogTitle>
                    <DialogDescription>
                        {assignment?.user_notes}
                    </DialogDescription>
                </DialogHeader>
                <div className='flex border  p-3 gap-4 justify-between rounded'>
                    <div className="flex items-center gap-3">
                        <RiFilePdfFill className="w-6 h-6 text-red-600" />
                        Assignment
                    </div>
                    <div className="flex items-center space-x-2">
                        <Eye className="w-6 h-6 text-blue-600" />
                        <a href={assignment?.file} className="text-blue-600" target='_blank' rel='noreferrer'>
                            <span>Download Assignment</span>
                        </a>
                    </div>
                </div>
                <div>
                    <h6 className="text-sm text-gray-800 mt-4">Faculty Review - </h6>
                    <div className="flex items-center gap-4 text-gray-500">
                        {assignment?.teacher_notes}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ReviewAssignment