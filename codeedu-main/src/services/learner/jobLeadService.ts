import ApiService from '../ApiService';
import { uploadFile } from '../resume/ResumeService';

export type JobLeadPayload = {
  type: number;
  company_name?: string;
  job_role?: string;
  location?: string;
  joining_date?: string;
  duration?: string;
  domain_name?: string;
  project_details?: string;
  problem_challenge?: string;
  current_location?: string;
  preferred_location?: string;
  desired_job_domain?: string;
  mentor_name?: string;
  note?: string;
  help_needed?: string;
  is_lead_saved?: number;
};

export interface JobLeadResponse {
  status: number;
  message: string;
  data?: any;
  exists?: boolean;
}

export async function saveJobLead(data: any, pdfFile?: File): Promise<JobLeadResponse> {
  let pdfUrl: string | undefined = undefined;

  if (pdfFile) {
    try {
      const uploadRes = await uploadFile(pdfFile, 'offer_letters');
      pdfUrl = uploadRes.file.url;
    } catch (err) {
      console.error('Failed to upload PDF', err);
      throw new Error('Failed to upload the attached file. Please try again.');
    }
  }

  let formData: FormData;
  if (data instanceof FormData) {
    formData = data;
    if (pdfUrl) {
      formData.append('pdf_file', pdfUrl);
    }
  } else {
    formData = new FormData();
    Object.keys(data).forEach(key => {
      let value = data[key];
      if (value === null || value === undefined) {
        value = '';
      }
      formData.append(key, value);
    });
    if (pdfUrl) {
      formData.append('pdf_file', pdfUrl);
    }
  }
  const response = await ApiService.fetchDataWithAxios<JobLeadResponse, FormData>({
    url: '/v1/job-lead-save',
    method: 'post',
    data: formData,
  });
  return response;
}
