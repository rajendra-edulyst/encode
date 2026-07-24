export type Settings = {
    organization: {
        name: string
        logo: string
        parent_id: number | null
        description: string | null
        template_image: string | null
    },
    configuration: {
        primary_color: string;
        text_color: string;
        header_color: string;
        fav_icon: string;
        enable_must_watchout: number;
        unlimited_mentor_slot: number;
        organization_goal: Array<{
            title: string;
            description: string;
        }>;
        organization_partner_count: Array<{
            title: string;
            count: number;
        }>;
        social_links: { [key: string]: string; };
        policies: Array<{
            title: string;
            url: string;
        }>;
    }
}


export interface SettingsApiResponse {
    data: Settings;
    message: string;
    status: number;

}
export type Patners = Array<{
    id: number
    name: string
    description: string
    short_code: string
    image: string
    organization_id: number
    url: string
}>

export interface PatnersApiResponse {
    data: Patners;
    message: string;
    status: number;
}