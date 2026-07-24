import type { NavigationTree } from '@/@types/navigation'
import createGroupNav from './create';
import communityNav from './community';
import collaborateNav from './collaborate'
import { NAV_ITEM_TYPE_ITEM } from '@/constants/navigation.constant';
import { ADMIN, FACULTY, INDUSTRY, LEARNER } from '@/constants/roles.constant';
import packageManager from './packageManager';

const navigationConfig: NavigationTree[] = [
    ...createGroupNav,
    ...communityNav,
    ...collaborateNav,
    {
        key: 'portfolio',
        path: '/portfolio',
        title: 'My Portfolio',
        translateKey: 'nav.portfolio',
        icon: 'portfolio',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        subMenu: [],
        groups: ['collaborate'],
    },
    {
        key: 'Queries',
        path: '/queries',
        title: 'Queries',
        translateKey: 'nav.queries',
        icon: 'queries',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [LEARNER, FACULTY, ADMIN, INDUSTRY],
        subMenu: [],
        groups: ['create', 'connect', 'collaborate'],
    },
    {
        key: 'helpCenter',
        path: '/help-center',
        title: 'Help Center (FAQ)',
        translateKey: 'nav.helpCenter',
        icon: 'helpCenter',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [LEARNER, FACULTY],
        subMenu: [],
        groups: ['connect', 'collaborate', 'create'],
    },
    ...packageManager,
]

export default navigationConfig