import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { assesmentFinish } from '@/services/learner/AssesmentService';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAssessmentDetailsWithQuestions, useSaveAssessmentAnswer } from '@/hooks/data/create/useCourses';

interface UseAssessmentAttemptProps {
  id: string | undefined;
  student_id?: number;
}

export const useAssessmentAttempt = ({ id, student_id }: UseAssessmentAttemptProps) => {
  const queryClient = useQueryClient();

  const studentId: string | undefined = student_id != undefined ? student_id.toString() : undefined;

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number | number[] | string | Record<number, string>>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [showReportDialog, setShowReportDialog] = useState<boolean>(false);
  const [reviewDialog, setReviewDialog] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { data: assesmentAttempt, isLoading: loading, error } = useAssessmentDetailsWithQuestions(id, studentId);
  const assesment = assesmentAttempt?.assessment_details;

  // Memoize sorted questions - move all question_type_id === 8 (Text type) to the end
  const questions = useMemo(() => {
    if (!assesment?.questions) return [];
    return [...assesment.questions].sort((a, b) => {
      // Move Text questions (type 8) to the end
      if (a.question_type_id === 8 && b.question_type_id !== 8) return 1;
      if (a.question_type_id !== 8 && b.question_type_id === 8) return -1;
      return 0;
    });
  }, [assesment?.questions]);

  const attempt_id = assesmentAttempt?.attempted_id;
  const saveAnswerMutation = useSaveAssessmentAnswer();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoSubmitRef = useRef<boolean>(false);

  const navigate = useNavigate();

  // Initialize timeLeft when assessment data is loaded
  useEffect(() => {
    if (assesment && timeLeft === 0) {
      setTimeLeft(assesment.duration_in_minutes * 60);
    }
  }, [assesment, timeLeft]);

  // Save answer to API using mutation
  const saveAnswerToAPI = useCallback(async (questionIndex: number, value: number | number[] | string | Record<number, string>) => {
    if (!id || !assesment || !questions[questionIndex]) {
      return;
    }

    const questionData = questions[questionIndex];

    const data: {
      content_id: string;
      question_id: number;
      option_id?: number | number[];
      answer_statement?: string;
      match_answers?: Record<number, string>;
      mark_review: number;
      durationSec: number;
      student_id?: number;
      question_sequence?: string;
    } = {
      content_id: id,
      question_id: questionData.question_id,
      mark_review: markedForReview.has(questionIndex) ? 1 : 0,
      durationSec: (assesment.duration_in_minutes * 60) - timeLeft,
      student_id: student_id,
      question_sequence: assesment.question_sequence,
    };

    console.log('Data to be sent:', data);

    // Add appropriate field based on question type
    if (questionData.question_type === 'Text' || questionData.question_type_id === 8) {
      data.answer_statement = value as string;
    } else if (questionData.question_type === 'Match The Following') {
      data.match_answers = value as Record<number, string>;
      data.answer_statement = JSON.stringify(value);
    } else {
      // For MCQ/MSQ/True-False, ensure it's treated as option_id
      data.option_id = value as number | number[];
    }

    // Use mutation to save answer with optimized retry and error handling
    try {
      setIsSaving(true);
      await saveAnswerMutation.mutateAsync(data);
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save answer');
    } finally {
      setIsSaving(false);
    }
  }, [id, assesment, markedForReview, timeLeft, saveAnswerMutation]);

  // Auto-submit handler
  const handleAutoSubmit = useCallback(async () => {
    if (!id) return;

    try {
      await assesmentFinish(id, studentId);
      // Invalidate all related queries to force a refresh on return
      queryClient.invalidateQueries({ queryKey: ['assessment-result'] });
      queryClient.invalidateQueries({ queryKey: ['assessment-instructions'] });
      queryClient.invalidateQueries({ queryKey: ['program-student-reviewed'] });
      queryClient.invalidateQueries({ queryKey: ['mycourses'] });
      queryClient.invalidateQueries({ queryKey: ['coursesProgress'] });
      queryClient.invalidateQueries({ queryKey: ['cci-stage-1-status'] });
      queryClient.invalidateQueries({ queryKey: ['cci-stage-2-status'] });
      queryClient.invalidateQueries({ queryKey: ['cci-stage-3-status'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });

      toast.success('Assessment submitted successfully!');
      const searchParams = new URLSearchParams(window.location.search);
      const cci = searchParams.get('cci');
      if (cci === '1') {
        navigate('/cci', { replace: true });
      } else if (attempt_id) {
        navigate(`/assessments/${id}/attempts/${attempt_id}/review`, { replace: true });
      } else {
        setReviewDialog(true);
      }
    } catch (error) {
      console.error('Auto-submit failed:', error);
      toast.error('Failed to submit assessment. Please try again.');
    }
  }, [attempt_id, id, navigate, queryClient, studentId]);

  // Handle answer change with proper typing and saving
  const handleAnswerChange = useCallback(async (value: number | number[] | string | Record<number, string>) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: value,
    }));

    if (!id || !assesment) {
      toast.error('Assessment Not Found, Please try again later');
      return;
    }

    await saveAnswerToAPI(currentQuestion, value);
  }, [currentQuestion, id, assesment, saveAnswerToAPI]);

  // Get question status
  const getQuestionStatus = useCallback((index: number): string => {
    if (markedForReview.has(index)) return 'review';
    if (answers[index] !== undefined) return 'answered';
    return 'unanswered';
  }, [answers, markedForReview]);

  // Toggle mark for review
  const toggleMarkForReview = useCallback(() => {
    setMarkedForReview((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion)) {
        newSet.delete(currentQuestion);
      } else {
        newSet.add(currentQuestion);
      }
      return newSet;
    });
  }, [currentQuestion]);

  // Memoized computed values
  const currentQuestionData = useMemo(
    () => assesment?.questions?.[currentQuestion],
    [assesment, currentQuestion]
  );

  const answeredCount = useMemo(
    () => Object.keys(answers).length,
    [answers]
  );

  const progressPercentage = useMemo(
    () => (answeredCount / (questions.length ?? 1)) * 100,
    [answeredCount, questions.length]
  );

  const questionsLength = useMemo(
    () => questions.length ?? 0,
    [questions.length]
  );

  // Finish assessment
  const finishAssesment = useCallback(async (skipConfirmation: boolean = false) => {
    const totalQuestions = questions.length ?? 0;
    const unansweredCount = totalQuestions - answeredCount;

    let isConfirmed = skipConfirmation;

    if (!skipConfirmation) {
      const result = await Swal.fire({
        title: 'Final Submit Assessment?',
        theme: 'dark',
        html: `
                  <div class="text-left flex flex-col items-center justify-center">
                      <p class="mb-2"><strong>Total Questions:</strong> ${totalQuestions}</p>
                      <p class="mb-2"><strong>Answered:</strong> ${answeredCount}</p>
                      <p class="mb-2"><strong>Unanswered:</strong> ${unansweredCount}</p>
                      ${unansweredCount > 0 ? `
                      <p class="text-sm text-center mt-4">You have unanswered questions!, <span class="text-red-600">this is final submission</span> and you won't be able to chnage your answers later.
                      </p>` : ''}
                  </div>
              `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Yes, submit it!',
        cancelButtonText: 'Review answers'
      });
      isConfirmed = result.isConfirmed;
    }

    if (isConfirmed) {
      if (!id) {
        toast.error('Assessment Not Found, Please try again later');
        return;
      }
      try {
        await assesmentFinish(id, studentId);
        // Invalidate all related queries to force a refresh on return
        queryClient.invalidateQueries({ queryKey: ['assessment-result'] });
        queryClient.invalidateQueries({ queryKey: ['assessment-instructions'] });
        queryClient.invalidateQueries({ queryKey: ['program-student-reviewed'] });
        queryClient.invalidateQueries({ queryKey: ['mycourses'] });
        queryClient.invalidateQueries({ queryKey: ['coursesProgress'] });
        queryClient.invalidateQueries({ queryKey: ['cci-stage-1-status'] });
        queryClient.invalidateQueries({ queryKey: ['cci-stage-2-status'] });
        queryClient.invalidateQueries({ queryKey: ['cci-stage-3-status'] });
        queryClient.invalidateQueries({ queryKey: ['user-profile'] });

        toast.success('Assessment submitted successfully!');
        const searchParams = new URLSearchParams(window.location.search);
        const cci = searchParams.get('cci');
        if (cci === '1') {
          navigate('/cci', { replace: true });
        } else {
          navigate(`/assessments/${id}/attempts/${attempt_id}/review`, { replace: true });
        }
      } catch (error) {
        Swal.fire('Error!', error as string, 'error');
      }
    }
  }, [answeredCount, attempt_id, id, navigate, queryClient, questions.length, studentId]);

  // Timer countdown with auto-submit
  useEffect(() => {
    if (timeLeft <= 0 || !assesment) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          if (!autoSubmitRef.current) {
            autoSubmitRef.current = true;
            handleAutoSubmit();
          }
          return 0;
        }

        if (prev === 300) {
          toast.warning('Only 5 minutes remaining!', {
            duration: 5000,
          });
        }

        if (prev === 60) {
          toast.error('Only 1 minute remaining!', {
            duration: 5000,
          });
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, assesment, handleAutoSubmit]);



  return {
    // State
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
    isSaving,
    loading,
    error,
    assesment,
    questions,

    // Computed values
    currentQuestionData,
    answeredCount,
    progressPercentage,
    questionsLength,

    // Actions
    handleAnswerChange,
    getQuestionStatus,
    toggleMarkForReview,
    finishAssesment,
    autoSubmitAssessment: handleAutoSubmit,
  };
};
