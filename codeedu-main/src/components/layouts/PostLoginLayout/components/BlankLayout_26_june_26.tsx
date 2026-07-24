import Header from '@/components/template/Header'
import UserProfileDropdown from '@/components//template/UserProfileDropdown'
import LayoutBase from '@/components//template/LayoutBase'
import { LAYOUT_COLLAPSIBLE_SIDE } from '@/constants/theme.constant'
import type { CommonProps } from '@/@types/common'
import Logo from '@/components/template/Logo'
import { Bell } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'
import { useEffect } from 'react'
import { setPrimaryColorFromHex } from '@/hooks/usePrimaryColor'
// import { useState } from 'react'
// import NotificationSheet from '@/views/components/NotificationSheet'


const Blank = ({ children }: CommonProps) => {
  // const [notificationSheetOpen, setNotificationSheetOpen] = useState(false)

  const { group } = useThemeStore((state) => state);

  useEffect(() => {
    if (group === 'create') {
      setPrimaryColorFromHex('#009BD8');
    }
    else if (group === 'connect') {
      setPrimaryColorFromHex('#E60086');
    }
    else if (group === 'collaborate') {
      setPrimaryColorFromHex('#7FBC42');
    }
    else {
      setPrimaryColorFromHex('#009BD8');
    }
  }, [group]);


  return (
    <LayoutBase
      type={LAYOUT_COLLAPSIBLE_SIDE}
      className="app-layout-collapsible-side flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col"
    >
      <Header
        className="dark:shadow-2xl border-b border-[#CBD5DD]"
        headerStart={<><Brand /></>}
        headerEnd={
          <>
            <div className="text-black">
              <Bell data-notification-toast-anchor="true" className="w-6 h- mr-2" />
            </div>
            <div>
              <UserProfileDropdown hoverable={false} />
            </div>
          </>
        }
      />
      <div className="flex min-h-0 min-w-0 w-full max-w-full flex-1">
        <div className="relative flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col">
          <div className="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col">
            {children}
          </div>
        </div>
      </div>

      {/* {notificationSheetOpen && <NotificationSheet show={notificationSheetOpen} onClose={() => setNotificationSheetOpen(false)} />} */}

    </LayoutBase>
  )
}

const Brand = () => {
  return (
    <div className="flex flex-auto items-center justify-start">
      <Logo imgClass='w-9' />
      <h1 className="text-sm md:text-xl font-bold text-primary ml-2">CodeEdu: Exam Portal </h1>
    </div>
  )
}

export default Blank