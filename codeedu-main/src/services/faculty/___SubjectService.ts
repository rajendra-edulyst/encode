import ApiService from '@/services/ApiService';

export interface Subject {
    id?: number;
    level?: string;
    name?: string;
    description?: string;
    image?: string;
    start_date?: string;
    end_date?: string;
    created_at?: string;
    subscription_type?: string;
    batch_name?: string;
    tot_learners?: number;
    semester_name?: string;
    course_name?: string;
}



export interface Faculty {
    id: number;
    name: string;
    email: string;
}

export interface Batch {
    id: number;
    program_id: number;
    title: string;
    start_date: string;
    end_date: string;
}

export interface learners {
    id: number;
    name: string;
    email: string;
    batch: string;
    session: string;
}

export interface SubjectDetailsResponse {
    id: number;
    name: string;
    description: string;
    image: string;
    start_date: string;
    end_date: string;
    duration: string | null;
    status: string;
    created_at: string;
    faculties: Faculty[];
    batches: Batch[];
    learners: learners[];
}

export async function getSubjectsService(): Promise<Subject[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<{ success: boolean; data: Subject[] }>({
            url: '/faculty/subjects',
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function getSubjectDetailsService(id: number): Promise<SubjectDetailsResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<{ success: boolean; data: SubjectDetailsResponse }>({
            url: `/faculty/subjects/${id}`,
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}