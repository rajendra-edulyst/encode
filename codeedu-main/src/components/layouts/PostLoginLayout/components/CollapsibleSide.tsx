import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import cciRoutes from "@/configs/routes.config/cciRoutes"
import ccatRoutes from "@/configs/routes.config/ccatRoutes"
import { Bell, BookCopy, ChartColumn, Moon, Sun, Ticket, Users } from 'lucide-react'
import SideNav from '@/components/template/SideNav'
import Header from '@/components/template/Header'
import MobileNav from '@/components/template/MobileNav'
import UserProfileDropdown from '@/components/template/UserProfileDropdown'
import LayoutBase from '@/components/template/LayoutBase'
import useResponsive from '@/utils/hooks/useResponsive'
import { LAYOUT_COLLAPSIBLE_SIDE } from '@/constants/theme.constant'
import type { CommonProps } from '@/@types/common'
import { useAuth } from '@/auth'
import { useThemeStore } from '@/store/themeStore'
import Logo from '@/components/template/Logo'

import { useNotificationController } from '@/hooks/data/useNotification'
import HeaderNav from './HeaderNav'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/shadcnTooltip'
import { setPrimaryColorFromHex } from '@/hooks/usePrimaryColor'
import { Button } from '@/components/ui/ShadcnButton'
import NotificationSheet from '@/views/components/NotificationSheet'
import { DonutChart } from '@/views/ccat/migration/components/DonutChart'
import { useUserProfile } from '@/hooks/data/useGettingStarted'


