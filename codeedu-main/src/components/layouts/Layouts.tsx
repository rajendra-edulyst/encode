import { Suspense, useMemo } from 'react'
import Loading from '@/components/shared/Loading'
import type { CommonProps } from '@/@types/common'
import { useAuth } from '@/auth'
import { useThemeStore } from '@/store/themeStore'
import PostLoginLayout from './PostLoginLayout'
import PreLoginLayout from './PreLoginLayout'
import { matchPath, useLocation } from 'react-router-dom'
import publicRoute from '@/configs/routes.config/publicRoute'
import PublicLayout from './PublicLayout'

import ChatbotTrigger from '@/components/EnBoatChatbot/ChatbotTrigger'
import appConfig from '@/configs/app.config'

const Layout = ({ children }: CommonProps) => {
    const layoutType = useThemeStore((state) => state.layout.type)

    const { authenticated } = useAuth()

    const location = useLocation()
    const isPublicRoute = useMemo(() => {
        return publicRoute.some(route => {
            if (authenticated && (route.path?.startsWith('/connect') || route.path?.startsWith('/courses'))) {
                return false
            }
            return matchPath(route.path, location.pathname)
        })
    }, [location.pathname, authenticated])

    if (isPublicRoute) {
        return (
            <Suspense fallback={<Loading loading={true} />}>
                <PublicLayout>{children}</PublicLayout>
            </Suspense>
        )
    }

    return (
        <Suspense
            fallback={
                <div className="flex flex-auto flex-col min-h-[100vh]">
                    <Loading loading={true} />
                </div>
            }
        >
            {authenticated ? (
                <>
                    <PostLoginLayout layoutType={layoutType}>
                        {children}
                    </PostLoginLayout>
                    {window.location.origin !== 'https://encode.codeedu.co' && !location.pathname.includes('/assessment') && !location.pathname.includes('/cci') && <ChatbotTrigger />}
                </>
            ) : (
                <PreLoginLayout>{children}</PreLoginLayout>
            )}
        </Suspense>
    )
}

export default Layout
