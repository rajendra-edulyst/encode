
export type Promotion = {
    id: number;
    placeholder: string;
    type: string;
    reference_id: number;
    organization_id: number;
    user_id: number;
    url_ref: string;
    sequence: number;
    tab_name: string;
    display_name: string;
    status: string;
    created_by: number;
    description: string;
    file: string;
    profiles: {
        id: number;
        name: string;
        image: string;
        description: string;
        profile_image: string;
        role: string;
        location: string;
        profileSection?: any;
    }[];
};


export type PromotionApiResponse = {
    data: Promotion[];
    message: string;
    status: string;
};