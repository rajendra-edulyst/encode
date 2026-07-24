import { DomainType } from '../CreativeStages';
import { ChevronRight, Loader } from 'lucide-react';
import { useFunctionalDomains, useSaveUserInterest, useUserProfile } from '@/hooks/data/useGettingStarted';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitUserDomains } from '@/services/getting-started';
import { useSessionUser } from '@/store/authStore';
import { useEffect, useState } from 'react';

interface DomainSelectionProps {
    selectedDomains: DomainType[];
    onSelect: (domains: DomainType[]) => void;
    onContinue: () => void;
    onBack: () => void;
}

const colors = ['#00A8E9', '#E60086', '#7FBC42'];

const DomainSelection = ({ selectedDomains, onSelect, onContinue, onBack }: DomainSelectionProps) => {
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
    const queryClient = useQueryClient();
    const { mutate: saveUserInterest } = useSaveUserInterest();
    const { data: functionalDomains = [], isLoading } = useFunctionalDomains();
    const { data: userProfile } = useUserProfile();
    const { user, setUser } = useSessionUser(state => state);

    const toggleDomain = (domainId: number) => {
        if (selectedDomains.includes(domainId)) {
            onSelect(selectedDomains.filter(d => d !== domainId));
        } else if (selectedDomains.length < 2) {
            onSelect([...selectedDomains, domainId]);
        }
    };

    const updateInterestInLocalUser = (interest_value: number) => {
        setUser({
            ...user,
            is_interest_save: interest_value,
        });
    }

    const saveDomainsMutation = useMutation({
        mutationFn: submitUserDomains,
        onSuccess: () => {
            setMessage({ type: 'success', text: 'Domains saved successfully!' });
            saveUserInterest({ interest_value: 1 });
            updateInterestInLocalUser(1);
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
            onContinue();
        },
        onError: () => {
            setMessage({ type: 'error', text: 'Failed to save domains. Please try again.' });
            saveUserInterest({ interest_value: 1 });
            updateInterestInLocalUser(1);
            onContinue();
        },
    });

    const handleNext = () => {
        if (selectedDomains.length <= 0) {
            setMessage({
                type: 'error', text: 'Please select minimum 1 domain and maximum 2 domains to proceed.'
            });
            return;
        }

        saveDomainsMutation.mutate(selectedDomains);
    }

    useEffect(() => {
        const alreadySelectedDomains = userProfile?.user_functional_domain?.map(domain => domain.id) || [];

        if (userProfile?.is_interest_save === 1 && alreadySelectedDomains.length > 0 && selectedDomains.length === 0) {
            const filteredDomains = alreadySelectedDomains.filter(id => id !== null).slice(0, 2);
            if (filteredDomains.length > 0) {
                onSelect(filteredDomains);
            }
        }
    }, [onSelect, selectedDomains.length, userProfile]);

    return (
        <div className="max-w-6xl mx-auto w-full px-4 flex flex-col justify-center min-h-[60vh] py-2 md:py-4">
            {/* Header */}
            <div className="text-center mb-4 md:mb-6">
                <h1 className="text-[28px] md:text-[36px] font-bold text-white leading-tight">Design the world you want to <span className='font-creative text-primary dark:text-[#00A8E9] font-[400] whitespace-nowrap'>Grow in</span></h1>
                <p className="text-white text-sm md:text-base mt-2 opacity-80 font-normal flex flex-wrap gap-1 md:gap-2 items-center justify-center leading-normal">
                    Pick Your Power Pair of Domains (
                    <span className="w-4 h-4 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center leading-none">P</span>
                    Primary &
                    <span className="w-4 h-4 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center leading-none">S</span>
                    Secondary
                    )
                </p>
            </div>

            {/* Domain Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-8 justify-items-center">
                {isLoading && (
                    <div className="col-span-2 sm:col-span-3 lg:col-span-5 flex items-center justify-center py-10">
                        <Loader className="animate-spin text-[#00A8E9]" />
                    </div>
                )}
                {functionalDomains.map((domain, colorIndex) => {
                    const isSelected = selectedDomains.includes(domain.id);
                    const index = selectedDomains.indexOf(domain.id);
                    // Disable unselected buttons when 2 domains are already selected
                    const isDisabled =
                        selectedDomains.length >= 2 && !isSelected;
                    const color = colors[colorIndex % colors.length];


                    return (
                        <button
                            key={domain.id}
                            onClick={() => !isDisabled && toggleDomain(domain.id)}
                            disabled={isDisabled}
                            className={`relative w-full max-w-[200px] transition-transform duration-200 ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                        >
                            {/* Badge */}
                            {isSelected && (
                                <div className="absolute top-0 left-0 z-20">
                                    <span
                                        className={`bg-[${color}] text-white rounded-full w-7 h-7 pt-0.5 flex items-center justify-center text-lg font-bold shadow-md`}
                                    >
                                        {index === 0 ? 'P' : index === 1 ? 'S' : index + 1}
                                    </span>
                                </div>
                            )}

                            {/* Card Container */}
                            <div
                                className={`relative h-full rounded-2xl p-[8px] flex justify-center overflow-hidden transition-all duration-300 ${isSelected ? 'shadow-xl' : ''}`}
                            >
                                <div
                                    className={`bg-[#1D1D1D] h-full px-3 py-4 min-h-[160px] md:min-h-[170px] w-full flex flex-col justify-start relative z-10 rounded-2xl border-[2px] transition-all duration-300 ${isSelected
                                        ? `border-[${color}] shadow-[0_0_15px_rgba(0,0,0,0.3)]`
                                        : 'border-[#1D1D1D]'
                                        }`}
                                >
                                    {/* Title */}
                                    <h3
                                        className="text-white font-bold text-[13px] md:text-[15px] mb-3 text-center leading-tight min-h-[40px] flex items-center justify-center"
                                    >
                                        {domain.name}
                                    </h3>

                                    {/* Items List */}
                                    <ul className="text-gray-400 text-xs text-left w-full pl-2">
                                        {domain.child_domains?.split(',')?.slice(0, 3).map((item, idx) => (
                                            <li
                                                key={idx}
                                                className="flex items-start gap-1.5 text-[11px] md:text-[12px] mb-1.5 leading-tight"
                                            >
                                                <span className="text-gray-500 text-sm leading-none mt-0.5">•</span>
                                                <span className="truncate">{item.trim()}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="absolute bottom-0 w-full z-0 opacity-80">
                                    <svg
                                        width="100%"
                                        height="48"
                                        viewBox="0 0 223 64"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        preserveAspectRatio="none"
                                    >
                                        <path
                                            d="M12.658 0h197.637c6.988 0 12.658 5.692 12.658 12.706v20.742c0 16.417-13.277 29.744-29.633 29.744H29.632C13.277 63.192 0 49.865 0 33.448V12.706C0 5.692 5.67 0 12.658 0z"
                                            fill={color}
                                        />
                                    </svg>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 w-full mt-2 md:mt-2">
                <button
                    onClick={onContinue}
                    disabled={saveDomainsMutation.isPending}
                    className="bg-gray-500 hover:bg-gray-600 text-white text-[13px] font-semibold rounded-[10px] flex flex-col items-center justify-center w-[90px] h-[90px] shadow-lg transition-all leading-snug"
                >
                    <span>Skip</span>
                    <span>for</span>
                    <span>Now</span>
                </button>
                <button
                    onClick={handleNext}
                    disabled={selectedDomains.length === 0 || saveDomainsMutation.isPending}
                    className="bg-[#FFEC00] hover:bg-[#FFEC00]/90 text-black text-[14px] font-bold rounded-[10px] flex flex-col items-center justify-center w-[90px] h-[90px] shadow-lg transition-all leading-snug disabled:bg-[#FFEC00]/60 disabled:cursor-not-allowed"
                >
                    {saveDomainsMutation.isPending ? (
                        <Loader className="animate-spin" size={20} />
                    ) : selectedDomains.length > 0 ? (
                        <span>Next</span>
                    ) : (
                        <>
                            <span>Select</span>
                            <span>Domains</span>
                        </>
                    )}
                </button>
            </div>
            {message?.text && <p className="mt-2 text-right mr-4 text-sm">{message.text}</p>}
        </div>
    );
};

export default DomainSelection;
