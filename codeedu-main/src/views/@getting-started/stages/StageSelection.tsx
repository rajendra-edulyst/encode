import { useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { StageType } from '../CreativeStages';
import school from '@/assets/images/school.png';
import pen from '@/assets/images/pen.png';
import cognition from '@/assets/images/cognition.png';
import ApiService from '@/services/ApiService';
import { useUserProfile } from '@/hooks/data/useGettingStarted';

interface StageSelectionProps {
    selectedStage: StageType | null;
    onSelect: (stage: StageType) => void;
    onContinue: () => void;
}

const stages = [
    {
        id: 'beginner' as StageType,
        title: 'Beginner',
        description: 'Exploring ideas, building basics, and discovering what excites you.',
        color: 'from-cyan-400 to-blue-500',
        borderColor: 'border-[#00A8E9]',
        icon: { bg: '#00A8E9', bgDark: '#014FA3', icon: school, },
    },
    {
        id: 'intermediate' as StageType,
        title: 'Intermediate',
        description: 'Growing skills, connecting concepts, and shaping your creative idea.',
        color: 'from-pink-500 to-fuchsia-600',
        borderColor: 'border-[#E60086]',
        icon: { bg: '#E60086', bgDark: '#B9036D', icon: pen, },
    },
    {
        id: 'advanced' as StageType,
        title: 'Advanced',
        description: 'Refining mastery, pushing boundaries, and building real-world impact.',
        color: 'from-lime-400 to-green-500',
        borderColor: 'border-[#7FBC42]',
        icon: { bg: '#7FBC42', bgDark: '#549A0E', icon: cognition, },
    },
];

const StageSelection = ({ selectedStage, onSelect, onContinue }: StageSelectionProps) => {
    const { data: userProfile } = useUserProfile();

    const handleStageSelect = async () => {
        const api = "update_cci_start_date";
        const payload = {
            persona_stage: selectedStage,
        };

        const result = await ApiService.fetchDataWithAxios<any>({
            url: api,
            method: 'POST',
            data: payload,
        });

        if (result?.status === 1) {
            onContinue();
        }
    }

    useEffect(() => {
        const stage = userProfile?.persona_stage as StageType;
        if (stage) {
            onSelect(stage);
        }
    }, [userProfile]);

    return (
        <div className="max-w-5xl mx-auto w-full px-4 flex flex-col justify-center py-2 md:py-4">
            {/* Header */}
            <div className="text-center mb-6 md:mb-8">
                <h1 className="text-[28px] md:text-[32px] font-bold text-white leading-tight">Choose your Creative <span className='font-creative text-primary dark:text-[#00a8e9] font-[400] whitespace-nowrap'>Stage</span></h1>
                <p className="text-white text-sm md:text-base mt-2 opacity-80">
                    We'll tailor the experience for you.
                </p>
            </div>

            {/* Stage Cards */}
            <div className="flex flex-col md:flex-row justify-center mt-8 gap-6 mb-10">
                {stages.map((stage) => {
                    const img = stage.icon.icon;
                    const isSelected = selectedStage === stage.id;

                    return (
                        <button
                            key={stage.id}
                            onClick={() => onSelect(stage.id)}
                            className={`relative flex group transition-all duration-300 w-[250px] max-w-full outline-none mx-auto md:mx-0`}
                        >
                            {/* Card Container */}
                            <div
                                className={`relative rounded-[20px] border-[2px] overflow-hidden w-full transition-all duration-300 ${isSelected ? `shadow-xl ${stage.borderColor} shadow-${stage.icon.bg}/30 border-[${stage.icon.bg}]` : 'border-transparent bg-[#1D1D1D]'
                                    }`}
                            >
                                <div className="bg-[#1D1D1D] px-6 py-6 h-full w-full rounded-sm flex flex-col items-center">
                                    {/* Title Spacer */}
                                    <div className='h-[85px]'></div>

                                    <h3 className="text-2xl font-bold text-white text-center mb-4 font-c">
                                        {stage.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-white text-[12px] md:text-[13px] font-normal text-center leading-[1.4] opacity-80 min-h-[60px] px-1">
                                        {stage.description}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-center absolute top-[-25px] left-1/2 transform -translate-x-1/2 pointer-events-none origin-top scale-[0.75]">
                                <div className="relative w-[212px] h-[155px]">
                                    <svg style={{ position: 'absolute', left: '-26px' }} width="37" height="37" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26.933 0L0 37h37L26.933 0z" fill={stage.icon.bgDark} /></svg>
                                    <div style={{ position: 'absolute', right: 0 }}>
                                        <svg width="212" height="155" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0l40.369 145.724a12.617 12.617 0 004.531 6.693A12.615 12.615 0 0052.547 155h110.888c3.21 0 6.193-1.209 8.462-3.254a12.583 12.583 0 003.716-6.022l35.92-129.674c.935-3.38.417-6.75-1.119-9.516C208.285 2.697 204.209 0 199.355 0H0z" fill={stage.icon.bg} /></svg>
                                        <div
                                            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-full p-4`}
                                        >
                                            <img src={img} alt={stage.title} width={74} height={60} className="w-auto h-auto" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 max-w-[800px] w-full mx-auto md:pr-[10px]">
                <button
                    className="bg-gray-500 hover:bg-gray-600 text-white text-[13px] font-semibold rounded-[10px] flex flex-col items-center justify-center w-[90px] h-[90px] shadow-lg transition-all leading-snug"
                >
                    <span>Skip</span>
                    <span>for</span>
                    <span>Now</span>
                </button>
                <button
                    onClick={handleStageSelect}
                    disabled={!selectedStage}
                    className="bg-[#FFEC00] hover:bg-[#FFEC00]/90 text-black text-[14px] font-bold rounded-[10px] flex flex-col items-center justify-center w-[90px] h-[90px] shadow-lg transition-all leading-snug disabled:bg-[#FFEC00]/60 disabled:cursor-not-allowed"
                >
                    {selectedStage ? (
                        <span>Next</span>
                    ) : (
                        <>
                            <span>Select</span>
                            <span>Stage</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default StageSelection;