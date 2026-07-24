import { AssessmentAttempt, AssessmentAttemptApiResponse, AssessmentInstruction, AssessmentInstructionApiResponse, AssessmentResult, AssessmentResultResponse, AssessmentReview, AssessmentReviewResponse } from "@/@types/create/courses";
import ApiService from "../ApiService";
import { Resource, ResourcesApiResponse } from "@/@types/learner/Courses";

type ZoomJoinContext = {
  joinUrl: string;
  openUrl: string;
  startUrl: string;
};

export async function fetchQuestions(
  contentId: string | undefined,
  student_id?: string,
  user_calender_id?: number
): Promise<AssessmentAttempt> {
  try {
    const response = await ApiService.fetchDataWithAxios<AssessmentAttemptApiResponse>({
      url: `/assessment-detail/${contentId}`,
      method: 'get',
      params: { student_id, user_calender_id }
    });
    return response?.data;
  } catch (error) {
    throw error as string;
  }
}

export async function assessmentQuestionSave(data: {
  content_id: string;
  question_id: number;
  option_id?: number | number[];
  answer_statement?: string;
  mark_review: number;
  durationSec: number;
  student_id?: number;
  question_sequence?: string;
}): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('content_id', data.content_id.toString());
    formData.append('question_id', data.question_id.toString());

    console.log('Data to be sent:', data.student_id);
    if (data.student_id !== undefined && data.student_id !== null) {
      formData.append('student_id', data.student_id.toString());
    }

    // Handle option_id for MCQ/MRQ questions
    if (data.option_id !== undefined && data.option_id !== null) {
      if (Array.isArray(data.option_id)) {

        data.option_id.forEach(optionId => {
          formData.append('option_id[]', optionId.toString());
        });
      } else {

        formData.append('option_id[]', data.option_id.toString());
      }
    }


    if (data.answer_statement !== undefined) {
      formData.append('answer_statement', data.answer_statement);
    }

    if (data.question_sequence !== undefined) {
      formData.append('question_sequence', data.question_sequence);
    }

    formData.append('mark_review', data.mark_review.toString());
    formData.append('durationSec', data.durationSec.toString());
    const response = await ApiService.fetchDataWithAxios<{
      message: string;
    }>({
      url: '/assessment-submit',
      method: 'post',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: formData as any,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.message;
  } catch (error) {
    throw error as string;
  }
}


export async function fetchAssessmentReview(assessment_id: string | undefined, attempt_id: string | undefined, student_id?: string | undefined): Promise<AssessmentReview> {
  try {
    const response = await ApiService.fetchDataWithAxios<AssessmentReviewResponse>({
      url: `/assessment-review/${assessment_id}`,
      method: 'get',
      params: { attempt_id, student_id }
    });
    return response?.data?.assessment_review;
  } catch (error) {
    throw error as string;
  }
}

export async function fetchAssessmentInsruction(content_id: number | undefined): Promise<AssessmentInstruction> {

  if (!content_id) {
    throw 'Content ID is undefined';
  }

  try {
    const response = await ApiService.fetchDataWithAxios<AssessmentInstructionApiResponse>({
      url: `/assessment-instructions/${content_id}`,
      method: 'get',
    })
    return response?.data?.instruction;
  } catch (error) {
    throw error as string;
  }
}

// assessment-result
export async function fetchAssessmentResult(assessment_id: string | undefined): Promise<AssessmentResult> {
  try {
    const response = await ApiService.fetchDataWithAxios<AssessmentResultResponse>({
      url: `/assessment-result/${assessment_id}`,
      method: 'get',
      params: { assessment_id }
    });
    return response?.data?.assessment_result;
  } catch (error) {
    throw error as string;
  }
}


