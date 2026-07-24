import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
import { ADMIN, FACULTY, INDUSTRY, LEARNER } from '@/constants/roles.constant'

const createRoutes: Routes = [

    {
        key: 'Learner.Dashboard',
        path: '/dashboard/learner',
        component: lazy(() => import('@/views/create/dashboard/learner-dashboard')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'Learner.Dashboard',
        path: '/dashboard/instructor',
        component: lazy(() => import('@/views/create/presenter/dashboard')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },

    {
        key: 'Learner.Dashboard',
        path: 'dashboard/learner/courses',
        component: lazy(() => import('@/views/create/dashboard/learner-dashboard/tabs/stats-details/CoursesEnrolled')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },

    {
        key: 'Learner.Dashboard',
        path: 'dashboard/learner/learning-hours',
        component: lazy(() => import('@/views/create/dashboard/learner-dashboard/tabs/stats-details/TotalLearningHours')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },

    {
        key: 'Learner.Dashboard',
        path: 'dashboard/learner/avg-session-duration',
        component: lazy(() => import('@/views/create/dashboard/learner-dashboard/tabs/stats-details/AvgSessionDuration')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },

    {
        key: 'Learner.Dashboard',
        path: 'dashboard/learner/assessment-details',
        component: lazy(() => import('@/views/create/dashboard/learner-dashboard/tabs/stats-details/AvgAssessmentScore')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },

    {
        key: 'Learner.Dashboard',
        path: 'dashboard/learner/certificates',
        component: lazy(() => import('@/views/create/dashboard/learner-dashboard/tabs/stats-details/CertificatesEarned')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'Learner.Dashboard',
        path: '/dashboard/instructor',
        component: lazy(() => import('@/views/create/presenter/dashboard')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'Create.Dashboard',
        path: '/create',
        component: lazy(() => import('@/views/create')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'Nav.Mentoring.MyMentors',
        path: '/mentoring/my-mentors',
        component: lazy(() => import('@/views/create/mentor/index')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    // explore Resources
    {
        key: 'exploreAllResources',
        path: '/explore/resources',
        component: lazy(() => import('@/views/learner/explore/resources')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'exploreAllResources',
        path: '/explore/resources/:type',
        component: lazy(
            () => import('@/views/learner/explore/resources/details'),
        ),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'Nav.Mentoring.Explore',
        path: '/mentoring/explore',
        component: lazy(() => import('@/views/create/mentor/index')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['collaborate', 'create'],
    },
    {
        key: 'myCourses',
        path: '/my-courses',
        component: lazy(() => import('@/views/create/learner/courses/my-courses')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
    },
    {
        key: 'exploreAllCourses',
        path: '/courses/explore',
        component: lazy(() => import('@/views/create/learner/courses/explore')),
        authority: [LEARNER, ADMIN, FACULTY, INDUSTRY],
    },
    {
        key: 'exploreAllCourses',
        path: '/explore-course/:id',
        component: lazy(() => import('@/views/create/learner/courses/ExploreCourseDetails')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'exploreAllCoursesDetails',
        path: '/courses/details/:id',
        component: lazy(() => import('@/views/create/learner/courses/ExploreCourseDetails')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'exploreAllCoursesDetailsSeo',
        path: '/explore-courses/details/:id',
        component: lazy(() => import('@/views/create/learner/courses/ExploreCourseDetails')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'recommendedCourseDetails',
        path: '/recommended-course/:id',
        component: lazy(() => import('@/views/create/learner/courses/RecommendedCourseDetails')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'recommendedCourseDetailsSeo',
        path: '/recommended-courses/details/:id',
        component: lazy(() => import('@/views/create/learner/courses/RecommendedCourseDetails')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'preparatoryCourseDetails',
        path: '/preparatory-course/:id',
        component: lazy(() => import('@/views/create/learner/courses/PreparatoryCourseDetails')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'preparatoryCourseDetailsSeo',
        path: '/preparatory-courses/details/:id',
        component: lazy(() => import('@/views/create/learner/courses/PreparatoryCourseDetails')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'myCourseDetails',
        path: '/my-courses/:id',
        component: lazy(() => import('@/views/create/learner/courses/MyCourseDetails')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'myCourseDetailsSeo',
        path: '/my-course/details/:id',
        component: lazy(() => import('@/views/create/learner/courses/MyCourseDetails')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'exploreAllCourses',
        path: '/courses/:id/payu-callback',
        component: lazy(() => import('@/views/create/learner/courses/components/PayUCallback')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'myCourses',
        path: `/courses/:courseId/modules/:moduleId`,
        component: lazy(() => import('@/views/create/learner/courses/player')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
        sideNavCollapse: true,
    },
    {
        key: 'myCoursesSeo',
        path: `/my-courses/:courseId/modules/:moduleId`,
        component: lazy(() => import('@/views/create/learner/courses/player')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
        sideNavCollapse: true,
    },
    {
        key: 'exploreCoursesSeo',
        path: `/explore-courses/:courseId/modules/:moduleId`,
        component: lazy(() => import('@/views/create/learner/courses/player')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
        sideNavCollapse: true,
    },
    {
        key: 'recommendedCoursesSeo',
        path: `/recommended-courses/:courseId/modules/:moduleId`,
        component: lazy(() => import('@/views/create/learner/courses/player')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
        sideNavCollapse: true,
    },
    {
        key: 'preparatoryCoursesSeo',
        path: `/preparatory-courses/:courseId/modules/:moduleId`,
        component: lazy(() => import('@/views/create/learner/courses/player')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
        sideNavCollapse: true,
    },
    // new
    {
        key: 'exploreAllResources',
        path: '/explore/resource-hub',
        component: lazy(() => import('@/views/create/learner/resource-hub')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'exploreAllResources',
        path: '/explore/resource-hub/:category',
        component: lazy(() => import('@/views/create/learner/resource-hub/tools')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'nav.myspace.resources',
        path: '/my-space/resource-hub',
        component: lazy(() => import('@/views/create/learner/resource-hub/my-resources')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'nav.recommended.resources',
        path: '/recommended/resource-hub',
        component: lazy(() => import('@/views/create/learner/resource-hub/recommended-resources')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },

    // recommended mentors
    {
        key: 'Nav.Mentoring.Recommended',
        path: '/mentoring/recommended',
        component: lazy(() => import('@/views/create/mentor/index')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'recommendedCourses',
        path: '/courses/recommended',
        component: lazy(() => import('@/views/create/learner/courses/recommended')),
        authority: [LEARNER, ADMIN, FACULTY, INDUSTRY],
    },
    {
        key: 'preparatoryCourses',
        path: '/courses/preparatory',
        component: lazy(() => import('@/views/create/learner/courses/preparatory')),
        authority: [LEARNER, ADMIN, FACULTY, INDUSTRY],
    },
    // calendar
    {
        key: 'Calendar',
        path: '/calendar',
        component: lazy(() => import('@/views/create/calendar')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'Calendar',
        path: '/calendar/sessions',
        component: lazy(
            () => import('@/views/create/old_calendar/CalendarRequests'),
        ),
        authority: [FACULTY, LEARNER, ADMIN],
        groups: ['create'],
    },
    {
        key: 'Calendar',
        path: '/calendar/available-slots',
        component: lazy(
            () => import('@/views/create/mentor/AvailableSlots'),
        ),
        authority: [FACULTY, LEARNER, ADMIN],
        groups: ['create'],
    },
    {
        key: 'Calendar',
        path: '/calendar/create',
        component: lazy(
            () => import('@/views/create/old_calendar/components/AddNewEvent'),
        ),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },

    {
        key: 'Calendar',
        path: '/calendar/apply-for-mentor',
        component: lazy(
            () => import('@/views/create/old_calendar/components/ApplyForMentor'),
        ),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'Dashboard-Mentor',
        path: '/dashboard/mentor',
        component: lazy(
            () => import('@/views/create/mentor/dashboard-mentor'),
        ),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'Dashboard-Mentor',
        path: '/overview-Mentor',
        component: lazy(
            () => import('@/views/create/mentor/dashboard-mentor/components/overview'),
        ),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'Dashboard-Mentor',
        path: '/sessions-Mentor',
        component: lazy(
            () => import('@/views/create/mentor/dashboard-mentor/components/session'),
        ),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'Dashboard-Mentor',
        path: '/session-history-Mentor',
        component: lazy(
            () => import('@/views/create/mentor/dashboard-mentor/components/session-history'),
        ),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'Dashboard-payment',
        path: '/purchase-history',
        component: lazy(
            () => import('@/views/create/purchase-course/purchase-history'),
        ),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
    {
        key: 'payment-receipt',
        path: '/purchase-history/:invoiceId',
        component: lazy(
            () => import('@/views/create/purchase-course/PaymentReciept'),
        ),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },

    {
        key: 'Dashboard-payment',
        path: '/purchase-invoice',
        component: lazy(
            () => import('@/views/create/learner/courses/components/CourseInvoice'),
        ),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        groups: ['create'],
    },
]

export default createRoutes
