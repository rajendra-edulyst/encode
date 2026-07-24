import {
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'

import type { NavigationTree } from '@/@types/navigation'
import { ADMIN, FACULTY, INDUSTRY, LEARNER } from '@/constants/roles.constant'

const communityNav: NavigationTree[] = [
    {
        key: 'nav.communities',
        path: '/connect',
        title: 'Wall',
        translateKey: 'nav.Social.item3',
        icon: 'myWall',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [FACULTY, LEARNER, ADMIN, INDUSTRY],
        subMenu: [],
        groups: ['connect'],
    },
    {
        key: 'nav.communities.myposts',
        path: '/connect?myposts=1',
        title: 'My Buzz',
        translateKey: 'nav.Social.item3',
        icon: 'myPosts',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [FACULTY, LEARNER, ADMIN, INDUSTRY],
        subMenu: [],
        groups: ['connect'],
    },
    {
        key: 'nav.communities.mycommunities',
        path: '/connect/communities',
        title: 'My Communities',
        translateKey: 'nav.Social.item3',
        icon: 'myCommunities',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [FACULTY, LEARNER, ADMIN, INDUSTRY],
        subMenu: [],
        groups: ['connect'],
    },
    {
        key: 'nav.communities.discover',
        path: '/connect/discover',
        title: 'Discover',
        translateKey: 'nav.Social.item3',
        icon: 'discover',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [FACULTY, LEARNER, ADMIN, INDUSTRY],
        subMenu: [],
        groups: ['connect'],
    },
    /*
     * Hidden: "Activity" button from left sidebar.
     * (Keeping code intact for easy re-enable.)
     */
    // {
    //     key: 'nav.communities.analytics',
    //     path: '/community/analytics',
    //     title: 'Activity',
    //     translateKey: 'nav.community.analytics',
    //     icon: 'analytics',
    //     type: NAV_ITEM_TYPE_ITEM,
    //     authority: [FACULTY, LEARNER, ADMIN, INDUSTRY],
    //     subMenu: [],
    //     groups: ['connect'],
    // },
]

export default communityNav