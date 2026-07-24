import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader2, X } from "lucide-react";
import person2 from "@/assets/images/Boy2.png";
import person3 from "@/assets/images/Boy3.png";
import person4 from "@/assets/images/Boy4.png";
import { useAuth } from "@/auth";
import appConfig from "@/configs/app.config";
import { toast } from "sonner";
import { fetchPersonaQuestions, fetchPersonaResponse, submitPersonaAnswers, fetchPersonaMaxCounts } from "./service";
import type { PersonaQuestion, PersonaFeedbackInsight } from "./types";

type PersonaStep = "intro" | "questions" | "complete";

interface PersonaInsightsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeMode?: boolean;
  isCompleted?: boolean;
}

const optionGridClass = (count: number) => {
  if (count <= 2) {
    return "grid-cols-1 sm:grid-cols-2";
  }

  return "grid-cols-1 sm:grid-cols-2";
};

const PersonaInsightsDialog = ({
  open,
  onOpenChange,
  resumeMode = false,
  isCompleted = false,
}: PersonaInsightsDialogProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<PersonaStep>(isCompleted ? "complete" : resumeMode ? "questions" : "intro");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insight, setInsight] = useState<PersonaFeedbackInsight | null>(null);
  const [questions, setQuestions] = useState<PersonaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [frozenSkipLabel, setFrozenSkipLabel] = useState<"Skip" | "Next">("Skip");

  useEffect(() => {
    if (!open) {
      return;
    }

    let mounted = true;

    const loadQuestions = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPersonaQuestions();
        const insightId = data.feedbackInsight?._id;
        const userExternalId = String(user?.id ?? "unknown-user");

        let userResponse = null;
        if (insightId) {
          userResponse = await fetchPersonaResponse(insightId, userExternalId);
        }

        if (!mounted) {
          return;
        }

        setInsight(data.feedbackInsight);
        const sortedQuestions = [...data.questions].sort((left, right) => left.orderIndex - right.orderIndex);
        setQuestions(sortedQuestions);

        let initialIndex = 0;
        if (userResponse && userResponse.answers) {
          const prefilledAnswers: Record<string, string> = {};
          userResponse.answers.forEach((ans: { questionId: string; answerValue?: { value: string } | string }) => {
            let val = "";
            if (typeof ans.answerValue === "string") {
              val = ans.answerValue;
            } else if (ans.answerValue && typeof ans.answerValue === "object") {
              val = ans.answerValue.value || "";
            }
            prefilledAnswers[String(ans.questionId)] = val;
          });
          setAnswers(prefilledAnswers);

          if (resumeMode) {
            const firstUnansweredIndex = sortedQuestions.findIndex(q => !prefilledAnswers[String(q._id)]);
            initialIndex = firstUnansweredIndex === -1 ? sortedQuestions.length - 1 : firstUnansweredIndex;
          }
        }

        setCurrentIndex(initialIndex);
        if (isCompleted) {
          setStep("complete");
        } else if (resumeMode) {
          setStep("questions");
          setStartedAt(Date.now());
        }
      } catch (loadError) {
        if (!mounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load persona questions right now."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadQuestions();

    return () => {
      mounted = false;
    };
  }, [open, user?.id]);

  useEffect(() => {
    if (!open) {
      setStep(isCompleted ? "complete" : resumeMode ? "questions" : "intro");
      setCurrentIndex(0);
      setAnswers({});
      setError(null);
      setStartedAt(null);
      setIsSubmitting(false);
    }
  }, [open, resumeMode, isCompleted]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const firstName = user?.name?.trim()?.split(" ")[0] || "Rahul";

  const completedCount = useMemo(
    () => questions.filter((question) => answers[question._id]).length,
    [answers, questions]
  );

  const isSubmitLast = async () => {
    const insightId = insight?._id;
    const userExternalId = String(user?.id ?? "unknown-user");
    const userResponse = insightId && await fetchPersonaResponse(insightId, userExternalId);
    return userResponse && userResponse.answers && userResponse.answers.length >= totalQuestions;
  }

  useEffect(() => {
    isSubmitLast().then(isLast => {
      setIsLastQuestion(isLast);
    });
  }, [insight?._id, user?.id]);

  const handleSelectOption = async (questionId: string, optionValue: string) => {
    if (isNavigating) return;

    // Capture current label BEFORE updating answers so button doesn't flicker
    setFrozenSkipLabel(answers[questionId] ? "Next" : "Skip");
    setIsNavigating(true);
    setAnswers((previous) => ({
      ...previous,
      [questionId]: optionValue,
    }));

    if (!insight?._id) {
      setIsNavigating(false);
      return;
    }

    // Incrementally submit the answer in the background
    try {
      const completionTime = startedAt
        ? Math.max(1, Math.round((Date.now() - startedAt) / 1000))
        : 1;

      const payload = {
        isAnonymous: false,
        completionTime,
        meta: {
          externalUserId: String(user?.id ?? "unknown-user"),
          appVersion: appConfig.appVersion,
          platform: /iphone|ipad|ipod/i.test(navigator.userAgent)
            ? "iOS"
            : /android/i.test(navigator.userAgent)
              ? "Android"
              : "Web",
        },
        answers: [
          {
            questionId,
            answerValue: { value: optionValue },
          },
        ],
      };

      const response = await submitPersonaAnswers(insight._id, payload);
      
      const totalAnswersCount = response?.data?.totalAnswersCount ?? response?.totalAnswersCount ?? 0;
      setIsLastQuestion(totalAnswersCount === totalQuestions);
      
      if (currentIndex < totalQuestions - 1) {
        handleNext();
      }
    } catch (err) {
      console.error('Failed to sync incremental answer:', err);
    } finally {
      setIsNavigating(false);
    }
  };

  const handleStart = () => {
    if (!questions.length) {
      return;
    }

    setStartedAt(Date.now());
    setStep("questions");
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((previous) => previous + 1);
    } else {
      onOpenChange(false);
    }
  };

  const handleFinish = async () => {
    if (!insight?._id) {
      toast.error("Insight information is missing.");
      return;
    }
    setIsSubmitting(true);
    try {
      await fetchPersonaMaxCounts(insight._id, String(user?.id ?? "unknown-user"));
    } catch (err) {
      console.error("Failed to fetch max counts", err);
    } finally {
      setIsSubmitting(false);
      setStep("complete");
    }
  };

  const handleBack = () => {
    if (step === "complete") {
      setStep("questions");
      setCurrentIndex(totalQuestions - 1);
      return;
    }

    setCurrentIndex((previous) => Math.max(previous - 1, 0));
  };

  const handleSkip = () => {
    if (!currentQuestion) {
      return;
    }

    setAnswers((previous) => {
      const nextAnswers = { ...previous };
      delete nextAnswers[currentQuestion._id];
      return nextAnswers;
    });

    handleNext();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full min-h-[90vh] md:min-h-[82vh] max-w-[900px] overflow-hidden bg-transparent p-0 shadow-none [&>button]:hidden border-none">
        <DialogTitle className="sr-only">Learning persona questionnaire</DialogTitle>
        <div className="relative min-h-[90vh] md:min-h-[82vh] h-auto overflow-y-auto text-white">
          <div className="relative max-h-[90vh] md:max-h-[82vh] overflow-y-auto rounded-[20px] md:rounded-[20px] border border-[#8d78ff] bg-[radial-gradient(circle_at_top,_rgba(132,110,255,0.42),_rgba(28,22,49,0.98)_55%)] text-white shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
            style={{ background: "radial-gradient(91.24% 67.91% at 55.11% 0%, #5B4E96 0%, #2E274C 52.4%, #1B172C 100%)" }}
          >
            <button
              type="button"
              aria-label="Close persona dialog"
              className="absolute right-6 top-6 z-20 text-white transition hover:scale-105 hover:text-[#d5c7ff]"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-10 w-10" />
            </button>

            {loading && (resumeMode || isCompleted) && (
              <div className="flex min-h-[360px] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-[#ba9fff]" />
              </div>
            )}

            {step === "intro" && !resumeMode && !isCompleted && (
              <div className="grid min-h-[400px] grid-cols-1 items-center gap-6 px-4 py-8 md:grid-cols-[280px_1fr] md:px-10">
                <div className="flex justify-center self-end -mb-8">
                  <img
                    src={person2}
                    alt="Persona guide"
                    className="max-h-[180px] sm:max-h-[250px] w-auto object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,0.55)] md:max-h-[445px]"
                  />
                </div>

                <div className="text-center md:text-center">
                  <p className="mb-5 text-lg font-bold text-[#B8A8FF] md:text-[32px]">
                    Hello {firstName}
                  </p>
                  <h2 className="text-2xl font-bold md:text-[20px] text-white">
                    Grow Smarter with Noah by Your Side
                  </h2>
                  <p className="mx-auto max-w-2xl text-base leading-7 text-white font-normal md:text-[16px]">
                    Start learning, evolve your skills, and elevate your expertise.
                  </p>
                  {error && (
                    <p className="mt-6 text-sm text-[#ffb4b4]">{error}</p>
                  )}

                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      disabled={loading || !questions.length}
                      className="min-h-[60px] md:min-h-[130px] w-full sm:w-auto min-w-[180px] rounded-[10px] bg-[#7568B1] px-8 py-4 text-lg md:text-xl font-normal text-white transition hover:bg-[#00A8E9] disabled:cursor-not-allowed disabled:opacity-70"
                      onClick={handleStart}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-3 text-lg">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Loading
                        </span>
                      ) : (
                        <span> Start <br /> Growing</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === "questions" && currentQuestion && (
              <div className="grid min-h-[480px] md:min-h-[500px] lg:min-h-[520px] grid-cols-1 gap-4 px-4 py-6 md:grid-cols-[190px_1fr] md:gap-5 md:pr-6 md:pl-0 lg:grid-cols-[220px_1fr]">
                <div>

                </div>
                <div className="absolute left-6 flex items-end justify-center self-end -mb-6">
                  <img
                    src={person3}
                    alt="Persona guide"
                    className="max-h-[160px] sm:max-h-[220px] w-auto object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,0.55)] md:max-h-[450px]"
                  />
                </div>

                <div className="flex min-h-0 flex-col items-center justify-center">
                  <div className="pr-10 text-center md:pr-14 min-h-[140px] md:min-h-[160px] flex flex-col justify-end">
                    <p className="mb-2 text-sm font-bold text-[#B8A8FF] md:text-[20px]">
                      Noah wants to know!
                    </p>
                    <div className="flex-1 flex items-center justify-center">
                      <h2 className="mx-auto max-w-3xl text-xl font-bold leading-tight sm:text-2xl md:text-[32px] md:leading-[1.2] lg:text-[36px]">
                        {currentQuestion.questionText}
                      </h2>
                    </div>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[#b4adc9] md:text-xs">
                      {currentIndex + 1} / {totalQuestions}
                      {currentQuestion.category?.name
                        ? ` • ${currentQuestion.category.name}`
                        : ""}
                    </p>
                  </div>

                  <div
                    className={`mt-8 w-fit grid ${optionGridClass(currentQuestion.options.length)} gap-8 px-0 md:px-2 lg:px-4`}
                  >
                    {currentQuestion.options.map((option) => {
                      const isSelected = answers[currentQuestion._id] === option.optionValue || answers[currentQuestion._id] === option._id;
                      return (
                        <button
                          key={option._id}
                          type="button"
                          className={`min-h-[88px] h-full rounded-[10px] border-2 px-4 py-4 text-center text-base leading-snug transition font-normal sm:text-lg md:min-h-[100px] w-[220px] m-auto md:text-[20px] lg:text-[20px] ${isSelected ? "border-white bg-[#00A8E9] text-white shadow-[0_12px_35px_rgba(131,104,255,0.32)]" : "border-transparent bg-[#7568B1] text-white hover:bg-[#00A8E9]"}`}
                          onClick={() => handleSelectOption(currentQuestion._id, option.optionValue)}
                        >
                          {option.optionLabel}
                        </button>
                      );
                    })}
                  </div>

                  <div className="hidden mt-6 flex flex-col-reverse items-stretch gap-3 pb-1 pt-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      disabled={currentIndex === 0}
                      className="w-full sm:w-auto min-w-[108px] rounded-[18px] border border-[#8e8e8e] bg-[#5a5a5a] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#696969] disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={handleBack}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="w-full sm:w-auto min-w-[108px] rounded-[18px] border border-[#8e8e8e] bg-[#5a5a5a] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#696969]"
                      disabled={isSubmitting}
                      onClick={answers[currentQuestion._id] ? handleNext : handleSkip}
                    >
                      {answers[currentQuestion._id] ? "Next" : "Skip"}
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto min-w-[108px] rounded-[18px] bg-[#8b79d8] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#9c8be0] disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={handleNext}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting
                        </span>
                      ) : currentIndex === totalQuestions - 1 ? (
                        "Finish"
                      ) : (
                        "Next"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === "complete" && (
              <div className="grid min-h-[340px] grid-cols-1 items-center px-4 py-8 md:grid-cols-[349px_1fr] md:pr-10 md:pl-0">
                <div className="flex items-end justify-center self-end -mb-8 md:justify-start">
                  <img
                    src={person4}
                    alt="Persona guide"
                    className="max-h-[180px] sm:max-h-[260px] w-auto object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,0.55)] md:max-h-[390px]"
                  />
                </div>

                <div className="text-center">
                  <p className="mb-4 text-3xl font-bold text-[#B8A8FF] md:text-[32px]">
                    Dear {firstName}
                  </p>
                  <h2 className="text-2xl font-bold md:text-[20px]">
                    You&apos;re Off to a Strong Start
                  </h2>
                  <p className="mx-auto max-w-3xl text-base font-normal leading-7 text-[#ece7ff] md:text-[16px]">
                    Take a moment to review your progress and plan your next step.
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.24em] text-[#b4adc9]">
                    {completedCount} of {totalQuestions} questions answered
                  </p>

                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      className="min-h-[90px] md:min-h-[130px] w-full sm:w-auto min-w-[190px] rounded-[10px] bg-[#7568B1] px-8 py-5 md:py-6 text-lg md:text-xl font-normal text-white transition hover:bg-[#00A8E9]"
                      // onClick={() => navigate("/cci-stage-4?persona=1")}
                      onClick={() => {
                        window.location.href = "/cci-stage-4?persona=1";
                      }}
                    >
                      View My
                      <br />
                      Progress
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
          {
            step === "questions" && currentQuestion && (
              <div className="mt-6 flex flex-col-reverse items-stretch gap-3 pb-1 pt-3 sm:flex-row sm:justify-end">
                {/* Back button */}
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  className="w-full h-[90px] sm:w-auto min-w-[108px] rounded-[14px] border-[3px] border-[#777777] bg-[#5A5A5A] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#696969] disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={handleBack}
                >
                  Back
                </button>

                {/* Skip / Next — hidden when on last question AND all answered */}
                {!(isLastQuestion && currentIndex === totalQuestions - 1) && (
                  <button
                    type="button"
                    className="w-full h-[90px] sm:w-auto min-w-[108px] rounded-[14px] border-[3px] border-[#777777] bg-[#5A5A5A] px-5 py-3 text-base font-bold text-white transition hover:bg-[#696969] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSubmitting || isNavigating}
                    onClick={() => {
                      if (answers[currentQuestion._id]) return handleNext();
                      return handleSkip();
                    }}
                    id="skip-button"
                  >
                    {isNavigating ? frozenSkipLabel : (answers[currentQuestion._id] ? "Next" : "Skip")}
                  </button>
                )}

                {/* Finish — always shown when all answered (mid-quiz as 3rd btn, last question as only action btn) */}
                {isLastQuestion && (
                  <button
                    type="button"
                    className="w-full h-[90px] sm:w-auto min-w-[108px] rounded-[14px] border-[3px] border-[#777777] bg-[#8B79D8] px-5 py-3 text-base font-bold text-white transition hover:bg-[#9c8be0] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSubmitting || isNavigating}
                    onClick={handleFinish}
                    id="finish-button"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Finishing
                      </span>
                    ) : "Finish"}
                  </button>
                )}

                {/* Last question, not all answered yet → Continue */}
                {!isLastQuestion && currentIndex === totalQuestions - 1 && (
                  <button
                    type="button"
                    className="w-full h-[90px] sm:w-auto min-w-[108px] rounded-[14px] border-[3px] border-[#777777] bg-[#8B79D8] px-5 py-3 text-base font-bold text-white transition hover:bg-[#9c8be0] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSubmitting || isNavigating}
                    onClick={() => {
                      if (answers[currentQuestion._id]) return handleNext();
                      return handleSkip();
                    }}
                  >
                    Continue
                  </button>
                )}
              </div>
            )
          }
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PersonaInsightsDialog;
