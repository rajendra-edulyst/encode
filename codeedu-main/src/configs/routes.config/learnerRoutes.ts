import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
import { ADMIN, FACULTY, INDUSTRY, LEARNER } from '@/constants/roles.constant'
import { LAYOUT_BLANK } from '@/constants/theme.constant'

const learnerRoutes: Routes = [
    {
        key: 'leaderboard',
        path: '/leaderboard',
        component: lazy(() => import('@/views/learner/leaderboard')),
        authority: [LEARNER, ADMIN, FACULTY, INDUSTRY],

    },
    {
        key: 'analytics',
        path: `/analytics`,
        component: lazy(() => import('@/views/learner/analytics')),
        authority: [LEARNER, ADMIN, FACULTY, INDUSTRY],
        groups: ['create']
    },
    {
        key: 'notification',
        path: `/notification-popup`,
        component: lazy(() => import('@/views/learner/notification')),
        authority: [LEARNER, ADMIN, FACULTY, INDUSTRY],
    },
    // assesment
    {
        key: 'assessment',
        path: `/assessment/attempt/instructions/:courseId/:id`,
        component: lazy(() => import('@/views/player/assessment/attempt/instructions')),
        authority: [LEARNER, ADMIN, FACULTY, INDUSTRY],
        groups: ['create'],
        meta: {
            layout: LAYOUT_BLANK,
        }
    },
    {
        key: 'assessment',
        path: `/assessment/:courseId/:id`,
        component: lazy(() => import('@/views/player/assessment/attempt')),
        authority: [LEARNER, ADMIN, FACULTY, INDUSTRY],
        groups: ['create'],
        meta: {
            layout: LAYOUT_BLANK,
        }
    },
    {
        key: 'assessment',
        path: `/assessments/:assessment_id/attempts/:attempt_id/review`,
        component: lazy(() => import('@/views/player/assessment/reviews')),
        authority: [LEARNER, ADMIN, FACULTY, INDUSTRY],
        groups: ['create'],
        // meta: {
        //     layout: LAYOUT_BLANK,
        // }
    },
    {
        key: 'AssessmentReview',
        path: '/assessment/attempt/assessmentReview/:id',
        component: lazy(() => import('@/views/player/assessment/attempt/components/AssessmentReviewPage')),
        authority: [LEARNER, ADMIN, FACULTY, INDUSTRY],
        meta: {
            layout: LAYOUT_BLANK,
        }
    },
    {
        key: 'myClasses',
        path: '/my-classes',
        component: lazy(() => import('@/views/learner/my-space/clasess')),
        authority: [LEARNER, ADMIN, FACULTY, INDUSTRY],
    },
    {
        key: 'myClassesFeedback',
        path: '/my-classes/:sessionId/feedback',
        component: lazy(() => import('@/views/learner/my-space/clasess/feedback')),
        authority: [LEARNER, ADMIN, FACULTY, INDUSTRY],
    },
    // internship
    {
        key: 'IdeaSpace',
        path: '/idea-space',
        component: lazy(() => import('@/views/learner/opportunitie/idea-space')),
        authority: [LEARNER, ADMIN, FACULTY, INDUSTRY],
        groups: ['collaborate'],
    },

    {
        key: 'Social.Blogs',
        path: '/social/blogs',
        component: lazy(() => import('@/views/learner/social/blogs')),
        authority: [LEARNER, ADMIN, FACULTY, INDUSTRY],
    },
    {
        key: 'Social.Post',
        path: '/social/post/:id',
        // component: lazy(() => import('@/views/learner/social/Show')),
        component: lazy(() => import('@/views/connect/encode/post-details')),
        authority: [LEARNER, ADMIN, FACULTY, INDUSTRY],
    },

    {
        key: 'announcements',
        path: '/announcements',
        component: lazy(() => import('@/views/learner/announcements')),
        authority: [LEARNER, ADMIN, FACULTY, INDUSTRY],
    }
];

export default learnerRoutes;