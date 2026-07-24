import {
  BadgeItem,
  BadgesResponse,
  CertificateStatsData,
  CertificateStatsResponse,
  CertificationsSummary,
  CertificationsSummaryResponse,
  CourseLearningHours,
  CourseLearningHoursResponse,
  CoursesProgress,
  CoursesProgressResponse,
  CoursesStatCount,
  CourseStatCountResponse,
  CurrentCourse,
  CurrentCourseResponse,
  DomainProgressItem,
  DomainProgressResponse,
  EarnedCertificate,
  EarnedCertificatesResponse,
  LearningStageData,
  LearningStageResponse,
  MentorSessions,
  MentorSessionsResponse,
  MilestonesData,
  MilestonesResponse,
  OpinionPolls,
  OpinionPollsResponse,
  ProgramCategory,
  ProgramCategoryResponse,
  SkillsBadgesSummaryData,
  SkillsBadgesSummaryResponse,
  SkillsProgressData,
  SkillsProgressResponse,
} from "@/@types/create/courses";
import ApiService from "../ApiService";

export async function fetchCoursesStatCount(type: string): Promise<CoursesStatCount> {
  try {
    const response = await ApiService.fetchDataWithAxios<CourseStatCountResponse>({
      url: `/v1/dashboard/learning-counts?type=${type}`,
      method: "get",
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}

export async function fetchCertificationsSummary(type: string): Promise<CertificationsSummary> {
  try {
    const response = await ApiService.fetchDataWithAxios<CertificationsSummaryResponse>({
      url: `/v1/dashboard/certifications/summary?type=${type}`,
      method: "get",
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}

export async function fetchCourseCategoryList(): Promise<ProgramCategory[]> {
  try {
    const response = await ApiService.fetchDataWithAxios<ProgramCategoryResponse>({
      url: `/get-course-category?is_program_cat=1`,
      method: "get",
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}

export async function fetchCoursesProgress(type: string): Promise<CoursesProgress> {
  try {
    const response = await ApiService.fetchDataWithAxios<CoursesProgressResponse>({
      url: `/v1/dashboard/courses/progress?type=${type}`,
      method: "get",
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}

export async function fetchMentorSessions(type: string): Promise<MentorSessions> {
  try {
    const response = await ApiService.fetchDataWithAxios<MentorSessionsResponse>({
      url: `/v1/dashboard/mentor-sessions-monthly?type=${type}`,
      method: "get",
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}

export async function fetchOpinionPolls(type: string): Promise<OpinionPolls> {
  try {
    const response = await ApiService.fetchDataWithAxios<OpinionPollsResponse>({
      url: `/v1/dashboard/opinion-polls?type=${type}`,
      method: "get",
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}

export async function fetchMilestones(type: string): Promise<MilestonesData> {
  try {
    const response = await ApiService.fetchDataWithAxios<MilestonesResponse>({
      url: `/v1/dashboard/milestones?type=${type}`,
      method: "get",
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}

export async function fetchCurrentCourse(type: string): Promise<CurrentCourse> {
  try {
    const response = await ApiService.fetchDataWithAxios<CurrentCourseResponse>({
      url: `/v1/dashboard/user-current-course?type=${type}`,
      method: "get",
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}

export async function fetchCertificateStats(type: string): Promise<CertificateStatsData> {
  try {
    const response = await ApiService.fetchDataWithAxios<CertificateStatsResponse>({
      url: `/v1/dashboard/certifications/stats?type=${type}`,
      method: "get",
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}

export async function fetchEarnedCertificates(type: string): Promise<EarnedCertificate[]> {
  try {
    const response = await ApiService.fetchDataWithAxios<EarnedCertificatesResponse>({
      url: `/v1/dashboard/certifications/earned?type=${type}`,
      method: "get",
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}

export async function fetchSkillsBadgesSummary(type: string): Promise<SkillsBadgesSummaryData> {
  try {
    const response = await ApiService.fetchDataWithAxios<SkillsBadgesSummaryResponse>({
      url: `/v1/dashboard/skills-badges/summary?type=${type}`,
      method: "get",
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}

export async function fetchLearningStage(type: string): Promise<LearningStageData> {
  try {
    const response = await ApiService.fetchDataWithAxios<LearningStageResponse>({
      url: `/v1/dashboard/learning-stage?type=${type}`,
      method: "get",
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}

export async function fetchSkillsProgress(type: string): Promise<SkillsProgressData> {
  try {
    const response = await ApiService.fetchDataWithAxios<SkillsProgressResponse>({
      url: `/v1/dashboard/skills-progress?type=${type}`,
      method: "get",
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}

export async function fetchDomainProgress(type: string): Promise<DomainProgressItem[]> {
  try {
    const response = await ApiService.fetchDataWithAxios<DomainProgressResponse>({
      url: `/v1/dashboard/domain-progress?type=${type}`,
      method: "get",
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}

export async function fetchBadges(type: string): Promise<BadgeItem[]> {
  try {
    const response = await ApiService.fetchDataWithAxios<BadgesResponse>({
      url: `/v1/dashboard/badges?type=${type}`,
      method: "get",
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}


export async function fetchLearningHours(): Promise<CourseLearningHours[]> {
  try {
    const response = await ApiService.fetchDataWithAxios<CourseLearningHoursResponse>({
      url: `/v1/dashboard/learning-activity-history`,
      method: "get",
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}
