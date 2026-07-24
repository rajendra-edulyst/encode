export interface QuickAction {
    user_id: number;
    title: string;
    content_id: number;
    assessment_start_date: number,
    assessment_end_date: number,
    level: string,
    label: string,
    message: string,
    action_url: string,
}

export interface QuickActions {
    quick_action: QuickAction[]
}

export interface QuickActionData {
    status: number;
    data: QuickActions;
    error: string[];
}