const CollapsibleSide = ({ children }: CommonProps) => {
    const { smaller, larger } = useResponsive()

    const { user } = useAuth()
    const navigate = useNavigate();
    const location = useLocation();
    const { data: userProfile } = useUserProfile();
    const hiddenRoutes = [...cciRoutes, ...ccatRoutes].map(route => route.path);
    const searchParams = new URLSearchParams(location.search);
    const hasCciQueryParam = Number(searchParams.get('cci')) > 0 || Number(searchParams.get('is_cci')) > 0;
    const isHiddenSidebarRoute = hasCciQueryParam || hiddenRoutes.some(path => location.pathname === path || location.pathname.startsWith(path + '/'));
    const percentage = userProfile?.user_profile?.completion_percentage || 0;
    const { group, setGroup, setMode, mode, toggleMode } = useThemeStore((state) => state)
    const hideHeaderRoutes = ['/payu-callback']

    const isHideHeader = hideHeaderRoutes.some(path => location.pathname === path || location.pathname.startsWith(path + '/'));

    const {
        notifications,
        setNotifications,
        loading,
        error,
        pagination,
        handlePageChange,
        unreadCount
    } = useNotificationController();

    const [notificationSheetOpen, setNotificationSheetOpen] = useState(false)
    const [logoNavigateUrl, setLogoNavigateUrl] = useState('/')

    const is_interest_save = user?.is_interest_save || null

    useEffect(() => {
        if (is_interest_save === null) {
            // setIsProfileDialogOpen(true);
        }
    }, [is_interest_save]);

    const onClose = () => {
        setNotificationSheetOpen(false);
    };

    useEffect(() => {
        if (group === 'create')
            setLogoNavigateUrl('/create')
        else if (group === 'connect')
            setLogoNavigateUrl('/connect')
        else if (group === 'collaborate')
            setLogoNavigateUrl('/collaborate');
        else
            setLogoNavigateUrl('/');
    }, [group]);

    const handleGroupChange = (newGroup: string) => {
        setGroup(newGroup);
        if (newGroup === 'create') {
            setPrimaryColorFromHex('#009BD8');
            navigate('/create');
        }
        else if (newGroup === 'connect') {
            setPrimaryColorFromHex('#E60086');
            navigate('/connect');
        }
        else if (newGroup === 'collaborate') {
            setPrimaryColorFromHex('#7FBC42');
            navigate('/collaborate');
        }
        else {
            setPrimaryColorFromHex('#FF0000');
        }
    }

    useEffect(() => {
        setMode('dark');
    }, [setMode]);


    useEffect(() => {
        // UTM Sign-up Bypass: Specifically ignore mandatory preferences for campaign users
        const utmSource = (sessionStorage.getItem('utm_source') || '').toLowerCase();
        const bypassSources = ['fb', 'instagram', 'whatsapp', 'behance', 'behanced', 'facebook', 'ig'];
        const isUtmCampaign = bypassSources.some(source => utmSource.includes(source));

        // Also check if we are already on a mentor related page to avoid loop/interruption
        const isMentorPage = window.location.pathname.includes('/become-mentor') || window.location.pathname.includes('/apply-mentor');

        // Allow users who were deep-linked to their requested path to bypass preferences
        const bypassPreferences = sessionStorage.getItem('bypassed_preferences') === 'true';
        //alert(bypassPreferences);

        if (user && !user.is_interest_save && !isUtmCampaign && !isMentorPage && !bypassPreferences) {
            navigate('/getting-started/preferences');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const hasAcademicHeadRole = user?.user_roles?.includes('AcademicHead');

    return (
        <LayoutBase
            type={LAYOUT_COLLAPSIBLE_SIDE}
            className="app-layout-collapsible-side flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col"
        >
            {!isHideHeader && <Header className="border-b dark:border-[#606060] z-30"
                headerStart={
                    <>
                        {smaller.lg && <MobileNav />}
                        <Link to={logoNavigateUrl} className='flex'>
                            <Logo imgClass="max-w-[60px] md:max-w-[152px]" mode={mode} />
                            <h5 className='text-base dark:text-white'>BETA</h5>
                        </Link>
                    </>
                }
                headerMiddle={
                    <div className='text-center'>
                        <HeaderNav />
                    </div>
                }
                headerEnd={
                    <>
                        <div className="flex items-center gap-3">
                            {/* show on localhost domainonly */}
                            <Link to="/cci-stage-4?persona=1">
                                <DonutChart percentage={percentage} size={40} strokeWidth={7} />
                            </Link>
                            {
                                window.location.hostname === 'localhost' &&
                                <Button variant={'ghost'} size={'icon'} className='text-black dark:text-[#7B7B7B]' onClick={toggleMode}>
                                    {mode === 'light' ? <Moon /> : <Sun />}
                                </Button>
                            }
                            {!isHiddenSidebarRoute && (
                                hasAcademicHeadRole ? (
                                    <TooltipProvider delayDuration={200}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link
                                                    to="/academic"
                                                    className="text-black dark:text-[#7B7B7B] hover:text-primary hover:dark:text-white mr-4 transition-colors"
                                                >
                                                    <ChartColumn />
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="text-white">Academic Analytics</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ) : (
                                    <TooltipProvider delayDuration={200}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="text-black dark:text-[#7B7B7B] opacity-40 cursor-not-allowed mr-4">
                                                    <ChartColumn />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="text-white">Requires Academic Head role</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )
                            )}

                            <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="text-black dark:text-[#7B7B7B] mr-4 relative">
                                            <Bell
                                                className="cursor-pointer"
                                                onClick={() => setNotificationSheetOpen(true)}
                                            />
                                            {unreadCount > 0 && (
                                                <span className="absolute -top-1 -right-1 bg-red-500 rounded-full text-white w-4 h-4 flex justify-center items-center text-[10px]">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className='text-white'>Notifications</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <UserProfileDropdown hoverable={false} />
                    </>
                }
            />}

            <div className="flex min-h-0 min-w-0 w-full max-w-full flex-1 bg-white dark:bg-black">
                {larger.lg && !isHiddenSidebarRoute && !isHideHeader && <SideNav />}
                <div className="relative flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col">
                    <div className="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col">
                        {children}
                    </div>
                </div>
            </div>

            <NotificationSheet
                open={notificationSheetOpen}
                notifications={notifications}
                loading={loading}
                error={error}
                setNotifications={setNotifications}
                pagination={pagination}
                onPageChange={handlePageChange}
                onOpenChange={onClose}
            />

            <div className='fixed z-50 bottom-0 bg-white dark:bg-black w-full border-t md:hidden px-2'>
                <div className='flex justify-between items-center p-2'>
                    <div className={`text-center flex flex-col items-center p-1 rounded-md px-5 ${group === 'create' ? 'bg-codeblue text-white font-bold' : ''}`} onClick={() => handleGroupChange('create')}>
                        <BookCopy /> Create
                    </div>
                    <div className={`text-center flex flex-col items-center p-1 rounded-md px-5 ${group === 'connect' ? 'bg-codepink text-white font-bold' : ''}`} onClick={() => handleGroupChange('connect')}>
                        <Users /> Connect
                    </div>
                    <div className={`text-center flex flex-col items-center p-1 rounded-md px-5 ${group === 'collaborate' ? 'bg-codegreen text-white font-bold' : ''}`} onClick={() => handleGroupChange('collaborate')}>
                        <Ticket /> Collaborate
                    </div>
                </div>
            </div>

            {/* help */}
            {/* <div className='z-[100000] fixed bottom-24 right-7 flex justify-center items-center cursor-pointer shadow-lg overflow-hidden' onClick={() => navigate('/queries')}>
                <img src='/img/help.png' className='w-12 h-12' />
            </div> */}

        </LayoutBase>
    )
}

export default CollapsibleSide