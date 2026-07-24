import { AssignedProgram, AssignedProgramResponse, FreeProgram, FreeProgramApiResponse, ProgramDetails, ProgramDetailsResponse, AssignedProgramForFilterApiResponse, AssignedProgramForFilter, CourseModuleApiResponse, CommonModuleContent, ProgramBatchAndModule, ProgramBatchAndModuleApiResponse, ProgramCategoryResponse, ProgramCategory, CreateProgramResponse, CreateProgramData, SaveContentOrderPayload, SaveContentResponse } from '@/@types/faculty/program';
import ApiService from '@/services/ApiService';


// program category list
export async function fetchProgramCategoryList(): Promise<ProgramCategory[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<ProgramCategoryResponse>({
            url: '/get-course-category',
            method: 'get',
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchAssignedPrograms(params?: URLSearchParams): Promise<AssignedProgram[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<AssignedProgramResponse>({
            url: '/v1/faculty-programs',
            method: 'get',
            params: params,
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// program details
export async function fetchProgramDetails(programId: string | number | undefined): Promise<ProgramDetails> {
    try {

        if (!programId) {
            throw "Program Id Not Found...";
        }

        const response = await ApiService.fetchDataWithAxios<ProgramDetailsResponse>({
            url: `/v1/get-course-details/${programId}`,
            method: 'get',
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}


export async function fetchModulesContents(moduleId: number | string | undefined): Promise<CommonModuleContent[]> {
    try {

        if (!moduleId) {
            throw "Module Id Not Found...";
        }

        const response = await ApiService.fetchDataWithAxios<CourseModuleApiResponse>({
            url: `/v1/module-content-list/${moduleId}`,
            method: 'get',
        });
        return response.data?.contents;
    } catch (error) {
        throw error as string;
    }
}

// free courses
export async function fetchFreePrograms(type?: string): Promise<FreeProgram[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<FreeProgramApiResponse>({
            url: '/v1/free-courses',
            method: 'get',
            params: {
                type: type,
            },
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}


export async function fetchAssignedProgramsforFilter(): Promise<AssignedProgramForFilter[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<AssignedProgramForFilterApiResponse>({
            url: '/v1/faculty-program',
            method: 'post',
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}


// program batch and module
export async function fetchProgramBatchAndModule(programId: number): Promise<ProgramBatchAndModule> {
    try {
        const response = await ApiService.fetchDataWithAxios<ProgramBatchAndModuleApiResponse>({
            url: `/v1/faculty-module-batch`,
            method: 'post',
            data: {
                program_id: programId,
            }
        });
        return response?.data?.original
    } catch (error) {
        throw error as string;
    }
}

// create a new program
export async function createProgram(programData: FormData): Promise<CreateProgramData> {
    try {
        const response = await ApiService.fetchDataWithAxios<CreateProgramResponse>({
            url: '/v1/programs/store',
            method: 'post',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: programData as any, // FormData type is not directly compatible with Axios
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// create category
export async function createCategory(categoryData: FormData): Promise<CreateProgramData> {
    try {
        const response = await ApiService.fetchDataWithAxios<CreateProgramResponse>({
            url: '/v1/save-category',
            method: 'post',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: categoryData as any,
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// create a module content

export async function createModuleContent(moduleContentData: FormData): Promise<CreateProgramData> {
    try {

        // append some default values to the FormData
        moduleContentData.append('start_date', new Date().toISOString());
        moduleContentData.append('end_date', new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString());
        moduleContentData.append('status', 'Active');
        moduleContentData.append('language', '1');
        moduleContentData.append('msg', 'Module content created successfully');
        moduleContentData.append('parent_id', '');
        moduleContentData.append('competitions_content', '');
        moduleContentData.append('job_content', '');
        moduleContentData.append('lang_ref_id', '');
        moduleContentData.append('new_content_msg', 'Created successfully!');
        moduleContentData.append('order', '0');
        moduleContentData.append('privacy', '1');
        moduleContentData.append('g_score', '');
        moduleContentData.append('per_completion', '');
        moduleContentData.append('difficulty_level', 'easy');

        const response = await ApiService.fetchDataWithAxios<CreateProgramResponse>({
            url: '/v1/create-content',
            method: 'post',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: moduleContentData as any, // FormData type is not directly compatible with Axios
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function saveContentOrder(data: SaveContentOrderPayload): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<SaveContentResponse>({
            url: '/v1/order-content',
            method: 'post',
            data,
        });
        return response.message;
    } catch (error) {
        throw error as string;
    }
}

export async function updateModuleOrder(moduleId: string, order: number): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios({
            url: `/v1/update-program-order`,
            method: 'post',
            data: {
                order: order,
                module_id: moduleId,
                level: 'module'
            },
        });
    } catch (error) {
        throw error as string;
    }
}

export async function updateModuleDetails(moduleData: FormData): Promise<CreateProgramData> {
    try {
        const response = await ApiService.fetchDataWithAxios<CreateProgramResponse>({
            url: '/v1/programs/update',
            method: 'post',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: moduleData as any, // FormData type is not directly compatible with Axios
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function deleteModule(moduleId: number): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios({
            url: `/v1/programs/delete-skill-module`,
            method: 'post',
            data: {
                pId: moduleId,
            }
        });
    } catch (error) {
        throw error as string;
    }
}

export async function deleteModuleContent(contentId: number): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios({
            url: `/v1/drop-content/${contentId}`,
            method: 'post',
        });
    } catch (error) {
        throw error as string;
    }
}