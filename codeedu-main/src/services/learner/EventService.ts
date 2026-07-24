import ApiService from '@/services/ApiService'
import { EventApiResponse, Event, ContentData, ContentDataResponse, EventActivityResponse, ParticipatingIndustry, ParticipatingIndustryResponse } from '@/@types/collaborate/events';
import { Job, JobApiResponse } from '@/@types/collaborate/jobs';

// fetch event list
// export async function fetchEvent(ongoing_date?: string | null, is_assigned?: number): Promise<Event[]> {
//     try {
//         const response = await ApiService.fetchDataWithAxios<EventData>({
//             url: '/competition-list' + (ongoing_date ? `?ongoing_date=${ongoing_date}` : '') + (is_assigned ? `&is_assigned=${is_assigned}` : ''),
//             method: 'get',
//         })
//         return response.data
//     } catch (error) {
//         throw error as string;
//     }
// }

export async function fetchEvent(params?: URLSearchParams | null): Promise<Event[]> {
  if (params) {
    params.forEach((value, key) => {
      if (value === 'undefined') {
        params.delete(key);
      }
    });
  }
  try {
    const response = await ApiService.fetchDataWithAxios<EventApiResponse>({
      url: '/competition-list',
      method: 'get',
      params: params
    })
    return response.data
  } catch (error) {
    throw error as string;
  }
}

// get event content by id
export async function fetchEventActivityContentById(id: string): Promise<ContentDataResponse> {
  try {
    const response = await ApiService.fetchDataWithAxios<ContentDataResponse>({
      url: `/learner-competition-detail/${id}`,
      method: 'get',
    })
    return response;
  } catch (error) {
    throw error as string;
  }
}


export async function fetchEventActivity(event_id: number): Promise<EventActivityResponse> {
  try {
    const response = await ApiService.fetchDataWithAxios<EventActivityResponse>({
      url: '/learner-competition-detail/' + event_id,
      method: 'get',
    });
    return response;
  } catch (error) {
    throw error as string;
  }
}

export async function fetchEventParticipatingIndustries(id: string): Promise<ParticipatingIndustry[]> {
  try {
    const response = await ApiService.fetchDataWithAxios<ParticipatingIndustryResponse>({
      url: `/event-industry-participating/${id}`,
      method: 'get',
    })
    return response.data;
  } catch (error) {
    throw error as string;
  }
}

export async function fetchEventJobs(program_id: string): Promise<Job[]> {
  try {
    const response = await ApiService.fetchDataWithAxios<JobApiResponse>({
      url: `/job-list-wow?program_id=${program_id}`,
      method: 'get',
    })
    return response.data;
  } catch (error) {
    throw error as string;
  }
}