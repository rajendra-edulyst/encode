import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
import { ADMIN, FACULTY, INDUSTRY, LEARNER } from '@/constants/roles.constant'
// import { CCI_LAYOUT } from '@/constants/theme.constant'; // Assume we don't need a special layout for now, or use common one

const cciRoutes: Routes = [
    {
        key: 'cci-dashboard',
        path: '/cci',
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        component: lazy(() => import('@/views/cci')),
        groups: ['create'],
        meta: {
            pageContainerType: 'gutterless'
        }
    }
]

export default cciRoutes;
