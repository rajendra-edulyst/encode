/* eslint-disable @typescript-eslint/no-explicit-any */

import ApiService from "@/services/ApiService";
import { JobDetailsData, JobDetailsResponse } from "../@types/jobsDetails";

export async function fetchJobDetails(jobId: string): Promise<JobDetailsData> {
  try {
    const response = await ApiService.fetchDataWithAxios<JobDetailsResponse>({
      url: `/get_job_details/${jobId}`,
      method: 'get',
    });

    return response.data ? response.data.length > 0 ? response.data[0] : {} as JobDetailsData : {} as JobDetailsData;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to fetch job details');
  }
}

export async function deleteJob(jobId: string): Promise<void> {
  try {
    await ApiService.fetchDataWithAxios({
      url: `/job-delete`,
      method: 'post',
      data: {
        program_id: jobId
      },
    });
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to delete job');
  }
}