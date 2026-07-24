
export interface Post {
  is_repost: unknown;
  id: number;
  title: string;
  organization_name: string;
  org_logo: string;
  description: string;
  created_at: number | null | Date | string;
  created_by: {
    id: number;
    name: string;
    profile_image: string | null;
  };
  updated_at: number;
  updated_by: number;
  created_by_image:string | null;
  status: string;
  parent_id: number;
  category_id: number;
  content_type: string;
  resource_path: string;
  language: string;
  tag: string | null;
  like_count: number;
  comment_count: number;
  program_content_id: number;
  start_date: number | null;
  end_date: number | null;
  is_multilingual: number;
  visibility_value: number;
  visibility: number;
  dimension: Dimension;
  multi_file_uploads: string[];
  view_count: number;
  multiple_file_upload: string | null;
  user_id: number;
  name: string;
  email: string;
  user_profile_image: string | null;
  user_status: string;
  user_like_trackings_id: number | null;
  user_liked: number;
  resource_type: string;
  multi_file_uploads_count: [number] | null;
  multi_file_uploads_dimension: string[] | null;
  thumbnail_url: string;
  is_attempt: number;
  user_submitted_file: string;
  resource_path_thumbnail: string;
  user_submitted_multiple_file: string[];
  created_by_name: string;
  category_name: string;
  repost_count: number;
  share_count: number;
  post_type: string;
  // repost data
  repost_id: number | null;
  repost_user_id: number | null;
  repost_user_name: string | null;
  repost_user_profile_image: string | null;
  repost_created_at: string;
  repost_status: string | null;
  repost_description: string | null;
  repost_category_id: number | null;
  repost_category_name: string | null;
  repost_like: number | null;
  repost_view: number | null;
  repost_comments: number | null;
  is_user_repost_like: boolean;
  profile_image?: string | null;
  reference_id?: number | null;
  is_pin?: number;
}

export interface PostDetailApiResponse {
  status: number;
  data: {
    list: Post[];
  };
  error: string;
}

export interface CommunitiesPostsApiResponse {
  status: number;
  data: {
    post: Post[];
  };
  error: string;
}


// community 

export type CommunityCategoryApiResponse = {
  status: number,
  data: CommunityCategory[]
  error: string
}


export interface CommunityCategory {
  id: number;
  title: string;
  description: string;
  image: string;
  user_mapping_id: number;
  total_user_joined: number;
  short_description: string;
  created_by?: number;
  domain_name?: string;
  domain_id?: number;
  user_joined_id?: number | null;
  is_mute?: number | boolean;
  created_by_admin: true | false;
  is_public: boolean;
  created_at: string | Date;
  cover_image: string | null;
  country_id?: string;
  state_id?: string;
  city_id?: string;
  type: string;
  location?: string;
  sub_domain_id?: string;
  logo?: string;
  cover?: string;
}


export interface PostComment {
  id: number;
  joy_content_id: number;
  user_name: string;
  content: string;
  created_at: string | Date | null;
  updated_at: number;
  level: number;
  email: string;
  name: string;
  profile_image: string | null;
  user_id: number;
  parent_id: number | null;
}

export interface PostCommentsApiResponse {
  status: number;
  data: {
    list: PostComment[];
  };
  error: string[];
}


export interface Domain {
  id: number;
  name: string;
  description: string;
  background: string | null;
  status: string;
  organization_id: number;
  created_at: string | Date;
  updated_at: string | Date;
  number_of_jobs: string;
  growth: string;
  growth_type: string;
  skill_id: number | null;
  staus: string;
  job_count: number;
}

export interface DomainApiResponse {
  status: number;
  data: {
    list: Domain[];
  };
  error: string[];
}

export interface SubDomain {
  id: number;
  name: string;
  description: string;
  background: string | null;
  status: string;
  organization_id: number;
  created_at: string | Date;
  updated_at: string | Date;
  number_of_jobs: string;
  growth: string;
  growth_type: string;
  skill_id: number | null;
  staus: string;
  job_count: number;
}

