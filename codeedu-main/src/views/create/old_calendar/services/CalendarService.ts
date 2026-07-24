import ApiService from '@/services/ApiService';
import { Event, EventData, EventResponse, MentorApiResponse, User, Batch, BatchApiResponse, SearchUser, SearchUserApiResponse, InvitedUsersApiRes, PendingInvitesApiResponse, PendingInvites, createEventApiResponse } from '../@types/calendar';
import { AllMentorList, AllMentorListResponse, LMSMentor, LMSMentorApiResponse } from '@/@types/create/mentor';

export async function fetchEvents(month?: string): Promise<EventData> {
  try {
    const response = await ApiService.fetchDataWithAxios<EventData>({
      url: 'user-calendar-list',
      method: 'post',
      data: { month },
    });
    return response;
  } catch {
    throw new Error('Failed to fetch events');
  }
}

export interface AvailabilityTime {
  available_date: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
}


export interface Availability {
  status: number;
  data: AvailabilityTime[];
  error: string;
}

export async function getUserAvailability(user_id: number): Promise<AvailabilityTime[]> {
  try {
    const response = await ApiService.fetchDataWithAxios<Availability>({
      url: `get-user-availabilities?user_id=${user_id}`,
      method: 'get'
    })
    return response.data;
  } catch {
    throw new Error('Failed to fetch availability');
  }
}

export async function fetchAllCalendarSessions(month?: string): Promise<EventData> {
  try {
    const response = await ApiService.fetchDataWithAxios<EventData>({
      url: 'user-all-calendar-session',
      method: 'post',
      data: { month },
    });
    return response;
  } catch {
    throw new Error('Failed to fetch events');
  }
}

export async function createEvent(event: Event | FormData): Promise<createEventApiResponse> {
  try {
    const response = await ApiService.fetchDataWithAxios<createEventApiResponse, Event | FormData>({
      url: 'user-calendar-save',
      method: 'post',
      data: event instanceof FormData ? event : { ...event },
    });
    return response;
  } catch {
    throw new Error('Failed to create event');
  }
}

export async function updateEvent(event: Event): Promise<Event> {
  try {
    const response = await ApiService.fetchDataWithAxios<EventResponse>({
      url: `wp/calendar/events/${event.id}`,
      method: 'put',
      data: { ...event },
    });
    return response.data;
  } catch {
    throw new Error('Failed to update event');
  }
}

export async function deleteEvent(eventId: string): Promise<void> {
  try {
    console.log(eventId);
    await ApiService.fetchDataWithAxios<void>({
      url: `user-calendar-delete`,
      method: 'post',
      data: { calender_id: eventId },
    });
  } catch {
    throw new Error('Failed to delete event');
  }
}


export async function fetchMentorList(): Promise<User[]> {
  try {
    const response = await ApiService.fetchDataWithAxios<MentorApiResponse>({
      url: `/get-mentors-list`,
      method: 'post',
    });

    return response.data;
  } catch (error) {
    throw error as string;
  }
}


export async function fetchBatches(parms?: URLSearchParams): Promise<Batch[]> {
  try {
    const response = await ApiService.fetchDataWithAxios<BatchApiResponse>({
      url: '/v1/faculty-batches',
      method: 'get',
      params: parms,
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}

export async function fetchUsers(query: string): Promise<SearchUser[]> {
  try {
    const response = await ApiService.fetchDataWithAxios<SearchUserApiResponse>({
      url: '/v1/user-search',
      method: 'get',
      params: {
        query,
      },
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}


export async function fetchInvitedUsers(EventId: number): Promise<InvitedUsersApiRes> {
  try {
    const response = await ApiService.fetchDataWithAxios<InvitedUsersApiRes>({
      url: `/calender-invited-user/${EventId}`,
      method: 'post',
    });
    return response;
  } catch (error) {
    throw error as string;
  }
}


export async function fetchPendingInvites(): Promise<PendingInvites[]> {
  try {
    const response = await ApiService.fetchDataWithAxios<PendingInvitesApiResponse>({
      url: `/calender-pending-list`,
      method: 'post',
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}

export async function AcceptInvite(InviteId: number): Promise<PendingInvites[]> {
  try {
    const response = await ApiService.fetchDataWithAxios<PendingInvitesApiResponse>({
      url: `/update-calender-invited/${InviteId}`,
      method: 'post',
      data: { "status": "1" }
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}

export async function RejectInvite(InviteId: number): Promise<PendingInvites[]> {
  try {
    const response = await ApiService.fetchDataWithAxios<PendingInvitesApiResponse>({
      url: `/update-calender-invited/${InviteId}`,
      method: 'post',
      data: { "status": "2" }
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}
export async function fetchMentorListV2(): Promise<AllMentorListResponse> {
  try {
    const response = await ApiService.fetchDataWithAxios<AllMentorListResponse>({
      url: `get-mentor-list-v2`,
      method: 'get',

    });
    return response;
  } catch (error) {
    throw error as string;
  }
}