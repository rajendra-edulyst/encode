import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const publicRoute: Routes = [
    {
        key: 'publicHome',
        path: '/',
        component: lazy(() => import('@/views/public')),
        authority: [],
    },
    {
        key: 'payuCallback',
        path: '/payu-callback',
        component: lazy(() => import('@/views/create/learner/courses/components/PayUCallback')),
        authority: [],
    },
    {
        key: 'publicBlogDetails',
        path: '/blogs/:slug/pid',
        component: lazy(() => import('@/views/public/BlogDetails')),
        authority: [],
    },
    {
        key: 'publicBlogDetailsConnect',
        path: '/connect/blogs/:slug/pid',
        component: lazy(() => import('@/views/public/BlogDetails')),
        authority: [],
    },
    {
        key: 'personaInfo',
        path: '/persona-info',
        component: lazy(() => import('@/views/auth/SignUp/components/persona-info')),
        authority: [],
    },
    {
        key: 'personaInfoStage',
        path: '/creative-stage',
        component: lazy(() => import('@/views/@getting-started/CreativeStages')),
        authority: [],
    },
    {
        key: 'planSelection',
        path: '/plan-selection',
        component: lazy(() => import('@/views/@getting-started/stages/Preferences')),
        authority: [],
    },
    {
        key: 'publicPortfolio',
        path: '/portfolio/:org_id/:uniqueIdentifier',
        component: lazy(() => import('@/views/common/profile-view/openview/public_index')),
        authority: [],
    },
    {
        key: 'payment',
        path: '/payments',
        component: lazy(() => import('@/views/auth/payment')),
        authority: [],
    },
    {
        key: 'publicCourseExplore',
        path: '/courses/all',
        component: lazy(() => import('@/views/create/learner/courses/explore')),
        authority: [],
    },
    {
        key: 'publicCourseDetails',
        path: '/courses/details/:id',
        component: lazy(() => import('@/views/create/learner/courses/ExploreCourseDetails')),
        authority: [],
    },
    {
        key: 'publicMentorsExplore',
        path: '/mentor/all',
        component: lazy(() => import('@/views/public-pages/public-mentors/explore')),
        authority: [],
    },
    {
        key: 'createHome',
        path: '/create-home',
        component: lazy(() => import('@/views/public-pages/create-home')),
        authority: [],
    },
    {
        key: 'publicEvent',
        path: '/event/:eventname/:id',
        component: lazy(() => import('@/views/public-pages/Event')),
        authority: [],
    },
    {
        key: 'connectHome',
        path: '/connect-home',
        component: lazy(() => import('@/views/public-pages/connect-home')),
        authority: [],
    },
    {
        key: 'connectHomeBlogs',
        path: '/connect-home/blogs',
        component: lazy(() => import('@/views/public-pages/connect-home/blogs')),
        authority: [],
    },
]

export default publicRoute
