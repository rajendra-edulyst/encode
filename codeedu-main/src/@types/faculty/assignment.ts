export type Assignment = {
  title: string;
  description: string;
  id: number;
  start_date: string;
  end_date: string;
  program_name: string;
  program_id?: number;
  expected_duration: number;
  content_type: string;
  is_graded: number;
  module_id: number;
  module_name?: string;
  module_title?: string;
  total_graded?: number;
  total_pending?: number;
  total_not_submitted?: number;
  total_learner: number;
  total_submissions: number;
  maximum_marks: number;
  passing_marks: number;
  file?: string;
  rubrics_url?: string;
  assignment_created_date: string;
  certificate?: number;
  certificate_id?: number;
  submission_mode?: number;
  mode_of_delivery?: string;
  is_external: number | null;
}

export type AssignmentsApiResponse = {
  status: number;
  error: string[];
  data: Assignment[]
}


// assignment details
export interface AssignmentApiResponse {
  status: number;
  error: string[];
  data: Assignment;
}

// Fetch assessment learners
export interface AssignmentLearner {
  user_id: number;
  user_name: string;
  email: string;
  profile_image: string;
  submission: string;
  enrollment_number: string | null;
  submission_date?: string | null;
  latest_attempt_id: number | null;
  is_reviewed: number;
  is_certificate_mapped: number;
  certificate_pdf_url: string | null;
  is_external: number;
  grade: string | null;
}


export interface AssignmentLearnerApiResponse {
  data: AssignmentLearner[];
  message: string;
  status: number;
}

export interface AssignmentSubmission {
  id: number;
  content_id: number;
  user_id: number;
  marks_obtained: number | null;
  is_passed: number;
  user_notes: string | null;
  teacher_notes: string | null;
  review_status: number;
  file: string;
  created_at: string;
  updated_at: string;
  organization_id: number | null;
  teacher_file: string | null;
  reviewed_by: number | null;
  grade: string | null;
  performance_level: string | null;
}

export interface AssignmentSubmissionApiResponse {
  data: AssignmentSubmission[];
  message: string;
  status: number;
}

export interface AssignmentSubmissionReportData {
  sn: number;
  learner_name: string;
  username: string;
  email: string;
  status: string;
  department: string;
  program_name: string;
  completion_per: string;
  [key: string]: string | number | undefined; // For module dynamic keys
}

export interface AssignmentSubmissionReportApiResponse {
  status: number;
  message: string;
  module_count: number;
  data: AssignmentSubmissionReportData[];
}