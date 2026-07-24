import dayjs from 'dayjs';
import type { DashboardData, PeriodType, StatItem, InstitutionAllocation, InstitutionDetail, CourseActivitySummary, CourseInstitutionDetail, StudentInstSummary, StudentDeptSummary, StudentCourseSummary, StudentDetailRow } from './types';

// Clean Mock Database grouped by period.
// When connecting to an API, replace this with a hook (e.g. useQuery) return value.
// No layout or component changes will be needed.
export const DASHBOARD_DATA_BY_PERIOD: Record<PeriodType, DashboardData> = {
    weekly: {
        lastUpdated: dayjs().format('MMMM D, YYYY'),
        stats: [
            { label: 'Total Institute', value: 6, change: '+2.02%', isPositive: true },
            { label: 'Active Licenses', value: 1980, change: '-9.12%', isPositive: false },
            { label: 'Total Students', value: 5790, change: '+12.07%', isPositive: true },
            { label: 'Total enCODE Instructors', value: 217, change: '+2%', isPositive: true },
            { label: 'Total Contract Value', value: '₹25,32,549' },
            { label: 'Total Internal Faculty', value: 75 },
        ],
        growthTrends: [
            { month: 'Jan 26', enrolled: 2800 },
            { month: 'Feb 26', enrolled: 4800 },
            { month: 'Mar 26', enrolled: 5200 },
            { month: 'Apr 26', enrolled: 5300 },
        ],
        progressDistribution: [
            { name: 'Completed', value: 31, color: '#009BD8' },
            { name: 'Not Started', value: 18, color: '#FFEC00' },
            { name: 'In Progress', value: 51, color: '#E60086' },
        ],
        topInstitutions: [
            { rank: 1, name: 'Tech Valley Institute', location: 'San Jose, California', studentsEnrolled: 1100, internalFaculty: 45, completionRate: 78 },
            { rank: 2, name: 'Stanford University', location: 'Stanford, California', studentsEnrolled: 1250, internalFaculty: 32, completionRate: 72 },
            { rank: 3, name: 'Global Business School', location: 'New York, USA', studentsEnrolled: 1580, internalFaculty: 40, completionRate: 70 },
            { rank: 4, name: 'MIT College of Technology', location: 'Cambridge, Massachusetts', studentsEnrolled: 890, internalFaculty: 25, completionRate: 62 },
            { rank: 5, name: 'Central High School', location: 'Austin, Texas', studentsEnrolled: 450, internalFaculty: 17, completionRate: 55 },
        ],
    },
    monthly: {
        lastUpdated: dayjs().format('MMMM D, YYYY'),
        stats: [
            { label: 'Total Institute', value: 6, change: '+5.40%', isPositive: true },
            { label: 'Active Licenses', value: 2100, change: '+4.80%', isPositive: true },
            { label: 'Total Students', value: 5920, change: '+15.20%', isPositive: true },
            { label: 'Total enCODE Instructors', value: 225, change: '+5.6%', isPositive: true },
            { label: 'Total Contract Value', value: '₹28,45,000' },
            { label: 'Total Internal Faculty', value: 78 },
        ],
        growthTrends: [
            { month: 'Jan 26', enrolled: 2500 },
            { month: 'Feb 26', enrolled: 4200 },
            { month: 'Mar 26', enrolled: 4900 },
            { month: 'Apr 26', enrolled: 5600 },
        ],
        progressDistribution: [
            { name: 'Completed', value: 35, color: '#009BD8' },
            { name: 'Not Started', value: 15, color: '#FFEC00' },
            { name: 'In Progress', value: 50, color: '#E60086' },
        ],
        topInstitutions: [
            { rank: 1, name: 'Tech Valley Institute', location: 'San Jose, California', studentsEnrolled: 1150, internalFaculty: 46, completionRate: 82 },
            { rank: 2, name: 'Stanford University', location: 'Stanford, California', studentsEnrolled: 1280, internalFaculty: 34, completionRate: 76 },
            { rank: 3, name: 'Global Business School', location: 'New York, USA', studentsEnrolled: 1600, internalFaculty: 42, completionRate: 71 },
            { rank: 4, name: 'MIT College of Technology', location: 'Cambridge, Massachusetts', studentsEnrolled: 910, internalFaculty: 26, completionRate: 65 },
            { rank: 5, name: 'Central High School', location: 'Austin, Texas', studentsEnrolled: 470, internalFaculty: 18, completionRate: 58 },
        ],
    },
    yearly: {
        lastUpdated: dayjs().format('MMMM D, YYYY'),
        stats: [
            { label: 'Total Institute', value: 8, change: '+20.00%', isPositive: true },
            { label: 'Active Licenses', value: 2500, change: '+25.00%', isPositive: true },
            { label: 'Total Students', value: 7200, change: '+35.40%', isPositive: true },
            { label: 'Total enCODE Instructors', value: 250, change: '+18.2%', isPositive: true },
            { label: 'Total Contract Value', value: '₹35,00,000' },
            { label: 'Total Internal Faculty', value: 90 },
        ],
        growthTrends: [
            { month: 'Jan 26', enrolled: 2000 },
            { month: 'Feb 26', enrolled: 3500 },
            { month: 'Mar 26', enrolled: 4500 },
            { month: 'Apr 26', enrolled: 6200 },
        ],
        progressDistribution: [
            { name: 'Completed', value: 45, color: '#009BD8' },
            { name: 'Not Started', value: 10, color: '#FFEC00' },
            { name: 'In Progress', value: 45, color: '#E60086' },
        ],
        topInstitutions: [
            { rank: 1, name: 'Tech Valley Institute', location: 'San Jose, California', studentsEnrolled: 1300, internalFaculty: 50, completionRate: 88 },
            { rank: 2, name: 'Stanford University', location: 'Stanford, California', studentsEnrolled: 1400, internalFaculty: 38, completionRate: 80 },
            { rank: 3, name: 'Global Business School', location: 'New York, USA', studentsEnrolled: 1800, internalFaculty: 45, completionRate: 76 },
            { rank: 4, name: 'MIT College of Technology', location: 'Cambridge, Massachusetts', studentsEnrolled: 1000, internalFaculty: 28, completionRate: 70 },
            { rank: 5, name: 'Central High School', location: 'Austin, Texas', studentsEnrolled: 500, internalFaculty: 20, completionRate: 64 },
        ],
    },
};

