import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
import { ADMIN, FACULTY, INDUSTRY, LEARNER } from '@/constants/roles.constant'

const communityRoutes: Routes = [
    {
        key: 'nav.communities',
        path: '/connect',
        component: lazy(() => import('@/views/connect/encode')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        meta: {
            pageContainerType: 'gutterless'
        },
        groups: ['connect'],
    },
    {
        key: 'nav.communities',
        path: '/connect/add-buzz',
        component: lazy(() => import('@/views/connect/encode/add-post')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        meta: {
            pageContainerType: 'gutterless'
        },
        groups: ['connect'],
    },
    {
        key: 'nav.communities',
        path: '/connect/add-buzz/:id',
        component: lazy(() => import('@/views/connect/encode/add-post')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        meta: {
            pageContainerType: 'gutterless'
        },
        groups: ['connect'],
    },
    {
        key: 'nav.communities.mycommunities',
        path: '/connect/communities/:communityId',
        component: lazy(() => import('@/views/connect/communities/details')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        meta: {
            pageContainerType: 'gutterless'
        },
        groups: ['connect']
    },
    {
        key: 'nav.communities',
        path: '/connect/encode',
        component: lazy(() => import('@/views/connect/encode')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        meta: {
            pageContainerType: 'gutterless'
        },
        groups: ['connect'],
    },
    {
        key: 'nav.communities.mycommunities',
        path: '/connect/communities',
        component: lazy(() => import('@/views/connect/communities')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        meta: {
            pageContainerType: 'gutterless'
        },
        groups: ['connect'],
    },
    {
        key: 'nav.communities',
        path: '/connect/communities/org/:orgId',
        component: lazy(() => import('@/views/connect/communities/org-communities')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        meta: {
            pageContainerType: 'gutterless'
        },
        groups: ['connect'],
    },
    {
        key: 'nav.communities.discover',
        path: '/connect/discover',
        component: lazy(() => import('@/views/connect/discover')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        meta: {
            pageContainerType: 'gutterless'
        },
        groups: ['connect'],
    },
    {
        key: 'nav.communities',
        path: '/connect/post/:postId',
        component: lazy(() => import('@/views/connect/encode/post-details')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        meta: {
            pageContainerType: 'gutterless'
        },
        groups: ['connect', 'collaborate'],
    },
    {
        key: 'nav.communities',
        path: '/connect/blogs/:slug/pid',
        component: lazy(() => import('@/views/connect/encode/blogs-details')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        meta: {
            pageContainerType: 'gutterless'
        },
        groups: ['connect', 'collaborate'],
    },
    {
        key: 'nav.communities.search',
        path: '/connect/search/:query',
        component: lazy(() => import('@/views/connect/search')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        meta: {
            pageContainerType: 'gutterless'
        },
        groups: ['connect'],
    },
    {
        key: 'connect.mbm',
        path: '/connect/mbm',
        component: lazy(() => import('@/views/connect/view-all/mbm')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        meta: {
            pageContainerType: 'gutterless'
        },
        groups: ['connect'],
    },
    {
        key: 'connect.pined',
        path: '/connect/pined',
        component: lazy(() => import('@/views/connect/view-all/pined')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        meta: {
            pageContainerType: 'gutterless'
        },
        groups: ['connect'],
    },









    {
        key: 'nav.communities',
        path: '/community/create_v2',
        component: lazy(() => import('@/views/common/____community/pages/mycommunities/createCommunityV2')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        meta: {
            pageContainerType: 'gutterless'
        },
        groups: ['connect'],
    },
    {
        key: 'nav.communities',
        path: '/community/forum',
        component: lazy(() => import('@/views/common/____community/pages/mycommunities/communityForum')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        meta: {
            pageContainerType: 'gutterless'
        },
        groups: ['connect'],
    },
    // {
    //     key: 'nav.communities',
    //     path: '/community/create',
    //     component: lazy(() => import('@/views/common/community/pages/mycommunities/createCommunity')),
    //     authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
    //     meta: {
    //         pageContainerType: 'gutterless'
    //     },
    //     groups: ['connect'],
    // },
    // {
    //     key: 'nav.communities',
    //     path: '/community/myposts/createpost',
    //     component: lazy(() => import('@/views/common/community/pages/myposts/CreatePostPage')),
    //     authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
    //     meta: {
    //         pageContainerType: 'gutterless'
    //     },
    //     groups: ['connect'],
    // },
    // // create post terms
    // {
    //     key: 'nav.communities.terms',
    //     path: '/community/terms',
    //     component: lazy(() => import('@/views/common/community/pages/terms')),
    //     authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
    //     meta: {
    //         pageContainerType: 'gutterless'
    //     },
    //     groups: ['connect'],
    // },
    // {
    //     key: 'nav.communities.wall.post',
    //     path: '/community/wall/post/:postId',
    //     component: lazy(() => import('@/views/common/community/pages/wall/post/details')),
    //     authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
    //     meta: {
    //         pageContainerType: 'gutterless'
    //     },
    //     groups: ['connect']
    // },
    // {
    //     key: 'nav.communities.wall.pined',
    //     path: '/community/wall/post/pined',
    //     component: lazy(() => import('@/views/common/community/components/post/pined/view_all')),
    //     authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
    //     meta: {
    //         pageContainerType: 'gutterless'
    //     },
    //     groups: ['connect']
    // },
    // {
    //     key: 'nav.communities.myposts',
    //     path: '/community/myposts',
    //     component: lazy(() => import('@/views/common/community/pages/myposts')),
    //     authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
    //     meta: {
    //         pageContainerType: 'gutterless'
    //     },
    //     groups: ['connect']
    // },
    // {
    //     key: 'nav.communities.myposts',
    //     path: '/community/myposts/:postId',
    //     component: lazy(() => import('@/views/common/community/pages/myposts/details')),
    //     authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
    //     meta: {
    //         pageContainerType: 'gutterless'
    //     },
    //     groups: ['connect']
    // },
    // {
    //     key: 'nav.communities.mycommunities',
    //     path: '/community/mycommunities',
    //     component: lazy(() => import('@/views/common/community/pages/mycommunities')),
    //     authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
    //     meta: {
    //         pageContainerType: 'gutterless'
    //     },
    //     groups: ['connect']
    // },
    // {
    //     key: 'nav.communities.mycommunities',
    //     path: '/community/mycommunities/:communityId',
    //     component: lazy(() => import('@/views/common/community/pages/mycommunities/details')),
    //     authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
    //     meta: {
    //         pageContainerType: 'gutterless'
    //     },
    //     groups: ['connect']
    // },
    // {
    //     key: 'nav.communities.discover',
    //     path: '/community/discover/:communityId',
    //     component: lazy(() => import('@/views/common/community/pages/mycommunities/details')),
    //     authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
    //     meta: {
    //         pageContainerType: 'gutterless'
    //     },
    //     groups: ['connect']
    // },

    // {
    //     key: 'nav.communities.mycommunities',
    //     path: '/community/mycommunities/:communityId/post/:postId',
    //     component: lazy(() => import('@/views/common/community/pages/mycommunities/posts/details')),
    //     authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
    //     meta: {
    //         pageContainerType: 'gutterless'
    //     },
    //     groups: ['connect']
    // },
    // {
    //     key: 'nav.communities.discover',
    //     path: '/community/discover',
    //     component: lazy(() => import('@/views/common/community/pages/discover')),
    //     authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
    //     meta: {
    //         pageContainerType: 'gutterless'
    //     },
    //     groups: ['connect']
    // },
    // // /community/analytics
    {
        key: 'nav.communities.analytics',
        path: '/community/analytics',
        component: lazy(() => import('@/views/common/____community/pages/analytics')),
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        meta: {
            pageContainerType: 'gutterless'
        },
        groups: ['connect']
    },
    // {
    //     key: 'nav.communities.wall.post',
    //     path: '/community/analytics/post/:postId',
    //     component: lazy(() => import('@/views/common/community/pages/wall/post/details')),
    //     authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
    //     meta: {
    //         pageContainerType: 'gutterless'
    //     },
    //     groups: ['connect']
    // },
    // // /community/activities
    // {
    //     key: 'nav.activities',
    //     path: '/community/activities',
    //     component: lazy(() => import('@/views/common/community/pages/activity')),
    //     authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
    //     meta: {
    //         pageContainerType: 'gutterless'
    //     },
    //     groups: ['connect']
    // },
    // // /community/wall/post/events
    // {
    //     key: 'nav.communities.wall.post.events',
    //     path: '/community/wall/post/events',
    //     component: lazy(() => import('@/views/common/community/components/post/events/view_all')),
    //     authority: [LEARNER, FACULTY],
    //     meta: {
    //         pageContainerType: 'gutterless'
    //     },
    //     groups: ['connect']
    // },
    // // community search
    // {
    //     key: 'nav.communities.search',
    //     path: '/community/search/:searchTerm',
    //     component: lazy(() => import('@/views/common/community/pages/search')),
    //     authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
    //     meta: {
    //         pageContainerType: 'gutterless'
    //     },
    //     groups: ['connect']
    // },
    // // tranding-communities
    // {
    //     key: 'nav.communities.trending',
    //     path: '/community/discover/trending',
    //     component: lazy(() => import('@/views/common/community/pages/discover/tranding-communities/viewall')),
    //     authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
    //     meta: {
    //         pageContainerType: 'gutterless'
    //     },
    //     groups: ['connect']
    // },
    // {
    //     key: 'nav.communities.trending',
    //     path: '/community/discover/viewall',
    //     component: lazy(() => import('@/views/common/community/pages/discover/ViewAllDiscover')),
    //     authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
    //     meta: {
    //         pageContainerType: 'gutterless'
    //     },
    //     groups: ['connect']
    // },
    // // Poppin
    // {
    //     key: 'nav.communities.poppin',
    //     path: '/community/discover/poppin',
    //     component: lazy(() => import('@/views/common/community/components/post/poppin/viewall')),
    //     authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
    //     meta: {
    //         pageContainerType: 'gutterless'
    //     },
    //     groups: ['connect']
    // },
    // // Industries
    // {
    //     key: 'nav.communities.industries',
    //     path: '/community/wall/industries',
    //     component: lazy(() => import('@/views/common/community/components/post/Industries/viewall')),
    //     authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
    //     meta: {
    //         pageContainerType: 'gutterless'
    //     },
    //     groups: ['connect']
    // }
]

export default communityRoutes