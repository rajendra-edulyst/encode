import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
import { ADMIN, FACULTY, INDUSTRY, LEARNER } from '@/constants/roles.constant'
import { CCAT_LAYOUT } from '@/constants/theme.constant';

const ccatRoutes: Routes = [
    {
        key: 'dashboard',
        path: '/ccat',
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        component: lazy(() => import('@/views/ccat/index')),
        groups: ['create'],
        meta: {
            layout: CCAT_LAYOUT,
            pageContainerType: 'gutterless'
        }
    },
    {
        key: 'exam-dashboard',
        path: '/exam-dashboard',
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        component: lazy(() => import('@/views/ccat/migration/pages/CCATExamDashboard')),
        groups: ['create'],
        meta: {
            pageContainerType: 'gutterless'
        }
    },
    {
        key: 'ccat-stage-4',
        path: '/cci-stage-4',
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        component: lazy(() => import('@/views/ccat/migration/pages/CCATStage4')),
        groups: ['create'],
        meta: {
            pageContainerType: 'gutterless'
        }
    },
    {
        key: 'ccatLandingPage',
        path: '/ccat-landing-page',
        authority: [],
        component: lazy(() => import('@/views/cci/ccat_landing')),
        groups: ['create'],
        meta: {
            pageContainerType: 'gutterless'
        }
    },
    {
        key: 'ccatStage2',
        path: '/cci-stage-2',
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        component: lazy(() => import('@/views/ccat/stage-2')),
        groups: ['create'],
        meta: {
            pageContainerType: 'gutterless'
        }
    },
    {
        key: 'ccatStage2AllBuzz',
        path: '/cci-stage-2/all-buzz',
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        component: lazy(() => import('@/views/ccat/stage-2/AllBuzz')),
        groups: ['create'],
        meta: {
            pageContainerType: 'gutterless'
        }
    },
    {
        key: 'ccatStage3',
        path: '/cci-stage-3',
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        component: lazy(() => import('@/views/ccat/stage-3')),
        groups: ['create'],
        meta: {
            pageContainerType: 'gutterless'
        }
    },
    {
        key: 'ccatStage3Narrative',
        path: '/cci-stage-3/narrative-showcase',
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        component: lazy(() => import('@/views/ccat/stage-3/narrative-showcase')),
        groups: ['create'],
        meta: {
            pageContainerType: 'gutterless'
        }
    },
    {
        key: 'ccatStage3Written',
        path: '/cci-stage-3/written-analysis',
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        component: lazy(() => import('@/views/ccat/stage-3/written-analysis')),
        groups: ['create'],
        meta: {
            pageContainerType: 'gutterless'
        }
    },
    {
        key: 'ccatStage3Graphic',
        path: '/cci-stage-3/graphic-analysis',
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        component: lazy(() => import('@/views/ccat/stage-3/graphic-analysis')),
        groups: ['create'],
        meta: {
            pageContainerType: 'gutterless'
        }
    }
]

export default ccatRoutes;