// --- INSTITUTIONS & LICENSES TAB DATA ---

export const INST_LIST_STATS: StatItem[] = [
    { label: 'Total Licenses Sold', value: 2250 },
    { label: 'Active Licenses', value: 1980 },
    { label: 'Total Available Licenses', value: 270 },
    { label: 'License Utilization', value: '88%' }
];

export const INSTITUTION_ALLOCATIONS: InstitutionAllocation[] = [
    { id: 'INST-001', name: 'Stanford University', type: 'University', location: 'Stanford, California', licensesSold: 450, licensesTotal: 500, studentsCount: 450, facultyCount: 45, utilization: 90, engagement: 'High' },
    { id: 'INST-002', name: 'MIT College of Technology', type: 'College', location: 'Cambridge, Massachusetts', licensesSold: 280, licensesTotal: 300, studentsCount: 280, facultyCount: 32, utilization: 75, engagement: 'Medium' },
    { id: 'INST-003', name: 'Tech Valley Institute', type: 'Institute', location: 'Austin, Texas', licensesSold: 180, licensesTotal: 250, studentsCount: 180, facultyCount: 18, utilization: 23, engagement: 'Low' },
    { id: 'INST-004', name: 'Tech Valley Institute', type: 'Institute', location: 'San Jose, California', licensesSold: 380, licensesTotal: 400, studentsCount: 1100, facultyCount: 38, utilization: 95, engagement: 'High' },
    { id: 'INST-005', name: 'Stanford University', type: 'University', location: 'Stanford, California', licensesSold: 450, licensesTotal: 500, studentsCount: 1250, facultyCount: 45, utilization: 90, engagement: 'High' },
    { id: 'INST-006', name: 'Stanford University', type: 'University', location: 'Stanford, California', licensesSold: 450, licensesTotal: 500, studentsCount: 1250, facultyCount: 45, utilization: 90, engagement: 'High' },
];

