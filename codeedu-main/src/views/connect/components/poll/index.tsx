import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { memo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Poll, PollOption } from '../../../types/community';
import { toast } from 'sonner';
import { savePollResponse } from '../../../services/PollService';
import { Progress } from '@/components/ui/progress';
import { useOpinionPollResult, useOpinionPolls } from '../../../@hooks/usePost';


const OpinionPoll: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isCci = searchParams.get('cci') === '1';


  const { data: opinionPolls = [], isLoading: loading, isError: error } = useOpinionPolls();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedPollUserSelectedOptionId, setSelectedPollUserSelectedOptionId] = useState<{ pollId: number; optionId: string; questionId: number } | null>(null);


  const isAttempted = React.useMemo(() => {
    const question = opinionPolls[selectedIndex]?.poll_questions_details?.questions?.[0];
    return question?.attempted === 1;
  }, [opinionPolls, selectedIndex]);

  const { data: result } = useOpinionPollResult(opinionPolls[selectedIndex]?.program_content_id || 0, isAttempted);
  const activePollResult = result?.questions?.[0] || null;

  const onNextButtonClick = () => {
    if (opinionPolls && opinionPolls.length > 0) {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % opinionPolls.length);
    }
  };

  const onPrevButtonClick = () => {
    if (opinionPolls && opinionPolls.length > 0) {
      setSelectedIndex((prevIndex) => (prevIndex - 1 + opinionPolls.length) % opinionPolls.length);
    }
  };

  const onDotButtonClick = (index: number) => {
    if (opinionPolls && opinionPolls.length > 0) {
      setSelectedIndex(index);
    }
  };


  const saveResponse = () => {

    if (!selectedPollUserSelectedOptionId) {
      toast.error('Please select an option before submitting.');
      return;
    }

    const { pollId, optionId, questionId } = selectedPollUserSelectedOptionId;
    // Logic to save the poll answer
    console.log(`Saving response for Poll ID: ${pollId}, Option ID: ${optionId}, Question ID: ${questionId}`);

    savePollResponse({
      content_id: pollId.toString(),
      question_id: questionId,
      option_id: optionId ? [optionId] : [],
      ...(isCci && { is_cci: '1' })
    })
      .then(() => {
        toast.success('Response saved successfully!');
        // getResult(pollId);
      })
      .catch((error) => {
        toast.error(`Error saving response: ${error}`);
      });
  };


  if (loading) return null;
  if (error) return null;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border glowConnectCard">
      <div className="mb-4">
        <div className='flex items-center justify-between mb-4'>
          <h2 className="text-lg font-semibold text-cblack">
            <span className="text-[#00A8e9] font-bold text-2xl">Opinion</span> Poll...
          </h2>
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full border text-cblue cursor-pointer border-[--IndexBlue] flex items-center justify-center`} onClick={onPrevButtonClick}>
              <ArrowLeft
                size={12}
                strokeWidth={2}
              />
            </div>
            <div className={`w-5 h-5 rounded-full border text-cblue cursor-pointer border-[--IndexBlue] flex items-center justify-center`} onClick={onNextButtonClick}>
              <ArrowRight
                size={12}
                strokeWidth={2}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-hidden">
        {opinionPolls?.length > 0 ? (
          opinionPolls.map((poll: Poll, index: number) => {
            const question = poll?.poll_questions_details?.questions?.[0];
            return (
              <div key={index} className={`mb-0 ${index === selectedIndex ? 'block' : 'hidden'}`}>
                {!question?.attempted && <div>
                  <div className="text-sm text-cblack mb-4">
                    {question?.question || 'No question available'}
                  </div>
                  <div className="space-y-3">
                    <RadioGroup className="space-y-2" onValueChange={(value) => setSelectedPollUserSelectedOptionId({ pollId: poll?.program_content_id, optionId: value, questionId: question?.question_id })}>
                      {question && question?.options?.length > 0 ? (
                        question.options.map((option: PollOption, optionIndex: number) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <RadioGroupItem
                              value={option?.option_id?.toString() || ''}
                              id={`option-${optionIndex}`}
                              className="cursor-pointer"
                            />
                            <Label htmlFor={`option-${optionIndex}`} className="cursor-pointer">
                              {option?.option_statement || 'No option available'}
                            </Label>
                          </div>
                        ))
                      ) : (
                        <div>No options available</div>
                      )}
                    </RadioGroup>
                  </div>
                </div>
                }
                {question?.attempted == 1 && activePollResult !== null &&
                  <div>
                    <div className="text-sm text-cblack mb-4">
                      {activePollResult?.que_statement || 'No question available'}
                    </div>
                    <div>
                      {activePollResult?.question_options?.length > 0 ? (
                        activePollResult.question_options.map((option, optionIndex: number) => (
                          <div key={optionIndex} className="flex flex-col mb-4">
                            <div className="flex-1 flex justify-between"><span className="text-sm text-cblack">{option.option_statement}</span><span className="text-sm text-cblack ml-2">{option.percentage} %</span></div>
                            <Progress value={option.percentage} className="h-2 mt-1 rounded-full" />
                          </div>
                        ))
                      ) : (
                        <div>No options available</div>
                      )}
                    </div>
                  </div>
                }
                <div className="flex justify-between items-center mt-6">
                  <div className="flex gap-2">
                    {opinionPolls?.length > 0 ? (
                      opinionPolls.map((_: Poll, index: number) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full cursor-pointer ${index === selectedIndex ? 'bg-[--IndexBlue]' : 'bg-gray-300'
                            }`}
                          onClick={() => onDotButtonClick(index)}
                        />
                      ))
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                    )}
                  </div>
                  {question?.attempted == 0 && <button className={`bg-[--IndexBlue] text-white text-sm font-medium py-1 px-4 rounded-md`} onClick={saveResponse}>
                    Submit
                  </button>}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-sm text-cblack">No polls available</div>
        )}
      </div>
    </div>
  );
};

export default memo(OpinionPoll);