// program-tools
export async function fetchProgramTools(program_id: string | undefined): Promise<Array<Resource>> {
  try {
    const response = await ApiService.fetchDataWithAxios<ResourcesApiResponse>({
      url: `/v1/program-resources/${program_id}`,
      method: 'get',
      params: { program_id }
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}



export async function fetchZoomContentJoinLink(contentId: number | undefined): Promise<string> {
  const context = await fetchZoomContentJoinContext(contentId);
  return context.joinUrl;
}

export async function fetchZoomContentJoinContext(
  contentId: number | undefined,
  isMentoring: 0 | 1 = 0
): Promise<ZoomJoinContext> {
  const pickFieldFromObject = (obj: Record<string, any>, field: string): string => {
    const value = obj?.[field];
    return typeof value === 'string' ? value : '';
  };

  const resolveField = (payload: unknown, field: string): string => {
    if (!payload) return '';

    if (typeof payload === 'string') {
      const trimmed = payload.trim();
      if (!trimmed) return '';
      if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
        try {
          return resolveField(JSON.parse(trimmed), field);
        } catch {
          return '';
        }
      }
      return '';
    }

    if (Array.isArray(payload)) {
      for (const item of payload) {
        const fieldValue = resolveField(item, field);
        if (fieldValue) return fieldValue;
      }
      return '';
    }

    if (typeof payload === 'object') {
      const asObj = payload as Record<string, any>;
      const direct = pickFieldFromObject(asObj, field);
      if (direct) return direct;

      const nestedCandidates = [asObj?.data, asObj?.result, asObj?.response];
      for (const nested of nestedCandidates) {
        const nestedValue = resolveField(nested, field);
        if (nestedValue) return nestedValue;
      }
    }

    return '';
  };

  const pickJoinUrlFromObject = (obj: Record<string, any>): string => {
    return (
      obj?.open_url ||
      obj?.start_url ||
      obj?.join_url ||
      obj?.url ||
      obj?.meeting_link ||
      ''
    );
  };

  const resolveZoomJoinUrl = (payload: unknown): string => {
    if (!payload) return '';

    if (typeof payload === 'string') {
      const trimmed = payload.trim();
      if (!trimmed) return '';

      // Some APIs return JSON string; parse and resolve recursively.
      if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
        try {
          const parsed = JSON.parse(trimmed);
          return resolveZoomJoinUrl(parsed);
        } catch {
          // Keep raw string if parsing fails.
        }
      }
      return trimmed;
    }

    if (Array.isArray(payload)) {
      for (const item of payload) {
        const url = resolveZoomJoinUrl(item);
        if (url) return url;
      }
      return '';
    }

    if (typeof payload === 'object') {
      const direct = pickJoinUrlFromObject(payload as Record<string, any>);
      if (direct) return direct;

      // Fallback for nested response wrappers.
      const nestedCandidates = [
        (payload as Record<string, any>)?.data,
        (payload as Record<string, any>)?.result,
        (payload as Record<string, any>)?.response,
      ];
      for (const nested of nestedCandidates) {
        const url = resolveZoomJoinUrl(nested);
        if (url) return url;
      }
    }

    return '';
  };

  const formData = new FormData();
  formData.append('cid', contentId ? contentId.toString() : '');
  formData.append('is_mentoring', String(isMentoring));
  try {
    const response = await ApiService.fetchDataWithAxios<{
      status: number;
      data: string;
      error: Array<string>;
    }>({
      url: `/lc/load`,
      method: 'post',
      data: formData as any,
    });

    const joinUrl = resolveZoomJoinUrl(response?.data);
    const openUrl = resolveField(response, 'open_url') || resolveField(response?.data, 'open_url');
    const startUrl = resolveField(response, 'start_url') || resolveField(response?.data, 'start_url');

    return { joinUrl, openUrl, startUrl };
  } catch (error) {
    throw error as string;
  }
}

export async function saveSurveyAnswers(data: {
  content_id: string;
  student_id?: number | null;
  user_calender_id?: number;
  answers: Array<{
    question_id: number;
    option_id?: number[];
    answer_statement?: string;
    marks_obtained?: number | null;
  }>;
}): Promise<string> {
  try {
    const response = await ApiService.fetchDataWithAxios<{
      message: string;
    }>({
      url: '/survey-submit',
      method: 'post',
      data: {
        content_id: parseInt(data.content_id),
        question_submitted: data.answers,
        student_id: data?.student_id,
        user_calender_id: data?.user_calender_id

      },
    });
    return response.message;
  } catch (error) {
    throw error as string;
  }
}


export async function fetchProgramUserList(program_id: string | undefined): Promise<Array<{ id: number; name: string; email: string; profile_image: string; batch_name: string; }>> {
  try {
    const response = await ApiService.fetchDataWithAxios<{
      data: any;
    }>({
      url: `/v1/program-user-list/${program_id}`,
      method: 'get',
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}

export type AppliedStudent = {
  user_id: number;
  name: string;
  email: string;
  mobile_no?: string | null;
  profile_image: string | null;
  enrollment_number: string | null;
  applied_at: string;
  job_status: number;
  document_url: string | null;
  college: string | null;
  course: string | null;
  passing_year: string | null;
  department_name: string | null;
  job_status_text: string;
  employment_type?: string | null;
  employ_type?: string | null;
  mec_regd_id?: string | null;
  academic_details: {
    college: string | null;
    course: string | null;
    passing_year: string | null;
    department: string | null;
    enrollment_number: string | null;
  };
};

export async function fetchAppliedStudentsByJob(job_id: string | undefined): Promise<AppliedStudent[]> {
  try {
    const response = await ApiService.fetchDataWithAxios<{
      status: number;
      data: AppliedStudent[];
      error: any[];
    }>({
      url: `/applied-students-by-job/${job_id}`,
      method: 'get',
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}


export async function fetchProgramStudentReviewed(content_id: string | undefined): Promise<Record<string, number>> {
  try {
    const response = await ApiService.fetchDataWithAxios<{
      data: Record<string, number>
    }>({
      url: `/student_reviewed`,
      method: 'post',
      data: { content_id }
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}