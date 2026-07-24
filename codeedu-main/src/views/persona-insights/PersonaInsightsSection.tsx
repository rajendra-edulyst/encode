import { useEffect, useState } from "react";
import personImage from "@/assets/images/Boy1.png";
import PersonaInsightsDialog from "./PersonaInsightsDialog";
import { fetchPersonaQuestions, fetchPersonaResponse } from "./service";
import { useAuth } from "@/auth";

const PersonaInsightsSection = () => {
  const [open, setOpen] = useState(false);
  const [hasAnswers, setHasAnswers] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;

    const checkExistingAnswers = async () => {
      try {
        const data = await fetchPersonaQuestions();
        const insightId = data.feedbackInsight?._id;
        const userExternalId = String(user?.id ?? "unknown-user");

        if (insightId) {
          const userResponse = await fetchPersonaResponse(insightId, userExternalId);
          if (mounted && userResponse && userResponse.answers) {
            const totalQuestions = data.questions?.length || 30;
            if (userResponse.answers.length >= totalQuestions) {
              setIsCompleted(true);
            } else if (userResponse.answers.length > 0) {
              setHasAnswers(true);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch persona response", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    if (user?.id) {
      if (!open) {
        checkExistingAnswers();
      }
    } else {
      setIsLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [user?.id, open]);


  return (
    <>
      <section className="mb-10">
        <div className="overflow-hidden rounded-[20px] border-2 border-[#402E94] px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:pr-16 md:pl-24 md:py-10"
          style={{ background: "radial-gradient(91.24% 67.91% at 55.11% 0%, #5B4E96 0%, #2E274C 52.4%, #1B172C 100%)" }}>
          <div className="grid items-center gap-8 md:grid-cols-[280px_1fr_220px]">
            <div className="flex self-end justify-center md:justify-start -mb-8 md:-mb-10">
              <img
                src={personImage}
                alt="Persona guide"
                className="max-h-[290px] w-auto object-contain drop-shadow-[0_14px_30px_rgba(0,0,0,0.5)]"
              />
            </div>

            <div className="text-center">
              <p className="mb-5 text-xl font-bold text-[#B8A8FF] md:text-[20px]">
                Noah has a surprise for you!
              </p>
              <p className="mx-auto max-w-3xl text-lg leading-normal text-[#888888] md:text-[16px] font-normal">
                Choose what you feel so that the recommendation can be top notch
                only for you.
              </p>
            </div>

            <div className="flex justify-center md:justify-end">
              <button
                type="button"
                className="min-h-[100px] min-w-[180px] rounded-[10px] bg-[#7568B1] px-8 py-6 text-xl font-normal text-white transition hover:scale-[1.02] hover:bg-[#9c8be0] disabled:opacity-50"
                onClick={() => {
                  if (!isCompleted) setOpen(true);
                  else window.location.href = "/cci-stage-4?persona=1";
                }}
                disabled={isLoading}
              >
                {isCompleted ? (
                  <>
                    View My
                    <br />
                    Progress
                  </>
                ) : hasAnswers ? (
                  <>
                    Resume
                    <br />
                    Now
                  </>
                ) : (
                  <>
                    Start
                    <br />
                    Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      <PersonaInsightsDialog open={open} onOpenChange={setOpen} resumeMode={hasAnswers} isCompleted={isCompleted} />
    </>
  );
};

export default PersonaInsightsSection;
