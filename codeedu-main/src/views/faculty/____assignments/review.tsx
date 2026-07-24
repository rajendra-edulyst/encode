import { Assignment, AssignmentLearner, AssignmentSubmission } from '@/@types/faculty/assignment';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/shadcnAvatar';
import { Button } from '@/components/ui/ShadcnButton';
import { Input } from '@/components/ui/ShadcnInput';
import { SidebarContent, SidebarFooter, useSidebar } from '@/components/ui/sidebar'
import { Textarea } from '@/components/ui/textarea';
import { addReviewComment } from '@/services/faculty/AssignmentService';
import { useAssignmentSubmissionStore } from '@/store/faculty/AssignmentStore';
import { File } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'sonner';

interface ReviewProps {
  assignment: Assignment;
  learner: AssignmentLearner;
  submission: AssignmentSubmission;
}

const Review: React.FC<ReviewProps> = ({ assignment, learner, submission }) => {
  const [review, setReview] = useState<{
    feedback: string;
    status: string | null;
    file: File | null;
    isGraded: number | null;
    maximum_marks: number;
    passing_marks: number;
  }>({
    feedback: '',
    status: null,
    file: null,
    isGraded: null,
    maximum_marks: 0,
    passing_marks: 0

  })

  const { setContent, setOpen, setTitle, setDescription } = useSidebar();
  const { fetchUserAssignmentSubmission } = useAssignmentSubmissionStore();
  const maximumMarks = assignment?.maximum_marks || 10;
  console.log('assignment data', JSON.stringify(assignment));
  console.log('assignment LEARNER', JSON.stringify(learner));
  console.log('assignment SUBMISSION', JSON.stringify(submission));

  const handleReview = () => {
    if (review.status === null) {
      toast.error('Please select a status');
      return;
    }

    if (!review.feedback) {
      toast.error('Please provide feedback');
      return;
    }

    // Only validate grade if maximum marks is not zero
    if (maximumMarks !== 0 && review.isGraded !== null) {
      if (review.isGraded < 0 || review.isGraded > maximumMarks) {
        toast.error(`Grade must be between 0 and ${maximumMarks}`);
        return;
      }
    }

    if (review.file) {
      const fileType = review.file.type;
      const fileSize = review.file.size;

      if (fileType !== 'application/pdf' && fileType !== 'application/msword' && fileType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        toast.error('Invalid file type. Only PDF, DOC, and DOCX are allowed.');
        return;
      }

      if (fileSize > 5 * 1024 * 1024) {
        toast.error('File size exceeds the limit of 5MB.');
        return;
      }
    }

    const data = new FormData();
    data.append('content_id', assignment?.id.toString());
    data.append('user_id', learner?.user_id.toString());
    data.append('id', submission?.id.toString());
    data.append('review_status', review.status);
    data.append('teacher_notes', review.feedback);

    // Only append marks if maximum marks is not zero and grade is provided
    if (maximumMarks !== 0 && review.isGraded !== null) {
      data.append('marks_obtained', review.isGraded.toString());
    }

    if (review.file) {
      data.append('teacher_file', review.file);
    }

    addReviewComment(data).then((response) => {
      console.log('Review submitted successfully:', response);
      toast.success('Review submitted successfully');
      setOpen(false);
      setContent(<></>);
      setTitle('');
      setDescription('');
      fetchUserAssignmentSubmission(assignment.id, learner.user_id);
    }).catch((error) => {
      toast.error('Something went wrong, Please try again later.');
      console.error('Error submitting review:', error);
    })
  }

  const handleGradeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '') {
      setReview(prev => ({
        ...prev,
        isGraded: null
      }));
      return;
    }

    const numericValue = parseFloat(value);

    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= maximumMarks) {
      setReview(prev => ({
        ...prev,
        isGraded: numericValue
      }));
    }
  }

  return (
    <>
      <SidebarContent className='p-2'>
        <div className="flex items-center justify-between p-2 border rounded-md shadow-sm bg-white mb-1">
          <div className='flex gap-2 items-center'>
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
              <File className='text-red-500' />
            </div>
            <div>
              <p className='text-sm font-bold'>Assignment</p>
              <p className={`text-xs ${submission.review_status === 1 ? 'text-green-500' : 'text-red-500'}`}>
                {submission.review_status === 1 ? 'Reviewed' : 'Not Reviewed'}
              </p>
            </div>
          </div>
        </div>

        {
          submission?.user_notes &&
          <div className="flex gap-1 border-t pt-3">
            <Avatar>
              <AvatarImage src={learner?.profile_image} alt="Profile" />
              <AvatarFallback>
                {learner?.user_name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="bg-green-100 rounded-md p-2">
              <p className='text-xs font-bold'>{submission?.user_notes}</p>
            </div>
          </div>
        }
        {
          submission?.teacher_notes &&
          <div className="flex gap-1 justify-end">
            <div className="bg-blue-100 rounded-md p-2">
              <p className='text-xs font-bold'>{submission?.teacher_notes}</p>
            </div>
            <Avatar>
              <AvatarImage src={`https://ui-avatars.com/api/?name=${submission?.reviewed_by}`} alt="Profile" />
            </Avatar>
          </div>
        }
      </SidebarContent>
      <SidebarFooter className='border-t p-2'>

        {maximumMarks != 0 && (
          <div>
            <Label className="text-sm font-bold">Grade (Max {maximumMarks})</Label>
            <Input
              type="number"
              min="0"
              max={maximumMarks}
              step="0.1"
              placeholder={`Enter grade (0-${maximumMarks})`}
              className="w-full"
              value={review.isGraded === null ? '' : review.isGraded}
              onChange={handleGradeChange}
            />
            <p className='text-xs text-gray-500'>Enter a value between 0 and {maximumMarks}</p>
          </div>
        )}

        <div>
          <Label className='text-sm'>Feedback</Label>
          <Textarea
            placeholder="Write your feedback here..."
            className="resize-none h-24"
            value={review.feedback}
            onChange={(e) => {
              setReview((prev) => ({
                ...prev,
                feedback: e.target.value
              }))
            }}
          />
        </div>
        <div>
          <Label className="text-sm font-bold">Attachment</Label>
          <Input
            type="file"
            accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="block w-full rounded border border-gray-300 shadow-sm p-2"
            onChange={(e) => {
              if (e.target.files) {
                setReview((prev) => ({
                  ...prev,
                  file: e.target.files && e.target.files[0]
                }))
              }
            }}
          />
          <p className='text-xs text-gray-500'>Accepted file types: PDF, DOC, DOCX</p>
        </div>
        <div>
          <Label className="text-sm font-bold">Status</Label>
          <Select defaultValue={submission.review_status.toString()} onValueChange={(value) => {
            setReview((prev) => ({
              ...prev,
              status: value
            }))
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Accepted</SelectItem>
              <SelectItem value="2">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" className='px-2' onClick={handleReview}>Submit Feedback</Button>
      </SidebarFooter>
    </>
  )
}

export default Review