export type Organization = {
    id: number;
    name: string;
    logo: string;
    org_description: string;
    brochure_url: string;
    banners: string[] | null;
    university_url: string;
    address: string;
    city: string;
    state_name: string;
    country_name: string
    rating: number;
    faqs: string[] | null;
    rank: number;
    about: string;
    admission: string;
    full_name: string;
    placements: string;
    short_name: string;
    testimonials: string[] | null;
    why_this_university: string;
    type: string
}

export type OrganizationApiResponse = {
    status: number;
    data: Organization[];
    error: string | null;
}


export type OrganizationDetailsResponse = {
    status: number;
    data: Organization;
    error: string[] | null;
}