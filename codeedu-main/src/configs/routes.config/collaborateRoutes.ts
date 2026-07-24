import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
import { ADMIN, FACULTY, INDUSTRY, LEARNER } from '@/constants/roles.constant'

const collaborateRoutes: Routes = [
    // home
    {
        key: 'nav.collaborate',
        path: '/collaborate',
        component: lazy(() => import('@/views/collaborate/CollaborateWrapper')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },
    {
        key: 'nav.collaborate.Opportunities',
        path: '/opportunities',
        component: lazy(() => import('@/views/collaborate/opportunities')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },
    {
        key: 'nav.collaborate.infocus',
        path: '/collaborate/infocus',
        component: lazy(() => import('@/views/collaborate/infocus/all')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },
    {
        key: 'nav.collaborate.infocus.creators',
        path: '/infocus/creators',
        component: lazy(() => import('@/views/collaborate/infocus/creators')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },
    {
        key: 'nav.collaborate.infocus.creative-directory',
        path: '/infocus/creative-directory',
        component: lazy(() => import('@/views/collaborate/infocus/creative-directory')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },
    // infocus details
    {
        key: 'nav.collaborate',
        path: '/collaborate/infocus/profile/:organizationId',
        component: lazy(() => import('@/views/collaborate/infocus/details')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],

        groups: ['collaborate'],
    },
    // agenda
    {
        key: 'nav.collaborate.agenda-list',
        path: '/collaborate/agenda-list',
        component: lazy(() => import('@/views/collaborate/agenda-list')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },
    {
        key: 'nav.collaborate.onTheAgenda',
        path: '/collaborate/agenda',
        component: lazy(() => import('@/views/collaborate/agenda')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },
    {
        key: 'nav.collaborate.onTheAgenda.masterclass',
        path: '/agenda/masterclass',
        component: lazy(() => import('@/views/collaborate/agenda')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },
    {
        key: 'nav.collaborate.onTheAgenda.workshops',
        path: '/agenda/workshops',
        component: lazy(() => import('@/views/collaborate/agenda')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },
    {
        key: 'nav.collaborate.onTheAgenda.industryVisits',
        path: '/agenda/industry-visits',
        component: lazy(() => import('@/views/collaborate/agenda')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },
    {
        key: 'nav.collaborate.onTheAgenda.competitions',
        path: '/agenda/competitions',
        component: lazy(() => import('@/views/collaborate/agenda')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },
    {
        key: 'nav.collaborate',
        path: '/agenda/details/:id',
        component: lazy(() => import('@/views/collaborate/agenda/details')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },
    {
        key: 'nav.collaborate',
        path: '/collaborate/agenda/details/:id',
        component: lazy(() => import('@/views/collaborate/agenda/details')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },
    // must attend
    {
        key: 'nav.collaborate.must-attend-list',
        path: '/collaborate/must-attend-list',
        component: lazy(() => import('@/views/collaborate/must-attend-list')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },
    {
        key: 'nav.collaborate',
        path: '/collaborate/must-attend',
        component: lazy(() => import('@/views/collaborate/must-attend')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },
    // Community Meetup
    // Flagship Events
    // Internship Placement Drive

    {
        key: 'nav.collaborate.must-attend.community-meetups',
        path: '/must-attend/community-meetups',
        component: lazy(() => import('@/views/collaborate/must-attend')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },
    {
        key: 'nav.collaborate.must-attend.flagship-events',
        path: '/must-attend/flagship-events',
        component: lazy(() => import('@/views/collaborate/must-attend')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },
    {
        key: 'nav.collaborate.must-attend.internship-placement-drive',
        path: '/must-attend/career-drive',
        component: lazy(() => import('@/views/collaborate/must-attend')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },
    {
        key: 'nav.collaborate.onTheAgenda.immersionPrograms',
        path: '/must-attend/immersion-programs',
        component: lazy(() => import('@/views/collaborate/must-attend')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },
    {
        key: 'nav.collaborate',
        path: '/collaborate/must-attend',
        component: lazy(() => import('@/views/collaborate/must-attend')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },
    {
        key: 'nav.collaborate',
        path: '/must-attend/details/:id',
        component: lazy(() => import('@/views/collaborate/must-attend/details')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },

    // internship
    // {
    //     key: 'Internship',
    //     path: '/internship',
    //     component: lazy(() => import('@/views/learner/opportunitie/Internship')),
    //     authority: [LEARNER],
    //     groups: ['collaborate'],
    // },
    {
        key: 'Internship',
        path: '/internship/add',
        component: lazy(() => import('@/views/learner/opportunitie/Internship/add')),
        authority: [LEARNER],
        groups: ['collaborate'],
    },
    {
        key: 'Internship',
        path: '/internship/:id',
        component: lazy(() => import('@/views/collaborate/opportunities/details')),
        authority: [LEARNER],
        groups: ['collaborate'],
    },

    {
        key: 'Internship',
        path: `/details/:id/event-activity/:contentId`,
        component: lazy(() => import('@/views/collaborate/opportunities/activity')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate', 'create'],

    },
    // collaborate
    {
        key: 'nav.collaborate.topIndustries',
        path: '/collaborate/industries',
        component: lazy(() => import('@/views/collaborate/industries')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },
    {
        key: 'nav.collaborate.topIndustries',
        path: '/collaborate/industries/:industryId',
        component: lazy(() => import('@/views/collaborate/industries/details')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },
    // My Analysis
    {
        key: 'nav.collaborate.myAnalysis.onAgenda',
        path: '/collaborate/my-analysis/on-the-agenda',
        component: lazy(() => import('@/views/collaborate/my-analysis/on-the-agenda')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },
    // events
    // events/create
    {
        key: 'nav.collaborate.events.onAgenda.create',
        path: '/collaborate/events/create',
        component: lazy(() => import('@/views/collaborate/events/add-event')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },
    {
        key: 'nav.collaborate.events.onAgenda.edit',
        path: '/collaborate/events/:id/edit',
        component: lazy(() => import('@/views/collaborate/events/add-event')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },
    {
        key: 'nav.collaborate.events',
        path: '/collaborate/events',
        component: lazy(() => import('@/views/collaborate/events')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },
    {
        key: 'nav.collaborate.events',
        path: '/collaborate/events/:id',
        component: lazy(() => import('@/views/collaborate/events/details')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    },

    // institute
    {
        key: 'nav.collaborate.institute',
        path: '/collaborate/institute',
        component: lazy(() => import('@/views/collaborate/institute')),
        authority: [LEARNER, FACULTY, INDUSTRY, ADMIN],
        groups: ['collaborate'],
    }
]

export default collaborateRoutes