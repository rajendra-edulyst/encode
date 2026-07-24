import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
import { ADMIN, INDUSTRY } from '@/constants/roles.constant'

const industryRoutes: Routes = [
    {
        key: 'nav.industries',
        path: '/industry',
        component: lazy(() => import('@/views/industry/pages/dashboard')),
        authority: [ADMIN, INDUSTRY],
        groups: ['collaborate']
    },
    {
        key: 'nav.industries.talentPool',
        path: '/industry/talent-pool',
        component: lazy(() => import('@/views/industry/pages/talent-pool')),
        authority: [ADMIN, INDUSTRY],
        groups: ['collaborate']
    },
    {
        key: 'nav.industries.talentPool',
        path: '/industry/talent-pool/talent/:id',
        component: lazy(() => import('@/views/industry/pages/talent-pool/profile')),
        authority: [ADMIN, INDUSTRY],
        groups: ['collaborate']
    },
    // /industry/jobs
    {
        key: 'nav.industries.jobs',
        path: '/industry/jobs',
        component: lazy(() => import('@/views/industry/pages/jobs')),
        authority: [ADMIN, INDUSTRY],
        groups: ['collaborate']
    },
    {
        key: 'nav.industries.jobs',
        path: '/industry/jobs/:id',
        component: lazy(() => import('@/views/industry/pages/jobs/details')),
        authority: [ADMIN, INDUSTRY],
        groups: ['collaborate']
    },
    {
        key: 'nav.industries.jobs',
        path: '/industry/jobs/add',
        component: lazy(() => import('@/views/industry/pages/jobs/add')),
        authority: [ADMIN, INDUSTRY],
        groups: ['collaborate']
    },
     {
        key: 'nav.industries.jobs',
        path: '/industry/jobs/edit/:id',
        component: lazy(() => import('@/views/industry/pages/jobs/edit')),
        authority: [ADMIN, INDUSTRY],
        groups: ['collaborate']
    },
    // nav.industries.analytics
    {
        key: 'nav.industries.analytics',
        path: '/industry/analytics',
        component: lazy(() => import('@/views/industry/pages/analytics')),
        authority: [ADMIN, INDUSTRY],
        groups: ['collaborate']
    }
]

export default industryRoutes