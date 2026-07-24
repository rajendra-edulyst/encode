export interface User {
  id: number;
  name: string;
  username: string;
  portfolio_social: {
    mob_num?: string;
    email?: string;
    linkedin?: string;
    bee?: string;
    dribble?: string;
    insta?: string;
    facebook?: string;
    twitter?: string;
    pinterest?: string;
    other?: string;
    site_url?: string;
  },
  portfolio_profile: {
    name: string;
    headline: string;
    location: string;
    country: string;
    city: string;
    lastName: string
    about_me: string;
  }
  organization_name: string;
  org_logo: string;

}

export interface MentorApiResponse {
  status: number;
  data: User[];
  error: string;
}


export interface MentorConnectRequest {
  start_date: string;
  end_date: string;
  title: string;
  description: string;
  link?: string;
  invited_user_ids: number[] | null;
}

export interface MentorConnectResponse {
  status: number;
  data: {
    list: string;
  };
  error: string;
}