import { lazy, Suspense, useState } from 'react'
import {
    LAYOUT_COLLAPSIBLE_SIDE,
    LAYOUT_BLANK,
    LAYOUT_GETTING_STARTED,
    CCAT_LAYOUT,
    LAYOUT_PORTFOLIO_SUMMARY
} from '@/constants/theme.constant'
import Loading from '@/components/shared/Loading'
import type { CommonProps } from '@/@types/common'
import type { JSX, LazyExoticComponent } from 'react'
import type { LayoutType } from '@/@types/theme'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { GlobalEventNotifier } from './components/GlobalEventNotifier'
import { useThemeStore } from '@/store/themeStore'

type Layouts = Record<
    string,
    LazyExoticComponent<<T extends CommonProps>(props: T) => JSX.Element>
>

interface PostLoginLayoutProps extends CommonProps {
    layoutType: LayoutType
}

const layouts: Layouts = {
    [LAYOUT_COLLAPSIBLE_SIDE]: lazy(
        () => import('./components/CollapsibleSide'),
    ),
    [LAYOUT_BLANK]: lazy(
        () => import('./components/BlankLayout'),
    ),
    [LAYOUT_GETTING_STARTED]: lazy(
        () => import('./components/GettingStartedLayout'),
    ),
    // New Ccat Layout
    [CCAT_LAYOUT]: lazy(
        () => import('./components/layouts/CcatLayout'),
    ),
    // Layout for portfolio summary
    [LAYOUT_PORTFOLIO_SUMMARY]: lazy(
        () => import('./components/PortfolioSummaryLayout'),
    ),
}

const PostLoginLayout = ({ layoutType, children }: PostLoginLayoutProps) => {
    
    const setSideNavCollapse = useThemeStore((state) => state.setSideNavCollapse)
    const AppLayout = layouts[layoutType] ?? layouts[Object.keys(layouts)[0]];

    const [showAiSidebar, setShowAiSidebar] = useState(false);
    
    const toggleAiSidebar = (open: boolean) => {
        setShowAiSidebar(open);
        setSideNavCollapse(open);
    };

    return (
        <Suspense fallback={(
            <div className="flex flex-auto flex-col min-h-[100vh]">
                <Loading loading={true} />
            </div>
        )}>
            <SidebarProvider defaultOpen={false} open={showAiSidebar}
                className="min-w-0 max-w-full"
                style={{
                    "--sidebar-width": "30rem",
                    "--sidebar-width-mobile": "20rem",
                } as React.CSSProperties}
                onOpenChange={(open) => {
                    toggleAiSidebar(open);
                }}
            >
                <AppLayout>{children}</AppLayout>
                <AppSidebar />
                <GlobalEventNotifier />
            </SidebarProvider>
        </Suspense>
    )

}

export default PostLoginLayout