export const INSTITUTION_DETAILS: Record<string, InstitutionDetail> = {
    'INST-001': {
        id: 'INST-001',
        name: 'Stanford University',
        location: 'Stanford, California',
        image: '/img/tech_institute_building.png',
        studentsCompleted: 405,
        studentsInProgress: 45,
        studentsNotStarted: 50,
        totalLicenses: 500,
        allocatedLicenses: 450,
        basicInfo: {
            type: 'University',
            location: 'Stanford, California, USA',
            dateOnboarded: 'September 15, 2022',
            lastPlatformActivity: 'March 15, 2024',
            email: 'admin@stanford.edu',
            phone: '+1 650-723-2300'
        },
        licensesUsers: {
            totalPurchased: 500,
            activated: 450,
            available: 50,
            explorer: 150,
            builder: 200,
            navigator: 100,
            studentsEnrolled: 1250,
            internalFaculty: 45,
            coursesAssigned: '140 of 150 Available'
        },
        courseActivity: {
            mostActive: 'Computer Science Basics',
            leastActive: 'Visual Design',
            totalAvailable: 150,
            avgCompletion: 90
        },
        engagementContract: {
            status: 'HIGH',
            contractValue: '₹7,50,000',
            renewalDate: '15 September, 2024',
            daysUntilRenewal: 372
        }
    },
    'INST-002': {
        id: 'INST-002',
        name: 'MIT College of Technology',
        location: 'Cambridge, Massachusetts',
        image: '/img/tech_institute_building.png',
        studentsCompleted: 210,
        studentsInProgress: 70,
        studentsNotStarted: 20,
        totalLicenses: 300,
        allocatedLicenses: 280,
        basicInfo: {
            type: 'College',
            location: 'Cambridge, Massachusetts, USA',
            dateOnboarded: 'October 12, 2023',
            lastPlatformActivity: 'March 14, 2024',
            email: 'info@mit.edu',
            phone: '+1 617-253-1000'
        },
        licensesUsers: {
            totalPurchased: 300,
            activated: 280,
            available: 20,
            explorer: 100,
            builder: 100,
            navigator: 80,
            studentsEnrolled: 890,
            internalFaculty: 25,
            coursesAssigned: '110 of 150 Available'
        },
        courseActivity: {
            mostActive: 'Engineering Math',
            leastActive: 'Intro to Art',
            totalAvailable: 150,
            avgCompletion: 75
        },
        engagementContract: {
            status: 'MEDIUM',
            contractValue: '₹4,20,000',
            renewalDate: '12 October, 2024',
            daysUntilRenewal: 400
        }
    },
    'INST-003': {
        id: 'INST-003',
        name: 'Tech Valley Institute',
        location: 'Austin, Texas',
        image: '/img/tech_institute_building.png',
        studentsCompleted: 40,
        studentsInProgress: 100,
        studentsNotStarted: 40,
        totalLicenses: 250,
        allocatedLicenses: 180,
        basicInfo: {
            type: 'Institute',
            location: 'Austin, Texas, USA',
            dateOnboarded: 'January 10, 2024',
            lastPlatformActivity: 'March 11, 2024',
            email: 'austin@techvalley.com',
            phone: '+1 512-555-0199'
        },
        licensesUsers: {
            totalPurchased: 250,
            activated: 180,
            available: 70,
            explorer: 60,
            builder: 60,
            navigator: 60,
            studentsEnrolled: 180,
            internalFaculty: 18,
            coursesAssigned: '45 of 150 Available'
        },
        courseActivity: {
            mostActive: 'Introduction to Coding',
            leastActive: 'Photography',
            totalAvailable: 150,
            avgCompletion: 23
        },
        engagementContract: {
            status: 'LOW',
            contractValue: '₹2,50,000',
            renewalDate: '10 January, 2025',
            daysUntilRenewal: 556
        }
    },
    'INST-004': {
        id: 'INST-004',
        name: 'Tech Valley Institute',
        location: 'San Jose, California',
        image: '/img/tech_institute_building.png',
        studentsCompleted: 450,
        studentsInProgress: 520,
        studentsNotStarted: 130,
        totalLicenses: 400,
        allocatedLicenses: 380,
        basicInfo: {
            type: 'Institute',
            location: 'San Jose, California, USA',
            dateOnboarded: 'December 10, 2023',
            lastPlatformActivity: 'March 12, 2024',
            email: 'contact@techvalley.com',
            phone: '+1 408-555-0100'
        },
        licensesUsers: {
            totalPurchased: 400,
            activated: 380,
            available: 20,
            explorer: 120,
            builder: 120,
            navigator: 160,
            studentsEnrolled: 1100,
            internalFaculty: 38,
            coursesAssigned: '120 of 150 Available'
        },
        courseActivity: {
            mostActive: 'Adobe Tools & Applications-1',
            leastActive: 'Photography',
            totalAvailable: 150,
            avgCompletion: 78
        },
        engagementContract: {
            status: 'HIGH',
            contractValue: '₹5,00,000',
            renewalDate: '10 December, 2024',
            daysUntilRenewal: 458
        }
    },
    'INST-005': {
        id: 'INST-005',
        name: 'Stanford University',
        location: 'Stanford, California',
        image: '/img/tech_institute_building.png',
        studentsCompleted: 405,
        studentsInProgress: 45,
        studentsNotStarted: 50,
        totalLicenses: 500,
        allocatedLicenses: 450,
        basicInfo: {
            type: 'University',
            location: 'Stanford, California, USA',
            dateOnboarded: 'September 15, 2022',
            lastPlatformActivity: 'March 15, 2024',
            email: 'admin@stanford.edu',
            phone: '+1 650-723-2300'
        },
        licensesUsers: {
            totalPurchased: 500,
            activated: 450,
            available: 50,
            explorer: 150,
            builder: 200,
            navigator: 100,
            studentsEnrolled: 1250,
            internalFaculty: 45,
            coursesAssigned: '140 of 150 Available'
        },
        courseActivity: {
            mostActive: 'Computer Science Basics',
            leastActive: 'Visual Design',
            totalAvailable: 150,
            avgCompletion: 90
        },
        engagementContract: {
            status: 'HIGH',
            contractValue: '₹7,50,000',
            renewalDate: '15 September, 2024',
            daysUntilRenewal: 372
        }
    },
    'INST-006': {
        id: 'INST-006',
        name: 'Stanford University',
        location: 'Stanford, California',
        image: '/img/tech_institute_building.png',
        studentsCompleted: 405,
        studentsInProgress: 45,
        studentsNotStarted: 50,
        totalLicenses: 500,
        allocatedLicenses: 450,
        basicInfo: {
            type: 'University',
            location: 'Stanford, California, USA',
            dateOnboarded: 'September 15, 2022',
            lastPlatformActivity: 'March 15, 2024',
            email: 'admin@stanford.edu',
            phone: '+1 650-723-2300'
        },
        licensesUsers: {
            totalPurchased: 500,
            activated: 450,
            available: 50,
            explorer: 150,
            builder: 200,
            navigator: 100,
            studentsEnrolled: 1250,
            internalFaculty: 45,
            coursesAssigned: '140 of 150 Available'
        },
        courseActivity: {
            mostActive: 'Computer Science Basics',
            leastActive: 'Visual Design',
            totalAvailable: 150,
            avgCompletion: 90
        },
        engagementContract: {
            status: 'HIGH',
            contractValue: '₹7,50,000',
            renewalDate: '15 September, 2024',
            daysUntilRenewal: 372
        }
    }
};

