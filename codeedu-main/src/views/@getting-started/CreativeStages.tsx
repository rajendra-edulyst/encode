import { useEffect, useState, useCallback } from 'react';
import StageSelection from './stages/StageSelection';
import DomainSelection from './stages/DomainSelection';
import SkillSelection from './stages/SkillSelection';
import { ChevronRight } from 'lucide-react';
import CourseSelection from './stages/CourseSelection';
import Preferences from './stages/Preferences';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { PreAssignCourse } from '@/@types/learner/Courses';
import ApiService from '@/services/ApiService';
import { useUserProfile } from '@/hooks/data/useGettingStarted';


export type StageType = 'beginner' | 'intermediate' | 'advanced';
export type DomainType = number;
export type SkillType = number;
export type PlanType = {
    id: number;
    name?: string;
    price?: number | string;
    duration?: string;
    credits?: number | string;
    description?: string;
    color_code?: string;
    parameters?: {
        value?: number | string;
        master?: {
            key?: string;
        };
    }[];
} | null;

export type CreativeCheckoutState = {
    selectedStage: StageType | null;
    selectedDomains: DomainType[];
    selectedSkills: SkillType[];
    selectedPlan: PlanType;
    selectedCourses: PreAssignCourse[];
};

const CreativeStages = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedStage, setSelectedStage] = useState<StageType | null>(null);
    const [selectedDomains, setSelectedDomains] = useState<DomainType[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<SkillType[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<PlanType>(null);
    const [selectedCourses, setSelectedCourses] = useState<PreAssignCourse[]>([]);
    const [completeStages, setCompleteStages] = useState<Record<string, number>>({});
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { data: userProfile } = useUserProfile();

    const handleStageSelect = useCallback((stage: StageType) => {
        setSelectedStage(stage);
    }, []);

    const handleDomainSelect = useCallback((domains: DomainType[]) => {
        setSelectedDomains(domains);
    }, []);

    const handleSkillSelect = useCallback((skills: SkillType[]) => {
        setSelectedSkills(skills);
    }, []);

    const handlePlanSelect = useCallback((plan: PlanType) => {
        setSelectedPlan(plan);
    }, []);

    const handleCourseSelect = useCallback((courses: PreAssignCourse[]) => {
        setSelectedCourses(courses);
    }, []);

    const getCurrentStageStatus = async () => {
        const res = await ApiService.fetchDataWithAxios<any>({
            url: 'get-creative-stage-status',
            method: 'GET'
        });
        setCompleteStages(res?.data || {});
    }

    useEffect(() => {
        getCurrentStageStatus();
    }, []);

    const handleContinue = () => {
        if (currentStep < 5) {
            setCurrentStep(prev => prev + 1);
        } else {
            const checkoutState: CreativeCheckoutState = {
                selectedStage,
                selectedDomains,
                selectedSkills,
                selectedPlan,
                selectedCourses,
            };

            sessionStorage.setItem('creative_checkout_state', JSON.stringify(checkoutState));
            navigate('/getting-started/payments', { state: checkoutState });
        }
    };

    const handleSkip = () => {
        setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleJumpOnStage = (stage: number) => {
        setCurrentStep(stage);
    };

    useEffect(() => {
        if (searchParams.get("profile") !== "upgrade") {
            if (completeStages) {
                if (completeStages.stage === 0 && !userProfile?.persona_stage) {
                    setCurrentStep(1);
                } else if (completeStages.domain === 0 && userProfile?.user_functional_domain.length < 0) {
                    setCurrentStep(2);
                } else if (completeStages.skill === 0) {
                    setCurrentStep(3);
                } else if (completeStages.package === 0) {
                    setCurrentStep(4);
                } else {
                    setCurrentStep(4);
                }
            } else {
                getCurrentStageStatus();
            }
        } else {
            setCurrentStep(4);
        }
    }, [completeStages, selectedStage]);

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Progress Steps */}
            <div className="py-2 md:py-4 px-4 md:px-8 max-w-5xl mx-auto">
                <div className="flex items-center justify-between gap-2 md:gap-5 text-[10px] md:text-sm overflow-x-auto pb-2 md:pb-0">
                    <StepIndicator
                        label="Stage Selection"
                        isActive={currentStep === 1}
                        isCompleted={currentStep > 1}
                        onClick={() => handleJumpOnStage(1)}
                    />
                    <ChevronRight className='' size={14} color={`${currentStep === 2 ? '#00A8E9' : '#757575'}`} />
                    <StepIndicator
                        label="Domain Selection"
                        isActive={currentStep === 2}
                        isCompleted={currentStep > 2}
                        onClick={() => handleJumpOnStage(2)}
                    />
                    <ChevronRight className='' size={14} color={`${currentStep === 3 ? '#00A8E9' : '#757575'}`} />
                    <StepIndicator
                        label="Skills Selection"
                        isActive={currentStep === 3}
                        isCompleted={currentStep > 3}
                        onClick={() => handleJumpOnStage(3)}
                    />
                    <ChevronRight className='' size={14} color={`${currentStep === 4 ? '#00A8E9' : '#757575'}`} />
                    <StepIndicator
                        label="Fellowship Plans"
                        isActive={currentStep === 4}
                        isCompleted={currentStep > 4}
                        onClick={() => handleJumpOnStage(4)}
                    />
                    <ChevronRight className='' size={14} color={`${currentStep === 5 ? '#00A8E9' : '#757575'}`} />
                    <StepIndicator
                        label="Course Selection"
                        isActive={currentStep === 5}
                        isCompleted={currentStep > 5}
                        onClick={() => handleJumpOnStage(5)}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center px-4 relative z-10 w-full mb-10">
                {currentStep === 1 && (
                    <StageSelection
                        selectedStage={selectedStage}
                        onSelect={handleStageSelect}
                        onContinue={handleContinue}
                    />
                )}

                {currentStep === 2 && (
                    <DomainSelection
                        selectedDomains={selectedDomains}
                        onSelect={handleDomainSelect}
                        onContinue={handleContinue}
                        onBack={handleBack}
                    />
                )}

                {currentStep === 3 && (
                    <SkillSelection
                        selectedSkills={selectedSkills}
                        onSelect={handleSkillSelect}
                        onContinue={handleContinue}
                        onSkip={handleSkip}
                        onBack={handleBack}
                    />
                )}

                {currentStep === 4 && (
                    <Preferences onSelect={handlePlanSelect} onContinue={handleContinue} />
                )}

                {currentStep === 5 && (
                    <CourseSelection
                        selectedDomains={selectedDomains}
                        selectedCourses={selectedCourses}
                        onSelect={handleCourseSelect}
                        onContinue={handleContinue}
                        onBack={handleBack}
                        selectedPlan={selectedPlan}
                    />
                )}
            </div>
            <video
                autoPlay
                loop
                muted
                playsInline
                className="fixed bottom-[-8rem] left-0 w-full h-96 object-cover z-0 opacity-80 pointer-events-none"
            >
                <source src="/video/rainbow.mp4" type="video/mp4" />
            </video>
        </div>
    );
};

const StepIndicator = ({
    label,
    isActive,
    isCompleted,
    onClick
}: {
    label: string;
    isActive: boolean;
    isCompleted: boolean;
    onClick?: () => void;
}) => (
    <div className="flex items-center gap-2">
        <span
            onClick={onClick}
            className={`text-sm ${isActive ? 'text-white' : isCompleted ? 'text-[#00A8E9]' : 'text-gray-500'}`}
        >
            {label}
        </span>
    </div>
);

export default CreativeStages;
