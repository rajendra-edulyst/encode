export interface FunctionalDomain {
    id: number;
    name: string;
    child_domains: string;
    is_mapped: number;
}

export interface FunctionalDomainApiResponse {
    status: number;
    data: FunctionalDomain[];
    error: string[];
}
