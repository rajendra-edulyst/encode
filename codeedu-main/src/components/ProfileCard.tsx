import React, { useEffect, useState } from 'react'
import { Card, CardContent } from './ui/card'
import { CalendarCheck2, CalendarPlus, ClipboardList } from 'lucide-react';
import { usePackageDetails, useSaveUserInterest, useUserProfile } from '@/hooks/data/useGettingStarted';
import { useMentorshipStatus } from '@/hooks/data/create/useMentor';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { useSessionUser } from '@/store/authStore';
import { Button } from './ui/ShadcnButton';
import AvailabilityPopup from '@/views/common/profile-view/components/AvailabilityPopup';
import { FACULTY, INDUSTRY, HOD, ADMIN } from '@/constants/roles.constant';
import { ShieldCheck } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/shadcnTooltip';
import { cn } from '@/lib/utils';
import { colorStyles } from '@/lib/packageColor';
import edit from "@/assets/images/edit.png";
import school from "@/assets/images/school.png";
import { mixpanelService } from '@/services/mixpanel/MixpanelService';

const ProfileCard = () => {
    const navigate = useNavigate();
    const { data: userProfile, refetch: refetchUserProfile } = useUserProfile();
    const { mutate: saveUserInterest } = useSaveUserInterest();
    const { profile, user, setProfile } = useSessionUser();
    const { data: mentorStatus } = useMentorshipStatus();
    const userIsMentor = profile === "mentor";
    const canUseInstructorProfile = user?.role === FACULTY || user?.role === ADMIN;
    const canUseLearnerProfile = user?.role !== FACULTY;
    const [showAvailabilityPopup, setShowAvailabilityPopup] = useState(false);
    const { data: packageDataRaw, refetch: refetchPackageData } = usePackageDetails(userProfile?.package_id || 0)

    // Removed redundant useEffect that explicitly called refetch on mount

    useEffect(() => {
        if (!profile && user) {
            if (`${user?.authority}` === INDUSTRY) {
                setProfile('industry');
            } else if (user?.role === HOD) {
                setProfile('hod');
            } else {
                setProfile('creator');
            }
        }
    }, [profile, user, setProfile]);
    const packageData = Array.isArray(packageDataRaw) ? packageDataRaw[0] : packageDataRaw as any;

    const [switches, setSwitches] = useState({
        is_hire_me_enabled: userProfile?.is_hire_me_enabled === 1,
        is_skill_up_enabled: userProfile?.is_skill_up_enabled === 1,
        is_hiring_now_enabled: userProfile?.is_hiring_now_enabled === 1,
        is_co_collab_now_enabled: userProfile?.is_co_collab_now_enabled === 1,
    });

    const handleSwitchChange = (field: string, checked: boolean) => {
        setSwitches((prev) => ({
            ...prev,
            [field]: checked,
        }));
        const payload = {
            interest_value: 1,
            [field]: checked ? 1 : 0,
        };
        saveUserInterest(payload);
    };

    useEffect(() => {
        if (userProfile) {
            setSwitches({
                is_hire_me_enabled: userProfile?.is_hire_me_enabled === 1,
                is_skill_up_enabled: userProfile?.is_skill_up_enabled === 1,
                is_hiring_now_enabled: userProfile?.is_hiring_now_enabled === 1,
                is_co_collab_now_enabled: userProfile?.is_co_collab_now_enabled === 1,
            });
        }
    }, [userProfile]);

    const changeProfileOfuser = (role: "creator" | "presenter" | "mentor" | 'industry' | 'institute' | 'hod' | null) => {
        mixpanelService.track('Dashboard Role Switched', {
            target_role: role,
            current_role: profile
        });

        if (role === 'creator') {
            setProfile(role);
            navigate('/dashboard/learner');
            return;
        }

        if (role === 'presenter') {
            setProfile(role);
            navigate('/dashboard/instructor');
            return;
        }

        if (role === 'hod') {
            setProfile(role);
            navigate('/hod/dashboard');
            return;
        }

        if (role === 'mentor') {
            const isApproved = mentorStatus?.status === 'approved' || (mentorStatus as any)?.approved_by === 1;
            if (!user?.is_mentor && !isApproved) {
                navigate('/become-mentor');
                return;
            }
            setProfile(role);
            navigate('/dashboard/mentor');
            return;
        }

        if (role === 'industry') {
            setProfile(role);
            navigate('/collaborate/my-analysis/on-the-agenda');
        }

        if (role === 'institute') {
            setProfile(role as any);
            navigate('/collaborate/institute');
        }
    }

    return (
        <>
            {
                `${user?.authority}` !== INDUSTRY && (
                    <Card className='overflow-hidden relative'>
                        <Badge className="absolute top-0 right-4 bg-gray-200 dark:bg-gray-700 rounded-lg font-bold text-white text-base capitalize rounded-t-none">
                            {profile === 'presenter' ? 'Instructor' : profile === 'mentor' ? 'Mentor' : profile === 'hod' ? 'HOD' : 'Creator'}
                        </Badge>
                        <CardContent className='pt-6'>
                            <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 md:gap-10 gap-5'>
                                <div className='col-span-1 lg:col-span-3'>
                                    <div className="flex flex-col items-start justify-between space-y-3">
                                        <h1 className="text-3xl md:text-5xl font-jacques font-bold dark:text-white">
                                            Hey, <span className="text-primary font-creative">{userProfile?.platform_name || userProfile?.name}</span>
                                        </h1>
                                        <div className='space-y-4 mt-2'>
                                            <div className="flex items-center gap-6">
                                                {
                                                    packageData ? (
                                                        <div className="flex items-center gap-3">
                                                            <div className='flex items-center gap-2'>
                                                                <img src={packageData?.icon} alt={packageData?.name} className="h-6 w-6 inline-block mr-2" />
                                                                <span className={`text-2xl font-jacques font-normal`}
                                                                    style={{
                                                                        color: colorStyles[packageData?.color_code].color
                                                                    }}
                                                                >{packageData?.name}</span>
                                                            </div>
                                                            <button className="p-1 hover:bg-gray-700 rounded" onClick={() => navigate('/getting-started/preferences?type=edit&profile=upgrade')}>
                                                                <img src={edit} alt="edit" className="w-[21px] h-auto text-gray-400 inline-block" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button className="px-3 py-2 bg-[#323232] rounded-[10px] font-jacques flex items-center gap-2 hover:bg-[#323232] transition text-center justify-center whitespace-nowrap" onClick={() => navigate('/getting-started/preferences?profile=upgrade')}>
                                                            <span className="text-xl font-jacques font-normal">Choose a Plan </span>
                                                            <img src={edit} alt="edit" className="w-[21px] h-auto text-gray-400 inline-block ml-2" />
                                                        </button>
                                                    )
                                                }
                                            </div>
                                            {userProfile?.user_functional_domain && <div className="flex flex-wrap gap-2">
                                                {[
                                                    ...new Map(
                                                        userProfile?.user_functional_domain?.map((domain) => [
                                                            domain.id,
                                                            domain,
                                                        ])
                                                    ).values(),
                                                ].map((domain, index) => (
                                                    domain?.id && <Badge
                                                        key={domain.id}
                                                        className="px-3 py-2 bg-card dark:text-white dark:bg-[#2A2A2A] rounded-xl text-sm border border-gray-300 dark:border-gray-700 font-light text-wrap"
                                                    >
                                                        {domain.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className='col-span-1 lg:col-span-2 flex flex-col justify-between items-end gap-5'>
                                    <div className='flex gap-3'>
                                        {user.role !== HOD && (
                                            <>
                                                <div className='text-center'>
                                                    {canUseLearnerProfile ? (
                                                        <div className={`w-[60px] h-[60px] cursor-pointer ${profile === 'creator' ? 'bg-gray-600 border-2 border-primary' : 'bg-gray-800 opacity-50'} rounded-lg flex items-center justify-center mx-auto`} onClick={() => changeProfileOfuser('creator')}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="23" viewBox="0 0 28 23" fill="none">
                                                                <path d="M24.6522 16.5978V8.90217L14.1522 14.6087C13.7609 14.8261 13.3478 14.9348 12.913 14.9348C12.4783 14.9348 12.0652 14.8261 11.6739 14.6087L0.652174 8.6087C0.413043 8.47826 0.244565 8.31522 0.146739 8.11957C0.048913 7.92391 0 7.70652 0 7.46739C0 7.22826 0.048913 7.01087 0.146739 6.81522C0.244565 6.61956 0.413043 6.45652 0.652174 6.32609L11.6739 0.326087C11.8696 0.217391 12.0707 0.13587 12.2772 0.0815217C12.4837 0.0271739 12.6957 0 12.913 0C13.1304 0 13.3424 0.0271739 13.5489 0.0815217C13.7554 0.13587 13.9565 0.217391 14.1522 0.326087L26.5761 7.1087C26.7935 7.21739 26.962 7.375 27.0815 7.58152C27.2011 7.78804 27.2609 8.01087 27.2609 8.25V16.5978C27.2609 16.9674 27.1359 17.2772 26.8859 17.5272C26.6359 17.7772 26.3261 17.9022 25.9565 17.9022C25.587 17.9022 25.2772 17.7772 25.0272 17.5272C24.7772 17.2772 24.6522 16.9674 24.6522 16.5978ZM11.6739 22.4348L5.15217 18.913C4.71739 18.6739 4.38043 18.3478 4.1413 17.9348C3.90217 17.5217 3.78261 17.0761 3.78261 16.5978V11.6413L11.6739 15.913C12.0652 16.1304 12.4783 16.2391 12.913 16.2391C13.3478 16.2391 13.7609 16.1304 14.1522 15.913L22.0435 11.6413V16.5978C22.0435 17.0761 21.9239 17.5217 21.6848 17.9348C21.4457 18.3478 21.1087 18.6739 20.6739 18.913L14.1522 22.4348C13.9565 22.5435 13.7554 22.625 13.5489 22.6793C13.3424 22.7337 13.1304 22.7609 12.913 22.7609C12.6957 22.7609 12.4837 22.7337 12.2772 22.6793C12.0707 22.625 11.8696 22.5435 11.6739 22.4348Z" fill="white" />
                                                            </svg>
                                                        </div>
                                                    ) : (
                                                        <TooltipProvider delayDuration={200}>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div
                                                                        className="w-[60px] h-[60px] rounded-lg flex items-center justify-center mx-auto border border-gray-600/80 bg-gray-800 cursor-not-allowed"
                                                                        aria-disabled
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="23" viewBox="0 0 28 23" fill="none" className="opacity-20">
                                                                            <path d="M24.6522 16.5978V8.90217L14.1522 14.6087C13.7609 14.8261 13.3478 14.9348 12.913 14.9348C12.4783 14.9348 12.0652 14.8261 11.6739 14.6087L0.652174 8.6087C0.413043 8.47826 0.244565 8.31522 0.146739 8.11957C0.048913 7.92391 0 7.70652 0 7.46739C0 7.22826 0.048913 7.01087 0.146739 6.81522C0.244565 6.61956 0.413043 6.45652 0.652174 6.32609L11.6739 0.326087C11.8696 0.217391 12.0707 0.13587 12.2772 0.0815217C12.4837 0.0271739 12.6957 0 12.913 0C13.1304 0 13.3424 0.0271739 13.5489 0.0815217C13.7554 0.13587 13.9565 0.217391 14.1522 0.326087L26.5761 7.1087C26.7935 7.21739 26.962 7.375 27.0815 7.58152C27.2011 7.78804 27.2609 8.01087 27.2609 8.25V16.5978C27.2609 16.9674 27.1359 17.2772 26.8859 17.5272C26.6359 17.7772 26.3261 17.9022 25.9565 17.9022C25.587 17.9022 25.2772 17.7772 25.0272 17.5272C24.7772 17.2772 24.6522 16.9674 24.6522 16.5978ZM11.6739 22.4348L5.15217 18.913C4.71739 18.6739 4.38043 18.3478 4.1413 17.9348C3.90217 17.5217 3.78261 17.0761 3.78261 16.5978V11.6413L11.6739 15.913C12.0652 16.1304 12.4783 16.2391 12.913 16.2391C13.3478 16.2391 13.7609 16.1304 14.1522 15.913L22.0435 11.6413V16.5978C22.0435 17.0761 21.9239 17.5217 21.6848 17.9348C21.4457 18.3478 21.1087 18.6739 20.6739 18.913L14.1522 22.4348C13.9565 22.5435 13.7554 22.625 13.5489 22.6793C13.3424 22.7337 13.1304 22.7609 12.913 22.7609C12.6957 22.7609 12.4837 22.7337 12.2772 22.6793C12.0707 22.625 11.8696 22.5435 11.6739 22.4348Z" fill="white" />
                                                                        </svg>
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="top" className="max-w-xs text-center">
                                                                    This role is not accessible
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    )}
                                                    <p className={cn('text-center text-[10px] mt-1', profile === 'creator' && canUseLearnerProfile ? 'text-primary' : !canUseLearnerProfile && 'text-gray-400')}>Learner</p>
                                                </div>
                                                <div className='text-center'>
                                                    {canUseInstructorProfile ? (
                                                        <div
                                                            className={`w-[60px] h-[60px] cursor-pointer ${profile === 'presenter' ? 'bg-gray-600 border-2 border-primary' : 'bg-gray-800 opacity-50'} rounded-lg flex items-center justify-center mx-auto`}
                                                            onClick={() => changeProfileOfuser('presenter')}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="29" height="25" viewBox="0 0 29 25" fill="none">
                                                                <path d="M26.087 23.4783V2.6087H2.6087V11.7391C2.6087 12.1087 2.4837 12.4185 2.2337 12.6685C1.9837 12.9185 1.67391 13.0435 1.30435 13.0435C0.934783 13.0435 0.625 12.9185 0.375 12.6685C0.125 12.4185 0 12.1087 0 11.7391V2.6087C0 1.8913 0.255435 1.27717 0.766304 0.766304C1.27717 0.255435 1.8913 0 2.6087 0H26.087C26.8043 0 27.4185 0.255435 27.9293 0.766304C28.4402 1.27717 28.6957 1.8913 28.6957 2.6087V20.8696C28.6957 21.587 28.4402 22.2011 27.9293 22.712C27.4185 23.2228 26.8043 23.4783 26.087 23.4783ZM10.4348 14.3478C9 14.3478 7.77174 13.837 6.75 12.8152C5.72826 11.7935 5.21739 10.5652 5.21739 9.13043C5.21739 7.69565 5.72826 6.46739 6.75 5.44565C7.77174 4.42391 9 3.91304 10.4348 3.91304C11.8696 3.91304 13.0978 4.42391 14.1196 5.44565C15.1413 6.46739 15.6522 7.69565 15.6522 9.13043C15.6522 10.5652 15.1413 11.7935 14.1196 12.8152C13.0978 13.837 11.8696 14.3478 10.4348 14.3478ZM2.6087 24.7826C1.8913 24.7826 1.27717 24.5272 0.766304 24.0163C0.255435 23.5054 0 22.8913 0 22.1739V21.1304C0 20.3913 0.190217 19.712 0.570652 19.0924C0.951087 18.4728 1.45652 18 2.08696 17.6739C3.43478 17 4.80435 16.4946 6.19565 16.1576C7.58696 15.8207 9 15.6522 10.4348 15.6522C11.8696 15.6522 13.2826 15.8207 14.6739 16.1576C16.0652 16.4946 17.4348 17 18.7826 17.6739C19.413 18 19.9185 18.4728 20.2989 19.0924C20.6793 19.712 20.8696 20.3913 20.8696 21.1304V22.1739C20.8696 22.8913 20.6141 23.5054 20.1033 24.0163C19.5924 24.5272 18.9783 24.7826 18.2609 24.7826H2.6087Z" fill="white" />
                                                            </svg>
                                                        </div>
                                                    ) : (
                                                        <TooltipProvider delayDuration={200}>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div
                                                                        className="w-[60px] h-[60px] rounded-lg flex items-center justify-center mx-auto border border-gray-600/80 bg-gray-800 cursor-not-allowed"
                                                                        aria-disabled
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="29" height="25" viewBox="0 0 29 25" fill="none" className="opacity-20">
                                                                            <path d="M26.087 23.4783V2.6087H2.6087V11.7391C2.6087 12.1087 2.4837 12.4185 2.2337 12.6685C1.9837 12.9185 1.67391 13.0435 1.30435 13.0435C0.934783 13.0435 0.625 12.9185 0.375 12.6685C0.125 12.4185 0 12.1087 0 11.7391V2.6087C0 1.8913 0.255435 1.27717 0.766304 0.766304C1.27717 0.255435 1.8913 0 2.6087 0H26.087C26.8043 0 27.4185 0.255435 27.9293 0.766304C28.4402 1.27717 28.6957 1.8913 28.6957 2.6087V20.8696C28.6957 21.587 28.4402 22.2011 27.9293 22.712C27.4185 23.2228 26.8043 23.4783 26.087 23.4783ZM10.4348 14.3478C9 14.3478 7.77174 13.837 6.75 12.8152C5.72826 11.7935 5.21739 10.5652 5.21739 9.13043C5.21739 7.69565 5.72826 6.46739 6.75 5.44565C7.77174 4.42391 9 3.91304 10.4348 3.91304C11.8696 3.91304 13.0978 4.42391 14.1196 5.44565C15.1413 6.46739 15.6522 7.69565 15.6522 9.13043C15.6522 10.5652 15.1413 11.7935 14.1196 12.8152C13.0978 13.837 11.8696 14.3478 10.4348 14.3478ZM2.6087 24.7826C1.8913 24.7826 1.27717 24.5272 0.766304 24.0163C0.255435 23.5054 0 22.8913 0 22.1739V21.1304C0 20.3913 0.190217 19.712 0.570652 19.0924C0.951087 18.4728 1.45652 18 2.08696 17.6739C3.43478 17 4.80435 16.4946 6.19565 16.1576C7.58696 15.8207 9 15.6522 10.4348 15.6522C11.8696 15.6522 13.2826 15.8207 14.6739 16.1576C16.0652 16.4946 17.4348 17 18.7826 17.6739C19.413 18 19.9185 18.4728 20.2989 19.0924C20.6793 19.712 20.8696 20.3913 20.8696 21.1304V22.1739C20.8696 22.8913 20.6141 23.5054 20.1033 24.0163C19.5924 24.5272 18.9783 24.7826 18.2609 24.7826H2.6087Z" fill="white" />
                                                                        </svg>
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="top" className="max-w-xs text-center">
                                                                    This role is not accessible
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    )}
                                                    <p className={cn('text-center text-[10px] mt-1', profile === 'presenter' && canUseInstructorProfile ? 'text-primary' : !canUseInstructorProfile && 'text-gray-400')}>Instructor</p>
                                                </div>
                                                <div className='text-center'>
                                                    <div className={`w-[60px] h-[60px] cursor-pointer ${profile === 'mentor' ? 'bg-gray-600 border-2 border-primary' : 'bg-gray-800 opacity-50'} rounded-lg flex items-center justify-center mx-auto`} onClick={() => changeProfileOfuser('mentor')}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="26" viewBox="0 0 24 26" fill="none">
                                                            <path d="M1.26809 13.5875V14.1171C1.26809 15.0198 2.01478 15.7541 2.93216 15.7541H3.03019C3.53053 17.5513 4.7735 19.0459 6.41269 19.9024C7.35901 20.3961 8.43537 20.6783 9.58031 20.6783C10.7252 20.6783 11.8016 20.3961 12.7474 19.9024C14.3866 19.0464 15.6296 17.5513 16.1299 15.7541H16.228C17.1463 15.7541 17.892 15.0198 17.892 14.1171V13.5875C17.892 12.8049 17.3302 12.1516 16.5835 11.99C16.6094 11.7556 16.6277 11.516 16.6277 11.2733L16.6242 11.2052C16.6257 11.0322 16.6196 10.8524 16.5967 10.659V10.658C16.4941 9.54063 16.1147 8.50695 15.527 7.62918C15.2237 7.17548 14.8636 6.76752 14.4618 6.40737C13.3859 5.44489 11.9911 4.85087 10.4596 4.81241L10.3819 4.75005C10.3169 4.67677 10.2437 4.66326 10.1954 4.66326C10.0801 4.66326 9.99989 4.74122 9.93487 4.80462H9.91353C9.79061 4.67937 9.67885 4.57075 9.57371 4.48085C9.36443 4.29791 9.18664 4.19189 9.02765 4.19189H9.02562C8.79806 4.20956 7.73287 4.59726 7.39101 4.85815C7.31583 4.91531 7.23101 4.99067 7.14211 5.07278C4.5241 5.86428 2.61265 8.33857 2.61265 11.2728L2.61417 11.3118L2.61722 11.4064C2.61417 11.6038 2.62027 11.7982 2.63856 11.9895C1.86138 12.1272 1.26758 12.7836 1.26758 13.587L1.26809 13.5875ZM16.4068 12.9457C16.6973 13.0242 16.9132 13.2783 16.9132 13.588V14.1176C16.9132 14.4559 16.6572 14.7345 16.326 14.7823C16.358 14.5219 16.3778 14.26 16.3778 13.9919C16.3778 13.7237 16.3544 13.4789 16.3224 13.2289C16.3524 13.1343 16.3819 13.0408 16.4073 12.9457H16.4068ZM3.83378 13.1369C3.85359 13.0075 3.88204 12.8802 3.91048 12.7539C4.70899 12.1739 5.73151 11.2712 6.12162 10.5603C6.12162 10.5603 12.5808 12.1079 14.9337 12.2862C15.0012 12.2904 15.0642 12.2935 15.1262 12.2945C15.2126 12.5679 15.2826 12.849 15.3273 13.138C15.3695 13.4171 15.3985 13.7013 15.3985 13.9919C15.3985 14.1992 15.3858 14.4045 15.3639 14.6061C15.3258 14.9523 15.2552 15.2875 15.1577 15.6118C14.4455 17.9816 12.2161 19.7163 9.58082 19.7163C6.94553 19.7163 4.7156 17.9816 4.00293 15.6118C3.90591 15.2875 3.83531 14.9523 3.7967 14.6061C3.77537 14.405 3.76216 14.1992 3.76216 13.9919C3.76216 13.7013 3.79162 13.4171 3.83378 13.1375V13.1369ZM2.24692 13.5875C2.24692 13.2544 2.49684 12.9821 2.82091 12.9291C2.82244 13.058 2.82599 13.1842 2.82955 13.3131C2.80314 13.5356 2.78282 13.7606 2.78282 13.9908C2.78282 14.259 2.80364 14.5209 2.83514 14.7813C2.50344 14.734 2.24743 14.4549 2.24743 14.1166V13.587L2.24692 13.5875Z" fill="white" />
                                                            <path d="M23.9999 4.35559C23.9999 1.95407 22.1265 0 19.8229 0C17.5193 0 15.6465 1.95407 15.6465 4.35559C15.6465 6.05657 16.5867 7.53199 17.9536 8.24866L17.9455 8.33077L17.944 8.34792V10.5384C17.944 10.9381 18.2548 11.2639 18.6399 11.2639H18.8654V11.2811H20.7804V11.2639H21.0065C21.3905 11.2639 21.7034 10.9381 21.7034 10.5384V8.34792L21.7013 8.33077L21.6932 8.24866C23.0596 7.53199 23.9993 6.05657 23.9993 4.35559H23.9999ZM17.3461 3.6592C17.3293 3.7278 17.2704 3.77665 17.2019 3.77665H17.1617C17.115 3.77665 17.0713 3.75482 17.0429 3.71584C17.0144 3.67739 17.0048 3.62906 17.017 3.58228C17.305 2.40101 18.234 1.48686 19.381 1.25351C19.476 1.23376 19.5593 1.3112 19.5593 1.40786V1.44788C19.5593 1.52168 19.5075 1.5856 19.4379 1.60067C18.4281 1.80751 17.6062 2.61564 17.3461 3.6592ZM21.4311 10.6216C21.4311 10.6736 21.3844 10.7136 21.3275 10.7136H18.3183C18.2615 10.7136 18.2157 10.6736 18.2157 10.6216V10.4589C18.2157 10.408 18.2615 10.3669 18.3183 10.3669H21.3275C21.3844 10.3669 21.4311 10.408 21.4311 10.4589V10.6216ZM21.4311 9.79996C21.4311 9.85089 21.3844 9.89194 21.3275 9.89194H18.3183C18.2615 9.89194 18.2157 9.85089 18.2157 9.79996V9.63729C18.2157 9.58636 18.2615 9.5453 18.3183 9.5453H21.3275C21.3844 9.5453 21.4311 9.58636 21.4311 9.63729V9.79996ZM21.4311 8.97779C21.4311 9.02924 21.3844 9.0703 21.3275 9.0703H18.3183C18.2615 9.0703 18.2157 9.02924 18.2157 8.97779V8.81513C18.2157 8.76524 18.2615 8.72418 18.3183 8.72418H21.3275C21.3844 8.72418 21.4311 8.76524 21.4311 8.81513V8.97779Z" fill="white" />
                                                            <path d="M18.8652 11.5182C18.8652 11.9095 19.1898 11.9308 19.587 11.9308H20.0579C20.4567 11.9308 20.7802 11.9095 20.7802 11.5182V11.2817H18.8652V11.5182Z" fill="white" />
                                                            <path d="M19.1617 25.9699V26.0001H0V25.9699C0 23.2342 1.77074 20.9268 4.20284 20.1711C4.26786 20.2356 9.0767 24.9627 14.8867 20.1711L14.8923 20.1514C17.3584 20.8847 19.1617 23.2098 19.1617 25.9704V25.9699Z" fill="white" />
                                                        </svg>
                                                    </div>
                                                    <p className={`text-center text-[10px] mt-1 ${profile === 'mentor' && 'text-primary'}`}>Mentor</p>
                                                </div>
                                            </>
                                        )}

                                        {user?.role === HOD && (
                                            <div className='text-center'>
                                                <div className={`w-[60px] h-[60px] cursor-pointer ${profile === 'hod' ? 'bg-gray-600 border-2 border-primary' : 'bg-gray-800 opacity-50'} rounded-lg flex items-center justify-center mx-auto`} onClick={() => changeProfileOfuser('hod')}>
                                                    <ShieldCheck className='text-white' size={28} />
                                                </div>
                                                <p className={`text-center text-[10px] mt-1 ${profile === 'hod' && 'text-primary'}`}>HOD</p>
                                            </div>
                                        )}
                                    </div>
                                    {user.role !== HOD && `${user?.authority}` !== INDUSTRY && <div>
                                        <Button asChild className='bg-codeyellow text-black'>
                                            <Link to={'/ccat-landing-page'}>
                                                <ClipboardList /> My CCIQ
                                            </Link>
                                        </Button>
                                    </div>
                                    }
                                    {user.role !== HOD && !userIsMentor && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="px-3 2xl:px-6 py-3 bg-gray-300 dark:text-white dark:bg-[#5A5A5A] rounded-xl font-jacques flex items-center gap-2 hover:bg-gray-700 transition text-center justify-center cursor-pointer">
                                                <span>Hire Me</span>
                                                <Switch
                                                    className="rounded-full relative bg-[#171717] data-[state=checked]:bg-[#2A2A2A]"
                                                    checked={switches?.is_hire_me_enabled}
                                                    onCheckedChange={(checked) => handleSwitchChange('is_hire_me_enabled', checked)}
                                                />
                                            </div>
                                            <div className="px-3 2xl:px-6 py-3 bg-gray-300 dark:text-white dark:bg-[#5A5A5A] rounded-xl font-jacques flex items-center gap-2 hover:bg-gray-700 transition text-center justify-center cursor-pointer">
                                                <span>Co-create</span>
                                                <Switch
                                                    className="rounded-full relative bg-[#2A2A2A] data-[state=checked]:bg-[#2A2A2A]"
                                                    checked={switches?.is_skill_up_enabled}
                                                    onCheckedChange={(checked) => handleSwitchChange('is_skill_up_enabled', checked)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {userIsMentor && (
                                        <div className="flex space-x-4">
                                            <Link to={"/calendar/sessions"}>
                                                <Button className="text-black max-w-24 flex items-center flex-col px-6 text-wrap h-full bg-codeblue"> <CalendarCheck2 />My Session</Button>
                                            </Link>
                                            <Button className="text-black max-w-24 flex items-center flex-col px-6 text-wrap h-full bg-codeyellow" onClick={() => setShowAvailabilityPopup(true)}> <CalendarPlus />Add your Availability</Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            }
            {
                `${user?.authority}` === INDUSTRY && (
                    <Card className='overflow-hidden relative bg-center bg-cover' style={{
                        backgroundImage: "url('/img/bg/collaborate-profilecard.png')"
                    }}>
                        <Badge className="absolute top-0 right-4 bg-gray-200 dark:bg-gray-700 rounded-lg font-bold text-white text-base capitalize rounded-t-none">
                            Creative Organization
                        </Badge>
                        <CardContent className='pt-6'>
                            <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 md:gap-10 gap-5'>
                                <div className='col-span-1 lg:col-span-3 flex flex-col items-start justify-between space-y-3'>
                                    <div className="flex flex-col items-start justify-between space-y-3">
                                        <h1 className="text-3xl md:text-5xl font-jacques font-bold dark:text-white">
                                            Welcome, <span className="text-primary font-creative">{userProfile?.organization_name}</span>
                                        </h1>
                                    </div>
                                    {userProfile?.user_functional_domain && <div className="flex flex-wrap gap-2 mt-5">
                                        {userProfile?.user_functional_domain?.map((domain, index) => (
                                            domain?.id && <Badge
                                                key={index}
                                                className="px-3 py-2 bg-card dark:text-white dark:bg-[#2A2A2A] rounded-xl text-sm border border-gray-300 dark:border-gray-700 font-light text-wrap"
                                            >
                                                {domain.name}
                                            </Badge>
                                        ))}
                                    </div>
                                    }
                                </div>
                                <div className='col-span-1 lg:col-span-2 flex flex-col justify-between items-end gap-5'>
                                    <div className='flex gap-3'>
                                        <div className='text-center'>
                                            <div className={`w-[60px]  ${profile === 'industry' ? 'bg-gray-600 border-2 border-primary' : 'bg-gray-800 opacity-70'} h-[60px] bg-gray-800 rounded-lg flex items-center justify-center mx-auto`} onClick={() => changeProfileOfuser('industry')}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="27" height="25" viewBox="0 0 27 25" fill="none">
                                                    <path d="M11.7391 16.9565V14.3478H14.3478V16.9565H11.7391ZM10.4348 5.21739H15.6522V2.6087H10.4348V5.21739ZM2.6087 24.7826C1.8913 24.7826 1.27717 24.5272 0.766304 24.0163C0.255435 23.5054 0 22.8913 0 22.1739H16.9565V18.2609C9.13043 18.6304 9.25543 18.9402 9.50543 19.1902C9.75543 19.4402 10.0652 19.5652 10.4348 19.5652H15.6522C16.0217 19.5652 16.3315 19.4402 16.5815 19.1902C16.8315 18.9402 16.9565 18.6304 16.9565 18.2609V16.9565H26.087V22.1739C26.087 22.8913 25.8315 23.5054 25.3207 24.0163C24.8098 24.5272 24.1957 24.7826 23.4783 24.7826H2.6087ZM0 14.3478V7.82609C0 7.1087 0.255435 6.49457 0.766304 5.9837C1.27717 5.47283 1.8913 5.21739 2.6087 5.21739H7.82609V2.6087C7.82609 1.8913 8.08152 1.27717 8.59239 0.766304C9.10326 0.255435 9.71739 0 10.4348 0H15.6522C16.3696 0 16.9837 0.255435 17.4946 0.766304C18.0054 1.27717 18.2609 1.8913 18.2609 2.6087V5.21739H23.4783C24.1957 5.21739 24.8098 5.47283 25.3207 5.9837C25.8315 6.49457 26.087 7.1087 26.087 7.82609V14.3478H16.9565V13.0435C16.9565 12.6739 16.8315 12.3641 16.5815 12.1141C16.3315 11.8641 16.0217 11.7391 15.6522 11.7391H10.4348C10.0652 11.7391 9.75543 11.8641 9.50543 12.1141C9.25543 12.3641 9.13043 12.6739 9.13043 13.0435V14.3478H0Z" fill="white" />
                                                </svg>
                                            </div>
                                            <p className='text-center text-[10px] mt-1 text-white'>Industry</p>
                                        </div>
                                        <div className='text-center'>
                                            <div className={`w-[60px]  ${profile === 'institute' ? 'bg-gray-600 border-2 border-primary' : 'bg-gray-800 opacity-70'} h-[60px] bg-gray-800 rounded-lg flex items-center justify-center mx-auto`} onClick={() => changeProfileOfuser('institute')}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="21" viewBox="0 0 25 21" fill="none">
                                                    <path d="M7.95652 20.8696C7.23913 20.8696 6.625 20.6141 6.11413 20.1033C5.60326 19.5924 5.34783 18.9783 5.34783 18.2609V15.6522C5.34783 15.2826 5.47283 14.9728 5.72283 14.7228C5.97283 14.4728 6.28261 14.3478 6.65217 14.3478H9.26087V11.413C8.6087 11.3696 7.96196 11.2337 7.32065 11.0054C6.67935 10.7772 6.11957 10.4348 5.6413 9.97826C5.51087 9.84783 5.40761 9.70109 5.33152 9.53804C5.25543 9.375 5.21739 9.20652 5.21739 9.03261V8.15217H4.27174C4.09783 8.15217 3.92935 8.11957 3.7663 8.05435C3.60326 7.98913 3.45652 7.8913 3.32609 7.76087L0.391304 4.82609C0.130435 4.56522 0 4.26087 0 3.91304C0 3.56522 0.130435 3.26087 0.391304 3C1.02174 2.36957 1.86957 1.90761 2.93478 1.61413C4 1.32065 4.97826 1.17391 5.86957 1.17391C6.45652 1.17391 7.02717 1.21739 7.58152 1.30435C8.13587 1.3913 8.69565 1.55435 9.26087 1.79348C9.26087 1.29348 9.43478 0.869565 9.78261 0.521739C10.1304 0.173913 10.5543 0 11.0543 0H22.3043C23.0217 0 23.6359 0.255435 24.1467 0.766304C24.6576 1.27717 24.913 1.8913 24.913 2.6087V16.9565C24.913 18.0435 24.5326 18.9674 23.7717 19.7283C23.0109 20.4891 22.087 20.8696 21 20.8696H7.95652ZM11.8696 14.3478H18.3913C18.7609 14.3478 19.0707 14.4728 19.3207 14.7228C19.5707 14.9728 19.6957 15.2826 19.6957 15.6522V16.9565C19.6957 17.3261 19.8207 17.6359 20.0707 17.8859C20.3207 18.1359 20.6304 18.2609 21 18.2609C21.3696 18.2609 21.6793 18.1359 21.9293 17.8859C22.1793 17.6359 22.3043 17.3261 22.3043 16.9565V2.6087H11.8696V3.3913L19.337 10.8587C19.5326 11.0543 19.6522 11.2772 19.6957 11.5272C19.7391 11.7772 19.7065 12.0217 19.5978 12.2609C19.4891 12.5 19.337 12.6902 19.1413 12.8315C18.9457 12.9728 18.6957 13.0435 18.3913 13.0435C18.2174 13.0435 18.0489 13.0054 17.8859 12.9293C17.7228 12.8533 17.587 12.7609 17.4783 12.6522L14.1522 9.32609L13.8913 9.58696C13.587 9.8913 13.2663 10.163 12.9293 10.4022C12.5924 10.6413 12.2391 10.8261 11.8696 10.9565V14.3478ZM4.82609 5.54348H6.52174C6.8913 5.54348 7.20109 5.66848 7.45109 5.91848C7.70109 6.16848 7.82609 6.47826 7.82609 6.84783V8.34783C8.08696 8.52174 8.3587 8.6413 8.6413 8.70652C8.92391 8.77174 9.21739 8.80435 9.52174 8.80435C10.0217 8.80435 10.4728 8.72826 10.875 8.57609C11.2772 8.42391 11.6739 8.15217 12.0652 7.76087L12.3261 7.5L10.5 5.67391C9.86957 5.04348 9.16304 4.57065 8.38043 4.25543C7.59783 3.94022 6.76087 3.78261 5.86957 3.78261C5.43478 3.78261 5.02174 3.81522 4.63043 3.88043C4.23913 3.94565 3.84783 4.04348 3.45652 4.17391L4.82609 5.54348Z" fill="white" />
                                                </svg>
                                            </div>
                                            <p className='text-center text-[10px] mt-1 text-white'>Institute</p>
                                        </div>
                                    </div>
                                    {!userIsMentor && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="px-3 2xl:px-6 py-3 bg-gray-300 dark:text-white dark:bg-[#5A5A5A] rounded-xl font-jacques flex items-center gap-2 hover:bg-gray-700 transition text-center justify-center cursor-pointer">
                                                <span>Hiring Now</span>
                                                <Switch
                                                    className="rounded-full relative bg-[#171717] data-[state=checked]:bg-[#2A2A2A]"
                                                    checked={switches?.is_hire_me_enabled}
                                                    onCheckedChange={(checked) => handleSwitchChange('is_hire_me_enabled', checked)}
                                                />
                                            </div>
                                            <div className="px-3 2xl:px-6 py-3 bg-gray-300 dark:text-white dark:bg-[#5A5A5A] rounded-xl font-jacques flex items-center gap-2 hover:bg-gray-700 transition text-center justify-center cursor-pointer">
                                                <span>Co-Create</span>
                                                <Switch
                                                    className="rounded-full relative bg-[#2A2A2A] data-[state=checked]:bg-[#2A2A2A]"
                                                    checked={switches?.is_skill_up_enabled}
                                                    onCheckedChange={(checked) => handleSwitchChange('is_skill_up_enabled', checked)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {userIsMentor && (
                                        <div className="flex space-x-4">
                                            <Link to={"/calendar/sessions"}>
                                                <Button className="text-black max-w-24 flex items-center flex-col px-6 text-wrap h-full bg-codeblue"> <CalendarCheck2 />My Session</Button>
                                            </Link>
                                            <Button className="text-black max-w-24 flex items-center flex-col px-6 text-wrap h-full bg-codeyellow" onClick={() => setShowAvailabilityPopup(true)}> <CalendarPlus />Add your Availability</Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            }
            <AvailabilityPopup open={showAvailabilityPopup} onClose={() => setShowAvailabilityPopup(false)} />
        </>
    )
}

export default ProfileCard