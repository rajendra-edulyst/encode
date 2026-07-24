// src/hooks/useWebSocket.ts

import { useEffect, useState } from 'react';
import { WebSocketMessage, websocketService } from '../services/websocket/websocket.service';


interface UseWebSocketOptions {
    autoConnect?: boolean;
    url?: string;
    channel?: string;
}

export function useWebSocket(options?: UseWebSocketOptions) {
    const WS_URL = 'wss://encodepm-api.edulyst.ai/ws'
    // const WS_URL = 'ws://localhost:3001/ws';

    const {
        autoConnect = true,
        url = WS_URL,
        channel,
    } = options || {};

    const [messages, setMessages] = useState<WebSocketMessage[]>([]);
    const [lastMessage, setLastMessage] =
        useState<WebSocketMessage | null>(null);

    useEffect(() => {
        if (!autoConnect) return;

        websocketService.connect(url);

        if (channel) {
            websocketService.subscribe(channel);
        }

        const removeListener = websocketService.addListener((message) => {
            setLastMessage(message);
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            if (channel) {
                websocketService.unsubscribe(channel);
            }

            removeListener();
        };
    }, [autoConnect, url, channel]);

    return {
        messages,
        lastMessage,

        send: websocketService.send.bind(websocketService),

        subscribe: websocketService.subscribe.bind(websocketService),

        unsubscribe: websocketService.unsubscribe.bind(websocketService),

        disconnect: websocketService.disconnect.bind(websocketService),
    };
}