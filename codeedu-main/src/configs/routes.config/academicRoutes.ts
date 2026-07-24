
import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
import { ADMIN, FACULTY, INDUSTRY, LEARNER, ACADEMMIC_DASHBOARD } from '@/constants/roles.constant'



const academicRoutes: Routes = [
    {
        key: 'AcademicDashboard',
        path: '/academic',
        authority: [ADMIN, ACADEMMIC_DASHBOARD],
        component: lazy(() => import('@/views/academic_head_dashboard/index')),
        groups: ['create'],
        meta: {
            pageContainerType: 'gutterless'
        }
    },
]

export default academicRoutes;