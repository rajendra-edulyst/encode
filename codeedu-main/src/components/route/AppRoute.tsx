import { useEffect, useCallback } from 'react'
import { useRouteKeyStore } from '@/store/routeKeyStore'
import { useLocation } from 'react-router-dom'
import { useThemeStore } from '@/store/themeStore'
import type { LayoutType } from '@/@types/theme'
import type { ComponentType } from 'react'
import { LAYOUT_COLLAPSIBLE_SIDE } from '@/constants/theme.constant'

export type AppRouteProps<T> = {
    component: ComponentType<T>
    routeKey: string
    layout?: LayoutType
    sideNavCollapse?: boolean
}

const AppRoute = <T extends Record<string, unknown>>({
    component: Component,
    routeKey,
    sideNavCollapse,
    ...props
}: AppRouteProps<T>) => {
    const location = useLocation()

    const layout = useThemeStore((state) => state.layout)
    const setPreviousLayout = useThemeStore((state) => state.setPreviousLayout)
    const setLayout = useThemeStore((state) => state.setLayout)
    const setSideNavCollapse = useThemeStore((state) => state.setSideNavCollapse)
    const { type: layoutType, previousType: previousLayout } = layout

    const setCurrentRouteKey = useRouteKeyStore((state) => state.setCurrentRouteKey)

    const handleLayoutChange = useCallback(() => {
        let currentKey = routeKey;
        if (location.pathname === '/collaborate/infocus') {
            const searchParams = new URLSearchParams(location.search);
            const tab = searchParams.get('tab');
            if (tab === 'Creators') currentKey = 'nav.collaborate.infocus.creators';
            else if (tab === 'Industries') currentKey = 'nav.collaborate.industries';
            else if (tab === 'Institutes') currentKey = 'nav.collaborate.institute';
        } else if (location.pathname === '/connect') {
            const searchParams = new URLSearchParams(location.search);
            if (searchParams.get('myposts') === '1') {
                currentKey = 'nav.communities.myposts';
            }
        }
        
        setCurrentRouteKey(currentKey)
        if (props.layout && props.layout !== layoutType) {
            setPreviousLayout(layoutType)
            setLayout(props.layout)
        }
        if (!props.layout) {
            if (previousLayout && layoutType !== previousLayout) {
                setLayout(previousLayout)
                setPreviousLayout('')
            } else if (!previousLayout && layoutType !== LAYOUT_COLLAPSIBLE_SIDE) {
                setLayout(LAYOUT_COLLAPSIBLE_SIDE)
            }
        }

        if (sideNavCollapse !== undefined) {
            setSideNavCollapse(!!sideNavCollapse)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.layout, routeKey, location.pathname, location.search])

    useEffect(() => {
        handleLayoutChange()
    }, [location, handleLayoutChange])

    return <Component {...(props as T)} />
}

export default AppRoute
