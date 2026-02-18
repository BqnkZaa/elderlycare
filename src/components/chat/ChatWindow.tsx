'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatConversation, ChatMessage, sendMessage, markAsRead } from '@/actions/chat.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, MoreVertical, Phone, Video } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { useSession } from 'next-auth/react';

interface ChatWindowProps {
    conversation: ChatConversation;
    messages: ChatMessage[];
    refreshMessages: () => void;
}

export function ChatWindow({ conversation, messages, refreshMessages }: ChatWindowProps) {
    const { data: session } = useSession();
    const [inputValue, setInputValue] = useState('');
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Helper to get conversation name
    const getConversationName = () => {
        if (conversation.isGroup) return conversation.name || 'Group Chat';
        return conversation.participants.find(p => p.user.id !== session?.user?.id)?.user.name || 'Unknown User';
    };

    const displayName = getConversationName();

    // Auto scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Mark as read on mount
    useEffect(() => {
        if (conversation.id) {
            markAsRead(conversation.id);
        }
    }, [conversation.id]);

    const handleSend = async () => {
        if (!inputValue.trim() || sending) return;

        setSending(true);
        try {
            await sendMessage(conversation.id, inputValue);
            setInputValue('');
            refreshMessages();
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b bg-white/90 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold text-sm">
                            {displayName.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight">{displayName}</h3>
                        <p className="text-[11px] text-green-500 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                            ออนไลน์
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-purple-600 hover:bg-purple-50 rounded-full">
                        <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-purple-600 hover:bg-purple-50 rounded-full">
                        <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-purple-600 hover:bg-purple-50 rounded-full">
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-5 py-4 bg-gray-50/40">
                <div className="flex flex-col gap-1 pb-2">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400 gap-3">
                            <div className="bg-purple-50 p-4 rounded-full">
                                <Send className="w-7 h-7 text-purple-300" />
                            </div>
                            <p className="text-sm">เริ่มต้นการสนทนา</p>
                        </div>
                    ) : (
                        messages.map((msg, i) => {
                            const prevMsg = messages[i - 1];
                            // Show avatar only when sender changes
                            const showAvatar = !prevMsg || prevMsg.senderId !== msg.senderId;
                            // Add extra top spacing when sender changes
                            const isNewGroup = showAvatar && i > 0;
                            return (
                                <div key={msg.id} className={isNewGroup ? 'mt-3' : 'mt-0.5'}>
                                    <MessageBubble message={msg} showAvatar={showAvatar} />
                                </div>
                            );
                        })
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Input */}
            <div className="px-4 py-3 bg-white">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                    className="flex items-center gap-2"
                >
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="พิมพ์ข้อความ..."
                        className="flex-1 bg-white border-gray-200 rounded-full px-4 text-black placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-purple-500 transition-colors text-sm shadow-sm"
                        disabled={sending}
                    />
                    <Button
                        type="submit"
                        disabled={!inputValue.trim() || sending}
                        size="icon"
                        className="bg-purple-600 hover:bg-purple-700 text-white w-10 h-10 rounded-full flex-shrink-0 shadow-sm transition-all disabled:opacity-50 disabled:bg-gray-200"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
