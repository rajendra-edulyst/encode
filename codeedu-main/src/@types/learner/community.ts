export interface Dimension {
  height: number;
  width: number;
}

export interface CommunityCategory {
  id: number;
  title: string;
  description: string;
  image: string;
  user_mapping_id: number;
  total_user_joined: number;
}

export interface Post {
  id: number;
  title: string;
  organization_name: string;
  org_logo: string;
  description: string;
  created_at: string | Date | null;
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


// community 

export type CommunityCategoryApiResponse = {
  status: number,
  data: CommunityCategory[]
  error: string
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