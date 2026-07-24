export type Community = {
    id: number,
    title: string,
    description: number,
    image: string,
    total_user_joined: number,
    total_content: number
}

export type CommunityApiResponse = {
    status: number,
    data: Community[]
    error: string
}


export type CommunityDetailsResponse = {
    status: number,
    data: CommunityDetailsList
    error: string
}


export type CommunityDetailsList = {
    list: {
        id: number;
        title: string;
        description: string;
        created_at: number;
        created_by: number;
        updated_at: number;
        updated_by: number;
        status: string;
        parent_id: number;
        category_id: 187;
        content_type: 1;
        resource_path: string;
        language: 1;
        tag: null;
        total_likes: null;
        program_content_id: number;
        start_date: number;
        end_date: 1738346520;
        is_multilingual: number;
        visibility_value: number;
        visibility: number;
        multi_file_uploads: string;
    },
    category: Community
}