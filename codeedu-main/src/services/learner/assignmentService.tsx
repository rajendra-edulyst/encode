/* eslint-disable @typescript-eslint/no-explicit-any */
import { AssignmentApiResponse, SubmissionApiResponse, Assignment } from "@/@types/learner/assignment";
import ApiService from "../ApiService";

export async function fetchAssignment(content_id: number | undefined): Promise<Assignment> {
    try {
        if (!content_id) throw 'Content ID is undefined';
        const response = await ApiService.fetchDataWithAxios<AssignmentApiResponse>({
            url: `/assignmentdetails/${content_id}`,
            method: 'get',
        });
        return response?.data?.assessment_details?.length > 0 ? response?.data?.assessment_details[0] : {} as Assignment;
    } catch (error) {
        throw error as string;
    }
}

export async function uploadeAssignment(formData: FormData): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<SubmissionApiResponse>({
            url: `/assignmentsubmit`,
            method: 'post',
            data: formData as any,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response?.message;
    } catch (error) {
        throw error as string;
    }
}