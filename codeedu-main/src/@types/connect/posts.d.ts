export interface Post {
  read_time: any;
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
  created_by_image: string | null;
  status: string;
  parent_id: number;
  category_id: number;
  content_type: string;
  /** May disagree with `content_type` on some list payloads; blog is often `1`. */
  content_type_id?: string | number;
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
  pin_by_id?: number;
  pin_by_role?: string;
  created_by_profile_image?: string | null;
}

export type PostApiResponse = {
  status: number;
  data: {
    post: Post[];
  };
  error: string;
}

export interface PostDetailApiResponse {
  status: number;
  data: {
    list: Post[];
  };
  error: string;
}


// comments
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


// search

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



// poll

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



export interface PollResult {
  content_id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  questions: PollResultQuestion[];
}

export interface PollResultQuestion {
  que_id: number;
  que_statement: string;
  question_options: PollResultOption[];
}

export interface PollResultOption {
  option_id: number;
  option_statement: string;
  percentage: number;
  vote_count: number;
  attempted: number;
}

export interface PollResultApiResponse {
  data: {
    survey_result: PollResult;
  };
  error: string[];
  status: number;
}

// Poll Response Types
export interface SavePollResponseData {
  content_id: string;
  question_id: number;
  option_id: string[];
}

export interface SavePollResponseResult {
  status: number;
  message: string;
  data?: unknown;
  error?: string;
}

export interface LikedUser {
  id: number;
  name: string;
  email: string;
  profile_image: string | null;
  mobile_no: string | null;
  username: string;
  organization_id: number;
}

export interface LikedUsersApiResponse {
  status: number;
  data: {
    current_page: number;
    data: LikedUser[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  error: string[];
}

export interface Dimension {
  width?: number;
  height?: number;
}