import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Bell, Moon, Sun } from 'lucide-react'
import Header from '@/components/template/Header'
import MobileNav from '@/components/template/MobileNav'
import UserProfileDropdown from '@/components/template/UserProfileDropdown'
import LayoutBase from '@/components/template/LayoutBase'
import useResponsive from '@/utils/hooks/useResponsive'
import { LAYOUT_PORTFOLIO_SUMMARY } from '@/constants/theme.constant'
import type { CommonProps } from '@/@types/common'
import { useAuth } from '@/auth'
import { useThemeStore } from '@/store/themeStore'
import Logo from '@/components/template/Logo'

import { useNotificationController } from '@/hooks/data/useNotification'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/shadcnTooltip'
import { Button } from '@/components/ui/ShadcnButton'
import NotificationSheet from '@/views/components/NotificationSheet'
import { DonutChart } from '@/views/ccat/migration/components/DonutChart'
import { useUserProfile } from '@/hooks/data/useGettingStarted'


const PortfolioSummaryLayout = ({ children }: CommonProps) => {
    const { smaller } = useResponsive()

    const { user } = useAuth()
    const navigate = useNavigate();
    const location = useLocation();
    const { data: userProfile } = useUserProfile();
    const percentage = userProfile?.user_profile?.completion_percentage || 0;
    const { setMode, mode, toggleMode } = useThemeStore((state) => state)

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

        if (user && !user.is_interest_save && !isUtmCampaign && !isMentorPage && !bypassPreferences) {
            navigate('/getting-started/preferences');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);



    return (
        <LayoutBase
            type={LAYOUT_PORTFOLIO_SUMMARY}
            className="app-layout-portfolio-summary flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col"
        >
            <Header className="border-b dark:border-[#606060] z-30"
                headerStart={
                    <>
                        {smaller.lg && <MobileNav />}
                        <Link to="/" className='flex'>
                            <Logo imgClass="max-w-[60px] md:max-w-[152px]" mode={mode} />
                            <h5 className='text-base dark:text-white'>BETA</h5>
                        </Link>
                    </>
                }
                headerMiddle={<></>}
                headerEnd={
                    <>
                        <div className="flex items-center gap-3">
                            <Link to="/cci-stage-4?persona=1">
                                <DonutChart percentage={percentage} size={40} strokeWidth={7} />
                            </Link>
                            {
                                window.location.hostname === 'localhost' &&
                                <Button variant={'ghost'} size={'icon'} className='text-black dark:text-[#7B7B7B]' onClick={toggleMode}>
                                    {mode === 'light' ? <Moon /> : <Sun />}
                                </Button>
                            }


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
            />

            <div className="flex min-h-0 min-w-0 w-full max-w-full flex-1 bg-white dark:bg-black">
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
        </LayoutBase>
    )
}

export default PortfolioSummaryLayout
