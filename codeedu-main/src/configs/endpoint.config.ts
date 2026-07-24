export const apiPrefix = '/api'

const endpointConfig = {
    signIn: '/login',
    signOut: '/logout',
    signUp: '/joy/signup',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    passwordUpdate: '/password-update',
    googleOauthSignIn: '/google-auth-login',
    appleOauthSignIn: '',


    dashboard: '/resume_dashboard',
    get_job_count: '/get_job_count',
    get_domain_count: '/get_domain_count',
    get_talent_pool: '/get_talent_pool',
    get_top_hiring_locations: '/get_top_hiring_locations',
    get_recent_placements: '/get_recent_placements',
    get_recent_job_matches: '/resume_dashboard',
    get_industry_domain: '/get_industry_domain_list',
    get_functional_domain_list: '/get_functional_domain_list',
    get_job_role_list: '/get_job_role_list',
    resumeList: 'resume_list',

    // Job
    matchingJoblist: '/matching_joblist',
    uploadResume: 'resume_parse',
    jobs: 'joblist',
    jobmatchingResumes: 'matching_resumes',
    getDomain: 'get_domain',
    getJobRole: 'get_jobrole',
    getSkill: 'get_skill',
    createJob: 'create_job',
    getContry: 'get_countries',
    getStates: 'get_states',
    getJobActivities: 'learner-competition-detail',
    createJobLms: 'create_job',
    send_matching_jobs_email: 'send_matching_jobs_email',
    create_skill: 'create_skill',
    delete_skill: 'delete_skill',
    create_job_role: 'create_job_role',
    companyList: '/companies-list',
    paymentCreate: '/payment/create',
    paymentVerify: '/payment/verify',
    paymentHistory: '/payment/history',
}

export default endpointConfig
