import PortfolioApiService from "./axios";

export interface getSectionsResponse {
    status: number
    data: [Section]
    message: string
}

export interface Section {
    _id: string
    SectionKey: string
    isDefault: boolean
    isLocked: boolean
    isRequired: boolean
    name: string
    description: string
    sectionOrder: number
    maxEntries: number
    isActive: boolean
    org_id: string
    allowedRoles: [string]
    sectionHtml: string
    fields: [fieldsSchema]
}


export interface fieldsSchema {
    _id: string
    fieldKey: string
    name: string
    isRequired: boolean
    dataType: string
    placeholder: string
    default_value: string
    validationType: string
    validationValue: string | number | boolean | null
}


export const getSections = async () => {
    const response = await PortfolioApiService.get('/user/sections');
    return response.data;
};
