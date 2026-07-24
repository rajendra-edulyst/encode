export interface Session {
    title: string;
    id: number;
    status: string;
    start_date: string;
    program_name: string;
    expected_duration: number;
    content_type: string;
    record_url: string | null;
    content: string;
    liveclass_presenter_id: number;
    semester_name: string;
    course_name: string;
    batch_name: string;
    end_date: string;
    class_status: string;
    attended_count: number;
    total_users: number;
    module_name: string;
    is_external: number | null;
};

export interface SessionApiResponse {
    status: number;
    error: string[];
    data: Session[];
};


// get live url
export interface LiveUrlApiResponse {
    status: number;
    error: string[];
    data: {
        URL: string;
    };
}

// sessions users
export interface Learners {
    user_id: number;
    email: string;
    name: string;
    profile_image: string;
    status: 'Invited' | 'attended' | 'absent';
    join_time: string;
    leave_time: string;
    duration: string;
}

export interface SessionDetailsForUsersListing {
    image: null;
    id: number;
    description: string;
    title: string;
    content: null,
    created_at: string;
    start_date: string;
    content_type: string;
    per_completion: number | null;
    module_id: number;
    skill_id: number;
    program_id: number;
    is_external: number;
}


export interface SessionUsersApiData {
    class_users: Learners[];
    content_details: SessionDetailsForUsersListing[];
}

export interface SessionUsersApiResponse {
    status: number;
    error: string[];
    data: SessionUsersApiData;
}


// details
export interface SessionDetails {
    title: string;
    id: number;
    status: string;
    start_date: string;
    module_name: string;
    skill_name: string;
    program_name: string;
    expected_duration: number;
    content_type: string;
    record_url: string | null;
    content: null;
    batch_name: string | null;
    end_date: string;
    class_status: string;
    liveclass_faculty: {
        id: number;
        name: string;
    }[]
}

export interface SessionDetailsApiResponse {
    status: number;
    error: string[];
    data: SessionDetails;
}