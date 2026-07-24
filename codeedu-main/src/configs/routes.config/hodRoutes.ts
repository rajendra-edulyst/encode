import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
import { ADMIN, HOD, LEARNER, FACULTY, INDUSTRY } from '@/constants/roles.constant'

const hodRoutes: Routes = [
    {
        key: 'hod.dashboard',
        path: '/hod/dashboard',
        component: lazy(() => import('@/views/hod/dashboard')),
        authority: [HOD, ADMIN, LEARNER, FACULTY, INDUSTRY],
    },
];

export default hodRoutes;
