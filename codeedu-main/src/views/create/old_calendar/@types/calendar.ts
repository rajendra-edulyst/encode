export type EventData = {
  data: Event[],
  error: string,
  status: string,
  pending_request: number
  recording_url: string

}

export type EventResponse = {
  data: Event,
  error: string,
  status: string,
}

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
    about_me: string;
    lastName: string;
  }
  organization_name: string;
  organization_display_name?: string;
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

export interface Batch {
  id: number;
  title: string;
}

export interface BatchApiResponse {
  status: number;
  data: Batch[];
  message: string;
}

export interface SearchUser {
  id: number;
  email: string;
  login_type: string | null;
  name: string;
  username: string;
  permanent_address: string | null;
  profile_image: string | null;
  date_of_birth: string | null;
  pincode: string | null;
  organization_id: number;
  mobile_no: string | null;
  role: string;
  status: string;
  resume: string | null;
  profile_video: string | null;
  portfolio_social: string | null;
}


export interface SearchUserApiResponse {
  success: boolean;
  data: SearchUser[];
  error: string | null;
}

export interface Event {
  id?: number;
  title: string;
  start_date: Date;
  end_date: Date;
  description?: string;
  purpose: string;
  link?: string;
  userType: 'mentor' | 'faculty' | 'learner' | 'batch';
  invited_user_ids?: number[];
  invited_by_name?: string;
  start: string;
  end: string;
  is_mentoring: number;
  batch_id?: number;
  approval_status?: number;
  recording_url?: string;
  mentor_calendar_id?: number;
}


export interface InvitedUsersApiRes {
  status: number;
  data: {
    calender_details: Event;
    invited_user: InvitedUsers[];
    status: {
      0: string;
      1: string;
      2: string;
    };
  };
  error: string;
}

export interface InvitedUsers {
  id: number;
  approval_status: number;
  name: string;
  email: string;
  profile_image: string;
  user_id: number;
}


export interface PendingInvitesApiResponse {
  status: number;
  data: PendingInvites[];
  error: string;
}

export interface PendingInvites {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  link: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  invited_by: number;
  ref_calender_id: number;
  purpose: string;
  approval_status: number;
  approval_date: null;
  is_mentoring: number;
  organization_id: number;
  approved_by: null;
  invited_by_name: string;
  invited_by_email: string;
  invited_by_profile_image: string;
  profile_image: string;
}

export interface createEventApiResponse {
  status: number;
  data: string;
  error: string;
}

export interface createEventApiSend {
  data: Event
}