// --- COURSE PERFORMANCE TAB DATA ---

export const COURSE_PERFORMANCE_STATS: StatItem[] = [
    { label: 'Total Courses', value: 650, change: '+2.02%', isPositive: true },
    { label: 'Assigned Courses', value: 492, change: '-9.12%', isPositive: false },
    { label: 'Course Running', value: 492, change: '+12.07%', isPositive: true },
    { label: 'Average Completion', value: '64%' }
];

export const COURSE_ACTIVITY_SUMMARIES: CourseActivitySummary[] = [
    {
        institutionId: 'INST-001',
        institutionName: 'Stanford University',
        institutionLocation: 'Stanford, California',
        coursesAvailable: 120,
        coursesAssigned: 80,
        coursesRunning: 75,
        mostActiveCourse: 'Adobe Tools & Applications-1',
        leastActiveCourse: 'Photography'
    },
    {
        institutionId: 'INST-002',
        institutionName: 'MIT College of Technology',
        institutionLocation: 'Cambridge, Massachusetts',
        coursesAvailable: 150,
        coursesAssigned: 110,
        coursesRunning: 90,
        mostActiveCourse: 'Engineering Math',
        leastActiveCourse: 'Intro to Art'
    },
    {
        institutionId: 'INST-003',
        institutionName: 'Tech Valley Institute',
        institutionLocation: 'Austin, Texas',
        coursesAvailable: 100,
        coursesAssigned: 60,
        coursesRunning: 45,
        mostActiveCourse: 'Introduction to Coding',
        leastActiveCourse: 'Photography'
    },
    {
        institutionId: 'INST-004',
        institutionName: 'Tech Valley Institute',
        institutionLocation: 'San Jose, California',
        coursesAvailable: 140,
        coursesAssigned: 120,
        coursesRunning: 75,
        mostActiveCourse: 'Adobe Tools & Applications-1',
        leastActiveCourse: 'Photography'
    },
    {
        institutionId: 'INST-005',
        institutionName: 'Stanford University',
        institutionLocation: 'Stanford, California',
        coursesAvailable: 120,
        coursesAssigned: 80,
        coursesRunning: 75,
        mostActiveCourse: 'Adobe Tools & Applications-1',
        leastActiveCourse: 'Photography'
    },
    {
        institutionId: 'INST-006',
        institutionName: 'Stanford University',
        institutionLocation: 'Stanford, California',
        coursesAvailable: 120,
        coursesAssigned: 80,
        coursesRunning: 75,
        mostActiveCourse: 'Adobe Tools & Applications-1',
        leastActiveCourse: 'Photography'
    }
];

