export type WebSocketMessage = {
    type: string;
    channel?: string;
    payload?: any;
    [key: string]: unknown;
};

type MessageCallback = (message: WebSocketMessage) => void;

class WebSocketService {
    private socket: WebSocket | null = null;
    private listeners: MessageCallback[] = [];
    private pendingMessages: WebSocketMessage[] = [];
    // private WS_URL = 'ws://localhost:3001/ws';
    private WS_URL = 'wss://encodepm-api.edulyst.ai/ws';

    connect(url: string = this.WS_URL) {
        if (
            this.socket &&
            (this.socket.readyState === WebSocket.OPEN ||
                this.socket.readyState === WebSocket.CONNECTING)
        ) {
            return;
        }

        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log('WebSocket connected');
            this.flushPendingMessages();
        };

        this.socket.onmessage = (event) => {
            try {
                const message: WebSocketMessage = JSON.parse(event.data);

                this.listeners.forEach((listener) => {
                    listener(message);
                });
            } catch (error) {
                console.error('Invalid websocket message', error);
            }
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error', error);
        };

        this.socket.onclose = () => {
            console.log('WebSocket disconnected');
        };
    }

    send(data: WebSocketMessage) {
        if (!this.socket || this.socket.readyState === WebSocket.CONNECTING) {
            this.pendingMessages.push(data);
            console.warn('WebSocket is not connected yet, queueing message');
            return;
        }

        if (this.socket.readyState !== WebSocket.OPEN) {
            this.pendingMessages.push(data);
            console.warn('WebSocket is closed, queueing message');
            return;
        }

        this.socket.send(JSON.stringify(data));
    }

    subscribe(channel: string) {
        this.send({
            type: 'subscribe',
            channel,
        });
    }

    unsubscribe(channel: string) {
        this.send({
            type: 'unsubscribe',
            channel,
        });
    }

    addListener(callback: MessageCallback) {
        this.listeners.push(callback);

        return () => {
            this.listeners = this.listeners.filter(
                (listener) => listener !== callback
            );
        };
    }

    disconnect() {
        this.socket?.close();
        this.socket = null;
    }

    private flushPendingMessages() {
        if (
            !this.socket ||
            this.socket.readyState !== WebSocket.OPEN ||
            this.pendingMessages.length === 0
        ) {
            return;
        }

        const queuedMessages = [...this.pendingMessages];
        this.pendingMessages = [];

        queuedMessages.forEach((message) => {
            this.socket?.send(JSON.stringify(message));
        });
    }
}

export const websocketService = new WebSocketService();
