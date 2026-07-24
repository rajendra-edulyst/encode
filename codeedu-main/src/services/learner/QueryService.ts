import { QueryRequest, QueryResponse, QueryRequestResponse, QueryReplyRequest ,QueryReply, QueryReplySendResponse, Query } from '@/@types/learner/mailbox';
import ApiService from '@/services/ApiService'

export async function addQuery(data: QueryRequest): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<QueryRequestResponse>({
            url: '/create-query',
            method: 'post',
            data: data
        })
        return response.data;
    } catch (error) {
        throw error as string;
    }
}


export async function getQueries(page: number = 1): Promise<QueryResponse> {
  try {
    const response = await ApiService.fetchDataWithAxios<QueryResponse>({
      url: `/get-query?page=${page}`,
      method: 'post',
      data: {
        is_api: '1'
      }
    });
    return response;
  } catch (error) {
    throw error as string;
  }
}


export async function getDraftQueries(page: number = 1): Promise<QueryResponse> {
  try {
    const response = await ApiService.fetchDataWithAxios<QueryResponse>({
      url: `/get-query?page=${page}&is_sent=0`,
      method: 'post',
      data: {
        is_api: '1',
      }
    });
    return response;
  } catch (error) {
    throw error as string;
  }
}

export async function getUserQueries(page: number = 1, is_replied: number, program_id?: number): Promise<QueryResponse> {
  try {
    let url = `/user-query-list?is_replied=${is_replied}&my_query=1&page=${page}`;
    if (program_id !== undefined && program_id !== null) {
      url += `&program_id=${program_id}`;
    }
    const response = await ApiService.fetchDataWithAxios<QueryResponse>({
      url,
      method: 'get',
    });
    return response;    
  } catch (error: unknown) {
    throw error as string;
  }
}


export async function getReplies(query_id: number): Promise<QueryReply[]> {
  try {
    const response = await ApiService.fetchDataWithAxios<QueryReplyRequest>({
      url: `query-reply`,
      method: 'post',
      data: {
        is_api: '1',
        id: query_id
      }
    });
    return response.data;
  } catch (error) {
    throw error as string;
  }
}


export async function sendReply(
  replyText: string,
  query_id: number,
  replyFile: File | null
): Promise<QueryReplySendResponse> {
  try {
    const response = await ApiService.fetchDataWithAxios<{ data: QueryReplySendResponse }>({
      url: `user-query-reply`,
      method: 'post',
      data: {
        is_api: '1',
        queryId: query_id,
        replyText: replyText,
        replyFile: replyFile,
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data; // This is of type QueryReplySendResponse
  } catch (error) {
    throw error as string;
  }
}

export async function deleteQuery(Query: Query): Promise<number> {
  try {
    const response = await ApiService.fetchDataWithAxios<QueryRequestResponse>({
      url: `/drop-query`,
      method: 'post',
      data: {
        is_api: '1',
        id: Query.id
      }
    });
    return response.status;
  } catch (error) {
    throw error as string;
  }
}

export async function sendDraftQuery(Query: Query): Promise<number> {
  try {
    const response = await ApiService.fetchDataWithAxios<QueryRequestResponse>({
      url: `/resend-query`,
      method: 'post',
      data: {
        is_api: '1',
        id: Query.id,
        title: Query.title,
        description: Query.description,
        type: 1
      }
    });
    return response.status;
  } catch (error) {
    throw error as string;
  }
  
}
// export async function getSingleQuery(id: string): Promise<Query> {
//   const res = await ApiService.fetchDataWithAxios<{ data: Query }>({
//     url: "/get-single-query", 
//     method: "post",
//     data: { is_api: "1", id },
//   });
//   return res.data;
// }

// export async function saveDraftQuery(
//   body: Partial<Query> & { id: string | number }
// ): Promise<number> {
//   const res = await ApiService.fetchDataWithAxios<QueryRequestResponse>({
//     url: "/resend-query",
//     method: "post",
//     data: { is_api: "1", ...body, type: 0 },
//   });
//   return res.status;
// }


