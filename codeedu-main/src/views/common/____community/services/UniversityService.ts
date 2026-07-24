import { Organization, OrganizationApiResponse, OrganizationDetailsResponse } from '@/@types/collaborate/organization';
import { Course, CoursesApiResponse } from '@/@types/learner/Courses';
import ApiService from '@/services/ApiService'

export async function fetchOrganizations(): Promise<Organization[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<OrganizationApiResponse>({
            url: 'university-list',
            method: 'get',
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}

export async function fetchOrganizationById(organizationId: string | undefined): Promise<Organization> {
    if (!organizationId) {
        throw new Error('Organization ID is required');
    }
    try {
        const response = await ApiService.fetchDataWithAxios<OrganizationDetailsResponse>({
            url: `get-university-meta/${organizationId}`,
            method: 'get',
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}

export async function fetchOrganizationCourses(organizationId: string | undefined): Promise<Course[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<CoursesApiResponse>({
            url: `/v1/free-courses`,
            method: 'get',
            params: {
                org_id: organizationId,
            }
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}