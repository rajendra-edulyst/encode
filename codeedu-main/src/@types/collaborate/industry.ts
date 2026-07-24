
export interface Industry {
  id: number;
  name: string;
  type: string;
  description: string;
  org_description: string;
  logo: string;
  address: string | null;
  country_name: string | null;
  location: string | null;
}

export interface IndustryApiResponse {
  status: number;
  data: Industry[];
  error: string;
}


export type Organization = {
  id: number;
  name: string;
  logo: string;
  org_description: string;
  brochure_url: string;
  banners: string[] | null;
  university_url: string;
  address: string;
  city: string;
  state_name: string;
  country_name: string
  rating: number;
  faqs: string[] | null;
  rank: number;
  about: string;
  admission: string;
  full_name: string;
  placements: string;
  short_name: string;
  testimonials: string[] | null;
  why_this_university: string;
  type: string
  testimonial: string;
  faq: string;
  brochure: string;
  company_id: number;
  subdomain_url?: string;
  email?: string;
  behance?: string;
  instagram?: string;
  pinterest?: string;
  dribbble?: string;
  youtube?: string;
}

export type OrganizationApiResponse = {
  status: number;
  data: Organization[];
  error: string | null;
}

export type OrganizationDetailsResponse = {
  status: number;
  data: Organization;
  error: string[] | null;
}


export type IndustryAnalysisCounts = {
  job_posted: number;
  events_created: string;
  tot_applicants: number;
  total_placed: number;
  tot_participants: number;
}

export type IndustryAnalysisApiResponse = {
  status: number;
  data: IndustryAnalysisCounts;
  error: string | null;
}


  