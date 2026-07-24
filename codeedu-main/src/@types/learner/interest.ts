export interface InterestArea {
    id: number;
    name: string;
    description: string | null;
    organization_id: number;
    status: string;
    created_at: string;
    updated_at: string;
    parent_id: number | null;
    is_mapped: number | null;
    image: string | null;
}

export interface InterestAreaData {
    status: number;
    data: InterestArea[];
    error: any[];
}