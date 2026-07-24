export interface Skill {
    skill_id: number;
    skill_name: string;
}

export interface SkillsApiResponse {
    status: number;
    data: Skill[];
    error?: string;
}
