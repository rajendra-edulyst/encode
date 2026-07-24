export interface StatCount {
    liveclass: {
        total: number;
        completed: string;
        upcoming: string;
        lastclassdatetime: string;
        lastclass: string | number;
    };
    mentroring: {
        total: string;
        completed: string;
        upcoming: string;
        lastmentoring: string;
    };
    assignment: {
        total: number;
        completed: string;
        upcoming: string;
        lastassignment: string;
    };
    assessment: {
        total: number;
        completed: string;
        upcoming: string;
        lastassessment: string;
    };
    program: number;
}


export interface StatCountApiResponse {
    status: number;
    error: string[];
    data: StatCount
}



export interface DashboardData {
  total_programs: number;
  heading: string;
  total_courses: number;
  students_registered: number;
  course_mappings: number;
  not_started: number;
  in_progress: number;
  completed: number;
  assessments_done: number;
  present: number;
  certificates_released: number;
  assessments_pending: number;
  absent: number;
  certificates_pending: number;
  avg_completion: number;
  avg_assessment_score: number;
  avg_attendance: number;
  tot_certificates: number;
  tot_assessment: number;
  present_per: number;
  certificates_released_per: number;
  assessments_done_per: number;
  assessments_pending_per: number;
  absent_per: number;
  certificates_pending_per: number;
  completed_per: number;
  in_progress_per: number;
  not_started_per: number;
  total_cnt: number;
}

export interface DashboardApiResponse {
    status: number;
    data: DashboardData;
    message: string;
}