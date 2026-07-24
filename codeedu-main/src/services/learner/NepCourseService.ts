// services/learner/NepCourseService.ts
import ApiService from '@/services/ApiService';

export async function fetchNepCategory(type?: string) {
  return await ApiService.fetchDataWithAxios<{ data: { id: string; name: string }[] }>({
    url: `/v1/category-list`,
    method: 'post',
    data: { type },
  });
}

export async function fetchNepCourseById(category_id: string) {
  return await ApiService.fetchDataWithAxios<{ data: any[] }>({
    url: `/v1/program_list`,
    method: 'post',
    data: { category_id },
  });
}


export async function fetchNepCourseTimer(): Promise<number> {
    const res = await ApiService.fetchDataWithAxios<{ data: { course_registration_timer?: string } }>({
      url: `/settings/?type=1`,
      method: 'get',
    });
  
    const timer = res?.data?.course_registration_timer;
    if (!timer || isNaN(Number(timer))) {
      return 0; // fallback to 0 when invalid/missing
    }
  
    return Number(timer); // already in seconds
  }