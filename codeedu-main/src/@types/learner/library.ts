export interface Module {
    id: number;
    name: string;
    description: string;
    skill: {
        id: number;
        name: string;
        description: string;
        course: {
            id: number;
            name: string;
            description: string;
        }
    }
}

export interface Content {
    id: number;
    h5p_content_id: number;
    parent_id: number | null;
    program_id: number;
    content_type: 'video' | 'notes' | 'assignment' | 'assessment' | 'zoomclass' | 'liveclass' | 'offlineclass';
    title: string;
    description: string;
    content: string | null;
    venue: string | null;
    start_date: string;
    end_date: string;
    expected_duration: number;
    status: string;
    content_status: string | null;
    created_by: number;
    order_no: number | null;
    created_at: string;
    updated_at: string;
    page_count: number | null;
    problem_count: number;
    privacy: number;
    reference_id: number;
    reference_author_id: number;
    language_id: number;
    language_reference_id: number | null;
    zoom_url: string | null;
    zoom_passkey: string | null;
    order: number;
    g_score: number | null;
    content_type_label: string;
    difficulty_level: string;
    per_completion: number | null;
    created_timezone: string;
    status_message: string | null;
    industry_domain_id: number | null;
    stream_file_id: string | null;
    module: Module;
}

export interface ContentAPiResponse {
    status: number;
    data: Content[];
    error: string[];
    pagination: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
}