export type QueryRequest = {
    title: string;
    description: string;
    is_api?: string;
    for?: string;
    program_id?: string;
}

export type QueryRequestResponse = {
    status: number;
    data: string;
    error: string
}

export type QueryResponse = {
    status: number;
    data: Query[],
    error: string,
    paginate: paginateData
}

export type paginateData = {
    total: number,
    count: number,
    per_page: number,
    current_page: number,
    total_pages: number,
    next_page_url: string | null,
    prev_page_url: string | null,
    from: number,
    to: number
}

export type Query = {
    to: any;
    for: any;
    program_id: any;
    id: number,
    title: string,
    description: string,
    attachment: null,
    is_new: number,
    is_faculty_answered: number,
    organization_id: number
    type: string
    created_at: string,
    name: string,
    subject: string,
    program_name: string
    mentor_name: string
}

export type QueryReplyRequest = {
    status : number,
    data: QueryReply[],
    error: string,
}
export type QueryReply = {
    id: number,
    description: string,
    attachment: string,
    replied_by: string,
    reply_at: string,
}

export type sendReplyRequest = {
    queryId: number,
    replyText: string,
    replyFile: string, 
    is_api: string,
}

export type QueryReplySendResponse = {
    status: number,
    data: DataQueryReplySendResponse,
    error: string,
    message: string,
}

export type DataQueryReplySendResponse = {
    id: number,
    user_id: number,
    title: string,
    description: string,
    is_faculty_answered: number,
    is_new: number,
    type: string,
    organization_id: number,
    created_at: string, 
    updated_at: string,
    attachment: null,
    status: string,
    query_for: string,
    mentor_id: number,    
}


