export interface Subject {
    id: number;
    name: string;
}

export interface SubjectApiResponse {
    status: number;
    data: Subject[];
    message: string;
}