import axios from 'axios';
import ApiService from '../ApiService';

export interface FileUploadResponse {
    message: string;
    file: {
        id: number;
        url: string;
        title: string;
    }
}

export interface ResumeParseResponse {
    status: boolean;
    data: any;
}

export interface MatchingResumeResponse {
    status: boolean;
    data: any[];
}

/**
 * Uploads a file to the specified external upload service
 */
export async function uploadFile(file: File, folderName: string = 'resume'): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', 'file upload');
    formData.append('folder_name', folderName);

    try {
        const response = await axios.post<FileUploadResponse>(
            'https://evservice.edulystventures.com/api/files/upload',
            formData
        );
        return response.data;
    } catch (error) {
        console.error('File upload failed:', error);
        throw error;
    }
}

/**
 * Parses a resume by sending the file directly to the API
 */
export async function parseResume(file: File): Promise<ResumeParseResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await ApiService.fetchDataWithAxios<ResumeParseResponse>({
            url: '/addResume',
            method: 'post',
            data: formData as any,
        });
        return response;
    } catch (error) {
        console.error('Resume parsing failed:', error);
        throw error;
    }
}

