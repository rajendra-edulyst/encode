export type Event = {
    id: number;
    name: string;
    description: string;
    image: string;
    created_at: string;
    start_date: string;
    end_date: string;
    com_status: {
        program_status: string;
        program_time: string;
    }
};

export type ApiResponse = {
    status: number;
    data: Event[];
    error: string;
};


export type EventDetailsResponse = {
    status: number;
    data: EventDetailsData;
    error: string;
};

export type EventDetailsData = {
    competitions_details: {
        program: {
            name: string;
            description: string;
            image: string;
            start_date: string;
            end_date: string;
            status: string;
            competition_level: string;
            is_published: number;
            com_status: {
                program_status: string;
                program_time: string;
            }
            contents: [
                {
                    id: number;
                    title: string;
                    description: string;
                    start_date: string;
                    end_date: string;
                    status: string;
                    difficulty_level: string;
                    expected_duration: string;
                    content_type_label: string;
                }
            ]
            event_details: {
                functional_domain?: string;
                domain_name?: string;
            }
        }
    },
    competition_instructions: {
        whats_in: string;
        instructions: string;
        faq: string;
        landing_page_url: string;
    },
    is_assigned: number;
    job_skill_details: {
        all_program_skills: string[];
    }
};