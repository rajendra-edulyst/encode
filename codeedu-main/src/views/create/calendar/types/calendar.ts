export interface InvitedUser {
  id: number;
  approval_status: number;
  name: string;
  email: string;
  profile_image: string;
  user_id: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  // color drives the UI class. We support the original palette plus primary/gray for approval status mapping.
  color: "blue" | "orange" | "purple" | "primary" | "gray";
  approval_status?: number;
  is_mentoring?: number;
  // If the current user has an outstanding invite for this mentoring session
  isPendingInvite?: boolean;
  // original server id (optional)
  originalId?: number | string;
  link?: string;
  meeting_status?: string;
  invited_user?: InvitedUser[];
}
