import { User } from "@/@types/auth";
import { CommonModuleContent } from "@/@types/learner/Courses";
import { useAuth } from '@/auth';
import SafeHtml from "@/components/SafeHtml";
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/ShadcnButton';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAssessmentDetailsWithQuestions, useAssessmentResult, useProgramStudentReviewed, useProgramUserList } from '@/hooks/data/create/useCourses';
import { saveSurveyAnswers } from '@/services/create/AssessmentService';
import { CheckCircle2, ChevronRight, CircleCheckBig, Eye, FileText, Loader2, Plus, Send, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { FACULTY } from '@/constants/roles.constant';

interface AssessmentProps {
  content: CommonModuleContent;
  /** After successful survey-submit, refetch event details so `attempt_id` is merged (same session). */
  onSurveySubmitted?: () => void | Promise<void>;
}

const Survey = ({ content, onSurveySubmitted }: AssessmentProps) => {

  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: assessmentResults } = useAssessmentResult(content?.program_content_id?.toString());
  const { data: assessmentAttempt, isLoading, error } = useAssessmentDetailsWithQuestions(content?.program_content_id?.toString());

  const assessmentDetails = assessmentAttempt?.assessment_details;
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [marksObtained, setMarksObtained] = useState<Record<number, number | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const [thankYouOpen, setThankYouOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const user_calender_id = searchParams.get("user_calender_id") || searchParams.get("user_calendar_id");

  const questions = assessmentDetails?.questions || [];
  const isPresenterOrFaculty = `${user?.authority}` === FACULTY;

  const handleAnswerChange = (questionIndex: number, questionId: number, value: string) => {
    setAnswers({ ...answers, [questionIndex]: value });
    // Clear validation error when user starts filling in fields
    if (validationError) {
      setValidationError('');
    }
  };

  const handleMarksChange = (questionIndex: number, value: number) => {
    setMarksObtained({
      ...marksObtained, [questionIndex]: value
    });
    // Clear validation error when user starts filling in fields
    if (validationError) {
      setValidationError('');
    }
  }

  const handleSubmitSurvey = async () => {
    try {
      if (!content?.program_content_id) {
        toast.error('ID not found');
        return;
      }

      if (content?.attempt_id != null) {
        toast.error('You have already submitted this feedback.');
        return;
      }

      // Validation: Check if all questions are answered
      const unansweredQuestions: number[] = [];
      const questionsWithoutMarks: number[] = [];

      questions.forEach((question: any, idx: number) => {
        const answer = answers[idx];
        const hasOptions = question?.options?.length > 0;

        // For survey: all questions must be answered
        if (!isPresenterOrFaculty && content?.content_type === 'survey') {
          if (!answer || (typeof answer === 'string' && answer.trim() === '')) {
            unansweredQuestions.push(idx + 1);
          }
        }

        // For assessment: both answer and marks are mandatory for text-based questions
        if (content?.content_type === 'assessment') {
          // Check if question is answered
          if (!isPresenterOrFaculty && (!answer || (typeof answer === 'string' && answer.trim() === ''))) {
            unansweredQuestions.push(idx + 1);
          }

          // For text-based questions (no options), marks are mandatory
          if (!hasOptions && isPresenterOrFaculty) {
            if (marksObtained[idx] === undefined || marksObtained[idx] === null) {
              questionsWithoutMarks.push(idx + 1);
            }
          }
        }
      });

      // Show validation errors
      if (!isPresenterOrFaculty && unansweredQuestions.length > 0) {
        toast.error(`Please answer question(s): ${unansweredQuestions.join(', ')}`);
        setValidationError(`Please answer question(s): ${unansweredQuestions.join(', ')}`);
        return;
      }

      if (questionsWithoutMarks.length > 0) {
        const questionText = questionsWithoutMarks.length === 1 ? 'question' : 'questions';
        const errorMessage = `Please provide marks for ${questionText}: ${questionsWithoutMarks.join(', ')}`;
        setValidationError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      setIsSubmitting(true);

      // Build the question_submitted array in the correct format
      const questionSubmitted = questions.map((question: any, idx: number) => {
        const answer = answers[idx];
        const hasOptions = question?.options?.length > 0;

        if (hasOptions) {
          // For multiple choice questions - use option_id
          let optionIds: number[] = [];

          if (answer) {
            // If answer is an array (multiple selections), use it directly
            if (Array.isArray(answer)) {
              optionIds = answer.map(a => parseInt(a));
            } else {
              // Single selection - convert to number
              optionIds = [parseInt(answer)];
            }
          }

          return {
            question_id: question?.question_id,
            option_id: optionIds,
          };
        } else {
          // For text-based questions - use answer_statement
          return {
            question_id: question?.question_id,
            answer_statement: answer || '',
            marks_obtained: marksObtained[idx] !== undefined ? marksObtained[idx] : null,
          };
        }
      });

      // Call the saveSurveyAnswers service with the formatted payload
      const message = await saveSurveyAnswers({
        content_id: content.program_content_id.toString(),
        answers: questionSubmitted,
        user_calender_id: user_calender_id ? parseInt(user_calender_id) : undefined,

      });

      toast.success(message || 'Submitted successfully!');

      if (content?.content_type === 'survey') {
        setThankYouOpen(true);
        await onSurveySubmitted?.();
      } else {
        await onSurveySubmitted?.();
        navigate('/create');
      }
    } catch (error) {
      console.error('Failed to submit survey:', error);
      toast.error('Failed to submit survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  /** Only backend `attempt_id` (merged in event activity from competitins-details) marks feedback as done. */
  const isCompleted = content?.attempt_id != null || (content?.content_type === 'survey' && content?.is_attempt === 1);

  return (
    <div className='flex flex-col gap-4 relative h-full'>
      {isSubmitting && content?.content_type === 'survey' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-lg">
          <div className="bg-[#323232] p-8 rounded-xl flex flex-col items-center shadow-2xl border border-gray-700">
            <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
            <h2 className="text-white text-xl font-semibold">Your feedback is saving please wait ..</h2>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loading loading={isLoading} />
        </div>
      )}

      {error && (
        <Alert title={'Failed to load'} type='danger' />
      )}

      {!isLoading && !error && (
        <>
          {isCompleted ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] px-6 sm:px-24 bg-[#323232] rounded-lg">
              <CircleCheckBig className="w-16 h-16 text-green-500 mb-4" />
              <h1 className="text-center text-2xl font-semibold text-white">
                {content?.content_type === 'survey' ? 'Feedback is already submitted' : `You have already completed this ${content?.title}.`}
              </h1>
              {content?.content_type === 'survey' && content?.is_attempt === 1 && (
                <p className="text-green-500 font-medium mt-2">Completion is 100%</p>
              )}
            </div>
          ) : (
            <Card className='bg-[#323232]'>
              {/* <CardHeader>
                <CardTitle className='text-white text-2xl font-bold'>Survey Details</CardTitle>
                <CardAction className='flex gap-3'>
                  {assessmentResults?.certificate_url ? (
                    <Button className='text-black' onClick={() => window.open(assessmentResults.certificate_url, '_blank')}>
                      View Certificate
                    </Button>
                  ) : null}
                  {
                    content?.attempts_remaining > 0 && <Button className='text-black' onClick={() => { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth', }) }}>
                      {content?.attempt_date ? 'Re-Attempt Survey' : 'Attempt Survey'}
                    </Button>
                  }
                </CardAction>
              </CardHeader> */}
              <CardContent>

                {/* {
                (content?.attempt_date != null && content?.attempt_date !== 0) &&
                <div>
                  <h5 className="mb-2">Last Attempt Details</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 mb-10 gap-4">
                    <div className="flex items-center border p-3 rounded gap-4 dark:bg-[#424242] dark:border-none">
                      <Calendar className="h-6 w-6 text-gray-600 dark:text-white font-bold" />
                      <div>
                        <span className="block text-gray-600 dark:text-white font-bold">Date</span>
                        <span className="block text-gray-800 dark:text-gray-200">
                          {formatDate(content.attempt_date, "DD/MM/YY HH:mm:ss")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center border p-3 rounded gap-4 dark:bg-[#424242] dark:border-none">
                      <BookOpenCheck className="h-6 w-6 text-gray-600 dark:text-white font-bold" />
                      <div>
                        <span className="block text-gray-600 dark:text-white font-bold">Marks</span>
                        <span className="block text-gray-800 dark:text-gray-200">
                          {content?.score}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              } */}

                <div className="col-span-1 md:col-span-7 flex flex-col gap-6">
                  <Card className="dark:bg-[#323232]">
                    <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                      {/* show selected user detail */}


                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-8 h-8 text-primary" />
                          <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Questions</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Answer all questions below</p>
                          </div>
                        </div>
                      </div>

                      {isPresenterOrFaculty && <div className="flex flex-col gap-2 py-4">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm text-gray-600 dark:text-white">
                            <span className="font-bold">Faculty:</span> {user?.name}
                          </p>
                          {/* <p className="text-sm text-gray-800 dark:text-gray-200">
                            <span className="font-bold">Learner:</span> {selectedUsers?.name} ({selectedUsers?.email})
                          </p> */}

                        </div>
                      </div>}

                    </CardHeader>
                    <CardContent className="pt-6">
                      <ScrollArea className="h-[600px] pr-4">
                        <div className="space-y-6">
                          {questions.length > 0 ? (
                            questions.map((question: any, idx: number) => (
                              <div key={idx} className="pb-6 border-b border-gray-600 last:border-b-0">
                                <div className="mb-4">
                                  <div className="flex items-start gap-2 mb-2">
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-semibold">
                                      {idx + 1}
                                    </span>
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                      <SafeHtml html={question?.question} className="text-gray-800" />
                                    </h3>
                                  </div>
                                  {question?.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 ml-10">
                                      <SafeHtml html={question?.description} className="text-gray-800" />
                                    </p>
                                  )}
                                </div>

                                {isPresenterOrFaculty && content?.content_type === 'assessment' && (
                                  <div className="my-4">
                                    <Label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                      Marks for this answer: <span className="text-red-500">*</span>
                                    </Label>
                                    <input
                                      type="number"
                                      min={0}
                                      max={question.marks || 0}
                                      value={marksObtained[idx] !== null ? marksObtained[idx] : ''}

                                      placeholder={`Max Marks: ${question.marks || 0}`}
                                      className="w-36 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                                      onChange={(e) => {
                                        const value = parseInt(e.target.value);

                                        if (value <= (question.marks || 0)) {
                                          handleMarksChange(idx, value);
                                        }
                                        else {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          handleMarksChange(idx, question?.marks || 0);
                                          toast.error(`Marks cannot exceed maximum of ${question?.marks || 0}`);
                                        }
                                      }}
                                    />
                                  </div>
                                )}

                                {/* Display options or text area based on question type */}
                                <div className="">
                                  {question?.options?.length > 0 ? (
                                    question?.options.map((option: any, optIdx: number) => (
                                      <label key={optIdx} className="flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                        <input
                                          type="radio"
                                          name={`question-${idx}`}
                                          value={option?.option_id || optIdx}
                                          checked={answers[idx] === (option?.option_id || optIdx).toString()}
                                          onChange={(e) => handleAnswerChange(idx, question?.question_id, e.target.value)}
                                          className="w-4 h-4 mt-1"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                          {option?.option_statement || option?.label || option?.text || `Option ${optIdx + 1}`}
                                        </span>
                                      </label>
                                    ))
                                  ) : (
                                    <>
                                      <textarea
                                        placeholder={`Enter your answer here... ${isPresenterOrFaculty ? '(Optional)' : ''}`}
                                        value={answers[idx] || ''}
                                        onChange={(e) => handleAnswerChange(idx, question?.question_id, e.target.value)}
                                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                                        rows={4}
                                      />
                                    </>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                              No questions available
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
                {/* Submit Button */}
                <div className="mt-6">
                  {/* Validation Error Display */}
                  {validationError && (
                    <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">Validation Error</h3>
                          <p className="text-sm text-red-700 dark:text-red-400 mt-1">{validationError}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleSubmitSurvey}
                    className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    <Send className="mr-2" size={20} />
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Thank you popup after successful submit */}
      <Dialog open={thankYouOpen} onOpenChange={setThankYouOpen}>
        <DialogContent className="sm:max-w-[680px] bg-[#6b6b6b] border-none p-0 overflow-hidden [&>button]:hidden">
          <div className="relative px-6 py-10 sm:px-10 sm:py-14 text-center">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setThankYouOpen(false)}
              className="absolute right-4 top-4 text-white/90 hover:text-white focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mx-auto max-w-[520px]">
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                ✨ Thank You!
              </h2>

              <p className="mt-8 text-xl sm:text-2xl leading-relaxed text-white/95">
                Your feedback is safely with us. We’re always listening and working on making things better.
              </p>

              <div className="mt-10 flex justify-center">
                <Button
                  type="button"
                  onClick={() => setThankYouOpen(false)}
                  className="bg-[#77B255] hover:bg-[#6aa64d] text-black font-semibold px-10 py-10 rounded-xl text-lg"
                >
                  <span className="leading-tight">
                    Continue
                    <br />
                    Exploring
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Survey
