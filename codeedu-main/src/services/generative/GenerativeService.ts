import ApiService from "../ApiService";

interface Photo {
    id: number;
    width: number;
    height: number;
    url: string;
    photographer: string;
    photographer_url: string;
    avg_color: string;
    src: {
        original: string;
        large2x: string;
        large: string;
        medium: string;
        small: string;
        portrait: string;
        landscape: string;
        tiny: string;
    },
    liked: boolean;
    alt: string;
}

interface ImagesSearchResponse {
    status: number;
    data: {
        page: number;
        per_page: number;
        photos: Photo[];
    };
    error: string[];
}


interface CreateContentResponse {
    status: number;
    data: {
        parts: [
            {
                text: string;
            }
        ]
    };
    error: string[];
}

interface Video {
    id: number;
    width: number;
    height: number;
    duration: number;
    full_res: string;
    tags: string[];
    url: string;
    image: string;
    avg_color: string;
    video_files: [
        {
            id: number;
            quality: string;
            file_type: string;
            width: number;
            height: number;
            link: string;
            size: number;
        }
    ];
    user: {
        id: number;
        name: string;
        url: string;
    }
}

interface VideoSearchResponse {
    status: number;
    data: Video[];
    error: string[];
}


export async function imagesSerach(prompt: string): Promise<Photo[] | null> {
    try {
        const response = await ApiService.fetchDataWithAxios<ImagesSearchResponse>({
            url: `v1/generate-ai-image?title=${prompt}&items=20`,
            method: 'get',
        });
        return response.data.photos;
    } catch (error) {
        console.error("Error fetching cities:", error);
        return null;
    }
}

export async function fetchCreateContent(prompt: string, htmlFragment: string): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<CreateContentResponse>({
            url: `v1/generate-ai-text`,
            method: 'post',
            data: {
                prompt,
                htmlFragment,
            },
        });
        return response.data.parts[0].text;
    } catch (error) {
        throw error as string;
    }
}

export async function videoSearch(prompt: string): Promise<Video[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<VideoSearchResponse>({
            url: `v1/generate-ai-video?prompt=${prompt}`,
            method: 'get',
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}
