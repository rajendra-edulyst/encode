import React, { useState, useEffect } from 'react'
import { CommonModuleContent } from "@/@types/learner/Courses";
import { BookOpenCheck, Calendar, ChevronRight, Clock, FileText, Pencil, PlayCircle, Loader2, CheckCircle2, Hash } from 'lucide-react';
import { BiQuestionMark } from 'react-icons/bi';
import { formatDate } from '@/utils/commonDateFormat';
import { useAssessmentInstructions, useAssessmentResult } from '@/hooks/data/create/useCourses';
import { useAuth } from '@/auth';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/ShadcnButton';
import AssessmentReviewPage from './attempt/components/AssessmentReviewPage';

interface AssessmentProps {
  content: CommonModuleContent;
  isReviewing?: boolean;
  onReviewToggle?: (isReviewing: boolean) => void;
}

const Assessment = ({ content, isReviewing, onReviewToggle }: AssessmentProps) => {

  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: assessmentInstructions } = useAssessmentInstructions(content?.program_content_id);
  const { data: assessmentResults } = useAssessmentResult(content?.program_content_id?.toString());
  const isCCI = new URLSearchParams(window.location.search).get('cci') === '1';
  const assessmentDetails = assessmentInstructions?.details;
  const statements = assessmentInstructions?.statement || [];
  const [acceptedRules, setAcceptedRules] = useState(false);
  const attemptAllowed = Number(assessmentDetails?.attempt_allowed ?? 0);
  const attemptsTaken = Number(assessmentResults?.attempts_taken ?? 0);
  console.log("attemptAllowed", attemptAllowed);
  console.log("attemptsTaken", attemptsTaken);
  const hasAttemptsLeft = attemptsTaken < attemptAllowed;
  console.log("hasAttemptsLeft", hasAttemptsLeft);
  const canAttempt = Boolean(assessmentDetails) && hasAttemptsLeft;

  const handleStartExamForLearner = () => {
    if (!content?.program_content_id || !content?.program_id) {
      toast.error("Something went wrong. Please try again later.");
      return;
    }

    if (!canAttempt) {
      toast.error("No attempts remaining for this assessment.");
      if (assessmentDetails?.latest_attempt_id) {
        navigate(`/assessment/attempt/assessmentReview/${assessmentDetails.content_id}?attempt_id=${assessmentDetails.latest_attempt_id}`, { replace: true });
      }
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    const cci = searchParams.get('cci');
    const cciParam = cci ? `&cci=${cci}` : '';
    const url = `/assessment/${content?.program_id}/${content?.program_content_id}?course=${assessmentDetails?.program_name}&module=${assessmentDetails?.module_name}${cciParam}`;

    const elem = document.documentElement as any;
    const requestMethod = elem.requestFullscreen || elem.webkitRequestFullscreen || elem.mozRequestFullScreen || elem.msRequestFullscreen;

    if (requestMethod) {
      try {
        const promise = requestMethod.call(elem);
        if (promise && promise.catch) {
          promise.catch((err: any) => console.log(err));
        }
      } catch (e) {
        console.log(e);
      }
      navigate(url);
    } else {
      const width = window.screen.availWidth;
      const height = window.screen.availHeight;
      const popup = window.open(url, "AssessmentSecureWindow", `toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${width},height=${height},top=0,left=0`);
      if (!popup) {
        toast.error("Your browser does not support full screen. Opening normally.");
        navigate(url);
      }
    }
  };

  const handleToggleReview = (state: boolean) => {
    if (onReviewToggle) {
      onReviewToggle(state);
    }
  };

  if (isReviewing) {
    return (
      <AssessmentReviewPage
        contentId={assessmentDetails?.content_id?.toString()}
        attemptId={assessmentDetails?.latest_attempt_id?.toString()}
        onBack={() => handleToggleReview(false)}
      />
    );
  }

  return (
    <div className='flex flex-col gap-4 relative'>
      <Card className='bg-[#323232]'>
        <CardHeader>
          <CardTitle className='text-white text-2xl font-bold'>Assessment Details</CardTitle>
          <CardAction className='flex gap-3'>
            {/* start Assessment click to scroll to bottom */}
            {/* {content?.attempt_date && <Button asChild className='text-black'><Link to={`/`}>Review Last Attempt</Link></Button>} */}


            {assessmentDetails &&
              (Number(assessmentDetails.is_attempted) === 1 &&
                (
                  <Button className="bg-primary w-full text-black hover:bg-primary/30" onClick={() => handleToggleReview(true)}>
                    <FileText size={16} className="mr-2" />
                    Review
                  </Button>
                )
              )}
            {
              assessmentResults?.certificate_url && <Button className='text-black' onClick={() => window.open(assessmentResults.certificate_url, '_blank')}>
                {/* View Certificate */}
                View Certificate
              </Button>
            }
            {
              canAttempt && <Button className='text-black' onClick={() => { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth', }) }}>
                {/* Start Assessment */}
                {isCCI ? 'Start Now' : (Number(assessmentResults?.attempts_taken) > 0 ? 'Re-Attempt' : 'Attempt')}
              </Button>
            }
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mb-6 gap-4">

            {
              !isCCI && (
                <div className="flex items-center border p-3 rounded gap-4 dark:bg-[#424242] dark:border-none">
                  <Pencil className="h-6 w-6 text-gray-600 dark:text-white font-bold" />
                  <div>
                    <span className="block text-gray-600 dark:text-white font-bold">Attempts</span>
                    <span className="block text-gray-800 dark:text-gray-200">
                      {assessmentResults?.attempts_taken ?? 0} / {assessmentDetails?.attempt_allowed ?? 0} attempts taken
                    </span>
                  </div>
                </div>
              )
            }
            <div className="flex items-center border p-3 rounded gap-4 dark:bg-[#424242] dark:border-none">
              <Clock className="h-6 w-6 text-gray-600 dark:text-white font-bold" />
              <div>
                <span className="block text-gray-600 dark:text-white font-bold">Duration</span>
                <span className="block text-gray-800 dark:text-gray-200">
                  {assessmentDetails?.duration_in_minutes} minutes
                </span>
              </div>
            </div>
            {/* que_count */}
            <div className="flex items-center border p-3 rounded gap-4 dark:bg-[#424242] dark:border-none">
              <BiQuestionMark className="h-6 w-6 text-gray-600 dark:text-white font-bold" />
              <div>
                <span className="block text-gray-600 dark:text-white font-bold">Questions</span>
                <span className="block text-gray-800 dark:text-gray-200">
                  {assessmentDetails?.question_count} questions
                </span>
              </div>
            </div>
            {/* maximum_marks */}
            {!isCCI && (
              <>
                <div className="flex items-center border p-3 rounded gap-4 dark:bg-[#424242] dark:border-none">
                  <BookOpenCheck className="h-6 w-6 text-gray-600 dark:text-white font-bold" />
                  <div>
                    <span className="block text-gray-600 dark:text-white font-bold">Maximum Marks</span>
                    <span className="block text-gray-800 dark:text-gray-200">
                      {assessmentDetails?.maximum_marks}
                    </span>
                  </div>
                </div>
                <div className="flex items-center border p-3 rounded gap-4 dark:bg-[#424242] dark:border-none">
                  <BookOpenCheck className="h-6 w-6 text-gray-600 dark:text-white font-bold" />
                  <div>
                    <span className="block text-gray-600 dark:text-white font-bold">Passing Marks</span>
                    <span className="block text-gray-800 dark:text-gray-200">
                      {assessmentDetails?.passing_marks}
                    </span>
                  </div>
                </div>
                <div className="flex items-center border p-3 rounded gap-4 dark:bg-[#424242] dark:border-none">
                  <BookOpenCheck className="h-6 w-6 text-gray-600 dark:text-white font-bold" />
                  <div>
                    <span className="block text-gray-600 dark:text-white font-bold">Best Marks</span>
                    <span className="block text-gray-800 dark:text-gray-200">
                      {assessmentDetails?.score ?? '--'}
                    </span>
                  </div>
                </div>
              </>
            )}


          </div>
          {
            !isCCI && (assessmentResults?.attempted_date != null && Number(assessmentResults?.attempted_date) !== 0) &&
            <div>
              <h5 className="mb-2">Last Attempt Details</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 mb-10 gap-4">
                <div className="flex items-center border p-3 rounded gap-4 dark:bg-[#424242] dark:border-none">
                  <Hash className="h-6 w-6 text-gray-600 dark:text-white font-bold" />
                  <div>
                    <span className="block text-gray-600 dark:text-white font-bold">Reference No.</span>
                    <span className="block text-gray-800 dark:text-gray-200">
                      #{assessmentDetails?.latest_attempt_id}
                    </span>
                  </div>
                </div>
                <div className="flex items-center border p-3 rounded gap-4 dark:bg-[#424242] dark:border-none">
                  <Calendar className="h-6 w-6 text-gray-600 dark:text-white font-bold" />
                  <div>
                    <span className="block text-gray-600 dark:text-white font-bold">Date</span>
                    <span className="block text-gray-800 dark:text-gray-200">
                      {formatDate(assessmentResults?.attempted_date, "DD/MM/YY HH:mm:ss")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center border p-3 rounded gap-4 dark:bg-[#424242] dark:border-none">
                  <BookOpenCheck className="h-6 w-6 text-gray-600 dark:text-white font-bold" />
                  <div>
                    <span className="block text-gray-600 dark:text-white font-bold">Marks</span>
                    <span className="block text-gray-800 dark:text-gray-200">
                      {assessmentResults?.overall_score}
                    </span>
                  </div>
                </div>


              </div>
            </div>
          }
        </CardContent>
      </Card>
      <Card className='bg-[#323232]'>
        <CardHeader>
          <CardTitle className='text-white text-2xl font-bold'>Exam Instructions</CardTitle>
          <CardDescription>Please read all instructions carefully before starting the exam</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div>
              {statements.map((instruction, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 py-2 rounded-lg dark:bg-[#323232] transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div
                    className="flex-1 text-sm text-gray-700 dark:text-gray-300 leading-relaxed pt-1"
                    dangerouslySetInnerHTML={{ __html: instruction }}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {
        canAttempt &&
        <div className='sticky bottom-3 bg-[#323232] rounded-lg border'>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="accept-rules"
                  checked={acceptedRules}
                  className="mt-1"
                  onCheckedChange={(checked) =>
                    setAcceptedRules(checked as boolean)
                  }
                />
                <Label
                  htmlFor="accept-rules"
                  className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer leading-relaxed"
                >
                  I have read and agree to all exam instructions and rules
                </Label>
              </div>
              <Button
                disabled={!acceptedRules}
                className="w-full sm:w-auto flex items-center justify-center bg-primary hover:bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleStartExamForLearner}
              >
                <PlayCircle className="mr-2" size={18} />
                {isCCI ? 'Start Now' : 'Start Exam'}
                <ChevronRight className="ml-2" size={18} />
              </Button>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default Assessment