export type PortfolioProfile = {
    name: string,
    headline: string,
    country: string,
    city: string,
    lastName: string,
    email: string,
    phone: string,
    state: string,
    about_me: string,
    id: number
}


export type Portfolio = {
    portfolio_title: string;
    portfolio_link: string;
    action: string;
    portfolio_key: string;
    edit_url_portfolio: string;
    edit_image_type: string;
    desc: string;
    image_name: string;
    portfolio_file: string;
    id: number;
};
export type Activity = {
    activity_type: string,
    title?: string,
    description?: string,
    start_date?: string,
    percentage?: string,
    end_date?: string,
    institute?: string,
    certificate?: string,
    action?: string,
    professional_key?: string,
    edit_url_professional?: string,
    employment_type?: string,
    currently_work_here?: string,
    curricular_type?: string,
    image_name?: string,
    id?: number,
    // new fields
    study_field?: string,
    location?: string,
    grade?: string,
};

export type PortfolioSocial = {
    mob_num: string,
    email: string,
    linkedin: string,
    facebook: string,
    twitter: string,
    site_url: string,
    bee: string,
    dribble: string,
    insta: string,
    pinterest: string,
    other: string,
    mob_num_hidden: string,
    email_hidden: string,
    id: number
};

export type ActivitySaveResponse = {
    status: number;
    data: {
        list: string;
    };
    error: string;
};

export type ActivityDeleteResponse = {
    status: number;
    data: {
        list: string;
    };
    error: string;
};


export type UserPortfolio = {
    image: string;
    name: string;
    verified: number;
    resume: Array<{ url: string, id: number }>;
    profile_video: string;
    profile_video_cdn: string;
    portfolio_profile: PortfolioProfile[];
    base_file_url: string;
    open_to_work: string;
    skill: SkillsResponseData[];
    portfolio: Portfolio[];
    Certificate: Activity[];
    Publication: Activity[];
    extra_activities: Activity[];
    Education: Activity[];
    Experience: Activity[];
    Project: Activity[];
    Extra: Activity[];
    portfolio_social: PortfolioSocial[];
    profile_completion: number;
    resume_parser_data_count: number;
    video_resume?: VideoResumes[];
    banner: {
        url: string,
        id: number
    }[]
}

export type PortfolioAddResponse = {
    status: number
    data: {
        list: string
    }
    error: string
}

export type UserPortfolioResponse = {
    status: number;
    data: UserPortfolio;
    error: string;
};

export type PortfolioSocialResponse = {
    status: number;
    data: {
        list: string;
    };
    error: string;
};

export type UpdatePortfolioInfoResponse = {
    status: number;
    data: {
        list: string;
        profile_image: string;
    };
    error: string;
};


// skills


// skills Suggestion Data

export type SkillsSuggestion = {
    id: number,
    name: string,
    description: string,
    organization_id: number,
    status: string,
    created_at: string,
    updated_at: string,
    parent_id: null
}

export type SkillsSuggestionResponse = {
    status: number;
    data: SkillsSuggestion[];
    error: string;
};

export type SkillsResponseData = {
    id?: number,
    organization_id?: number,
    user_id?: number,
    skill_id: number,
    self_proficiency?: string,
    assesed_proficiency?: null,
    assessment_content_id?: null,
    assessment_score?: null,
    assesed_date?: null,
    status?: string,
    created_at?: string,
    updated_at?: string,
    name?: string,
    description?: null
}

export type SkillsRequest = {
    skill_id: string
    self_proficiency: string
}


export type SkillsResponse = {
    status: number;
    data: SkillsResponseData[];
    error: string;
};

export type SkillAddResponse = {
    status: number;
    data: string;
    error: string;
};




export type VideoResume = {
    url: string;
    video_title: string;
    video_text: string;
    video_thumbnail: string;
    type: string;
    webm_url: string;
    created_date: string;
};

export type VideoResumes = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
};
