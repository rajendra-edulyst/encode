export interface Batch {
    id: number;
    title: string;
}

export interface BatchApiResponse {
    status: number;
    data: Batch[];
    message: string;
}