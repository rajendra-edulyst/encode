export type Preference = {
    id: number;
    name: string;
    description: string;
    price: number;
    color_code: string;
    icon_code: string;
    icon: string,
    hover_icon: string,
    type: string;
    status: number;
    duration: string,
    credits: number,
    start_date: string,
    end_date: string,
    categories: Array<{
        id: number;
        name: string;
        items: Array<{
            id: number;
            title: string;
            status: string;
            contentsPackage: Array<{
                id: number;
                type: string;
                allowed_access_count: number;
            }>;
        }>;
        category_color_code: string;
    }>;
};

export interface PreferenceResponse {
    status: number;
    data: Array<Preference>;
    error: Array<string>;
}

export type FunctionalDomain = {
    id: number;
    name: string;
    child_domains: string;
    is_mapped: number;
};

export interface FunctionalDomainResponse {
    status: number;
    data: Array<FunctionalDomain>;
    error: Array<string>;
}


export type UserProfile = {
    id: number;
    name: string;
    email: string;
    profile_image: string;
    platform_name: string;
    is_hire_me_enabled: number;
    is_skill_up_enabled: number;
    is_hiring_now_enabled: number;
    is_co_collab_now_enabled: number;
    is_interest_save: number | null;
    is_co_create_enabled: number;
    organization_name: string | null;
    persona_stage: string;
    user_functional_domain: [{
        id: number;
        name: string;
    }];
    preference: {
        id: number;
        name: string;
        image: string;
    },
    package_id: number;
    packages: {
        package_id: number;
        name: string;
        description: string;
        price: number;
        color_code: string;
        icon_code: string;
        type: string;
        status: number;
        categories: Array<{
            category_id: number;
            category_name: string;
            items: Array<{
                item_id: number;
                title: string;
                content: [{
                    content_id: number;
                    content_type: string;
                    allowed_access_count: number;
                    used_access_count: number;
                }]
            }>;
            category_color_code: string;
        }>;
    },
    bio: string | null;
    user_profile: {
        _id: string;
        name: string;
        portfolio_id: string;
        org_id: string;
        role: string;
        uniqueIdentifier: string;
        isVerified: boolean;
        profileSection: {
            social_links: Array<{
                [key: string]: string
            }>;
        };
        status: string;
        __v: number;
        completion_percentage: number;
    }
    completed_hrs?: number;
    cci_start_date?: string | null;
    cci_stage_4?: number;
};

export interface UserProfileResponse {
    status: number;
    data: UserProfile;
    error: Array<string>;
}

export interface CCIStage1StatusResponse {
    status: number;
    data: {
        final: number;
    };
    message: string;
}