export const COURSE_INSTITUTION_DETAILS: Record<string, CourseInstitutionDetail> = {
    'INST-001': {
        institutionId: 'INST-001',
        institutionName: 'Stanford University',
        institutionLocation: 'Stanford, California',
        image: '/img/tech_institute_building.png',
        runningCoursesCount: 75,
        totalEnrollments: 10540,
        avgCompletionRate: 71,
        allocatedCourses: 80,
        totalCourses: 120,
        coursesList: [
            { id: 'CS-001', name: 'Adobe Tools & Design Application-1', domain: 'Graphic Design', module: 'Self Paced', duration: '48 Hours', status: 'Running', instructor: 'Dr. Sarah Johnson', enrolled: 145, completion: 90 },
            { id: 'CS-002', name: 'Adobe Tools & Design Application-2', domain: 'Graphic Design', module: 'Live Online', duration: '72 Hours', status: 'Completed', instructor: 'Dr. Garima Agarwal', enrolled: 75, completion: 100 },
            { id: 'CS-003', name: 'Typography & Prototyping', domain: 'UI/UX Design', module: 'In-Class', duration: '142 Hours', status: 'Not Assigned', instructor: 'John Doe', enrolled: 145, completion: 0 },
            { id: 'CS-004', name: 'Adobe Tools & Design Application-1', domain: 'Graphic Design', module: 'Self-Paced', duration: '48 Hours', status: 'Running', instructor: 'Dr. Sarah Johnson', enrolled: 145, completion: 90 },
            { id: 'CS-005', name: 'Adobe Tools & Design Application-1', domain: 'Graphic Design', module: 'Self-Paced', duration: '48 Hours', status: 'Running', instructor: 'Dr. Sarah Johnson', enrolled: 145, completion: 90 }
        ]
    },
    'INST-002': {
        institutionId: 'INST-002',
        institutionName: 'MIT College of Technology',
        institutionLocation: 'Cambridge, Massachusetts',
        image: '/img/tech_institute_building.png',
        runningCoursesCount: 90,
        totalEnrollments: 8900,
        avgCompletionRate: 68,
        allocatedCourses: 110,
        totalCourses: 150,
        coursesList: [
            { id: 'CS-101', name: 'Engineering Mathematics', domain: 'Mathematics', module: 'Live Online', duration: '60 Hours', status: 'Running', instructor: 'Prof. Alan Turing', enrolled: 210, completion: 75 },
            { id: 'CS-102', name: 'Introduction to Physics', domain: 'Physics', module: 'Self Paced', duration: '45 Hours', status: 'Completed', instructor: 'Dr. Marie Curie', enrolled: 180, completion: 100 },
            { id: 'CS-103', name: 'Art and Design Appreciation', domain: 'Humanities', module: 'In-Class', duration: '30 Hours', status: 'Not Assigned', instructor: 'Jane Smith', enrolled: 50, completion: 0 }
        ]
    },
    'INST-003': {
        institutionId: 'INST-003',
        institutionName: 'Tech Valley Institute',
        institutionLocation: 'Austin, Texas',
        image: '/img/tech_institute_building.png',
        runningCoursesCount: 45,
        totalEnrollments: 3400,
        avgCompletionRate: 55,
        allocatedCourses: 60,
        totalCourses: 100,
        coursesList: [
            { id: 'CS-201', name: 'Introduction to Coding', domain: 'Computer Science', module: 'Self Paced', duration: '40 Hours', status: 'Running', instructor: 'Dr. Ada Lovelace', enrolled: 180, completion: 80 },
            { id: 'CS-202', name: 'Advanced Photography', domain: 'Arts', module: 'In-Class', duration: '50 Hours', status: 'Not Assigned', instructor: 'John Miller', enrolled: 40, completion: 0 }
        ]
    },
    'INST-004': {
        institutionId: 'INST-004',
        institutionName: 'Tech Valley Institute',
        institutionLocation: 'San Jose, California',
        image: '/img/tech_institute_building.png',
        runningCoursesCount: 75,
        totalEnrollments: 11200,
        avgCompletionRate: 74,
        allocatedCourses: 120,
        totalCourses: 140,
        coursesList: [
            { id: 'CS-301', name: 'Adobe Tools & Design Application-1', domain: 'Graphic Design', module: 'Self Paced', duration: '48 Hours', status: 'Running', instructor: 'Dr. Sarah Johnson', enrolled: 145, completion: 90 },
            { id: 'CS-302', name: 'Adobe Tools & Design Application-2', domain: 'Graphic Design', module: 'Live Online', duration: '72 Hours', status: 'Completed', instructor: 'Dr. Garima Agarwal', enrolled: 75, completion: 100 },
            { id: 'CS-303', name: 'Typography & Prototyping', domain: 'UI/UX Design', module: 'In-Class', duration: '142 Hours', status: 'Not Assigned', instructor: 'John Doe', enrolled: 145, completion: 0 }
        ]
    },
    'INST-005': {
        institutionId: 'INST-005',
        institutionName: 'Stanford University',
        institutionLocation: 'Stanford, California',
        image: '/img/tech_institute_building.png',
        runningCoursesCount: 75,
        totalEnrollments: 10540,
        avgCompletionRate: 71,
        allocatedCourses: 80,
        totalCourses: 120,
        coursesList: [
            { id: 'CS-001', name: 'Adobe Tools & Design Application-1', domain: 'Graphic Design', module: 'Self Paced', duration: '48 Hours', status: 'Running', instructor: 'Dr. Sarah Johnson', enrolled: 145, completion: 90 },
            { id: 'CS-002', name: 'Adobe Tools & Design Application-2', domain: 'Graphic Design', module: 'Live Online', duration: '72 Hours', status: 'Completed', instructor: 'Dr. Garima Agarwal', enrolled: 75, completion: 100 },
            { id: 'CS-003', name: 'Typography & Prototyping', domain: 'UI/UX Design', module: 'In-Class', duration: '142 Hours', status: 'Not Assigned', instructor: 'John Doe', enrolled: 145, completion: 0 }
        ]
    },
    'INST-006': {
        institutionId: 'INST-006',
        institutionName: 'Stanford University',
        institutionLocation: 'Stanford, California',
        image: '/img/tech_institute_building.png',
        runningCoursesCount: 75,
        totalEnrollments: 10540,
        avgCompletionRate: 71,
        allocatedCourses: 80,
        totalCourses: 120,
        coursesList: [
            { id: 'CS-001', name: 'Adobe Tools & Design Application-1', domain: 'Graphic Design', module: 'Self Paced', duration: '48 Hours', status: 'Running', instructor: 'Dr. Sarah Johnson', enrolled: 145, completion: 90 },
            { id: 'CS-002', name: 'Adobe Tools & Design Application-2', domain: 'Graphic Design', module: 'Live Online', duration: '72 Hours', status: 'Completed', instructor: 'Dr. Garima Agarwal', enrolled: 75, completion: 100 },
            { id: 'CS-003', name: 'Typography & Prototyping', domain: 'UI/UX Design', module: 'In-Class', duration: '142 Hours', status: 'Not Assigned', instructor: 'John Doe', enrolled: 145, completion: 0 }
        ]
    }
};

