import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import AuthorityGuard from './AuthorityGuard'
import AppRoute from './AppRoute'
import PageContainer from '@/components/template/PageContainer'
import { protectedRoutes, publicRoutes, authRoutes } from '@/configs/routes.config'
import appConfig from '@/configs/app.config'
import { useAuth } from '@/auth'
import { Routes, Route, Navigate } from 'react-router-dom'
import type { LayoutType } from '@/@types/theme'
import GroupCheck from './GroupCheck'
import AuthRoute from './AuthRoute'

interface ViewsProps {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    layout?: LayoutType
}

type AllRoutesProps = ViewsProps

const { authenticatedEntryPath } = appConfig

const AllRoutes = (props: AllRoutesProps) => {
    const { user, authenticated } = useAuth()
    const role = (user?.role || '').toLowerCase()
    const org = (user?.user_org_type || '').toLowerCase()
    const isIndustryOrInstituteAdmin = role === 'admin' && (org === 'industry' || org === 'institute')
    const homePath = isIndustryOrInstituteAdmin ? '/collaborate' : authenticatedEntryPath
    return (
        <Routes>
            <Route path="/" element={<PublicRoute />}>
                {publicRoutes.filter(route => !(authenticated && (route.path?.startsWith('/connect') || route.path?.startsWith('/courses')))).map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            route.path === '/' && authenticated ? (
                                <Navigate to={homePath} replace />
                            ) : (
                                <AppRoute
                                    routeKey={route.key}
                                    component={route.component}
                                    {...route.meta}
                                />
                            )
                        }
                    />
                ))}
            </Route>
            <Route path="/" element={<ProtectedRoute />}>
                <Route
                    path="/"
                    element={<Navigate replace to={homePath} />}
                />
                {protectedRoutes.map((route, index) => (
                    <Route
                        key={route.key + index}
                        path={route.path}
                        element={
                            <GroupCheck
                                groups={route.groups}
                            >
                                <AuthorityGuard
                                    userAuthority={user.authority}
                                    authority={route.authority}
                                >
                                    <PageContainer {...props} {...route.meta}>
                                        <AppRoute
                                            routeKey={route.key}
                                            component={route.component}
                                            {...route.meta}
                                            sideNavCollapse={route.sideNavCollapse}
                                        />
                                    </PageContainer>
                                </AuthorityGuard>
                            </GroupCheck>
                        }
                    />
                ))}
                <Route path="*" element={<Navigate replace to="/" />} />
            </Route>
            <Route path="/" element={<AuthRoute />}>
                {authRoutes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <AppRoute
                                routeKey={route.key}
                                component={route.component}
                                {...route.meta}
                            />
                        }
                    />
                ))}
            </Route>
        </Routes>
    )
}

export default AllRoutes
