// Define the shape of our dashboard data so it can be easily mapped to API responses.
export interface StatItem {
    label: string;
    value: string | number;
    change?: string;
    isPositive?: boolean;
}

export interface GrowthTrend {
    month: string;
    enrolled: number;
}

export interface ProgressSegment {
    name: string;
    value: number;
    color: string;
    count?: number;
}

export interface InstitutionRank {
    rank: number;
    name: string;
    location: string;
    studentsEnrolled: number;
    internalFaculty: number;
    completionRate: number;
}

export interface DashboardData {
    lastUpdated: string;
    stats: StatItem[];
    growthTrends: GrowthTrend[];
    progressDistribution: ProgressSegment[];
    topInstitutions: InstitutionRank[];
}

export type PeriodType = 'weekly' | 'monthly' | 'yearly';

export type TabType =
    | 'overview'
    | 'institutions_licenses'
    | 'course_performance'
    | 'students_analytics';

export const TABS: { id: TabType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'institutions_licenses', label: 'Institutions & Licenses' },
    { id: 'course_performance', label: 'Course Performance' },
    { id: 'students_analytics', label: 'Students Analytics' },
];

export const PERIODS: PeriodType[] = ['weekly', 'monthly', 'yearly'];

// --- INSTITUTIONS & LICENSES STRUCTURES ---

export interface InstitutionAllocation {
    id: string;
    name: string;
    type: 'University' | 'College' | 'Institute';
    location: string;
    licensesSold: number;
    licensesTotal: number;
    studentsCount: number;
    facultyCount: number;
    utilization: number;
    engagement: 'High' | 'Medium' | 'Low';
}

export interface InstitutionDetail {
    id: string;
    name: string;
    location: string;
    image: string;
    studentsCompleted: number;
    studentsInProgress: number;
    studentsNotStarted: number;
    totalLicenses: number;
    allocatedLicenses: number;
    basicInfo: {
        type: string;
        location: string;
        dateOnboarded: string;
        lastPlatformActivity: string;
        email: string;
        phone: string;
    };
    licensesUsers: {
        totalPurchased: number;
        activated: number;
        available: number;
        explorer: number;
        builder: number;
        navigator: number;
        studentsEnrolled: number;
        internalFaculty: number;
        coursesAssigned: string;
    };
    courseActivity: {
        mostActive: string;
        leastActive: string;
        totalAvailable: number;
        avgCompletion: number;
    };
    engagementContract: {
        status: 'HIGH' | 'MEDIUM' | 'LOW';
        contractValue: string;
        renewalDate: string;
        daysUntilRenewal: number;
    };
}

// --- COURSE PERFORMANCE STRUCTURES ---

export interface CourseActivitySummary {
    institutionId: string;
    institutionName: string;
    institutionLocation: string;
    coursesAvailable: number;
    coursesAssigned: number;
    coursesRunning: number;
    mostActiveCourse: string;
    leastActiveCourse: string;
}

export interface CourseDetailItem {
    id: string;
    name: string;
    domain: string;
    module: string;
    duration: string;
    status: 'Running' | 'Completed' | 'Not Assigned';
    instructor: string;
    enrolled: number;
    completion: number;
}

export interface CourseInstitutionDetail {
    institutionId: string;
    institutionName: string;
    institutionLocation: string;
    image: string;
    runningCoursesCount: number;
    totalEnrollments: number;
    avgCompletionRate: number;
    allocatedCourses: number;
    totalCourses: number;
    coursesList: CourseDetailItem[];
}

// --- STUDENT ANALYTICS STRUCTURES ---

export interface StudentInstSummary {
    institutionId: string;
    institutionName: string;
    institutionLocation: string;
    totalEnrolled: number;
    facultyCount: number;
    completedCount: number;
    inProgressCount: number;
    notStartedCount: number;
}

export interface StudentDeptSummary {
    departmentId: string;
    departmentName: string;
    hodName: string;
    coursesAlignedCount: number;
    studentsEnrolledCount: number;
    facultyCount: number;
    avgCompletionRate: number;
}

export interface StudentCourseSummary {
    courseId: string;
    courseName: string;
    module: string;
    instructorName: string;
    studentsEnrolledCount: number;
    duration: string;
    completionRate: number;
}

export interface StudentDetailRow {
    studentName: string;
    studentEmail: string;
    status: 'Completed' | 'In Progress' | 'Not Started';
    assignmentsFraction: string;
    progressPercentage: number;
    grade: string;
    lastActive: string;
}


