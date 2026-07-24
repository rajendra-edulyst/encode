import React, { useEffect, useState } from 'react'
import { Check, ChevronLeft, ChevronRight, Loader } from 'lucide-react'
import { useFunctionalDomains, useSaveUserInterest, useUserProfile } from '@/hooks/data/useGettingStarted'
// import { errorToast, successToast } from '../auth/@lib/toastUtils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { submitUserDomains } from '@/services/getting-started'
import { useNavigate } from 'react-router-dom'
import { useSessionUser } from '@/store/authStore'
import LoadingSection from '@/components/LoadingSection'
import { Dialog, DialogContent } from '@/components/ui/dialog'

const Domains = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { mutate: saveUserInterest } = useSaveUserInterest();
    const [selectedDomains, setSelectedDomains] = useState<number[]>([]);

    const [showDialog, setShowDialog] = useState(false);

    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

    const borderColors = ['border-codeblue', 'border-codepink', 'border-codegreen']
    const beforeBgcolors = ['before:bg-codeblue', 'before:bg-codepink', 'before:bg-codegreen']

    const { data: functionalDomains = [], isLoading } = useFunctionalDomains();
    const { data: userProfile } = useUserProfile();


    const searchParams = new URLSearchParams(window.location.search);
    const type = searchParams.get('type');
    const isEdit = type === 'edit';

    const toggleDomain = (domainId: number) => {
        setSelectedDomains(prev => {
            if (prev.includes(domainId)) {
                return prev.filter(id => id !== domainId)
            } else if (prev.length < 3) {
                return [...prev, domainId]
            }
            return prev
        })
    }

    const isSelected = (domainId: number) => selectedDomains.includes(domainId);

    const { user, setUser } = useSessionUser(state => state);

    const updateInterestInLocalUser = (interest_value: number) => {
        setUser({
            ...user,
            is_interest_save: interest_value,
        });
    }

    const saveDomainsMutation = useMutation({
        mutationFn: submitUserDomains,
        onSuccess: () => {
            // successToast('Domains saved successfully!');
            setMessage({ type: 'success', text: 'Domains saved successfully!' });
            saveUserInterest({ interest_value: 1 });
            updateInterestInLocalUser(1);
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
            if (isEdit) {
                navigate('/getting-started/profile');
                return;
            }
            setShowDialog(true);
        },
        onError: () => {
            // errorToast('Failed to save domains. Please try again.');
            setMessage({ type: 'error', text: 'Failed to save domains. Please try again.' });
            saveUserInterest({ interest_value: 1 });
            updateInterestInLocalUser(1);
            if (isEdit) {
                navigate('/getting-started/profile');
                return;
            }
            setShowDialog(true);
        },
    });

    const handleNext = () => {
        if (selectedDomains.length <= 0) {
            // errorToast('Please select exactly 3 domains to proceed.');
            setMessage({
                type: 'error', text: 'Please select minimum 1 domain and maximum 3 domains to proceed.'
            });
            return;
        }
        saveDomainsMutation.mutate(selectedDomains);
    }

    useEffect(() => {
        const alreadySelectedDomains = userProfile?.user_functional_domain?.map(domain => domain.id) || [];

        // only preselect if interest was already saved
        if (userProfile?.is_interest_save === 1 && alreadySelectedDomains.length > 0) {
            // setSelectedDomains(alreadySelectedDomains);
            // check if any null values then set empty
            const filteredDomains = alreadySelectedDomains.filter(id => id !== null);
            setSelectedDomains(filteredDomains);
        } else {
            setSelectedDomains([]); // ensure empty for new users
        }
    }, [userProfile]);
    useEffect(() => {
        const utmSource = (sessionStorage.getItem('utm_source') || '').toLowerCase();
        const bypassSources = ['facebook', 'instagram', 'whatsapp', 'behance', 'behanced', 'fb', 'ig'];
        const isUtmCampaign = bypassSources.some(source => utmSource.includes(source));

        const isNewUser = !user || Number(user.is_interest_save) !== 1;

        if (isUtmCampaign && isNewUser) {
            navigate(`/become-mentor?utm=${utmSource || 'campaign'}`);
            return;
        }
    }, [navigate, user]);

    return (
        <div className="min-h-screen text-white relative overflow-hidden flex flex-col">
            <div className="flex-1 flex flex-col items-center px-4 py-12 relative z-10">
                <div className="text-center mb-12 max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-jacques font-bold mb-4">
                        Shape your Design <span className="text-codeblue font-creative">UNIVERSE</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 font-light">
                        Pick your top 3 domains and start crafting your creative expertise.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 max-w-7xl w-full mb-10">
                    <div className='col-span-5'>
                        <LoadingSection isLoading={isLoading} title="domains" />
                    </div>
                    {selectedDomains.length > 0 && <div className='text-right col-span-5'>
                        {selectedDomains.length} Domains Selected
                    </div>}
                    {functionalDomains.map((domain, index) => {

                        const border = borderColors[index % borderColors.length];
                        const beforeBg = beforeBgcolors[index % beforeBgcolors.length];
                        const bg = beforeBgcolors[index % beforeBgcolors.length].replace('before:', '');

                        return (
                            <button key={domain.id}
                                className='relative mb-10 col-span-5 md:col-span-2 lg:col-span-1'
                                disabled={selectedDomains.length >= 3 && !isSelected(domain.id)}
                                onClick={() => toggleDomain(domain.id)}
                            >
                                <div className={`relative min-h-[224px] bg-[#2A2A2A] rounded-3xl p-6 transition-all duration-300 border-4 ${isSelected(domain.id) ? `${border} shadow-2xl` : 'border-transparent'} ${selectedDomains.length >= 3 && !isSelected(domain.id) ? 'cursor-not-allowed' : 'cursor-pointer'}
                                    before:absolute before:content-[''] before:h-16 before:w-[110%] ${beforeBg} before:-bottom-3 before:-left-3 before:rounded-b-3xl before:-z-10 before:rounded-t-3xl before:hover:-z-10
                                `}>
                                    <h3 className="text-lg md:text-xl font-jacques font-bold mb-4 text-white text-left min-h-[60px]">
                                        {domain.name}
                                    </h3>
                                    <ul className="text-left">
                                        {domain?.child_domains?.split(',')?.splice(0, 3).map((item, index) => (
                                            <li key={index} className="text-gray-300 text-base md:text-base flex items-start">
                                                <span className="mr-2">•</span>
                                                <span className='line-clamp-1'>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div>
                                        <Check className={`absolute top-2 right-2 w-5 h-5 p-1 rounded-full  ${bg} text-white ${isSelected(domain.id) ? 'block' : 'hidden'}`} strokeWidth={2} />
                                    </div>
                                </div>
                            </button>
                        )
                    })}
                </div>
                <div className='flex flex-col justify-end items-end w-full max-w-7xl'>
                    <div className="flex gap-7 relative z-20">
                        <div className="relative z-20 flex justify-end w-full max-w-5xl">
                            <div className='text-center text-xl gap-2 bg-[#727272] w-[122px] h-[100px] rounded-lg flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform font-jacques text-black font-bold' onClick={() => navigate('/getting-started/preferences')}>
                                <ChevronLeft className="w-12 h-22" strokeWidth={2} />
                                Back
                            </div>
                        </div>
                        <div className="relative z-20 flex justify-end w-full max-w-5xl">
                            <div className='text-center text-xl gap-2 bg-codeyellow w-[122px] h-[100px] rounded-lg flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform font-jacques text-black font-bold' onClick={handleNext}>
                                {saveDomainsMutation?.isPending ? <Loader className='animate-spin' /> : <ChevronRight className="w-12 h-22" strokeWidth={2} />}
                                Next
                            </div>
                        </div>
                    </div>
                    {
                        message?.text && <p className='mt-2'>{message.text}</p>
                    }
                </div>
            </div>
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute -bottom-16 left-0 w-full h-96 object-cover z-0 opacity-80 pointer-events-none"
            >
                <source src="/video/rainbow.mp4" type="video/mp4" />
            </video>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className='text-center bg-[#5A5A5A]'>
                    <div className='mb-6'>
                        <div className='mb-6'>
                            <h1 className='text-[64px] mb-4'>✨</h1>
                            <h1 className='text-3xl font-bold text-white'>Got it! Your Domains Are Set.</h1>
                        </div>
                        <p className='text-base text-white font-normal'>
                            Your choices define your creative journey ahead. CODE will now personalise your learning path around your selected domains.
                        </p>
                        <br />
                        <p className='text-sm text-white font-normal'>
                            You can explore or change them anytime from your dashboard.
                        </p>
                    </div>
                    <div className="relative z-20 flex justify-center w-full max-w-5xl" onClick={() => navigate('/getting-started/profile')}>
                        <div className='text-center text-base gap-2 bg-codeyellow w-[122px] h-[100px] rounded-lg flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform font-jacques text-black font-bold' onClick={handleNext}>
                            <ChevronRight className="w-12 h-22" strokeWidth={2} />
                            Start Exploring
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Domains