import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
import { PACKAGE_MANAGER } from '@/constants/roles.constant'

const PackageManagerRoutes: Routes = [
    {
        key: 'nav.PackageManager.dashboard',
        path: '/package-manager/dashboard',
        component: lazy(() => import('@/views/package-manager/dashboard')),
        authority: [PACKAGE_MANAGER],
        groups: ['collaborate'],
    },
    {
        key: 'nav.PackageManager.userPackages',
        path: '/package-manager/user-packages',
        component: lazy(() => import('@/views/package-manager/user-packages')),
        authority: [PACKAGE_MANAGER],
        groups: ['collaborate'],
    },
    {
        key: 'nav.PackageManager.industryPackages',
        path: '/package-manager/industry-packages',
        component: lazy(() => import('@/views/package-manager/industry-packages')),
        authority: [PACKAGE_MANAGER],
        groups: ['collaborate'],
    }
]

export default PackageManagerRoutes