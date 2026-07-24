import ApiService from '@/services/ApiService';
import { CalendarEvent } from '../types/calendar';

type ServerEvent = {
  id: number | string;
  title: string;
  start?: string;
  end?: string;
  start_date?: string;
  end_date?: string;
  is_mentoring?: number;
  approval_status?: number;
  link?: string;
  invited_user?: any[];
};

type EventData = {
  data: ServerEvent[];
  pending_request?: number;
};

export async function fetchServerEvents(month?: string): Promise<EventData> {
  return ApiService.fetchDataWithAxios<EventData>({
    url: 'user-calendar-list',
    method: 'post',
    data: { month },
  });
}

function toIsoDateTime(dt?: string) {
  if (!dt) return undefined;
  // server may return "YYYY-MM-DD HH:MM" — replace space with T for Date parsing
  const normalized = dt.replace(' ', 'T');
  const d = new Date(normalized);
  if (isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

export async function fetchCalendarEvents(month?: string): Promise<{ events: CalendarEvent[]; pending_request?: number }> {
  const res = await fetchServerEvents(month);
  const serverEvents = (res.data || []) as ServerEvent[];
  const events: CalendarEvent[] = serverEvents.map((e) => ({
    id: String(e.id),
    title: e.title,
    startTime: toIsoDateTime(e.start) || toIsoDateTime(e.start_date) || new Date().toISOString(),
    endTime: toIsoDateTime(e.end) || toIsoDateTime(e.end_date) || new Date().toISOString(),
    approval_status: e.approval_status,
    is_mentoring: e.is_mentoring,
    originalId: e.id,
    // normalize possible link fields from the server (some responses use `link`, `event_link` or `meeting_link`)
    link: (() => {
      const r = e as unknown as Record<string, unknown>;
      const v = r.link ?? r.event_link ?? r.meeting_link;
      return typeof v === 'string' ? v : undefined;
    })(),
    color: (() => {
      // approval_status: 1 -> primary, 0 -> gray, otherwise mentoring -> orange, default blue
      if (e.approval_status === 1) return 'primary';
      if (e.approval_status === 0) return 'gray';
      if (e.is_mentoring) return 'orange';
      return 'blue';
    })(),
    invited_user: e.invited_user,
  }));

  return { events, pending_request: res.pending_request };
}

export async function createServerEvent(payload: { title: string; start_date: string; end_date: string; description?: string; purpose?: string }) {
  return ApiService.fetchDataWithAxios({
    url: 'user-calendar-save',
    method: 'post',
    data: payload,
  });
}
export interface UserAvailability {
  id: number;
  user_id: number;
  availability_type: string;
  available_date: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  recurrence_interval: string;
  timezone: string;
  role: string;
  status: string;
  meeting_status: string;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
}
export interface SaveUserAvailabilitiesResponse {
  status: number;
  data: UserAvailability;
  error?: {
    message?: string;
    [key: string]: any;
  };
}

// Save user availability: accepts { date: 'YYYY-MM-DD', start_time: 'HH:MM', end_time: 'HH:MM' }
export async function saveUserAvailabilities(payload: { date: string; start_time: string; end_time: string }) {
  return ApiService.fetchDataWithAxios<SaveUserAvailabilitiesResponse>({
    url: 'save-user-availabilities',
    method: 'post',
    data: payload,
  });
}

export async function removeUserAvailability(availabilityId: string | number) {
  return ApiService.fetchDataWithAxios<SaveUserAvailabilitiesResponse>({
    url: 'remove-user-availability',
    method: 'post',
    data: { availability_id: availabilityId },
  });
}

export async function getUserAvailabilities() {
  return ApiService.fetchDataWithAxios<SaveUserAvailabilitiesResponse>({
    url: 'get-user-availabilities',
    method: 'get',
  });
}

export async function getAllMyAvailabilities() {
  return ApiService.fetchDataWithAxios<SaveUserAvailabilitiesResponse>({
    url: 'get-my-all-availabilities',
    method: 'get',
  });
}

export async function deleteServerEvent(eventId: string | number) {
  return ApiService.fetchDataWithAxios({
    url: `user-calendar-delete`,
    method: 'post',
    data: { calender_id: eventId },
  });
}

// eslint-disable-next-line
export async function updateServerEvent(eventId: string | number, payload: any) {
  return ApiService.fetchDataWithAxios({
    url: `wp/calendar/events/${eventId}`,
    method: 'put',
    data: payload,
  });
}
