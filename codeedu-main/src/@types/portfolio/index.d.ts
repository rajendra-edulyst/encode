export interface Resume {
  url: string
  id: number
}

export interface Activity {
  activity_type: string
  description: string
  start_date: string
  end_date: string
  percentage: string
  institute: string
  certificate: string
  action: string
  professional_key: string
  edit_url_professional: string
  employment_type: string
  currently_work_here: string
  curricular_type: string
  role: string
  location: string
  study_field: string
  degree: string
  grade: string
  image_name: string
  id: number
  title: string
}

export interface Skill {
  id: number
  organization_id: number
  user_id: number
  skill_id: number
  self_proficiency: number
  assesed_proficiency: number | null
  assessment_content_id: number | null
  assessment_score: number | null
  assesed_date: string | null
  status: string
  created_at: string
  updated_at: string
  name: string
  description: string
}

export interface PortfolioProfile {
  name: string
  headline: string
  country: string
  city: string
  lastName: string
  email: string
  phone: string
  state: string
  about_me: string
  id: number
}

export interface Portfolio {
  slot_available: number
  image: string;
  name: string;
  resume: Resume[];
  profile_video: string;
  profile_video_cdn: string;
  Education: Activity[];
  Experience: Activity[];
  skill: Skill[];
  Certificate: Activity[];
  extra_activities: Activity[];
  portfolio_profile: PortfolioProfile;
  Publication: Activity[];
  Project: Activity[];
  Extra: Activity[];
  banner: {
    url: string;
    id: number;
  }[];
  portfolio_social: {
    mob_num: string;
    email: string;
    linkedin: string;
    facebook: string;
    site_url: string;
    twitter: string;
    bee: string;
    dribble: string;
    insta: string;
    pinterest: string;
    pinterest: string;
  }[]
}

export interface PortfolioApiResponse {
  data: Portfolio;
  status: string;
  error: string[];
}

export interface FetchUsersCertificateResponse {
  data: {
    program_certificate: programCertificate[];
    content_certificate: contentCertificate[];
  };
  status: number;
  message: string;
  error?: string[];
}


export interface Skills {
  id: number;
  name: string;
}

export interface FetchUsersSkills {
  status: number;
  message: string;
  data: Skills[];
}


export interface programCertificate {
  certificate_number: string;
  pdf_file_path: string;
  course_name: string;
  program_id: number;
    type: string;
  assigned_date: string;
}

export interface contentCertificate {
  certificate_number: string;
  pdf_file_path: string;
  content_name: string;
  content_type: string;
  content_id: number;
  assigned_date: string;
    type: string;
}

export interface UserCertificate {
  certificate_number: string;
  pdf_file_path: string;
  content_name?: string;
  content_type?: string;
  course_name?: string;
  program_id?: number;
  content_id?: number;
  assigned_date: string;
  type: string;
}


export interface FetchUserToolsSoftware {
  status: number;
  message: string;
  data: ToolsSoftware[];
}
export interface ToolsSoftware {
  id: number;
  name: string;
}
