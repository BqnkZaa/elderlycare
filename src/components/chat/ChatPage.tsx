'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChatConversation, ChatMessage, ChatUser, getMessages, getConversations } from '@/actions/chat.actions';
import { ChatSidebar } from './ChatSidebar';
import { ChatWindow } from './ChatWindow';
import { useChatSSE, SSEMessage } from './useChatSSE';
import { Loader2 } from 'lucide-react';

interface ChatPageProps {
    initialConversations: ChatConversation[];
    users: ChatUser[];
}

export function ChatPage({ initialConversations, users }: ChatPageProps) {
    const [conversations, setConversations] = useState<ChatConversation[]>(initialConversations);
    const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>(
        initialConversations[0]?.id
    );
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(false);

    // Sync conversations from server props
    useEffect(() => {
        setConversations(initialConversations);
    }, [initialConversations]);

    // Fetch messages when selected conversation changes
    useEffect(() => {
        if (selectedConversationId) {
            fetchMessages(selectedConversationId);
        }
    }, [selectedConversationId]);

    const fetchMessages = async (id: string) => {
        setLoadingMessages(true);
        try {
            const msgs = await getMessages(id);
            setMessages(msgs);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleRefreshMessages = () => {
        if (selectedConversationId) {
            fetchMessages(selectedConversationId);
        }
    };

    // Handle incoming SSE messages — append directly to state without page refresh
    const handleSSEMessages = useCallback((newMessages: SSEMessage[]) => {
        // Update messages for the currently selected conversation
        setMessages((prev) => {
            const relevantMessages = newMessages.filter(
                (msg) => msg.conversationId === selectedConversationId
            );
            if (relevantMessages.length === 0) return prev;

            // Convert SSE messages to ChatMessage format and deduplicate
            const existingIds = new Set(prev.map((m) => m.id));
            const newChatMessages: ChatMessage[] = relevantMessages
                .filter((msg) => !existingIds.has(msg.id))
                .map((msg) => ({
                    id: msg.id,
                    content: msg.content,
                    senderId: msg.sender.id,
                    type: msg.type as 'TEXT' | 'SYSTEM',
                    createdAt: new Date(msg.createdAt),
                    sender: {
                        name: msg.sender.name,
                    },
                }));

            if (newChatMessages.length === 0) return prev;
            return [...prev, ...newChatMessages];
        });

        // Update conversation list sidebar (last message preview, unread count, order)
        // Re-fetch conversations silently to keep sidebar fresh
        getConversations().then((updated) => {
            setConversations(updated);
        }).catch(console.error);
    }, [selectedConversationId]);

    // Listen for real-time updates — NO router.refresh()
    useChatSSE(handleSSEMessages);

    const selectedConversation = conversations.find(c => c.id === selectedConversationId);

    return (
        <div className="flex h-full border rounded-2xl overflow-hidden bg-white shadow-sm">
            <div className={`${selectedConversationId ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r`}>
                <ChatSidebar
                    conversations={conversations}
                    selectedConversationId={selectedConversationId}
                    onSelectConversation={setSelectedConversationId}
                    users={users}
                />
            </div>
            <div className={`${!selectedConversationId ? 'hidden md:flex' : 'flex'} flex-1 flex-col`}>
                {selectedConversation ? (
                    loadingMessages ? (
                        <div className="flex-1 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                        </div>
                    ) : (
                        <ChatWindow
                            conversation={selectedConversation}
                            messages={messages}
                            refreshMessages={handleRefreshMessages}
                        />
                    )
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-500">
                        เลือกการสนทนาเพื่อเริ่มแชท
                    </div>
                )}
            </div>
        </div>
    );
}
