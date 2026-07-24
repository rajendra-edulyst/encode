export type LiveClass = {
    id: number;
    content_type: string;
    name: string;
    description: string;
    duration: number;
    from_date: number;
    program_id: number;
    program_name: string;
    level: string;
    batch: string;
    zoom_url: string;
    zoom_passkey: string;
    class_status: string;
    open_url: string | null;
    record_url: string | null;
    record_available: boolean | null;
    parent_id: number | null;
    language_id: number;
    url: string;
    passkey: string;
    liveclass_action: string;
    liveclass_action_title: string;
    session_starting_in: string;
    attendance_status: string;
    call_to_action: {
        action: string;
        action_title: string;
        session_starting_in: string;
    };
    end_date: number;
    liveclass_status: string;
    trainer_name: string;
    start_time: string;
    starttime_ts: number;
    end_time: string;
    endtime_ts: number;
    trainer_id: number;
    module_name?: string;
};

export type Pagination = {
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
};

export type LiveClassApiResponse = {
    status: number;
    data: {
        modules: {
            liveclass: LiveClass[];
        };
    };
    error: string[];
};

export type LiveClassDetails = {
    status: number;
    data: LiveClass;
    error: string[];
};

export interface ZoomLCLoadResponse {
    status: number;
    data: string;
    error: any[];
}