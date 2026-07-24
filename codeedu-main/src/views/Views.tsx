import { Suspense, useEffect } from 'react'
import Loading from '@/components/shared/Loading'
import AllRoutes from '@/components/route/AllRoutes'
import type { LayoutType } from '@/@types/theme'
import { clearStorageIfExpired } from '@/utils/storageCleaner'
import ScrollToTop from '@/utils/ScrollToTop'

import { onMessageListener } from '@/services/NotificationService'

interface ViewsProps {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    layout?: LayoutType
}

const Views = (props: ViewsProps) => {

    useEffect(() => {
        clearStorageIfExpired();

        // Register Global Notification Listener
        const unsubscribe = onMessageListener();

        return () => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        }

    }, []);

    return (
        <Suspense fallback={<Loading loading={true} className="w-full" />}>
            <ScrollToTop />
            <AllRoutes {...props} />
        </Suspense>
    )
}

export default Views
