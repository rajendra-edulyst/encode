export interface JobDetailsData {
    id: number;
    designation: string;
    location: string;
    jobinfo: string;
    description: string;
    min_experience: string;
    max_experience: string;
    company: string;
    jd_url: string;
    vacancies: string;
    logo_url: string;
    te_logo_url: string | null;
    white_listed_keywords: string;
    keywords: string;
    keywords_ar: string;
    email: string;
    is_easy_apply: string;
    job_id: string;
    job_id_orig: string | null;
    job_posted_date_time: string;
    min_Salary: string;
    max_Salary: string;
    Country: string;
    State: string;
    City: string;
    functional_Domain: string;
    sector_industry_domain: string;
    icon: string;
    skills: string;
    program_ids: string | null;
    gulf_id: number;
    education: string | null;
    nationality: string | null;
    gender: string | null;
    chart_key: string;
    job_role: string;
    job_designation: string;
    status: string;
    created_at: string;
    updated_at: string;
    job_closing_date: string | null;
    job_type: string;
    source: string;
    organization_id: string | null;
    name: string;
    is_expired: number;
    min_ctc: string | null;
  }
  
  export interface JobDetailsResponse {
    status: number;
    data: JobDetailsData[];
    message: string;
  }
  