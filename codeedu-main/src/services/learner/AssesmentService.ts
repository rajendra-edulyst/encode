import ApiService from '@/services/ApiService';
import { AssessmentAttemptApiResponse, AssessmentAttempt, AssessmentInstruction, AssessmentSubmitResponse, AssessmentFinishResponse, AssessmentInstructionApiResponse, AssessmentReview, AssessmentReviewResponse } from '@/@types/learner/assessment';

export async function fetchQuestions(contentId: string): Promise<AssessmentAttempt> {
  try {
    const response = await ApiService.fetchDataWithAxios<AssessmentAttemptApiResponse>({
      url: `/assessment-detail/${contentId}`,
      method: 'get'
    });
    return response?.data?.assessment_details;
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
  question_sequence?: string;
}): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('content_id', data.content_id.toString());
    formData.append('question_id', data.question_id.toString());

    // Handle option_id for MCQ/MRQ questions
    if (data.option_id !== undefined && data.option_id !== null) {
      if (Array.isArray(data.option_id)) {
        // For multiple choice questions, append each option
        data.option_id.forEach(optionId => {
          formData.append('option_id[]', optionId.toString());
        });
      } else {
        // For single choice questions
        formData.append('option_id[]', data.option_id.toString());
      }
    }

    // Handle answer_statement for text questions
    if (data.answer_statement !== undefined) {
      formData.append('answer_statement', data.answer_statement);
    }

    if (data.question_sequence !== undefined) {
      formData.append('question_sequence', data.question_sequence);
    }

    formData.append('mark_review', data.mark_review.toString());
    formData.append('durationSec', data.durationSec.toString());
    const response = await ApiService.fetchDataWithAxios<AssessmentSubmitResponse>({
      url: '/assessment-submit',
      method: 'post',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: formData as any,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response?.data?.attempt_id != null) {
      localStorage.setItem('attempt_id', `${response?.data?.attempt_id}`);
    }
    return response.message;
  } catch (error) {
    throw error as string;
  }
}


export async function assesmentFinish(content_id: string, student_id?: string): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('content_id', content_id.toString());
    if (student_id != undefined && student_id != null && student_id !== '') {
      formData.append('student_id', student_id.toString());
    }
    const response = await ApiService.fetchDataWithAxios<AssessmentFinishResponse>({
      url: `/assessment-onfinish`,
      method: 'post',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: formData as any,
    });
    return response.message;
  } catch (error) {
    throw error as string;
  }
}



export async function fetchAssessmentInsruction(program_content_id: string): Promise<AssessmentInstruction> {
  try {
    const response = await ApiService.fetchDataWithAxios<AssessmentInstructionApiResponse>({
      url: `/assessment-instructions/${program_content_id}`,
      method: 'get',
    })
    return response?.data?.instruction;
  } catch (error) {
    throw error as string;
  }
}



// export async function fetchAssessmentReview(contentId: string): Promise<AssessmentReview> {
//   try {
//     const response = await ApiService.fetchDataWithAxios<AssessmentReviewResponse>({
//       url: `/assessment-review/${contentId}`,
//       method: 'get',
//     });
//     return response?.data?.assessment_review;
//   } catch (error) {
//     throw error as string;
//   }
// }
export async function fetchAssessmentReview(contentId: string, attempt_id?: number): Promise<AssessmentReview> {
  try {
    const response = await ApiService.fetchDataWithAxios<AssessmentReviewResponse>({
      url: `/assessment-review/${contentId}?attempt_id=${attempt_id ?? ''}`,
      method: 'get',
    });
    return response?.data?.assessment_review;
  } catch (error) {
    throw error as string;
  }
}