export interface NotificationMeta {
  id: number;
  route: string;
  sound: string;
  message: string;
  content_type: string;
  organization_id: number;
}

export interface Notification {
  id: number;
  user_id: number;
  organization_id: number;
  status: string;
  message: string;
  message_type: string;
  notification_type: string;
  reference_id: number;
  message_title: string;
  is_read: number;
  redirect_url: string;
  meta: string | NotificationMeta;
  created_at: string;
  updated_at: string;
}

export interface NotificationData {
  current_page: number;
  data: Notification[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface NotificationApiResponse {
  status: number;
  data: NotificationData;
  error: string[];
}
