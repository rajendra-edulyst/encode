export type Community = {
    id: number;
    title: string;
    image: string;
    cover_image: string;
    location: string | null;
    description: string;
    total_user_joined: number;
    created_by: number;
    created_by_admin: boolean;
    created_at: string;
    is_public: boolean;
    domain_id: number | null;
    domain_name: string | null;
    user_joined_id: number | null;
    is_mute: number;
}

export interface OrgCommunities {
    org_name: string;
    org_id: number;
    org_logo: string;
    org_type: string;
    communities: Community[];
}

export interface OrgCommunityApiResponse {
    status: number;
    data: OrgCommunities[];
    error: string;
}


// community 
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


export type CommunityCategoryApiResponse = {
    status: number;
    data: CommunityCategory[];
    error: string;
}

export type CommunityCategoryDetailsApiResponse = {
    status: number;
    data: CommunityCategory;
    error: string;
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