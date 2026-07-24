// courseService.ts
import ApiService from '@/services/ApiService';
import axios from 'axios';
import { TOKEN_NAME_IN_STORAGE, TOKEN_TYPE, REQUEST_HEADER_AUTH_KEY } from '@/constants/api.constant';
import appConfig from '@/configs/app.config';
import cookiesStorage from '@/utils/cookiesStorage';
import {
    Course, CourseDetails, CoursesApiResponse, CourseDetailsApiResponse, CourseModule, CourseModuleApiResponse, getContinueReadingCoursesResponse, ProgramApiResponse, PreAssignCourse, ConetentCompletionApiResponse, CourseStatistics,
    CourseStatisticsApiResponse, AttendanceStatistics, AttendanceStatisticsApiResponse,
    ActiveHoursStatistics,
    ActiveHoursStatisticsApiResponse,
    EventStatistics,
    EventStatisticsApiResponse,
    ModeOfDeliveryResponse,
    CourseCategoryDomainApiResponse,
    CourseCategoryDomain,
    ContinuePreviousContent,
    ContinuePreviousContentApiResponse,
    CourseDetailsV2,
    CourseDeatilsV2ApiResponse,
    CourseInstructorAndCourseLeaderApiResponse,
    CourseInstructorAndCourseLeader,
    CourseSkilsAndJobRoles,
    CourseSkilsAndJobRolesApiResponse,
    CourseModuleV2,
    CourseModuleApiResponseV2,
    ProgramAndContentCertificateApiResponse,
    ProgramAndContentCertificate,
    EnrolledCourse,
    EnrolledCoursesApiResponse
} from '@/@types/learner/Courses';

// Fetch all courses

export async function fetchCourses(params?: URLSearchParams): Promise<CoursesApiResponse> {
    try {
        const newParams = new URLSearchParams(params);
        if (typeof window !== 'undefined' && window.location.pathname === '/getting-started/preferences' && window.location.search.includes('type=edit')) {
            newParams.append('creative', '1');
        }

        newParams.append('_t', Date.now().toString());

        const response = await ApiService.fetchDataWithAxios<CoursesApiResponse>({
            url: `/v1/course-list-v2`,
            method: 'get',
            params: newParams
        });
        return response
    } catch (error) {
        throw error as string;
    }
}

// recommended courses
export async function fetchRecommendedCourses(params?: URLSearchParams): Promise<CoursesApiResponse> {
    try {
        // Create a new URLSearchParams to avoid mutating the original
        const newParams = new URLSearchParams(params);
        newParams.append('my_recmd', '1');
        const response = await ApiService.fetchDataWithAxios<CoursesApiResponse>({
            url: `/v1/recommended-courses-v2`,
            method: 'get',
            params: newParams
        });
        return response
    } catch (error) {
        throw error as string;
    }
}

export async function fetchModes(params?: URLSearchParams): Promise<ModeOfDeliveryResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<ModeOfDeliveryResponse>({
            url: `/v1/program-delivery-mode`,
            method: 'get',
            params
        });
        return response;
    } catch (error) {
        throw error as string;
    }
}



// Fetch course by ID
export async function fetchCourseById(course_id: string | undefined): Promise<CourseDetails> {
    if (!course_id) {
        throw new Error('Course ID is required');
    }
    try {
        const response = await ApiService.fetchDataWithAxios<CourseDetailsApiResponse>({
            url: `/v1/get-course-details/${course_id}`,
            method: 'get',
            params: { _t: Date.now() }
        });
        return response.data
    } catch (error) {
        throw error as string;
    }
}

