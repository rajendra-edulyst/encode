import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
import { ADMIN, FACULTY, INDUSTRY, LEARNER } from '@/constants/roles.constant'
import { LAYOUT_PORTFOLIO_SUMMARY } from '@/constants/theme.constant'

const commonRoutes: Routes = [
    // {
    //     key: 'dashboard',
    //     path: '/home',
    //     authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
    //     component: lazy(() => import('@/views/__Home')),
    //     groups: ['create'],
    // },
    {
        key: 'portfolio',
        path: '/portfolio',
        component: lazy(() => import('@/views/common/profile-view')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create', 'collaborate', 'connect'],
    },
    {
        key: 'portfoliofirstrender',
        path: '/portfolio-summary',
        component: lazy(() => import('@/views/common/profile-view/ProfileViewFirstRender')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create', 'collaborate', 'connect'],
        meta: {
            layout: LAYOUT_PORTFOLIO_SUMMARY
        }
    },
    {
        key: 'profile',
        path: '/profile',
        component: lazy(() => import('@/views/common/profile-view')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create', 'collaborate', 'connect'],
    },
    {
        key: 'myCertificates',
        path: '/my-certificates',
        component: lazy(() => import('@/views/common/profile-view/openview/ViewMyCertificate')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create', 'collaborate', 'connect'],
    },
    {
        key: 'portfolio',
        path: '/user-portfolio/:org_id/:uniqueIdentifier',
        component: lazy(() => import('@/views/common/profile-view/openview')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create', 'collaborate'],
    },
    {
        key: 'Portfolio',
        path: '/mini-portfolio/:org_id/:uniqueIdentifier',
        component: lazy(() => import('@/views/common/profile-view/openview/mini_profile')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create', 'collaborate'],
    },
    {
        key: 'Profile',
        path: `/portfolio/:id`,
        component: lazy(() => import('@/views/portfolio')),
        authority: [],
    },
    {
        key: 'nav.myspace.mentors',
        path: '/my-space/mentors',
        component: lazy(() => import('@/views/learner/my-space/mentors')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'nav.recommended.mentors',
        path: '/recommended/mentors',
        component: lazy(() => import('@/views/learner/recommended/mentors')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },

    {
        key: 'Nav.Mentoring',
        path: '/become-mentor',
        component: lazy(() => import('@/views/auth/deeplink/MentorLandingPage')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'Nav.ApplyMentor',
        path: '/apply-mentor',
        component: lazy(() => import('@/views/create/mentor/ApplyForMentor')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    // {
    //     key: 'nav.Social.communities',
    //     path: '/communities',
    //     component: lazy(() => import('@/views/learner/community/CommunityPage')),
    //     authority: [LEARNER, FACULTY],
    // },
    // {
    //     key: 'nav.communities',
    //     path: '/communities/:id',
    //     component: lazy(() => import('@/views/learner/community/CommunityDetails')),
    //     authority: [LEARNER, FACULTY],
    // },
    // {
    //     key: 'nav.communities',
    //     path: '/communities/content/:id',
    //     component: lazy(() => import('@/views/learner/community/Content')),
    //     authority: [LEARNER, FACULTY],
    // },
    // {
    //     key: 'nav.communities',
    //     path: '/communities/create-post',
    //     component: lazy(() => import('@/views/learner/community/createContent')),
    //     authority: [LEARNER, FACULTY],
    // },
    // errors
    {
        key: 'Error.AccessDenied',
        path: '/access-denied',
        component: lazy(() => import('@/views/errors/AccessDenied')),
        authority: [],
    },
    // {
    //     key: 'masterClass',
    //     path: '/master-class',
    //     component: lazy(() => import('@/views/learner/____masterClass/____index')),
    //     authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
    //     groups: ['create'],
    // },
    // {
    //     key: 'Immersion',
    //     path: '/immersion',
    //     component: lazy(() => import('@/views/learner/immersion/index')),
    //     authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
    //     groups: ['create'],
    // },
    {
        key: 'Queries',
        path: '/queries',
        component: lazy(() => import('@/views/common/queries/index')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['connect', 'collaborate', 'create'],
    },
    {
        key: 'NewQueries',
        path: '/queries/new',
        component: lazy(() => import('@/views/common/queries/CreateQuery')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['connect', 'collaborate', 'create'],
    },
    // {
    //     key: 'Event',
    //     path: '/events',
    //     component: lazy(() => import('@/views/learner/events/EventsPage')),
    //     authority: [LEARNER, FACULTY],
    //     groups: ['collaborate'],
    // },
    {
        key: 'Event',
        path: '/event-activity/:id',
        component: lazy(() => import('@/views/learner/events/EventActivity')),
        authority: [LEARNER, FACULTY],
        groups: ['collaborate'],
    },
    {
        key: 'Event',
        path: '/event-activity/:event_id/content/:content_id',
        component: lazy(() => import('@/views/learner/events/activities/Activity')),
        authority: [LEARNER, FACULTY],
        groups: ['collaborate'],
    },
    // {
    //     key: 'Event',
    //     path: '/events/:id',
    //     component: lazy(() => import('@/views/learner/event/Show')),
    //     authority: [LEARNER, FACULTY],
    //     groups: ['collaborate'],
    // },

    {
        key: 'Course',
        path: '/course/library',
        component: lazy(() => import('@/views/learner/library')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
    },
    // {
    //     key: 'enrolledCourses',
    //     path: '/courses/enrolled',
    //     component: lazy(() => import('@/views/learner/courses/_____enrolledCourses')),
    //     authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
    // },
    // {
    //     key: 'allCourses',
    //     path: '/all-courses',
    //     component: lazy(() => import('@/views/learner/courses/_____enrolledCourses')),
    //     authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
    // },

    {
        key: 'courseRegistration',
        path: '/course-registration',
        authority: [LEARNER, ADMIN],
        component: lazy(() => import('@/views/learner/courseRegistration/index')),
    },

    {
        key: 'proceedCourseRegistration',
        path: '/proceed-course-registration',
        authority: [LEARNER, ADMIN],
        component: lazy(() => import('@/views/learner/courseRegistration/components/ProceedMain')),
    },
    // {

    //     key: 'Home',
    //     path: '/home-new',
    //     component: lazy(() => import('@/views/learner/opportunitie/Internship/Home')),
    //     authority: [LEARNER],
    // },

    {
        key: 'helpCenter',
        path: '/help-center',
        authority: [LEARNER, FACULTY],
        component: lazy(() => import('@/views/common/helpCenter')),
        groups: ['connect', 'collaborate', 'create'],
    },
    //  {
    //     key: 'analyticsDashboard',
    //     path: '/analytics-dashboard',
    //     authority: [FACULTY, ADMIN],
    //     component: lazy(() => import('@/views/common/dashboard')),
    //     groups: ['connect', 'collaborate', 'create'],
    // },
    {
        key: 'eventLandingPage',
        path: '/event-participation/:encryptedId',
        authority: [],
        component: lazy(() => import('@/views/auth/deeplink/index')),
    },

    {
        key: 'ZoomMeeting',
        path: '/zoom/meeting/:content_id',
        component: lazy(() => import('@/views/learner/events/activities/ZoomMeeting')),
        authority: [LEARNER, FACULTY],
        groups: ['collaborate'],
    },

    {
        key: 'ZoomMeetingCollaborate',
        path: '/zoom/meeting/collaborate/:content_id',
        component: lazy(() => import('@/views/learner/events/activities/ZoomMeetingCollaborate')),
        authority: [LEARNER, FACULTY],
        groups: ['collaborate'],
    },
]

export default commonRoutes