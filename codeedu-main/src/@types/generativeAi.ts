export type Photo = {
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

export type ImagesSearchResponse = {
    status: number;
    data: {
        page: number;
        per_page: number;
        photos: Photo[];
    };
    error: string[];
}


export type CreateContentResponse = {
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

export type Video = {
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

export type VideoSearchResponse = {
    status: number;
    data: Video[];
    error: string[];
}