// course instructors
export async function fetchCourseInstructors(course_id: string | undefined): Promise<CourseInstructorAndCourseLeader> {
    if (!course_id) {
        throw new Error('Course ID is required');
    }
    try {
        const response = await ApiService.fetchDataWithAxios<CourseInstructorAndCourseLeaderApiResponse>({
            url: `/v1/course-instructor-leader/${course_id}`,
            method: 'get',
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchCourseSkillsAndJobRoles(course_id: string | undefined): Promise<CourseSkilsAndJobRoles> {
    if (!course_id) {
        throw new Error('Course ID is required');
    }
    try {
        const response = await ApiService.fetchDataWithAxios<CourseSkilsAndJobRolesApiResponse>({
            url: `/v1/course-skill-job-role/${course_id}`,
            method: 'get',
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// // v1/course-details-v2/5445
export async function fetchCourseByIdV2(course_id: string | undefined, cci?: string | null): Promise<CourseDetailsV2> {
    if (!course_id) {
        throw new Error('Course ID is required');
    }
    try {
        const params: any = cci ? { cci } : {};
        params._t = Date.now();
        const response = await ApiService.fetchDataWithAxios<CourseDeatilsV2ApiResponse>({
            url: `/v1/course-details-v2/${course_id}`,
            method: 'get',
            params,
        });
        return response.data
    } catch (error) {
        throw error as string;
    }
}


// v1/course-modules/5445
export async function featchCourseModules(course_id: string | undefined): Promise<CourseModuleV2[]> {
    if (!course_id) {
        throw new Error('Course ID is required');
    }
    try {
        const response = await ApiService.fetchDataWithAxios<CourseModuleApiResponseV2>({
            url: `/v1/course-modules/${course_id}`,
            method: 'get',
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}



// Fetch module by course and module ID
export async function fetchModuleByCourseId(module_id: string | undefined): Promise<CourseModule> {
    try {
        const response = await ApiService.fetchDataWithAxios<CourseModuleApiResponse>({
            url: `v1/module-content-list/${module_id}`,
            method: 'get',
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// fetchCourseAndContentCertificate
export async function fetchCourseAndContentCertificate(course_id: string | undefined): Promise<ProgramAndContentCertificate> {

    if (!course_id) {
        throw new Error('Course ID is required');
    }

    try {
        const response = await ApiService.fetchDataWithAxios<ProgramAndContentCertificateApiResponse>({
            url: `/v1/user-certificate-list`,
            method: 'get',
            params: {
                program_id: course_id
            }
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// Fetch continue reading courses
export async function fetchContinueReadingCourses(): Promise<Course[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<getContinueReadingCoursesResponse>({
            url: '/v1/courses/continue-reading',
            method: 'get',
        });
        return response.data.courses;
    } catch (error) {
        throw error as string;
    }
}



export async function preAssignedCourses(type?: string): Promise<PreAssignCourse[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<ProgramApiResponse>({
            url: `/learner/programs`,
            method: 'get',
        });
        return response?.data?.list ?? [];
    } catch (error) {
        throw error as string;
    }
}


// apply courses 
export async function saveUserCourseLead(params: { program_id: number, reason?: string, wp_center_id: number }): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<string>({
            url: '/user-course-lead',
            method: 'post',
            data: params
        });
        return response
    } catch (error) {
        throw error as string;
    }
}


// course timespan tracking
export async function saveCourseTimespan(params: { program_id: number, module_id: number, content_id: number, timestamp: number, flag: number }): Promise<any> {
    try {
        const response = await ApiService.fetchDataWithAxios<any>({
            url: `/learner/course-timespan`,
            method: 'post',
            data: params
        });
        return response;
    } catch (error) {
        throw error;
    }
}

// content completion service
export async function saveContentCompletion(formData: FormData): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<ConetentCompletionApiResponse>({
            url: `program-content-attempt`,
            method: 'post',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: formData as any,
        });

        try {
            const completion = formData.get('completion');
            const content_id = formData.get('content_id');
            if (completion === '100' && content_id) {
                const match = window.location.pathname.match(/\/courses\/(\d+)\/modules\/(\d+)/);
                if (match) {
                    saveCourseTimespan({
                        program_id: parseInt(match[1]),
                        module_id: parseInt(match[2]),
                        content_id: Number(content_id),
                        timestamp: Math.floor(Date.now() / 1000),
                        flag: 1
                    }).catch(err => console.error("Error saving timespan flag 1", err));
                }
            }
        } catch (e) {
            console.error("Error tracking course timespan flag 1", e);
        }

        return response.message;
    } catch (error) {
        throw error as string;
    }
}

// get content completion statistics
export async function getProgramsStatistics(filter: string): Promise<CourseStatistics> {
    try {
        const response = await ApiService.fetchDataWithAxios<CourseStatisticsApiResponse>({
            url: `/v1/programs/completion/statistics${filter ? `?duration=${filter}` : ''}`,
            method: 'get',
        });
        return response.data
    } catch (error) {
        throw error as string;
    }
}


// attendance-statistics
export async function getAttendanceStatistics(filter: string): Promise<AttendanceStatistics> {
    try {
        const response = await ApiService.fetchDataWithAxios<AttendanceStatisticsApiResponse>({
            url: `/v1/programs/completion/attendance-statistics${filter ? `?duration=${filter}` : ''}`,
            method: 'get',
        });
        return response.data
    } catch (error) {
        throw error as string;
    }
}

// active hours

export async function getActiveHoursStatistics(duration: number, year: number): Promise<ActiveHoursStatistics[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<ActiveHoursStatisticsApiResponse>({
            url: `/v1/programs/completion/active-time?duration=${duration}&year=${year}`,
            method: 'get',
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// event statics

export async function getEventStatistics(): Promise<EventStatistics> {
    try {
        const response = await ApiService.fetchDataWithAxios<EventStatisticsApiResponse>({
            url: `/v1/programs/completion/event-statistics`,
            method: 'get',
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}


// get locked redirect reading content
// v1/get-pending-content

export async function getPendingContent(content_id: number): Promise<ContinuePreviousContent> {
    try {
        const response = await ApiService.fetchDataWithAxios<ContinuePreviousContentApiResponse>({
            url: `/v1/get-pending-content/${content_id}`,
            method: 'get',
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// get-course-industries
export async function getCourseIndustries(id: number | undefined): Promise<Array<CourseCategoryDomain>> {
    try {
        const response = await ApiService.fetchDataWithAxios<CourseCategoryDomainApiResponse>({
            url: `/get-course-industries`,
            method: 'get',
            params: {
                course_category_id: id
            }
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchEnrolledCoursesList(filter: string): Promise<EnrolledCourse[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<EnrolledCoursesApiResponse>({
            url: `/v1/dashboard/enrolled-courses-list?type=${filter}`,
            method: 'get'
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchUserAssessmentList(filter: string): Promise<EnrolledCourse[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<EnrolledCoursesApiResponse>({
            url: `/v1/dashboard/user-assessment-list?type=${filter}`,
            method: 'get'
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// Enroll course via CCI flow — calls the external encodeapi endpoint
export async function enrollCourse(program_id: number): Promise<unknown> {
    // Resolve auth token using the same priority as the Axios interceptor:
    // localStorage → sessionStorage → cookies
    const storage = appConfig.accessTokenPersistStrategy;
    let accessToken: string | null = null;

    if (storage === 'localStorage') {
        accessToken = localStorage.getItem(TOKEN_NAME_IN_STORAGE);
    } else if (storage === 'sessionStorage') {
        accessToken = sessionStorage.getItem(TOKEN_NAME_IN_STORAGE);
    } else if (storage === 'cookies') {
        accessToken = await cookiesStorage.getItem(TOKEN_NAME_IN_STORAGE);
    }

    // Fallback: check both storages if strategy is unrecognised or token is missing
    if (!accessToken) {
        accessToken =
            localStorage.getItem(TOKEN_NAME_IN_STORAGE) ||
            sessionStorage.getItem(TOKEN_NAME_IN_STORAGE);
    }

    try {
        const response = await axios.post(
            'https://encodeapi.codeedu.co/api/enroll_course',
            { program_id },
            {
                headers: {
                    'Content-Type': 'application/json',
                    ...(accessToken && { [REQUEST_HEADER_AUTH_KEY]: `${TOKEN_TYPE}${accessToken}` }),
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}