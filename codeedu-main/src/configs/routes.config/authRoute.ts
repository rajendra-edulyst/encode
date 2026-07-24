import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const authRoute: Routes = [
    // {
    //     key: 'register',
    //     path: '/create-account',
    //     component: lazy(() => import('@/views/auth/Register')),
    //     authority: [],
    // },
    {
        key: 'signIn',
        path: `/sign-in`,
        component: lazy(() => import('@/views/auth/SignIn')),
        authority: [],
    },
    {
        key: 'signUp',
        path: `/sign-up`,
        component: lazy(() => import('@/views/auth/SignUp')),
        authority: [],
    },
    {
        key: 'SignUpStart',
        path: `/sign-up/start`,
        component: lazy(() => import('@/views/auth/SignUp/start')),
        authority: [],
    },
    {
        key: 'AccountVerify',
        path: `/account-verify`,
        component: lazy(() => import('@/views/auth/SignUp/components/otpVerify')),
        authority: [],
    },
    // personal-info
    {
        key: 'personalInfo',
        path: `/personal-info`,
        component: lazy(() => import('@/views/auth/SignUp/components/persona-info')),
        authority: [],
    },
    {
        key: 'whyJoin',
        path: `/why-join`,
        component: lazy(() => import('@/views/auth/SignUp/components/whyJoin')),
        authority: [],
    },
    {
        key: 'eula',
        path: `/eula`,
        component: lazy(() => import('@/views/auth/SignUp/components/eula')),
        authority: [],
    },
    {
        key: 'referenceNumber',
        path: `/reference-number`,
        component: lazy(() => import('@/views/auth/SignUp/components/reference-number')),
        authority: [],
    },
    {
        key: 'forgotPassword',
        path: `/forgot-password`,
        component: lazy(() => import('@/views/auth/ForgotPassword')),
        authority: [],
    },
    {
        key: 'resetPassword',
        path: `/reset-password`,
        component: lazy(() => import('@/views/auth/ResetPassword')),
        authority: [],
    },
    {
        key: 'userProfile',
        path: `/user-profile/:id`,
        component: lazy(() => import('@/views/portfolio')),
        authority: [],
    },
    {
        key: 'SetNewPassword',
        path: `/set-new-password`,
        component: lazy(() => import('@/views/auth/SetNewPassword')),
        authority: [],
    },
    // org-sign-in
    {
        key: 'orgSignIn',
        path: `/org-sign-in/:token`,
        component: lazy(() => import('@/views/auth/OrgSignIn')),
        authority: [],
    }
]

export default authRoute
