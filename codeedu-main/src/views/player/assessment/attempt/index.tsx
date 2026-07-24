import React, { memo, useMemo, lazy, useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/ShadcnButton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import { Flag, FileText } from 'lucide-react';
import Report from './components/Report';
import QuestionPalette from './components/QuestionPalette';
import QuestionNavigation from './components/QuestionNavigation';
import AssesmentHeader from './components/AssesmentHeader';
import QuestionRenderer from './components/QuestionRenderer';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Save } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAssessmentAttempt } from './hooks/useAssessmentAttempt';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/auth';
import { toast } from 'sonner';
import { mixpanelService } from '@/services/mixpanel/MixpanelService';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import WebcamProctor from './components/WebcamProctor';

const Review = lazy(() => import('./components/Review'));

const MemoizedQuestionRenderer = memo(QuestionRenderer);
const MemoizedQuestionPalette = memo(QuestionPalette);
const MemoizedQuestionNavigation = memo(QuestionNavigation);
const MemoizedAssesmentHeader = memo(AssesmentHeader);

const AssesmentAttempt: React.FC = () => {

  const { id, courseId } = useParams<{ id: string, courseId: string }>();
  const selectedUser = new URLSearchParams(window.location.search).get('selectedUser');
  // Use custom hook for all assessment logic
  const {
    currentQuestion,
    setCurrentQuestion,
    answers,
    setAnswers,
    timeLeft,
    markedForReview,
    showReportDialog,
    setShowReportDialog,
    reviewDialog,
    setReviewDialog,
    loading,
    error,
    assesment,
    answeredCount,
    progressPercentage,
    handleAnswerChange,
    getQuestionStatus,
    toggleMarkForReview,
    finishAssesment,
    autoSubmitAssessment,
    isSaving,
    questions,
  } = useAssessmentAttempt({ id, student_id: selectedUser ? parseInt(selectedUser) : undefined });

  // Update questions length
  const questionsLengthCount = useMemo(
    () => questions.length,
    [questions]
  );
  useEffect(() => {
    if (assesment?.title) {
      mixpanelService.track('Assessment Started', {
        assessment_id: id,
        assessment_name: assesment.title,
        total_questions: questions.length,
        page_path: window.location.pathname,
        timestamp: new Date().toISOString()
      });
    }
  }, [assesment?.title, id]);

  const { user } = useAuth();
  const hasAutoSubmittedRef = useRef(false);
  const allowFullscreenExitRef = useRef(false);
  const VIOLATION_LIMIT = 3;
  const lastViolationTimeRef = useRef(0);
  const violationCountRef = useRef(0);
  const [showRefreshWarning, setShowRefreshWarning] = useState(false);
  const pendingReloadRef = useRef(false);
  const handle = useFullScreenHandle();

  const safeAutoSubmit = (reason: string) => {
    if (hasAutoSubmittedRef.current) return;

    hasAutoSubmittedRef.current = true;
    allowFullscreenExitRef.current = true;

    mixpanelService.track('Assessment Auto Submitted', {
      assessment_id: id,
      assessment_name: assesment?.title,
      reason,
      answered_questions: answeredCount,
      timestamp: new Date().toISOString(),
    });

    toast.error(reason);
    autoSubmitAssessment();
  };

  const registerViolation = (reason: string) => {
    const now = Date.now();
    // Prevent double-counting or rapid-fire violations (e.g. blur + visibilitychange)
    if (now - lastViolationTimeRef.current < 3000) return;
    lastViolationTimeRef.current = now;

    violationCountRef.current += 1;
    const remaining = VIOLATION_LIMIT - violationCountRef.current;
    if (remaining <= 0) {
      safeAutoSubmit(`Attempt auto-submitted: ${reason}`);
      return;
    }
    toast.warning(`${reason}. Warning ${violationCountRef.current}/${VIOLATION_LIMIT}.`, {
      duration: 5000,
    });
  };

  const safeFinishAssessment = (skipConfirmation: boolean = false) => {
    allowFullscreenExitRef.current = true;

    mixpanelService.track('Assessment Completed', {
      assessment_id: id,
      assessment_name: assesment?.title,
      total_questions: questions.length,
      answered_questions: answeredCount,
      timestamp: new Date().toISOString(),
    });

    finishAssesment(skipConfirmation);
  };

  // Harden browser interactions during assessment (copy/paste/context/tools shortcuts)
  useEffect(() => {
    const preventEvent = (e: Event) => {
      if (e.type === 'selectstart' || e.type === 'dragstart') {
        const target = e.target as HTMLElement;
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          (typeof target.closest === 'function' && target.closest('[contenteditable]'))
        ) {
          return;
        }
      }
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Intercept refresh shortcuts to show custom warning dialog
      const isRefresh =
        e.key === 'F5' ||
        (e.ctrlKey && e.key.toLowerCase() === 'r') ||
        (e.metaKey && e.key.toLowerCase() === 'r');

      if (isRefresh) {
        e.preventDefault();
        setShowRefreshWarning(true);
        return;
      }

      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U') ||
        (e.ctrlKey && ['c', 'v', 'x', 'a', 'p', 's'].includes(e.key.toLowerCase())) ||
        (e.metaKey && ['c', 'v', 'x', 'a', 'p', 's'].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', preventEvent);
    document.addEventListener('copy', preventEvent);
    document.addEventListener('paste', preventEvent);
    document.addEventListener('cut', preventEvent);
    document.addEventListener('selectstart', preventEvent);
    document.addEventListener('dragstart', preventEvent);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', preventEvent);
      document.removeEventListener('copy', preventEvent);
      document.removeEventListener('paste', preventEvent);
      document.removeEventListener('cut', preventEvent);
      document.removeEventListener('selectstart', preventEvent);
      document.removeEventListener('dragstart', preventEvent);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Fullscreen enforcement and tab/window focus monitoring.
  useEffect(() => {
    if (!handle.active) return; // Only add strict monitoring when actually in fullscreen

    const onVisibilityChange = () => {
      if (document.hidden && handle.active) {
        registerViolation('Tab/app switching is not allowed during assessment');
      }
    };

    const onBlur = () => {
      if (handle.active) {
        registerViolation('Window focus loss is not allowed during assessment');
      }
    };

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    // Delay adding listeners to avoid false violations during initial fullscreen transition
    const timeoutId = setTimeout(() => {
      document.addEventListener('visibilitychange', onVisibilityChange);
      window.addEventListener('blur', onBlur);
    }, 2000);

    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('beforeunload', onBeforeUnload);

      if (handle.active && !allowFullscreenExitRef.current) {
        handle.exit();
      }
    };
  }, [handle.active]);

  const [hasStartedFullscreen, setHasStartedFullscreen] = useState(false);

  const handleFullScreenChange = (isFull: boolean) => {
    if (isFull) {
      setHasStartedFullscreen(true);
    } else if (hasStartedFullscreen && !allowFullscreenExitRef.current) {
      registerViolation('Fullscreen mode is mandatory during assessment');
    }
  };

  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isRequestingCamera, setIsRequestingCamera] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loading loading={loading} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <Alert title={error?.message || 'Failed to load assessment'} type='danger' />
      </div>
    );
  }

  return (
    <FullScreen handle={handle} onChange={handleFullScreenChange} className="fullscreen-container">
      {!handle.active ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl max-w-md w-full text-center shadow-xl border border-gray-100 dark:border-gray-700">
            <FileText className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Assessment Ready</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
              This assessment requires fullscreen mode to ensure a distraction-free environment.
              Exiting fullscreen or switching tabs will result in a warning or auto-submission.
            </p>
            <Button
              onClick={async () => {
                try {
                  await handle.enter();
                } catch {
                  toast.error('Failed to enter fullscreen. Please try again.');
                }
              }}
              className="w-full text-lg h-12 bg-green-600 hover:bg-green-700 text-white"
            >
              Enter Fullscreen & Start
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="h-full bg-white dark:bg-gray-900 overflow-y-auto">
            <MemoizedAssesmentHeader
              title={assesment?.title || ''}
              timeLeft={timeLeft}
              progress={progressPercentage}
              onEndExam={safeFinishAssessment}
            />
            {/* Main Content */}
            <div className="pt-28 pb-32 px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                {/* Question Section */}
                <div className="col-span-1 md:col-span-7 flex flex-col gap-6">
                  <Card>
                    <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-8 h-8 text-primary" />
                          <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Question {currentQuestion + 1}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">of {questionsLengthCount}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <span className="text-sm font-medium text-green-700 dark:text-green-400">
                              Marks: {questions[currentQuestion]?.marks ?? 'N/A'}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                            onClick={() => setShowReportDialog(true)}
                          >
                            <Flag className="w-4 h-4 mr-2" />
                            Report
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Question Renderer Component */}
                      {questions[currentQuestion] && (
                        <MemoizedQuestionRenderer
                          question={questions[currentQuestion]}
                          currentAnswer={answers[currentQuestion]}
                          onAnswerChange={handleAnswerChange}
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>
                {/* Question Palette Sidebar */}
                <div className="col-span-1 md:col-span-3">
                  <div className="sticky top-32 flex flex-col gap-6">
                    <div>
                      <MemoizedQuestionPalette
                        questions={questions}
                        answers={answers}
                        markedForReview={markedForReview}
                        setCurrentQuestion={setCurrentQuestion}
                        getQuestionStatus={getQuestionStatus}
                        activeQuestion={currentQuestion}
                      />
                    </div>
                    <Card className='relative'>
                      <CardContent>
                        <div className='flex items-center gap-3'>
                          <img src={user?.profile_image || ''} alt="User Avatar" className="w-10 h-10 rounded-full border" />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user?.name || 'Learner'}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || ''}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Bottom Action Bar */}
          <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white dark:bg-[#121212] border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.3)] p-4 sm:px-8">
            <div className="max-w-[1400px] mx-auto flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="mark-review"
                  checked={markedForReview.has(currentQuestion)}
                  onCheckedChange={toggleMarkForReview}
                  className="w-5 h-5"
                />
                <Label htmlFor="mark-review" className="font-semibold cursor-pointer text-[15px] select-none text-gray-800 dark:text-gray-200">
                  Mark for Review
                </Label>
              </div>
              <MemoizedQuestionNavigation
                currentQuestion={currentQuestion}
                setCurrentQuestion={setCurrentQuestion}
                markedForReview={markedForReview}
                setAnswers={setAnswers}
                questionsLength={questionsLengthCount}
                answersLength={answeredCount}
                finishAssesment={safeFinishAssessment}
                timeLeft={timeLeft}
                isSaving={isSaving}
              />
            </div>
          </div>

          {/* Refresh Warning Dialog */}
          <Dialog open={showRefreshWarning} onOpenChange={setShowRefreshWarning}>
            <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none shadow-2xl [&>button]:hidden">
              <DialogTitle className="sr-only">Refresh Warning</DialogTitle>
              <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 px-6 py-5 flex items-center gap-3">
                  <div className="bg-white/20 rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-white tracking-wide">Warning — Do Not Refresh</h2>
                </div>
                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    If you refresh this page, <span className="font-semibold text-orange-600 dark:text-orange-400">your progress will be lost</span> and your current attempt will be <span className="font-semibold text-red-600 dark:text-red-400">reset</span>. You may not be able to resume from where you left off.
                  </p>
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg px-4 py-3 flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      We recommend staying on this page and completing your assessment without interruptions.
                    </p>
                  </div>
                </div>
                {/* Footer */}
                <div className="px-6 pb-5 flex gap-3 justify-end">
                  <button
                    onClick={() => setShowRefreshWarning(false)}
                    className="px-5 py-2 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors shadow"
                  >
                    Stay on Page
                  </button>
                  <button
                    onClick={() => { pendingReloadRef.current = true; window.location.reload(); }}
                    className="px-5 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Refresh Anyway
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Report Dialog */}
          <Report
            show={showReportDialog}
            question={questions[currentQuestion]?.question_id || 0}
            onClose={() => setShowReportDialog(false)}
          />

          {/* Review Dialog */}
          {reviewDialog && (
            <Review
              show={reviewDialog}
              assessment_id={id || null}
              courseId={courseId || null}
              onClose={(value: boolean) => setReviewDialog(value)}
            />
          )}
          {isSaving && (
            <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center bg-black/20 backdrop-blur-[1px] transition-opacity">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl border border-gray-100 dark:border-gray-700">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                  <div className="relative bg-primary/10 p-4 rounded-full">
                    <Save className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                    Saving Your Progress
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[250px]">
                    Please wait a moment while we securely save your assessment answer...
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </FullScreen>
  );
};

export default AssesmentAttempt;
