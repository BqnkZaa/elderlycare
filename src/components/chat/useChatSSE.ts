'use client';

import { useEffect, useRef } from 'react';

export interface SSEMessage {
    id: string;
    conversationId: string;
    content: string;
    type: string;
    createdAt: string;
    sender: {
        id: string;
        name: string;
        role: string;
    };
}

interface SSEEvent {
    type: 'new_messages';
    messages: SSEMessage[];
}

export function useChatSSE(onNewMessages?: (messages: SSEMessage[]) => void) {
    const callbackRef = useRef(onNewMessages);
    callbackRef.current = onNewMessages;

    useEffect(() => {
        const eventSource = new EventSource('/api/chat/stream');

        eventSource.onopen = () => {
            console.log('SSE Connected');
        };

        eventSource.onmessage = (event) => {
            try {
                const data: SSEEvent = JSON.parse(event.data);
                if (data.type === 'new_messages' && data.messages.length > 0) {
                    callbackRef.current?.(data.messages);
                }
            } catch (e) {
                // Ignore parse errors (e.g. heartbeat comments)
            }
        };

        eventSource.onerror = (error) => {
            console.error('SSE Error:', error);
            // Don't close immediately — browser will auto-reconnect
        };

        return () => {
            eventSource.close();
        };
    }, []); // No dependencies — callback is tracked via ref
}
