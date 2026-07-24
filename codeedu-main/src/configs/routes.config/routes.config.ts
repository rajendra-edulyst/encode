import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'
import learnerRoutes from './learnerRoutes'
import facultyRoutes from './facultyRoutes'
import commonRoutes from './commonRoutes'
import communityRoutes from './communityRoutes'
import industryRoutes from './industryRoute'
import collaborateRoutes from './collaborateRoutes'
import createRoutes from './createRoute'
import publicRoute from './publicRoute'
import gettingStartedRoutes from './gettingStarted'
import ccatRoutes from './ccatRoutes'
import PackageManagerRoutes from './packageManagerRoute'
import hodRoutes from './hodRoutes'
import cciRoutes from './cciRoutes'
import academicRoutes from './academicRoutes'

export const authRoutes: Routes = [...authRoute]
export const publicRoutes: Routes = [...publicRoute]

export const protectedRoutes: Routes = [
    ...gettingStartedRoutes,
    ...commonRoutes,
    ...learnerRoutes,
    ...facultyRoutes,
    ...communityRoutes,
    ...industryRoutes,
    ...collaborateRoutes,
    ...createRoutes,
    ...ccatRoutes,
    ...PackageManagerRoutes,
    ...hodRoutes,
    ...cciRoutes,
    ...academicRoutes
]