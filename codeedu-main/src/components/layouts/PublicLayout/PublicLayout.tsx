import { useMemo, lazy, JSX } from 'react'
import type { CommonProps } from '@/@types/common'
import type { LazyExoticComponent } from 'react'
import { useLocation } from 'react-router-dom'

type LayoutType = 'simple' | 'courseDiscovery'

type Layouts = Record<
    LayoutType,
    LazyExoticComponent<<T extends CommonProps>(props: T) => JSX.Element>
>

const layouts: Layouts = {
    simple: lazy(() => import('./Simple')),
    courseDiscovery: lazy(() => import('./CourseDiscoveryLayout')),
}


const PublicLayout = ({ children }: CommonProps) => {
    const location = useLocation()
    
    const currentLayoutType: LayoutType = useMemo(() => {
        if (location.pathname.startsWith('/courses/') || location.pathname.startsWith('/courses/all')) {
            return 'courseDiscovery'
        }
        return 'simple'
    }, [location.pathname])

    const Layout = useMemo(() => {
        return layouts[currentLayoutType]
    }, [currentLayoutType])

    return <Layout>{children}</Layout>
}

export default PublicLayout