// --- STUDENT ANALYTICS TAB DATA ---

export const STUDENT_ANALYTICS_STATS: StatItem[] = [
    { label: 'Total Students', value: 5790, change: '+2.02%', isPositive: true },
    { label: 'Completed (100%)', value: 1775, change: '-9.12%', isPositive: false },
    { label: 'In Progress', value: 2970, change: '+12.07%', isPositive: true },
    { label: 'Not Started Yet', value: 1045 }
];

export const STUDENT_INST_SUMMARIES: StudentInstSummary[] = [
    {
        institutionId: 'INST-001',
        institutionName: 'Stanford University',
        institutionLocation: 'Stanford, California',
        totalEnrolled: 1250,
        facultyCount: 45,
        completedCount: 320,
        inProgressCount: 680,
        notStartedCount: 250
    },
    {
        institutionId: 'INST-002',
        institutionName: 'MIT College of Technology',
        institutionLocation: 'Cambridge, Massachusetts',
        totalEnrolled: 1000,
        facultyCount: 30,
        completedCount: 250,
        inProgressCount: 550,
        notStartedCount: 200
    },
    {
        institutionId: 'INST-003',
        institutionName: 'Tech Valley Institute',
        institutionLocation: 'Austin, Texas',
        totalEnrolled: 800,
        facultyCount: 22,
        completedCount: 180,
        inProgressCount: 420,
        notStartedCount: 200
    },
    {
        institutionId: 'INST-004',
        institutionName: 'Tech Valley Institute',
        institutionLocation: 'San Jose, California',
        totalEnrolled: 1100,
        facultyCount: 38,
        completedCount: 300,
        inProgressCount: 580,
        notStartedCount: 220
    },
    {
        institutionId: 'INST-005',
        institutionName: 'Stanford University',
        institutionLocation: 'Stanford, California',
        totalEnrolled: 1250,
        facultyCount: 45,
        completedCount: 320,
        inProgressCount: 680,
        notStartedCount: 250
    },
    {
        institutionId: 'INST-006',
        institutionName: 'Stanford University',
        institutionLocation: 'Stanford, California',
        totalEnrolled: 1250,
        facultyCount: 45,
        completedCount: 320,
        inProgressCount: 680,
        notStartedCount: 250
    }
];

