export type CompanyApiResponse = {
    status: number;
    error: string[];
    data: Company[];
};

export type Company = {
    id: number;
    name: string;
    email: string;
    description: string;
    thumbnail: string;
}