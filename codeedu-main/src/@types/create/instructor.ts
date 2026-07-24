export interface ApiResponse<T> {
  status: number
  data: T
  error: string
}
export interface InstructorStatsOverview {
  total_courses: number
  total_students: number
  total_revenue: number
  average_rating: number
}

export interface InstructorRatingMetric {
  percentage: number
  reviews: number
}

export interface InstructorRatingsData {
  overall_rating: number
  metrics: {
    knowledge: InstructorRatingMetric
    teaching_skills: InstructorRatingMetric
    engagement: InstructorRatingMetric
  }
}

export type InstructorRatingsResponse =
  ApiResponse<InstructorRatingsData>

export interface BuilderCategory {
  [key: string]: string
}

export interface InstructorBuilderStatsData {
  builder: {
    create: BuilderCategory
    connect: BuilderCategory
    collaborate: BuilderCategory
  }
}

export type InstructorBuilderStatsResponse =
  ApiResponse<InstructorBuilderStatsData>

export interface InstructorTopCourse {
  name: string
  learners: number
  rating: number
  completion_rate: number
}

export type InstructorTopCoursesResponse =
  ApiResponse<InstructorTopCourse[]>

/* --------------------------------------------
 * Monthly Enrollment Trend
 * -------------------------------------------- */
export interface InstructorMonthlyEnrollmentTrend {
  label: string
  completion: number
  enrollments: number
  courses_assigned: number
}

/* --------------------------------------------
 * API Data
 * -------------------------------------------- */
export interface InstructorActivityStatsData {
  monthly_enrollment_trends: InstructorMonthlyEnrollmentTrend[]
}

/* --------------------------------------------
 * API Response
 * -------------------------------------------- */
export interface InstructorActivityStatsResponse {
  status: number
  data: InstructorActivityStatsData
  error: string
}

export interface StatsMetric<T = number | string> {
  value: T;
  percentage: number;
  increase_or_decrease: 0 | 1;
}

export interface CourseStatsOverview {
  total_courses: StatsMetric<number>;
  active_courses: StatsMetric<number>;
  completed_courses: StatsMetric<number>;
  active_learners: StatsMetric<number>;
  avg_watch_time: StatsMetric<string>;
  avg_assignment_score: StatsMetric<string>;
  avg_rating: StatsMetric<number>;
}
export interface CourseStatsOverviewResponse {
  status: number;
  data: CourseStatsOverview;
  error: string;
}

export interface DashboardResponse {
  status: number;
  data: DashboardData;
  error: string;
}

export interface DashboardData {
  total_students: number;
  active_students: number;
  course_completion: string;
  avg_performance: string;
}


export interface InstructorLearnerListResponse {
  status: number;
  data: InstructorLearnerListData;
  error: string;
}

export interface InstructorLearnerListData {
  stats: InstructorLearnerStats;
  learners: Learner[];
}

export interface InstructorLearnerStats {
  total: number;
  completed: number;
  avg_grading: number;
}

export interface Learner {
  id: number;
  name: string;
  email: string;
  image: string | null;
  status: "ACTIVE" | "INACTIVE" | string;
  progress: number;
}

export interface InstructorCourseListResponse {
  status: number;
  data: InstructorCourse[];
  error: string;
}

export interface InstructorCourse {
  course_id: number;
  course_name: string;
  total_students: number;
  avg_progress: number;
  active_students: number;
  completed_students: number;
  avg_grade: number;
}

export interface StudentCourseDetailsResponse {
  status: number;
  data: StudentCourseDetailsData;
  error: string;
}

export interface StudentCourseDetailsData {
  user: StudentUser;
  overall_progress: string; // "7.69%"
  modules: CourseModule[];
  assessments: CompletionStats;
  assignments: CompletionStats;
  live_classes: LiveClassStats;
  /** Watch / learning hours when provided by API */
  total_hours?: string;
}

export interface StudentUser {
  name: string;
  email: string;
  enrolled_date: string; // "Nov 25, 2025"
}

export interface CourseModule {
  id: number;
  name: string;
  grade: string;    // "0%"
  progress: number; // 11, 0 etc.
}

export interface CompletionStats {
  completed: number;
  total: number;
}

export interface LiveClassStats {
  attended: number;
  total: number;
  percentage: string; // "33%"
}

