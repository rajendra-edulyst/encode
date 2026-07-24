export interface CreatePostResponse {
    status: number;
    message: string;
    data: PostData;
}

export interface PostData {
    id: number;
}
