import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import React, { memo, useState, useCallback, useMemo } from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from '@/components/ui/progress';
import { useOpinionPollResult, usePosts, useSavePollResponse } from '@/hooks/data/connect/usePosts';
import { Poll, PollOption } from '@/@types/connect/posts';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/ShadcnButton';
import { usePackageAccessCounts } from '@/hooks/data/usePackageAccessCounts';

interface SelectedPollOption {
  pollId: number;
  optionId: string;
  questionId: number;
}

const isPoll = (post: unknown): post is Poll => {
  return typeof post === 'object' && post !== null && 'poll_questions_details' in post;
};

const OpinionPoll: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedPollOption, setSelectedPollOption] = useState<SelectedPollOption | null>(null);
  const { isAccessExhausted } = usePackageAccessCounts();

  const params = useMemo(() => {
    const p = new URLSearchParams();
    p.append('content_type', '12');
    return p;
  }, []);

  const { data: postsData = [], isLoading, isError } = usePosts(params);

  // Filter and cast to Poll[] - content_type=12 returns polls with poll_questions_details
  const opinionPolls = useMemo(() => {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const polls = postsData.filter(isPoll) as unknown as Poll[];
    return polls.filter(poll => {
      const endDate = poll.poll_questions_details?.end_date || poll.end_date;
      // If end_date is null or 0, we assume it doesn't expire
      if (!endDate) return true;
      return endDate > currentTimeInSeconds;
    });
  }, [postsData]);

  // Get current poll
  const currentPoll = useMemo(() => opinionPolls[selectedIndex], [opinionPolls, selectedIndex]);

  // Only fetch poll results if the current poll has been attempted (voted on)
  const isAttempted = useMemo(() => {
    const question = currentPoll?.poll_questions_details?.questions?.[0];
    return question?.attempted === 1;
  }, [currentPoll]);

  // Fetch poll results
  const { data: pollResult } = useOpinionPollResult(currentPoll?.program_content_id || 0, isAttempted);
  const activePollResult = useMemo(() => pollResult?.questions?.[0] || null, [pollResult]);

  // Save poll response mutation
  const { mutate: savePollMutation, isPending: isSaving } = useSavePollResponse();
  const isOpinionAccessExhausted = isAccessExhausted('opinion_polls') || isAccessExhausted('opinion-polls');

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (opinionPolls.length > 0) {
      setSelectedIndex((prev) => (prev + 1) % opinionPolls.length);
      setSelectedPollOption(null);
    }
  }, [opinionPolls.length]);

  const handlePrev = useCallback(() => {
    if (opinionPolls.length > 0) {
      setSelectedIndex((prev) => (prev - 1 + opinionPolls.length) % opinionPolls.length);
      setSelectedPollOption(null);
    }
  }, [opinionPolls.length]);

  const handleDotClick = useCallback((index: number) => {
    setSelectedIndex(index);
    setSelectedPollOption(null);
  }, []);

  // Option selection handler
  const handleOptionChange = useCallback((value: string, poll: Poll) => {
    const question = poll?.poll_questions_details?.questions?.[0];
    if (question) {
      setSelectedPollOption({
        pollId: poll.program_content_id,
        optionId: value,
        questionId: question.question_id
      });
    }
  }, []);

  // Submit handler
  const handleSubmit = useCallback(() => {
    if (!selectedPollOption) {
      return;
    }

    savePollMutation({
      content_id: selectedPollOption.pollId.toString(),
      question_id: selectedPollOption.questionId,
      option_id: [selectedPollOption.optionId],
    });
  }, [selectedPollOption, savePollMutation]);

  // Show loading state
  if (isLoading) {
    return (
      <Card className='py-4 gap-0'>
        <CardHeader className='pb-0 px-3 gap-0'>
          <CardTitle className="text-xl text-white"> <span className='text-primary'>Opinion</span> Poll...</CardTitle>
        </CardHeader>
        <CardContent className='p-3'>
          <div className="rounded-xl p-6 shadow-sm border border-gray-700 bg-[#1A1A1A] text-center text-gray-400">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show empty/error state
  if (isError || !opinionPolls || opinionPolls.length === 0) {
    return null;
  }

  return (
    <Card className='py-4 gap-0'>
      <CardHeader className='pb-0 px-3 gap-0'>
        <CardTitle className="text-xl text-white"> <span className='text-primary'>Opinion</span> Poll...</CardTitle>
        {
          opinionPolls.length > 1 && (
            <CardAction>
              <div className="flex items-center gap-2">
                <button
                  className="w-6 h-6 rounded-full border text-primary cursor-pointer border-primary flex items-center justify-center hover:bg-primary/10 transition-colors"
                  aria-label="Previous poll"
                  onClick={handlePrev}
                >
                  <ArrowLeft size={14} strokeWidth={2.5} />
                </button>
                <button
                  className="w-6 h-6 rounded-full border text-primary cursor-pointer border-primary flex items-center justify-center hover:bg-primary/10 transition-colors"
                  aria-label="Next poll"
                  onClick={handleNext}
                >
                  <ArrowRight size={14} strokeWidth={2.5} />
                </button>
              </div>
            </CardAction>
          )
        }
      </CardHeader>
      <CardContent className='p-3'>
        <div className="rounded-xl p-6 shadow-sm border border-gray-700 bg-[#1A1A1A]">
          {currentPoll && (() => {
            const question = currentPoll.poll_questions_details?.questions?.[0];
            const isAttempted = question?.attempted === 1;

            return (
              <div>
                {/* Question */}
                <div className="text-lg text-white mb-6 font-medium leading-relaxed">
                  {isAttempted
                    ? (activePollResult?.que_statement || 'No question available')
                    : (question?.question || 'No question available')
                  }
                </div>

                {/* Options or Results */}
                {!isAttempted ? (
                  // Show options for unattempted polls
                  <div className="space-y-4 mb-6">
                    <RadioGroup
                      className="space-y-4"
                      value={selectedPollOption?.optionId || ''}
                      onValueChange={(value) => handleOptionChange(value, currentPoll)}
                      disabled={isOpinionAccessExhausted}
                      title={isOpinionAccessExhausted ? 'You have reached the maximum limit available under your current package' : ''}
                    >
                      {question?.options && question.options.length > 0 ? (
                        question.options.map((option: PollOption, optionIndex: number) => (
                          <div key={optionIndex} className="flex items-center space-x-3">
                            <RadioGroupItem
                              value={option.option_id.toString()}
                              id={`option-${selectedIndex}-${optionIndex}`}
                              className="cursor-pointer border-gray-500 text-primary"
                            />
                            <Label
                              htmlFor={`option-${selectedIndex}-${optionIndex}`}
                              className="cursor-pointer text-white text-base font-medium"
                            >
                              {option.option_statement || 'No option available'}
                            </Label>
                          </div>
                        ))
                      ) : (
                        <div className='text-gray-400 text-sm'>No options available</div>
                      )}
                    </RadioGroup>
                  </div>
                ) : (
                  // Show results for attempted polls
                  <div className="space-y-6 mb-6">
                    {activePollResult?.question_options && activePollResult.question_options.length > 0 ? (
                      (() => {
                        const chosenOptionId = question?.options?.find(o => Number(o.attempted) === 1)?.option_id;

                        return activePollResult.question_options.map((option, optionIndex: number) => {
                          const isChosen = option.option_id === chosenOptionId || Number(option.attempted) === 1;
                          return (
                            <div key={optionIndex} className="flex items-start">
                              {isChosen ? (
                                <div className="flex items-start gap-4 w-full">
                                  <div className="w-8 shrink-0 mt-0.5">
                                    <CheckCircle2 className="w-8 h-8 text-[#22C55E]" />
                                  </div>
                                  <div className="flex flex-col flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="text-base text-white font-medium">
                                        {option.option_statement}
                                      </span>
                                      <span className="text-base text-white font-medium">
                                        {option.percentage}%
                                      </span>
                                    </div>
                                    <Progress
                                      value={option.percentage}
                                      className="h-1.5 rounded-full bg-gray-600 indicator-primary"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col w-full">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-base text-white font-medium">
                                      {option.option_statement}
                                    </span>
                                    <span className="text-base text-white font-medium">
                                      {option.percentage}%
                                    </span>
                                  </div>
                                  <Progress
                                    value={option.percentage}
                                    className="h-1.5 rounded-full bg-gray-600 indicator-primary"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        });
                      })()
                    ) : (
                      <div className='text-gray-400 text-sm'>No results available</div>
                    )}
                  </div>
                )}

                {/* Footer - Dots and Submit */}
                <div className="flex justify-between items-center mt-8">
                  {/* Pagination dots */}
                  <div className="flex gap-2">
                    {opinionPolls.length > 1 && opinionPolls.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-colors ${index === selectedIndex ? 'bg-primary' : 'bg-gray-600'
                          }`}
                        aria-label={`Go to poll ${index + 1}`}
                        onClick={() => handleDotClick(index)}
                      />
                    ))}
                  </div>

                  {/* Submit button */}
                  {!isAttempted && (
                    <Button
                      className="bg-primary text-white text-base font-bold py-2 px-8 rounded-lg hover:bg-primary/90 shadow-lg transition-all disabled:opacity-50"
                      disabled={!selectedPollOption || isSaving}
                      onClick={handleSubmit}
                    >
                      {isSaving ? 'Submitting...' : 'Submit'}
                    </Button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(OpinionPoll);