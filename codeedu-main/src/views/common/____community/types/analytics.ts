export interface AnalyticGraph {
    label: string;
    likes: number;
    views: number;
}

export interface AnalyticsApiResponse {
    data: AnalyticGraph[];
    status: boolean;
    message: string;
}

export interface Impressions {
    video: number;
    images: number;
    blogs: number;
    Reels: number;
}

export interface AnalyticsImpressionsApiResponse {
    data: Impressions;
    status: boolean;
    message: string;
}

export interface MyActivity {
    like: number;
    comment: number;
    repost: number;
    communities_created: number;
    event_count: number;
    internship_count: number;
}

export interface MyActivityApiResponse {
    status: number;
    message: string;
    data: MyActivity;
}


export interface LikedPost {
    id: number;
    title: string;
    category: string;
    time: string;
    description: string;
    resource_path_thumbnail: string;
    category_name: string;
    created_at: string;
    post_created_by_id: number;
    post_created_by_name: string;
    post_created_by_profile_image: string;
}

export interface LikedPostApiResponse {
    status: number;
    message: string;
    data: LikedPost[];
}

export interface CommentPost {
    id: number;
    title: string;
    category: string;
    time:string;
    description: string;
    resource_path_thumbnail: string;
    category_name: string;
    created_at: string;
    post_created_by_id: number;
    post_created_by_name: string;
    profile_url:string;
    post_created_by_profile_image: string;
}

export interface CommentPostApiResponse {
    status: number;
    message: string;
    data: CommentPost[];
}

export interface Events {
    id: number;
    name: string;
    image: string;
    created_at: string;
    start_date: string;
    end_date: string;
    com_status:{
    program_status: string | null;
    program_time: string | null;
  }
}

export interface EventsApiResponse {
    status: number;
    message: string;
    data: Events[];
}

export interface Internship {
    id: number;
    name: string;
    image: string;
    description: string;
    location: string;
    start_date: string;
}

export interface InternshipApiResponse{
    status: number;
    message: string;
    data: Internship[];
}

