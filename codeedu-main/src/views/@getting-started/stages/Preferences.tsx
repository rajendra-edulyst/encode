import React, { useEffect, useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { usePackageParameters, usePackages, useUserPackageDetails, useUserProfile } from '@/hooks/data/useGettingStarted'
import { successToast, errorToast } from '../../auth/@lib/toastUtils'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSessionUser } from '@/store/authStore'
import { INDUSTRY } from '@/constants/roles.constant'
import * as LucideIconsModule from 'lucide-react';
import logo from '@/assets/images/logogreen.png';
import boy from '@/assets/images/boy7.png';
import glitch from '@/assets/images/glitchimg.png';
import shadow from '@/assets/images/shadow.png';
import { colorStyles, duration, getGroupedParameters } from '@/lib/packageColor'
import { ConfirmationDialog } from '@/views/auth/@lib/popupUtils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/shadcnTooltip'

const Preferences = ({ onContinue, onSelect }: { onContinue: () => void; onSelect: (userPackage: any) => void }) => {
    const [selectedMindset, setSelectedMindset] = useState<number | null>(null)
    const [open, setOpen] = useState(false)
    const { user, setUser } = useSessionUser(state => state);
    const [searchParams] = useSearchParams();

    const type = searchParams.get("type");

    const preferenceType = useMemo(() => {
        const isIndustryRole = Array.isArray(user?.authority) && user.authority.includes(INDUSTRY);
        const isIndustryOrg = user?.user_org_type === 'industry';
        return isIndustryRole || isIndustryOrg ? 'b2b' : 'user';
    }, [user?.authority, user?.user_org_type]);

    const params = useMemo(() => {
        const query = new URLSearchParams();
        query.append('type', preferenceType);
        return query;
    }, [preferenceType]);

    const { data: preferences = [], isLoading, isFetched } = usePackages(params);
    const { data: parameters = [] } = usePackageParameters()
    const { data: userProfile } = useUserProfile();
    const userId = userProfile?.id;
    const { data: packageDetailsRes } = useUserPackageDetails(userId);
    const packageDetails = useMemo(() => packageDetailsRes?.data?.package, [packageDetailsRes]);

    const navigate = useNavigate();

    const handleNextStep = () => {
        if (!selectedMindset) {
            successToast('Please select a mindset before proceeding.');
            setOpen(false)
            return;
        }

        const selectedPackage = preferences.find((userPackage: any) => userPackage.id === selectedMindset);
        if (!selectedPackage) {
            successToast('Please select a valid package before proceeding.');
            setOpen(false)
            return;
        }

        if (selectedPackage.name?.toLowerCase() === 'open for all') {
            onSelect(selectedPackage);
            setOpen(false);
            navigate('/portfolio-summary');
            return;
        }

        // savePreferenceMutation.mutate(selectedMindset);
        onSelect(selectedPackage);
        setOpen(false)
        onContinue();
    };

    const handleProceed = () => {
        const packageId = packageDetails && packageDetails?.id;
        if (!selectedMindset) {
            successToast('Please select a mindset before proceeding.');
            return;
        }
        if (type === "edit" && packageId) {
            setOpen(true)
        } else {
            handleNextStep();
        }
    }

    useEffect(() => {
        const packageId = packageDetails?.id;

        if (
            !packageId ||
            !preferences?.length ||
            selectedMindset !== null
        ) {
            return;
        }

        const selectedPackage = preferences.find(
            (item: any) => item.id === packageId
        );

        if (selectedPackage) {
            setSelectedMindset(packageId);
            onSelect(selectedPackage);
        }
    }, [packageDetails?.id, preferences]);

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

    const handleMessage = () => {
        errorToast(`Downgrading your current package isn't available.`);
    }

    const handleSelectPackage = (packageId: number) => {
        setSelectedMindset(packageId)
    }

    const getLucideIcon = (iconName: string) => {
        const pascalCase = iconName?.split('-')?.map(word => word.charAt(0).toUpperCase() + word.slice(1))?.join('');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (LucideIconsModule as any)[pascalCase];
    };

    return (
        <div className="min-h-screen w-full text-white relative overflow-hidden flex flex-col justify-between pb-32">

            <div className="flex-1 flex flex-col items-center relative z-10">
                {/* Header */}
                <div className="relative overflow-hidden mb-4 w-full flex justify-center flex-col items-center">
                    <div className="text-center mb-8 max-w-3xl">
                        <h1 className="text-3xl md:text-4xl font-jacques font-bold mb-2">
                            Choose How You Want to <span className="text-codeblue font-creative">Grow</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 font-light">
                            Pick what feels right. You can always upgrade later.
                        </p>
                    </div>

                    {/* Fellowship Banner */}
                    <div className="max-w-5xl min-h-[140px] w-full mx-auto bg-[#171717] rounded-2xl border border-[#2A2A2A] flex items-center justify-between relative">
                        <div className="flex items-center gap-6 p-5 w-[80%]">
                            <div className="flex-shrink-0">
                                <img
                                    src={logo}
                                    alt="Fellowship"
                                    className="h-auto w-[240px] object-contain"
                                />
                            </div>

                            <div className="max-w-2xl">
                                <p className="text-xs md:text-base text-gray-300 leading-relaxed text-justify">
                                    enCODE Fellowship is a calibrated, Micro credit-based
                                    creative journey designed to build measurable capability,
                                    visible portfolio, and professional positioning.
                                </p>
                            </div>
                        </div>

                        <img
                            src={boy}
                            alt="Robot"
                            className="absolute scale-x-[-1] w-[240px] h-auto bottom-[40px] translate-y-1/2 right-[-60px] object-contain hidden md:block mr-6"
                        />
                    </div>
                </div>
                {/* Trial Banner */}
                <div className="relative max-w-5xl w-full h-[100px] mx-auto bg-[#1D1D1D] rounded-2xl overflow-hidden border border-[#2A2A2A] p-3 flex items-center justify-between mt-2">
                    <div className="relative z-10 w-1/3 flex items-center justify-center">
                        <p className="text-white text-base md:text-lg font-semibold">
                            Access the Platform <br /> Through a Trial Pack
                        </p>
                    </div>

                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full">
                        <img src={shadow} alt="shadow" className="w-auto h-full object-fill absolute left-[-70px]" />
                        <img src={glitch} alt="glitch" className="w-auto h-full object-fill" />
                    </div>

                    <button onClick={() => { navigate('/portfolio') }} className="bg-[#FFE600] text-[16px] h-full text-black font-bold px-5 py-3 rounded-xl hover:scale-105 transition">
                        Start your <br /> Journey
                    </button>
                </div>

                {/* Plans */}
                <div className="max-w-5xl w-full mx-auto bg-[#1D1D1D] rounded-3xl border border-[#2A2A2A] p-4 mt-4">
                    <h2 className="text-center text-white text-lg font-bold mb-6">
                        Choose the plan of your choice
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {preferences.map((userPackage: any) => {
                            const IconComponent = getLucideIcon(userPackage.icon_code);
                            const isSelected = selectedMindset === userPackage.id;
                            const allParameters = userPackage?.parameters || [];
                            const color = colorStyles[userPackage.color_code];
                            const dd = duration[userPackage.duration as keyof typeof duration || '1_year'];
                            const icon = userPackage.icon;
                            const hoverIcon = userPackage.hover_icon;
                            const isDisabled = Number(packageDetails?.price) > Number(userPackage.price);

                            // create grouped data dynamically from parameter definitions
                            const groupedParameters = getGroupedParameters(allParameters, parameters);

                            return (
                                <div
                                    key={userPackage.id}
                                    className={`relative transition-all rounded-[10px] duration-300 h-full`}
                                    onMouseEnter={(e) => {
                                        if (!isSelected) {
                                            e.currentTarget.style.boxShadow = `0px 0px 15px 0px ${color.color}`;
                                        } else {
                                            e.currentTarget.style.boxShadow = 'none';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isSelected) {
                                            e.currentTarget.style.boxShadow = 'none';
                                        } else {
                                            e.currentTarget.style.boxShadow = 'none';
                                        }
                                    }}
                                >
                                    {/* Card Container */}
                                    <button
                                        onClick={() => isDisabled ? handleMessage() : handleSelectPackage(userPackage.id)}
                                        className={`w-full h-full text-left relative rounded-[10px] overflow-hidden flex flex-col ${isSelected
                                            ? `bg-[${color.color}]`
                                            : 'bg-[#323232]'
                                            }`}
                                    // disabled={isDisabled}
                                    >
                                        {/* Header Section */}
                                        <div className="p-3 relative">
                                            {/* Badge */}
                                            <div className="absolute top-0 right-0">
                                                <div
                                                    className={`px-2 pt-1.5 pb-1 rounded-bl-[10px] text-[10px] font-semibold ${isSelected ? `text-[${color.color}]` : 'text-white'}`}
                                                    style={{
                                                        backgroundColor:
                                                            isSelected ? 'white' : color.color,
                                                    }}
                                                >
                                                    {userPackage.credits} Micro Credits
                                                </div>
                                            </div>

                                            {/* Icon + Title */}
                                            <div className="flex items-center gap-2 mb-2 mt-4">
                                                <div
                                                    className="rounded-lg p-1.5 min-w-[48px] w-[48px] h-[48px] min-h-[48px] flex items-center justify-center"
                                                >
                                                    {userPackage.icon ? (isSelected ? (
                                                        <img
                                                            src={hoverIcon}
                                                            alt={userPackage.name}
                                                            className="w-full h-auto object-contain"
                                                        />) : (
                                                        <img
                                                            src={icon}
                                                            alt={userPackage.name}
                                                            className="w-full h-auto object-contain"
                                                        />
                                                    )
                                                    ) : IconComponent ? (
                                                        <IconComponent
                                                            className="w-6 h-6 text-white"
                                                            strokeWidth={2}
                                                        />
                                                    ) : null}
                                                </div>

                                                <div className="flex flex-col items-start gap-1 max-w-[55%]">
                                                    <h3 className="text-[20px] font-bold text-white leading-tight">
                                                        {userPackage.name}
                                                    </h3>

                                                    <TooltipProvider delayDuration={100}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <p className="text-white font-normal text-[10px] line-clamp-2 text-left mt-0.5">
                                                                    {userPackage.description}
                                                                </p>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="bg-[#1D1D1D] text-white max-w-[280px] border-[#2A2A2A] z-50">
                                                                <p className="text-xs font-normal break-words">
                                                                    {userPackage.description}
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                                {/* Price */}
                                                <div className="mt-auto flex flex-col items-end min-w-fit ml-auto">
                                                    <span className="text-lg font-bold text-white">
                                                        ₹{Math.floor(Number(userPackage?.price || 0))}
                                                    </span>

                                                    <span className="text-white text-[10px] font-normal ml-1">
                                                        / {dd?.days} Days
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Features Grid */}
                                        <div className="px-3 pb-3 pt-0 grid grid-cols-2 gap-2">
                                            {groupedParameters.map((point: any, idx: number) => {
                                                return (
                                                    <div
                                                        key={idx}
                                                        className="rounded-lg p-2.5 flex flex-col items-start"
                                                        style={{
                                                            backgroundColor: isSelected
                                                                ? `${lightenColor(color.color, 18)}`
                                                                : '#5A5A5A'
                                                        }}
                                                    >
                                                        <div className="text-[28px] font-bold text-white leading-none mb-1.5 mt-1">
                                                            {point?.value}
                                                        </div>

                                                        <div className="text-[10px] font-normal text-white leading-tight">
                                                            {point?.title}
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {/* Add-On Box */}
                                            <div className="rounded-lg p-2.5 flex flex-col items-start"
                                                style={{ backgroundColor: isSelected ? `${lightenColor(color.color, 18)}` : '#5A5A5A' }}>
                                                <div className="text-[16px] font-bold text-white leading-none mb-1.5 mt-1">
                                                    Add-On
                                                </div>

                                                <div className="text-[10px] font-normal text-white leading-normal">
                                                    500+ Resource Tools Communities Building
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Next */}
                <div className="fixed bottom-4 right-4 flex justify-end gap-3 z-50">
                    <button
                        onClick={() => { navigate('/portfolio') }}
                        className="bg-[#727272] hover:bg-gray-600 min-w-[84px] h-[76px] text-[14px] flex items-center justify-center text-white rounded-xl transition-colors text-center"
                    >
                        <span>Skip <br /> For <br /> Now</span>
                    </button>
                    <button
                        onClick={handleProceed}
                        className="bg-[#FFEC00] hover:bg-[#FFEC00]/90 text-[14px] min-w-[84px] h-[76px] font-bold text-black rounded-xl transition-colors disabled:bg-[#FFEC00]/60 disabled:cursor-not-allowed flex items-center justify-center flex-col gap-1"
                    >
                        <ChevronRight size={20} className="text-black" />
                        <span className='text-black'>Next</span>
                    </button>
                </div>
            </div>
            <ConfirmationDialog open={open} onOpenChange={setOpen} onConfirm={handleNextStep} title="Are you sure?" text=" 🚀 Ready to level up your plan?" confirmBtn={`Yes, upgrade it!`} />
        </div>
    )
}

export default Preferences



const lightenColor = (color: string, percent: number) => {
    const num = parseInt(color.replace("#", ""), 16);

    const amt = Math.round(2.55 * percent);

    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;

    return (
        "#" +
        (
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
        )
            .toString(16)
            .slice(1)
    );
};
