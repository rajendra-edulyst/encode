export interface Advertisement {
    id: number;
    placeholder: string;
    type: string;
    reference_id: number | null;
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
    profiles: Profile[];
}

export interface Profile {
    id: number;
    name: string;
    logo: string;
    url: string;
    description: string;
}


export interface AdvertisementResponse {
    status: number;
    data: Advertisement[];
    error: string[];
}