export const STUDENT_DEPT_SUMMARIES: Record<string, StudentDeptSummary[]> = {
    'INST-001': [
        { departmentId: 'CSE', departmentName: 'Computer Science & Engineering', hodName: 'Dr. Sarah Johnson', coursesAlignedCount: 12, studentsEnrolledCount: 457, facultyCount: 11, avgCompletionRate: 90 },
        { departmentId: 'IT', departmentName: 'Information Technology', hodName: 'Emily Williams', coursesAlignedCount: 12, studentsEnrolledCount: 418, facultyCount: 15, avgCompletionRate: 58 },
        { departmentId: 'CE', departmentName: 'Civil Engineering', hodName: 'Dr. David Brown', coursesAlignedCount: 7, studentsEnrolledCount: 306, facultyCount: 9, avgCompletionRate: 23 },
        { departmentId: 'ME', departmentName: 'Mechanical Engineering', hodName: 'Dr. Sarah Johnson', coursesAlignedCount: 12, studentsEnrolledCount: 457, facultyCount: 11, avgCompletionRate: 90 }
    ],
    'INST-002': [
        { departmentId: 'CSE', departmentName: 'Computer Science & Engineering', hodName: 'Dr. Sarah Johnson', coursesAlignedCount: 10, studentsEnrolledCount: 400, facultyCount: 8, avgCompletionRate: 85 },
        { departmentId: 'IT', departmentName: 'Information Technology', hodName: 'Emily Williams', coursesAlignedCount: 10, studentsEnrolledCount: 350, facultyCount: 12, avgCompletionRate: 60 },
        { departmentId: 'CE', departmentName: 'Civil Engineering', hodName: 'Dr. David Brown', coursesAlignedCount: 6, studentsEnrolledCount: 250, facultyCount: 10, avgCompletionRate: 30 }
    ],
    'INST-003': [
        { departmentId: 'CSE', departmentName: 'Computer Science & Engineering', hodName: 'Dr. Sarah Johnson', coursesAlignedCount: 8, studentsEnrolledCount: 320, facultyCount: 6, avgCompletionRate: 80 },
        { departmentId: 'IT', departmentName: 'Information Technology', hodName: 'Emily Williams', coursesAlignedCount: 8, studentsEnrolledCount: 280, facultyCount: 10, avgCompletionRate: 55 },
        { departmentId: 'CE', departmentName: 'Civil Engineering', hodName: 'Dr. David Brown', coursesAlignedCount: 5, studentsEnrolledCount: 200, facultyCount: 6, avgCompletionRate: 40 }
    ],
    'INST-004': [
        { departmentId: 'CSE', departmentName: 'Computer Science & Engineering', hodName: 'Dr. Sarah Johnson', coursesAlignedCount: 12, studentsEnrolledCount: 457, facultyCount: 11, avgCompletionRate: 90 },
        { departmentId: 'IT', departmentName: 'Information Technology', hodName: 'Emily Williams', coursesAlignedCount: 12, studentsEnrolledCount: 418, facultyCount: 15, avgCompletionRate: 58 },
        { departmentId: 'CE', departmentName: 'Civil Engineering', hodName: 'Dr. David Brown', coursesAlignedCount: 7, studentsEnrolledCount: 306, facultyCount: 9, avgCompletionRate: 23 }
    ],
    'INST-005': [
        { departmentId: 'CSE', departmentName: 'Computer Science & Engineering', hodName: 'Dr. Sarah Johnson', coursesAlignedCount: 12, studentsEnrolledCount: 457, facultyCount: 11, avgCompletionRate: 90 },
        { departmentId: 'IT', departmentName: 'Information Technology', hodName: 'Emily Williams', coursesAlignedCount: 12, studentsEnrolledCount: 418, facultyCount: 15, avgCompletionRate: 58 },
        { departmentId: 'CE', departmentName: 'Civil Engineering', hodName: 'Dr. David Brown', coursesAlignedCount: 7, studentsEnrolledCount: 306, facultyCount: 9, avgCompletionRate: 23 }
    ],
    'INST-006': [
        { departmentId: 'CSE', departmentName: 'Computer Science & Engineering', hodName: 'Dr. Sarah Johnson', coursesAlignedCount: 12, studentsEnrolledCount: 457, facultyCount: 11, avgCompletionRate: 90 },
        { departmentId: 'IT', departmentName: 'Information Technology', hodName: 'Emily Williams', coursesAlignedCount: 12, studentsEnrolledCount: 418, facultyCount: 15, avgCompletionRate: 58 },
        { departmentId: 'CE', departmentName: 'Civil Engineering', hodName: 'Dr. David Brown', coursesAlignedCount: 7, studentsEnrolledCount: 306, facultyCount: 9, avgCompletionRate: 23 }
    ]
};

