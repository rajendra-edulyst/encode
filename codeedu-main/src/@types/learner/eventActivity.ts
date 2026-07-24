export interface CompetitionInstructions {
    whats_in: string;
    instructions: string;
    faq: string;
    landing_page_url: string;
}

export interface EventActivity {
    image: string | null;
    id: number;
    author_id: number;
    reference_id: number;
    reference_author_id: number;
    module_id: number;
    title: string;
    content: string;
    description: string;
    created_at: string;
    content_type: string;
    page_count: number | null;
    expected_duration: number;
    end_date: string;
    start_date: string;
    completion_percentage: number | null;
    user_id: number | null;
    g_score: number | null;
    activity_status: string | null;
    content_type_label: string;
    difficulty_level: string;
    per_completion: number | null;
    language_id: number;
    parent_id: number | null;
    liveclass_action:string;
}

export interface EventActivityResponse {
    status: number;
    data: {
        list: EventActivity[];
        competition_instructions: CompetitionInstructions;
    };
    error: any[];
}

