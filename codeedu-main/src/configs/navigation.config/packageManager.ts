import {
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'

import type { NavigationTree } from '@/@types/navigation'
import { PACKAGE_MANAGER } from '@/constants/roles.constant'

const packageManager: NavigationTree[] = [
    {
        key: 'nav.PackageManager.dashboard',
        path: '/package-manager/dashboard',
        title: 'Package Manager Home',
        translateKey: 'nav.Social.item3',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [PACKAGE_MANAGER],
        subMenu: [],
    },
    {
        key: 'nav.PackageManager.userPackages',
        path: '/package-manager/user-packages',
        title: 'User Packages',
        translateKey: 'nav.PackageManager.userPackages',
        icon: 'package',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [PACKAGE_MANAGER],
        subMenu: [],
    },
    {
        key: 'nav.PackageManager.industryPackages',
        path: '/package-manager/industry-packages',
        title: 'Industry Packages',
        translateKey: 'nav.PackageManager.industryPackages',
        icon: 'industries',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [PACKAGE_MANAGER],
        subMenu: [],
    }
]

export default packageManager;