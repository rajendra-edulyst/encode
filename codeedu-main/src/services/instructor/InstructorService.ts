import { CourseStatsOverview, CourseStatsOverviewResponse, DashboardData, DashboardResponse, InstructorActivityStatsData, InstructorActivityStatsResponse, InstructorBuilderStatsData, InstructorBuilderStatsResponse, InstructorCourse, InstructorCourseListResponse, InstructorLearnerListData, InstructorLearnerListResponse, InstructorRatingsData, InstructorRatingsResponse, InstructorStatsOverview, InstructorTopCourse, InstructorTopCoursesResponse, StudentCourseDetailsData, StudentCourseDetailsResponse } from "@/@types/create/instructor";
import ApiService from "../ApiService";

export async function fetchInstructorRatings(type: string): Promise<InstructorRatingsData> {
  const res = await ApiService.fetchDataWithAxios<InstructorRatingsResponse>({
    url: `/v1/dashboard/instructor-ratings-reviews?type=${type}`,
    method: "get",
  });

  return res.data;
}
export async function fetchInstructorActivityStats(type: string): Promise<InstructorActivityStatsData> {
  const res = await ApiService.fetchDataWithAxios<InstructorActivityStatsResponse>({
    url: `/v1/dashboard/instructor-activity-stats?type=${type}`,
    method: "get",
  });

  return res.data;
}


export async function fetchInstructorTopCourses(type: string): Promise<InstructorTopCourse[]> {
  const res = await ApiService.fetchDataWithAxios<InstructorTopCoursesResponse>({
    url: `/v1/dashboard/instructor-top-courses?type=${type}`,
    method: "get",
  });

  return res.data;
}


export async function fetchInstructorBuilderStats(type: string): Promise<InstructorBuilderStatsData> {
  const res = await ApiService.fetchDataWithAxios<InstructorBuilderStatsResponse>({
    url: `/v1/dashboard/instructor-builder-stats?type=${type}`,
    method: "get",
  });

  return res.data;
}

export async function fetchInstructorOverviewStats(type: string): Promise<CourseStatsOverview> {
  const res = await ApiService.fetchDataWithAxios<CourseStatsOverviewResponse>({
    url: `/v1/dashboard/instructor-stats-overview`,
    method: "post",
    data: { filter: type }
  });

  return res.data;
}

export async function fetchInstructorLearnerStats(type: string): Promise<DashboardData> {
  const res = await ApiService.fetchDataWithAxios<DashboardResponse>({
    url: `/v1/dashboard/instructor-learner-stats`,
    method: "post",
    data: { filter: type }
  });

  return res.data;
}

export async function fetchInstructorLearnerCourseList(type: string): Promise<InstructorCourse[]> {
  const res = await ApiService.fetchDataWithAxios<InstructorCourseListResponse>({
    url: `/v1/dashboard/instructor-course-list?type=${type}`,
    method: "get",
  });

  return res.data;
}



export async function fetchInstructorLearnerList(program_id: string): Promise<InstructorLearnerListData> {
  const res = await ApiService.fetchDataWithAxios<InstructorLearnerListResponse>({
    url: program_id ? `/v1/dashboard/instructor-learner-list?program_id=${program_id}` : `/v1/dashboard/instructor-learner-list`,
    method: "get",
  });

  return res.data;
}

export async function fetchInstructorLearnerDetails(program_id: string, user_id: string): Promise<StudentCourseDetailsData> {
  const res = await ApiService.fetchDataWithAxios<StudentCourseDetailsResponse>({
    url: `/v1/dashboard/instructor-learner-detail?program_id=${program_id}&user_id=${user_id}`,
    method: "get",
  });

  return res.data;
}







