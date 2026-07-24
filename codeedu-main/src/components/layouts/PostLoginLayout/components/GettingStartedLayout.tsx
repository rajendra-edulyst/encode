import LayoutBase from '@/components//template/LayoutBase'
import { LAYOUT_COLLAPSIBLE_SIDE } from '@/constants/theme.constant'
import type { CommonProps } from '@/@types/common'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '@/components/template/Logo'
import { useThemeStore } from '@/store/themeStore'
import { useEffect, useState } from 'react'
import UserProfileDropdown from '@/components/template/UserProfileDropdown'
import { Bell } from 'lucide-react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useUserProfile } from '@/hooks/data/useGettingStarted'
import NotificationSheet from '@/views/components/NotificationSheet'
import { useNotificationController } from '@/hooks/data/useNotification'

const Blank = ({ children }: CommonProps) => {

  const { setMode } = useThemeStore((state) => state);
  const [openNotificationSheet, setOpenNotificationSheet] = useState(false);
  const { data: userProfile } = useUserProfile();
  const navigate = useNavigate();

  const {
    notifications,
    loading,
    error,
    setNotifications,
    pagination,
    handlePageChange,
    unreadCount
  } = useNotificationController();

  // get ?type=edit from url
  const searchParams = new URLSearchParams(window.location.search);
  const type = searchParams.get('type');

  useEffect(() => {
    setMode('dark');
  }, [setMode]);

  const isProfilePage = window.location.pathname === '/getting-started/profile';
  const percentage = userProfile?.user_profile?.completion_percentage || 0;

  const typeIsEdit = type === 'edit';


  return (
    <LayoutBase type={LAYOUT_COLLAPSIBLE_SIDE} className="app-layout-collapsible-side flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col">
      {(!isProfilePage && !typeIsEdit) && <header className="flex justify-center items-center py-2 shadow border-b border-gray-800 z-20 bg-black backdrop-blur h-[60px] md:h-[80px]">
        <Link to={`/create`} className='flex'>
          <Logo imgClass="max-w-[100px] md:max-w-[152px]" mode="dark" type="full" />
          <h5 className='text-base dark:text-white ml-1'>BETA</h5>
        </Link>
      </header>}
      {
        (isProfilePage || typeIsEdit) && <header className="md:px-14 flex justify-between items-center py-2 shadow border-b border-gray-800 z-20 bg-black backdrop-blur h-[60px] md:h-[80px]">
          <div>
            <Link to={`/create`} className='flex'>
              <Logo imgClass="max-w-[100px] md:max-w-[152px]" mode="dark" type="full" />
              <h5 className='text-base dark:text-white ml-1'>BETA</h5>
            </Link>
          </div>
          <div className='px-5 flex items-center gap-7 hidden'>
            <div className='relative flex border rounded-xl cursor-pointer text-white px-3 py-2 items-center justify-center gap-2' onClick={() => navigate('/portfolio')}>
              <CircularProgressbar value={percentage} text={`${percentage}%`} className='h-10'
                styles={buildStyles({
                  pathColor: `#FFEC00`,
                  trailColor: '#5A5A5A',
                  backgroundColor: '#3e98c7',
                  textColor: '#FFF'
                })}
              />
              <h4 className='text-xs md:text-lg text-nowrap font-normal hidden md:block'>Complete Your Profile</h4>
            </div>
            <div className="relative">
              <Bell
                data-notification-toast-anchor="true"
                className="cursor-pointer"
                onClick={() => setOpenNotificationSheet(true)}
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 rounded-full text-white w-4 h-4 flex justify-center items-center text-[10px]">
                  {unreadCount}
                </span>
              )}
            </div>
            <UserProfileDropdown hoverable={false} />
          </div>
        </header>
      }
      <div className="flex min-h-0 min-w-0 w-full max-w-full flex-1 bg-black">
        <div className="relative flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col">
          <div className="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col">
            {children}
          </div>
        </div>
      </div>
      <NotificationSheet
        open={openNotificationSheet}
        onOpenChange={setOpenNotificationSheet}
        notifications={notifications}
        loading={loading}
        error={error}
        setNotifications={setNotifications}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </LayoutBase>
  )
}
export default Blank