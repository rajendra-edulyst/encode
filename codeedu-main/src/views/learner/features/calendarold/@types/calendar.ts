export type Event = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    description?: string;
    link?: string;
    start_date?: Date;
    end_date?: Date;
}

export type EventData = {
    data: Event[],
    message: string,
    status: string,
}

export type EventResponse = {
    data: Event,
    message: string,
    status: string,
}