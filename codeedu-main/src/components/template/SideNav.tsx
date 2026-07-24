import classNames from '@/utils/classNames'
import ScrollBar from '@/components/ui/ScrollBar'
// import Logo from '@/components/template/Logo'
import VerticalMenuContent from '@/components/template/VerticalMenuContent'
import { useThemeStore } from '@/store/themeStore'
import { useSessionUser } from '@/store/authStore'
import { useRouteKeyStore } from '@/store/routeKeyStore'
import navigationConfig from '@/configs/navigation.config'
// import appConfig from '@/configs/app.config'
// import { Link } from 'react-router-dom'
import {
    SIDE_NAV_WIDTH,
    SIDE_NAV_COLLAPSED_WIDTH,
    // SIDE_NAV_CONTENT_GUTTER,
    // HEADER_HEIGHT,
    // LOGO_X_GUTTER,
} from '@/constants/theme.constant'
import type { Mode } from '@/@types/theme'
import SideNavToggle from '@/components/template/SideNavToggle'
// import { useAuth } from '@/auth'


type SideNavProps = {
    translationSetup?: boolean
    background?: boolean
    className?: string
    contentClass?: string
    mode?: Mode
}

const sideNavStyle = {
    width: SIDE_NAV_WIDTH,
    minWidth: SIDE_NAV_WIDTH,
}

const sideNavCollapseStyle = {
    width: SIDE_NAV_COLLAPSED_WIDTH,
    minWidth: SIDE_NAV_COLLAPSED_WIDTH,
    boxShadow: 'rgba(39, 52, 84, 0.20) -1px 0px 5px 0px',
    WebkitBoxShadow: 'rgba(39, 52, 84, 0.20) -1px 0px 5px 0px',
    MozBoxShadow: 'rgba(39, 52, 84, 0.20) -1px 0px 5px 0px',
}

const SideNav = ({
    translationSetup = true,
    background = true,
    className,
    contentClass,
    // mode,
}: SideNavProps) => {
    // const defaultMode = useThemeStore((state) => state.mode)
    const direction = useThemeStore((state) => state.direction)
    const sideNavCollapse = useThemeStore(
        (state) => state.layout.sideNavCollapse,
    )

    const currentRouteKey = useRouteKeyStore((state) => state.currentRouteKey)
    const userAuthority = useSessionUser((state) => state.user.authority)
    const { group } = useThemeStore((state) => state)

    return (
        <div
            style={sideNavCollapse ? sideNavCollapseStyle : sideNavStyle}
            className={classNames(
                'side-nav rounded-r-lg pt-4 border',
                background && 'side-nav-bg',
                !sideNavCollapse && 'side-nav-expand',
                className,
            )}
        >
            {/* {
                (user?.role === 'Admin' && user?.org_logo && user?.organization_id !== 162) &&
                <div className='absolute bottom-10 left-[50%] w-full h-4 z-10 transform -translate-x-[50%] flex items-center justify-center'>
                    <img src={decodeURIComponent(user?.org_logo)} alt="Organization Logo" className="w-32" />
                </div>
            } */}
            {/* {
                !sideNavCollapse &&
                <Link
                    to={appConfig.authenticatedEntryPath}
                    className="side-nav-header flex flex-col justify-center"
                    style={{ height: HEADER_HEIGHT }}
                >
                    <Logo
                        imgClass="max-w-[130px]"
                        mode={mode || defaultMode}
                        type={sideNavCollapse ? 'streamline' : 'full'}
                        className={classNames(
                            sideNavCollapse && 'ltr:ml-[11.5px] ltr:mr-[11.5px]',
                            sideNavCollapse
                                ? SIDE_NAV_CONTENT_GUTTER
                                : LOGO_X_GUTTER,
                        )}
                    />
                </Link>
            } */}
            <div className={classNames('side-nav-content', contentClass)}>
                <div className='flex items-center justify-between px-4 mb-2'>
                    <h5 className={`${sideNavCollapse ? 'hidden' : 'block text-primary font-semibold capitalize'}`}>{group}</h5>
                    <SideNavToggle />
                </div>
                <ScrollBar style={{ height: '100%' }} direction={direction}>
                    <VerticalMenuContent
                        collapsed={sideNavCollapse}
                        navigationTree={navigationConfig}
                        routeKey={currentRouteKey}
                        direction={direction}
                        translationSetup={translationSetup}
                        userAuthority={userAuthority || []}
                    />
                </ScrollBar>
            </div>
        </div>
    )
}

export default SideNav
