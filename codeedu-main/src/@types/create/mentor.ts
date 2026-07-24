
export interface Mentor {
  _id: string;
  name: string;
  portfolio_id: string;
  org_id: string;
  role: string;
  uniqueIdentifier: string;
  isVerified: boolean;
  rating?: string | null;
  slot_available?: number;


  profileSection: {
    about: {
      id: string;
      about_me: string;
      current_role_head_line: string;
      location: string;
      years_of_exp: number;
      domain: string;
    }[],
    basic_info: {
      name: string;
      username: string;
      email: string;
      phone: string;
      profilePicture: string;
      coverPicture: string;
      resume: string;
      verification_status: string;
      show_personal_info: boolean;
    }[],
    social_links: [
      {
        portfolio: string;
        linkedin: string;
        behance: string;
        instagram: string;
        youtube: string;
        dribble: string;
        facebook: string;
        twitter: string;
        pinterest: string;
        other: string;
        vidwan: string;
      }
    ]
    areas_of_expertise: [
      {
        areas_of_expertise: string;
      }
    ]
    experience_summary: [
      {
        experience_summary: string;
      }
    ];
    experience: {
      id: string;
      title: string;
      employment_type: string;
      company_name: string;
      location: string;
      start_date: string;
      end_date: string;
      description: string;
      years_of_experience?: number; // Optional field to store years of experience
    }[]
  };
  status: string;
  editKey: string;
  __v: number;
}

export interface MentorApiResponse {
  status: string;
  data: Mentor[];
  message: string;
}


export type LMSMentor = {
  id: number;
  name: string;
  email: string;
  phone: string;
  rating: string;
  slot_available: number;
}

export type LMSMentorApiResponse = {
  status: boolean;
  data: LMSMentor[];
  message: string;
}

export type IndustryMentor = {
  id: number;
  name: string;
  email: string;
  organization_id: number;
  portfolio_social: string[];
  portfolio_profile: string[];
  organization_name: string;
  org_logo: string;
  department_name: string | null;
  department_id: number | null;
  enrollment_number: string | null;
  rating: string | null
  skills: string[];
  slot_available: number;
}

export type IndustryMentorApiResponse = {
  status: number;
  data: IndustryMentor[];
  error: string;
}
export interface MentorStatsData {
  total_mentees: number;
  sessions_conducted: number;
  total_mentoring_hours: number;
  avg_session_duration: string; // e.g. "42 m"
  repeat_session_request: number;
  total_ratings: number;
}

export interface MentorStatsResponse {
  status: number;
  data: MentorStatsData;
  error: string;
}

export interface MentorMonthlyStats {
  month: string;
  completed: number;
  hours: number;
}

export interface MentorMonthlyStatsResponse {
  status: number;
  data: MentorMonthlyStats[];
  error: string;
}

export interface MentorRankingItem {
  name: string;
  email: string;
  profile_pic: string | null;
  ranking: string;
  ranking_label: string;
}

export interface MentorRankingResponse {
  status: number;
  data: MentorRankingItem[];
  error: string;
}


export type RecentActivityType =
  | 'completed_session'
  | 'session_request'
  | 'review';

export interface RecentActivityItem {
  name: string;
  action: string;
  time: string; // e.g. "2 hours ago"
  type: RecentActivityType;
}

export interface RecentActivityResponse {
  status: number;
  data: RecentActivityItem[];
  error: string;
}

export interface UpcomingSessionStats {
  total_upcoming: number;
  today: number;
  approved: number;
  declined: number;
  pending_approval: number;
}

export interface UpcomingSessionStatsResponse {
  status: number;
  data: UpcomingSessionStats;
  error: string;
}

export type SessionStatus = 'upcoming' | 'pending' | 'completed' | 'cancelled';

export interface MentorUpcomingSession {
  id: number;
  name: string;
  profile_pic: string | null;
  topic: string;
  start_date: string;          // "YYYY-MM-DD HH:mm:ss"
  end_date: string;            // "YYYY-MM-DD HH:mm:ss"
  status: SessionStatus;
  meeting_link: string | null;
  is_approved: 0 | 1;
  approved_date_time: string | null;
}

export interface MentorUpcomingSessionsResponse {
  status: number;
  data: MentorUpcomingSession[];
  error: string;
}


export interface MentorSessionHistoryStat {
  total_sessions: number;
  completed: number;
  total_hours: number;   // can be float (e.g. 11.8)
  avg_rating: number;    // e.g. 4.8
}

export interface MentorSessionHistoryStatResponse {
  status: number;
  data: MentorSessionHistoryStat;
  error: string;
}

export type MentorSessionHistoryStatus = 'Completed' | 'Declined';

export interface MentorSessionHistoryItem {
  id: number;
  name: string;
  profile_pic: string | null;
  topic: string;
  date: string;        // "YYYY-MM-DD HH:mm:ss"
  duration: string;    // e.g. "45 Min"
  rating: number;      // 1–5
  status: MentorSessionHistoryStatus;
  recording_url?: string;
}

export interface MentorSessionHistoryResponse {
  status: number;
  data: MentorSessionHistoryItem[];
  error: string;
}

export type MentorSessionDetailStatus = 'Completed' | 'Declined' | 'Cancelled';

export interface MentorSessionDetails {
  id: number;
  mentor_name: string;
  topic: string;
  date: string;
  duration: string;
  time: string;
  rating: number;
  status: MentorSessionDetailStatus;
  session_notes: string;
  file: string;
  feedback: string;
  outcomes: string[];
  image: string;
}

export interface MentorSessionDetailsResponse {
  status: number;
  data: MentorSessionDetails;
  error: string;
}

export interface MentorPerformance {
  completion_rate: number;
  response_time: string;
  mentee_retention: number;
}

export interface MentorPerformanceResponse {
  status: number;
  data: MentorPerformance;
  error: string;
}




// Skill type
export interface MentorSkill {
  id: number
  name: string
}

// Mentor item
export interface AllMentorList {
  id: number
  name: string
  email: string
  organization_id: number

  portfolio_social: any[] // empty array in response, keep flexible
  portfolio_profile: any[] // empty array in response

  organization_name: string
  org_logo: string

  department_name: string | null
  department_id: number | null
  enrollment_number: string | null

  rating: string | null // API sends rating as string or null
  skills: MentorSkill[]
  slot_available?: number
}

// Pagination info
export interface Pagination {
  total: number
  per_page: number
  current_page: number
  last_page: number
  from: number
  to: number
}

// Full API response
export interface AllMentorListResponse {
  status: number
  data: AllMentorList[]
  pagination: Pagination
  error: string
}




