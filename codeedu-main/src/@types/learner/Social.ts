export interface Dimension {
    height: number;
    width: number;
}

export interface Post {
    created_by_profile_image: any;
    created_by_image: any;
    designation: string;
    qualification: string;
    linkedin: string;
    experience: string;
    bio: string;
    created_by_name: string;
    id: number;
    title: string;
    organization_name: string;
    org_logo: string;
    description: string;
    platform: string;
    read_time: string;
    created_at: number;
    created_by: number;
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
    multi_file_uploads_count: string[];
    multi_file_uploads_dimension: string[];
    thumbnail_url: string;
    is_attempt: number;
    user_submitted_file: string;
    user_submitted_multiple_file: string[];
}

export interface PostDetailApiResponse {
    status: number;
    data: {
        list: Post[];
    };
    error: string;
}

export interface PostApiResponse {
    status: number;
    data: {
        post: Post[];
    };
    error: string;
}