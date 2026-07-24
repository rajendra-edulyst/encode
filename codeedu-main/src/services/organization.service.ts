import ApiService from './ApiService'

export interface CreateOrganizationRequest {
    name: string;
    email: string;
    short_name: string;
    mobile_number?: string;
    country_id?: string;
    state_id?: string;
    city?: string;
}

export interface CreateOrganizationResponse {
    status: number;
    message: string;
    data?: any;
}

export async function createOrganization(data: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
    return ApiService.fetchDataWithAxios<CreateOrganizationResponse>({
        url: '/v1/orgs/create?auto_login=1',
        method: 'post',
        data: data as unknown as Record<string, unknown>,
    })
}
