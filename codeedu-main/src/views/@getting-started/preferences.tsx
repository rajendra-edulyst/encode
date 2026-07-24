import React, { useEffect, useMemo, useState } from 'react'
import { ChevronRight, Loader } from 'lucide-react'
import { usePreferences, useUserProfile } from '@/hooks/data/useGettingStarted'
import LoadingSection from '@/components/LoadingSection'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { submitPreferences } from '@/services/getting-started'
import { successToast } from '../auth/@lib/toastUtils'
import { useNavigate } from 'react-router-dom'
import { useSessionUser } from '@/store/authStore'
import { INDUSTRY } from '@/constants/roles.constant'
import * as LucideIconsModule from 'lucide-react';

const Preferences = () => {
    const [selectedMindset, setSelectedMindset] = useState<number | null>(null)
    const { user, setUser } = useSessionUser(state => state);
    const preferenceType = useMemo(() => {
        const isIndustryRole = Array.isArray(user?.authority) && user.authority.includes(INDUSTRY);
        const isIndustryOrg = user?.user_org_type === 'industry';
        return isIndustryRole || isIndustryOrg ? 'industry' : 'user';
    }, [user?.authority, user?.user_org_type]);

    const params = useMemo(() => {
        const query = new URLSearchParams();
        query.append('type', preferenceType);
        return query;
    }, [preferenceType]);
    const { data: preferences = [], isLoading, isFetched } = usePreferences(params);
    const { data: userProfile } = useUserProfile();

    const searchParams = new URLSearchParams(window.location.search);
    const type = searchParams.get('type');
    const isEdit = type === 'edit';

    const navigate = useNavigate();
    const queryClient = useQueryClient()

    const savePreferenceMutation = useMutation({
        mutationFn: submitPreferences,
        onSuccess: (data) => {
            console.log('Preferences saved successfully:', data);
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
            navigate('/getting-started/domains' + (isEdit ? '?type=edit' : ''));
        },
        onError: (error) => {
            console.error('Error saving preferences:', error);
        },
    });


    const handleNextStep = () => {
        if (!selectedMindset) {
            successToast('Please select a mindset before proceeding.');
            return;
        }
        savePreferenceMutation.mutate(selectedMindset);
    };


    useEffect(() => {
        if (userProfile && userProfile?.preference?.id) {
            setSelectedMindset(userProfile?.preference?.id);
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

        if (isFetched && preferences?.length === 0 && Number(user?.is_interest_save) !== 1) {
            setUser({
                ...user,
                is_interest_save: 1,
            });
        }
    }, [preferences, isFetched, navigate, setUser, user]);


    const getLucideIcon = (iconName: string) => {
        const pascalCase = iconName?.split('-')?.map(word => word.charAt(0).toUpperCase() + word.slice(1))?.join('');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (LucideIconsModule as any)[pascalCase];
    };

    return (
        <div className="min-h-screen w-full bg-black text-white relative overflow-hidden flex flex-col justify-between">
            <div className="flex-1 flex flex-col items-center relative z-10 py-10">
                <div className="text-center md:mb-16 max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-jacques font-bold mb-4">
                        Chart Your Learning <span className="text-codeblue font-creative">Horizon</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 font-light">
                        Select the mindset that inspires you most.
                    </p>
                </div>
                <div className="flex flex-col md:grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl w-full mb-16 gap-20 md:gap-8 md:px-10 px-10 md:items-stretch">
                    <div className='col-span-3'>
                        {
                            isLoading && <LoadingSection isLoading={isLoading} title="preferences" />
                        }
                    </div>
                    {preferences.map((userPackage) => {
                        const IconComponent = getLucideIcon(userPackage.icon_code);
                        return (
                            <button
                                key={userPackage.id}
                                className={`relative group transition-all duration-300 flex ${selectedMindset === userPackage.id ? 'scale-110' : 'hover:scale-105'}`}
                                onClick={() => setSelectedMindset(userPackage.id)}
                            >
                                <div className="relative flex-1 flex">
                                    <div className={`relative rounded-3xl p-4 flex flex-col items-center justify-start transition-all duration-300 flex-1 ${selectedMindset === userPackage.id ? 'ring-4 ring-white' : ''}`}
                                        style={{
                                            backgroundColor: userPackage?.color_code
                                        }}
                                    >
                                        <div className="absolute bg-white rounded-2xl w-full flex items-center justify-center shadow-lg relative py-5 -top-10">
                                            {userPackage.icon_code && <div className={`flex flex-col items-center justify-center`}
                                                style={{ color: userPackage?.color_code }}
                                            >
                                                {
                                                    userPackage.icon_code && userPackage.icon_code.includes('http') ? (
                                                        <img src={userPackage.icon_code} alt={`${userPackage.name} icon`} className="max-h-12 object-contain" />
                                                    ) : (
                                                        IconComponent ? <IconComponent className="w-10 h-10 mb-2" style={{ color: userPackage.color_code }} /> : null
                                                    )
                                                }
                                                <h1 className='text-center text-xl'>{userPackage?.name}</h1>
                                            </div>}
                                            <div className={`absolute -bottom-5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[24px] border-white`}
                                            ></div>
                                        </div>
                                        <div className="text-center text-white">
                                            <p className="mb-1 text-xs">{userPackage?.description}</p>
                                        </div>
                                        {
                                            userPackage?.categories && userPackage.categories.map((category, categoryIndex) => {
                                                return (
                                                    <div key={categoryIndex} className="w-full">
                                                        <div className="text-left relative text-white w-full mt-4 border-2 p-3 rounded-lg border-gray-300">
                                                            <h3 className={`text-lg font-jacques font-bold mb-2 absolute -top-3.5 px-2`}
                                                                style={{ backgroundColor: userPackage?.color_code }}
                                                            >
                                                                {category?.name}
                                                            </h3>
                                                            {category?.items.map((point, idx) => (
                                                                <div key={idx} className='mt-2'>
                                                                    <p className="text-sm mb-2">{point?.title}</p>
                                                                    <ul>
                                                                        {
                                                                            point?.contentsPackage.map((item, itemIdx) => (
                                                                                <li key={itemIdx} className="text-xs mb-1 list-disc list-inside capitalize">
                                                                                    {item?.type?.replace(/_/g, " ")} : {item?.allowed_access_count}
                                                                                </li>
                                                                            ))
                                                                        }
                                                                    </ul>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </button>
                        )
                    })}
                </div>
                <div className="relative z-20 flex justify-end w-full max-w-5xl px-4">
                    <div className='text-center text-xl gap-2 bg-codeyellow w-[122px] h-[100px] rounded-lg flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform font-jacques text-black font-bold' onClick={handleNextStep}>
                        {savePreferenceMutation?.isPending ? <Loader className='animate-spin' /> : <ChevronRight className="w-12 h-22" strokeWidth={2} />}
                        Next
                    </div>
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
        </div>
    )
}

export default Preferences