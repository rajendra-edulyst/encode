import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
import { FACULTY } from '@/constants/roles.constant'

const facultyRoutes: Routes = [
    // programs
    {
        key: 'programs',
        path: '/recommended-programs',
        component: lazy(() => import('@/views/faculty/programs/recommended-programs')),
        authority: [FACULTY],
    },
    {
        key: 'subjects',
        path: '/subjects',
        component: lazy(() => import('@/views/faculty/subjects')),
        authority: [FACULTY],
    },
    {
        key: 'subjects',
        path: '/subjects/:id',
        component: lazy(() => import('@/views/faculty/subjects/details')),
        authority: [FACULTY],
    },
    {
        key: 'subjects',
        path: `/subjects/:courseId/modules/:moduleId`,
        component: lazy(() => import('@/views/faculty/subjects/player')),
        authority: [FACULTY],
    },
    // content -  sessions
    {
        key: 'sessions',
        path: '/sessions',
        component: lazy(() => import('@/views/faculty/sessions')),
        authority: [FACULTY],
    },
    {
        key: 'sessions',
        path: '/sessions/create',
        component: lazy(() => import('@/views/faculty/sessions/create')),
        authority: [FACULTY],
    },
    {
        key: 'sessions',
        path: '/sessions/:id',
        component: lazy(() => import('@/views/faculty/sessions/details')),
        authority: [FACULTY],
    },
    // content
    // assignments
    {
        key: 'assignment',
        path: '/create/subjects/assignments',
        component: lazy(() => import('@/views/create/presenter/subjects/modules/contents/assignments')),
        authority: [FACULTY],
    },
    {
        key: 'assignment',
        path: '/create/subjects/assignments/:id',
        component: lazy(() => import('@/views/create/presenter/subjects/modules/contents/assignments/details')),
        authority: [FACULTY],
    },
    {
        key: 'assignment',
        path: '/create/subjects/assignments/add',
        component: lazy(() => import('@/views/create/presenter/subjects/modules/contents/assignments/add')),
        authority: [FACULTY],
    },
    // assessment
    {
        key: 'Assessment',
        path: '/assessments',
        component: lazy(() => import('@/views/create/presenter/subjects/modules/contents/assessment')),
        authority: [FACULTY],
    },
    {
        key: 'Assessment',
        path: '/assessments/:id',
        component: lazy(() => import('@/views/create/presenter/subjects/modules/contents/assessment/details')),
        authority: [FACULTY],
    },
    {
        key: 'Assessment',
        path: '/assessments/add',
        component: lazy(() => import('@/views/create/presenter/subjects/modules/contents/assessment/add')),
        authority: [FACULTY],
    },
    // learners
    {
        key: 'userSearch',
        path: '/user-search',
        component: lazy(() => import('@/views/faculty/usersearch')),
        authority: [FACULTY],
    },
    {
        key: 'Events',
        path: '/manage-events',
        component: lazy(() => import('@/views/faculty/events')),
        authority: [FACULTY],
    },
    {
        key: 'Events',
        path: '/manage-events/create',
        component: lazy(() => import('@/views/faculty/events/CreateEvents')),
        authority: [FACULTY],
    },
    {
        key: 'Events',
        path: '/manage-events/:id/activity',
        component: lazy(() => import('@/views/faculty/programs/creation/modules')),
        authority: [FACULTY],
    },
    {
        key: 'Program',
        path: '/programs/create',
        component: lazy(() => import('@/views/faculty/programs/creation')),
        authority: [FACULTY],
    },
    {
        key: 'Program',
        path: '/programs/:id/modules',
        component: lazy(() => import('@/views/faculty/programs/creation/modules')),
        authority: [FACULTY],
    },
    // content creation
    {
        key: 'Program',
        path: '/programs/:id/modules/:moduleId/contents/:contentId?/notes',
        component: lazy(() => import('@/views/faculty/programs/creation/modules/contents/notes')),
        authority: [FACULTY],
    },
    {
        key: 'Program',
        path: '/programs/:id/modules/:moduleId/contents/:contentId?/audio',
        component: lazy(() => import('@/views/faculty/programs/creation/modules/contents/audio')),
        authority: [FACULTY],
    },
    {
        key: 'Program',
        path: '/programs/:id/modules/:moduleId/contents/:contentId?/video',
        component: lazy(() => import('@/views/faculty/programs/creation/modules/contents/video')),
        authority: [FACULTY],
    },
    {
        key: 'Program',
        path: '/programs/:id/modules/:moduleId/contents/:contentId?/assignment',
        component: lazy(() => import('@/views/faculty/programs/creation/modules/contents/assignment')),
        authority: [FACULTY],
    },
    {
        key: 'Program',
        path: '/programs/:id/modules/:moduleId/contents/:contentId?/quiz',
        component: lazy(() => import('@/views/faculty/programs/creation/modules/contents/quiz')),
        authority: [FACULTY],
    },
    {
        key: 'Program',
        path: '/programs/:id/modules/:moduleId/contents/:contentId?/liveclass',
        component: lazy(() => import('@/views/faculty/programs/creation/modules/contents/liveclass')),
        authority: [FACULTY],
    },
    {
        key: 'Program',
        path: '/programs/:id/modules/:moduleId/contents/:contentId?/scorm',
        component: lazy(() => import('@/views/faculty/programs/creation/modules/contents/scorm')),
        authority: [FACULTY],
    },
    {
        key: 'Program',
        path: '/programs/:id/modules/:moduleId/contents/:contentId?/survey',
        component: lazy(() => import('@/views/faculty/programs/creation/modules/contents/survey')),
        authority: [FACULTY],
    },
    {
        key: 'Program',
        path: '/programs/:id/modules/:moduleId/contents/:contentId?/text',
        component: lazy(() => import('@/views/faculty/programs/creation/modules/contents/text')),
        authority: [FACULTY],
    },
    {
        key: 'Program',
        path: '/programs/:id/modules/:moduleId/contents/:contentId?/external_link',
        component: lazy(() => import('@/views/faculty/programs/creation/modules/contents/externalLink')),
        authority: [FACULTY],
    },
    // content creation end
    {
        key: 'ProgramModuleAssessmentQuestions',
        path: '/programs/:id/modules/:moduleId/content/:contentId/assessment-questions',
        component: lazy(() => import('@/views/faculty/programs/creation/modules/contents/assessment-questions')),
        authority: [FACULTY],
    },
    {
        key: 'ProgramModuleAssessmentQuestions',
        path: '/programs/:id/modules/:moduleId/content/:contentId/assessment-questions/add',
        component: lazy(() => import('@/views/faculty/programs/creation/modules/contents/assessment-questions/create')),
        authority: [FACULTY],
    },
    {
        key: 'ContentCreation',
        path: '/content-creation/edit',
        component: lazy(() => import('@/views/faculty/content-creation')),
        authority: [FACULTY],
    },
    {
        key: 'Activity',
        path: '/activity',
        component: lazy(() => import('@/views/faculty/activity')),
        authority: [FACULTY],
    },
    {
        key: 'Category',
        path: '/program/categories/create',
        component: lazy(() => import('@/views/faculty/programs/category/index')),
        authority: [FACULTY],
    },
    {
        key: 'FacultyEvalutionReview',
        path: '/faculty-evaluation-review/:contentId/:attemptId/:studentId',
        component: lazy(() => import('@/views/player/survey/review')),
        authority: [FACULTY],
    },
    {
        key: 'StudentQueries',
        path: '/student-queries',
        component: lazy(() => import('@/views/faculty/student-queries/index')),
        authority: [FACULTY],
    }
];

export default facultyRoutes