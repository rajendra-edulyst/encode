import ApiService from '@/services/ApiService'
import {
  InstructorActivityStatsData,
  InstructorActivityStatsResponse,
  InstructorBuilderStatsData,
  InstructorRatingsResponse,
  InstructorStatsOverview,
  InstructorTopCourse,
} from '@/@types/create/instructor'

export async function fetchInstructorStatsOverview(
  params?: URLSearchParams
): Promise<Array<InstructorStatsOverview>> {
  try {
    const response =
      await ApiService.fetchDataWithAxios<{
        data: InstructorStatsOverview[]
      }>({
        url: '/v1/dashboard/instructor-stats-overview',
        method: 'get',
        params,
      })

    return response?.data || []
  } catch (error) {
    throw error as string
  }
}


export async function fetchInstructorBuilderStats(
  params?: URLSearchParams
): Promise<Array<InstructorBuilderStatsData>> {
  try {
    const response =
      await ApiService.fetchDataWithAxios<{
        data: InstructorBuilderStatsData[]
      }>({
        url: '/v1/dashboard/instructor-builder-stats',
        method: 'get',
        params,
      })

    return response?.data || []
  } catch (error) {
    throw error as string
  }
}


export async function fetchInstructorRatingsReviews(
  params?: URLSearchParams
): Promise<Array<InstructorRatingsResponse>> {
  try {
    const response =
      await ApiService.fetchDataWithAxios<{
        data: InstructorRatingsResponse[]
      }>({
        url: '/v1/dashboard/instructor-ratings-reviews',
        method: 'get',
        params,
      })

    return response?.data || []
  } catch (error) {
    throw error as string
  }
}


export async function fetchInstructorTopCourses(
  params?: URLSearchParams
): Promise<Array<InstructorTopCourse>> {
  try {
    const response =
      await ApiService.fetchDataWithAxios<{
        data: InstructorTopCourse[]
      }>({
        url: '/v1/dashboard/instructor-top-courses',
        method: 'get',
        params,
      })

    return response?.data || []
  } catch (error) {
    throw error as string
  }
}

export async function fetchInstructorActivityStats(
  params?: URLSearchParams
): Promise<InstructorActivityStatsData> {
  try {
    const response =
      await ApiService.fetchDataWithAxios<InstructorActivityStatsResponse>({
        url: '/v1/dashboard/instructor-activity-stats',
        method: 'get',
        params,
      })

    return response.data
  } catch (error) {
    throw error as string
  }
}

export async function fetchCCIProgressReport(
  params?: URLSearchParams
): Promise<any> {
  try {
    const response = await ApiService.fetchDataWithAxios<any>({
      url: '/cci-progress-report',
      method: 'get',
      params,
    })
    return response;
  } catch (error) {
    throw error as string
  }
}