export interface SubDomainApiResponse {
  status : number;
  data: {
    list: SubDomain[];
  };
  error: string[];
}


export type Event = {
  id: number;
  parent_id: number | null;
  category_id: number;
  session_id: number | null;
  level: string;
  name: string;
  organization_name:string;
  description: string;
  image: string;
  content_type: string;
  start_date: string;
  from_date: string;
  end_date: string;
  duration: string | null;
  created_by: number;
  status: string;
  created_at: string;
  updated_at: string;
  organization_id: number;
  is_global_program: number;
  registration_need_approval: number;
  assigned_rule_id: number | null;
  weightage: number | null;
  certificate_id: number;
  certificate_number_pattern: string;
  certificate_latest_number: number;
  type: string | null;
  short_code: string | null;
  g_score: number | null;
  subscription_type: string | null;
  is_structured: boolean | null;
  is_competition: number;
  termination_days: number | null;
  organized_by: string | null;
  competition_level: string;
  is_popular: number;
  is_published: number;
  is_job: boolean | null;
  is_recommended: boolean | null;
  step_no: number;
  is_internship: boolean | null;
  organized_by_id: number | null;
  sis_ref_module_id: number | null;
  department_id: number | null;
  order: number | null;
  wp_course_id: number;
  job_id: number | null;
  pg_score: number | null;
  comp_type: string | null;
  landing_page_url: string;
  domain_id: number | null;
  domain_name: string | null;
  venue:string | null
  location: string | null;
  experience: string | null;
  skill_names: string | null;
  job_status: string | null;
  job_status_numeric: number | null;
  score: number;
  participants: number | null;
  com_status:{
    program_status: string | null;
    program_time: string | null;
  }
};

export type EventApiResponse = {
  status: number;
  data: Event[];
  error: string[];
};


export type TrendingCommunity = {
  id: number;
  title: string;
  description: string;
  short_description: string;
  image: string;
  parent_id: number;
  total_content: number;
  user_mapping_id: number | null;
  total_user_joined: number;
  org_name: string | null;
}

export type TrendingCommunityApiResponse = {
  status: number;
  data: TrendingCommunity[];
  error: string;
}


// PoppinTagApiResponse
export interface PoppinTag {
  tag: string;
  category_name: string;
  post_count: string;
}

export interface PoppinTagApiResponse {
  status: number;
  data: PoppinTag[];
  error: string;
}


// Poll

export interface PollOption {
  option_id: number;
  option_statement: string;
  attempted: number;
}

export interface PollQuestions {
  question_id: number;
  question: string;
  question_type: string;
  question_image: string[];
  question_type_id: number;
  response_medium: string | null;
  negative_marks: number | null;
  marks: number | null;
  attempted: number | null;
  difficulty_level: string | null;
  time_taken: number | null;
  options: PollOption[];
}

export interface PollQuestionDetails {
  title: string;
  description: string;
  start_date: number | null;
  end_date: number | null;
  maximum_marks: number | null;
  passing_marks: number | null;
  question_count: number;
  negative_marking: number | null;
  negative_marks: number | null;
  total_attempts: number | null;
  attempt_count: number | null;
  duration_in_minutes: number | null;
  questions: PollQuestions[]
}


export interface Poll {
  id: number;
  title: string;
  organization_name: string;
  org_logo: string;
  description: string;
  created_at: number | null;
  created_by: {
    id: number;
    name: string;
    profile_image: string | null;
  };
  updated_at: number;
  updated_by: number;
  status: string;
  parent_id: number;
  category_id: number;
  content_type: string;
  resource_path: string;
  language: string;
  tag: string | null;
  like_count: number;
  comment_count: number;
  program_content_id: number;
  start_date: number | null;
  end_date: number | null;
  is_multilingual: number;
  visibility_value: number;
  visibility: number;
  dimension: Dimension;
  multi_file_uploads: string[];
  view_count: number;
  multiple_file_upload: string | null;
  user_id: number;
  name: string;
  email: string;
  profile_image: string | null;
  user_status: string;
  user_like_trackings_id: number | null;
  user_liked: number;
  resource_type: string;
  multi_file_uploads_count: [number] | null;
  multi_file_uploads_dimension: string[] | null;
  thumbnail_url: string;
  is_attempt: number;
  user_submitted_file: string;
  resource_path_thumbnail: string;
  user_submitted_multiple_file: string[];
  created_by_name: string;
  category_name: string;
  repost_count: number;
  poll_questions_details: PollQuestionDetails;
}


