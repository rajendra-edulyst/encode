import { SearchUser, SearchUserApiResponse, SearchUserAssessment, SearchUserAssessmentApiResponse, SearchUserAssignment, SearchUserAssignmentApiResponse, SearchUserLoginHistory, SearchUserLoginHistoryApiResponse } from '@/@types/faculty/userSearch';
import ApiService from '@/services/ApiService';

export async function fetchUsers(query: string): Promise<SearchUser[]> {
  try {
    const response = await ApiService.fetchDataWithAxios<SearchUserApiResponse>({
      url: '/v1/user-search',
      method: 'get',
      params: {
        query,
      },
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}

// user assignment
export async function fetchUserAssignments(userId: number): Promise<SearchUserAssignment[]> {
  try {
    const response = await ApiService.fetchDataWithAxios<SearchUserAssignmentApiResponse>({
      url: `/v1/user-assignment/${userId}`,
      method: 'get',
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}

// user assessment
export async function fetchUserAssessments(userId: number): Promise<SearchUserAssessment[]> {
  try {
    const response = await ApiService.fetchDataWithAxios<SearchUserAssessmentApiResponse>({
      url: `/v1/user-assessment/${userId}`,
      method: 'get',
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}

// userr login history
export async function fetchUserLoginHistory(userId: number): Promise<SearchUserLoginHistory[]> {
  try {
    const response = await ApiService.fetchDataWithAxios<SearchUserLoginHistoryApiResponse>({
      url: `/v1/user-login-list/${userId}`,
      method: 'get',
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}