export const STUDENT_COURSE_SUMMARIES: Record<string, StudentCourseSummary[]> = {
    'INST-001_CSE': [
        { courseId: 'CSE112', courseName: 'Adobe Tools & Application Design-1', module: 'Self Paced', instructorName: 'Jennifer Davis', studentsEnrolledCount: 457, duration: '52 Hours', completionRate: 90 },
        { courseId: 'CSE113', courseName: 'Adobe Tools & Application Design-1', module: 'Self Paced', instructorName: 'Jennifer Davis', studentsEnrolledCount: 457, duration: '52 Hours', completionRate: 90 },
        { courseId: 'CSE114', courseName: 'Adobe Tools & Application Design-1', module: 'Self Paced', instructorName: 'Jennifer Davis', studentsEnrolledCount: 457, duration: '52 Hours', completionRate: 90 },
        { courseId: 'CSE115', courseName: 'Adobe Tools & Application Design-1', module: 'Self Paced', instructorName: 'Jennifer Davis', studentsEnrolledCount: 457, duration: '52 Hours', completionRate: 90 },
        { courseId: 'CSE116', courseName: 'Adobe Tools & Application Design-1', module: 'Self Paced', instructorName: 'Jennifer Davis', studentsEnrolledCount: 457, duration: '52 Hours', completionRate: 90 },
        { courseId: 'CSE117', courseName: 'Adobe Tools & Application Design-1', module: 'Self Paced', instructorName: 'Jennifer Davis', studentsEnrolledCount: 457, duration: '52 Hours', completionRate: 90 }
    ],
    'INST-001_IT': [
        { courseId: 'IT101', courseName: 'Database Management Systems', module: 'Self Paced', instructorName: 'Dr. John Miller', studentsEnrolledCount: 418, duration: '45 Hours', completionRate: 58 },
        { courseId: 'IT102', courseName: 'Web Technologies', module: 'Live Online', instructorName: 'Prof. Alice Green', studentsEnrolledCount: 418, duration: '60 Hours', completionRate: 65 }
    ],
    'INST-001_CE': [
        { courseId: 'CE201', courseName: 'Structural Analysis-1', module: 'In-Class', instructorName: 'Dr. David Brown', studentsEnrolledCount: 306, duration: '75 Hours', completionRate: 23 }
    ],
    'INST-001_ME': [
        { courseId: 'ME301', courseName: 'Thermodynamics-1', module: 'Self Paced', instructorName: 'Jennifer Davis', studentsEnrolledCount: 457, duration: '52 Hours', completionRate: 90 }
    ]
};

export const STUDENT_DETAIL_ROWS: Record<string, StudentDetailRow[]> = {
    'INST-001_CSE_CSE112': [
        { studentName: 'Rahul Jaykar', studentEmail: 'rahuljaykar@stanford.edu', status: 'Completed', assignmentsFraction: '4/4', progressPercentage: 100, grade: 'A+', lastActive: '4 hours' },
        { studentName: 'Robert Gracia', studentEmail: 'robertgracia@stanford.edu', status: 'In Progress', assignmentsFraction: '2/4', progressPercentage: 50, grade: '-', lastActive: '2 hours' },
        { studentName: 'Robert Gracia', studentEmail: 'robertgracia@stanford.edu', status: 'In Progress', assignmentsFraction: '2/4', progressPercentage: 50, grade: '-', lastActive: '2 hours' },
        { studentName: 'Robert Gracia', studentEmail: 'robertgracia@stanford.edu', status: 'In Progress', assignmentsFraction: '2/4', progressPercentage: 50, grade: '-', lastActive: '2 hours' }
    ]
};


