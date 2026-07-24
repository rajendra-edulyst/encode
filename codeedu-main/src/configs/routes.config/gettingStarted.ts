import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
import { ADMIN, FACULTY, INDUSTRY, LEARNER } from '@/constants/roles.constant'
import { LAYOUT_GETTING_STARTED } from '@/constants/theme.constant'

const gettingStartedRoutes: Routes = [
    {
        key: 'gettingStarted',
        path: '/getting-started/preferences',
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        component: lazy(() => import('@/views/@getting-started/CreativeStages')),
        meta: {
            layout: LAYOUT_GETTING_STARTED,
            pageContainerType: 'gutterless'
        }
    },
    {
        key: 'gettingStarted',
        path: '/getting-started/domains',
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        component: lazy(() => import('@/views/@getting-started/domains')),
        meta: {
            layout: LAYOUT_GETTING_STARTED,
            pageContainerType: 'gutterless'
        }
    },
    {
        key: 'gettingStarted',
        path: '/getting-started/profile',
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        component: lazy(() => import('@/views/@getting-started/index')),
        meta: {
            layout: LAYOUT_GETTING_STARTED,
        }
    },
    {
        key: 'gettingStarted',
        path: '/getting-started/payments',
        component: lazy(() => import('@/views/auth/payment')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        meta: {
            layout: LAYOUT_GETTING_STARTED,
        }
    },
]

export default gettingStartedRoutes