export interface PollApiResponse {
  status: number;
  data: {
    post: Poll[];
  }
  error: string[];
}


// industry posts

export interface IndustryPost {
  id: number;
  title: string;
  description: string;
  resource_path_thumbnail: string;
  created_at: string | Date;
  org_name: string;
  org_logo: string;
  org_id: number;
}

export interface IndustryPostApiResponse {
  status: number;
  data: IndustryPost[];
  error: string[];
}


export interface CommunityMember {
  id: number;
  name: string;
  email: string;
  profile_image: string | null;
  user_status: string;
  user_id: number;
  is_joined: boolean;
}

export interface CommunityMembers {
  followers: CommunityMember[];
  admin: CommunityMember[];
  moderator: CommunityMember[];
}
export interface CommunityMembersApiResponse {
  status: number;
  data: CommunityMembers;
  error: string[];
  pagination: {
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    per_page: number;
    prev_page_url: null;
    to: 7;
    total: 7;
    current_page: 1;
  },
}

export interface Hints {
  // for person
  id: string;
  index: string;
  org_id: number;
  type: string;
  name?: string;
  email?: string;
  username?: string;
  profile_image?: string | null;
  title?: string;
  description?: string;
  organization_id?: number;
  tags?: string[];
  image?: string;
  post_name?: string;
  created_by?: string;
  category_name?: string;
  thumbnail_url?: string;
  tag: string | null;
  logo?: string;
}

export interface Suggestion {
  type: string;
  total: number;
  hits: Hints[]
}

export interface SuggestionsApiResponse {
  success: boolean;
  suggestions: Suggestion[];
  error: string | null;
}


// old

export interface Dimension {
  height: number;
  width: number;
}

export interface Data {
  post: Post[];
}

export interface CommunityData {
  status: number;
  data: Data;
  error: string;
}

export interface CommunityDetailsList {
  list: Post[];
  category: CommunityCategory;
}

export interface CommunityDetailsApiResponse {
  status: number;
  data: CommunityDetailsList;
  error: string;
}


export interface OrgCommunities {
  org_name: string;
  org_id: number;
  org_logo: string;
  org_type: string;
  communities: CommunityCategory[];
}
export interface OrgCommunityApiResponse {
  status: number;
  data: OrgCommunities[];
  error: string;
}

export interface RecCommunities {
  title:string;
  id: number;
  logo: string;
  type: string;
  total_user_joined: string;
  image: string;
  domain_name: string;
  description: string;
}

export interface RecCommunityApiResponse {
  status: number;
  data: RecCommunities[];
  error: string;
}


export interface UserCommunityAnalytics {
  community_member_count: {
    count: number;
    percentat: string;
  },
  communities_created: {
    count: number;
    percentat: string;
  },
  posts_created: {
    count: number;
    percentat: string;
  },
  post_view_count: {
    count: number;
    percentat: string;
  },
  post_like_count: {
    count: number;
    percentat: string;
  },
  post_comment_count: {
    count: number;
    percentat: string;
  },
  repost_count: {
    count: number;
    percentat: string;
  },
  follower_count: {
    count: number;
    percentat: string;
  },
  badge: {
    count: number | null;
    percentat: string;
  },
  points_earned: {
    count: number;
    percentat: string;
  }
}

export interface UserCommunityAnalyticsApiResponse {
  status: number;
  data: UserCommunityAnalytics;
  error: string;
}


// posts 
export interface CommunityPostsApiResponse {
  status: number;
  data: {
    posts: Post[];
    community: CommunityCategory;
  };
  error: string;
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
  }
}


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