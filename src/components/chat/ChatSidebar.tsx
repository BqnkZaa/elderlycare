'use client';

import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { ChatConversation, ChatUser } from '@/actions/chat.actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NewChatDialog } from './NewChatDialog';
import { useSession } from 'next-auth/react';

interface ChatSidebarProps {
    conversations: ChatConversation[];
    selectedConversationId?: string;
    onSelectConversation: (id: string) => void;
    users: ChatUser[];
}

export function ChatSidebar({
    conversations,
    selectedConversationId,
    onSelectConversation,
    users,
}: ChatSidebarProps) {
    const { data: session } = useSession();

    const getConversationName = (conv: ChatConversation) => {
        if (conv.isGroup) return conv.name || 'Group Chat';
        // Find valid participant that is NOT me
        const other = conv.participants.find((p) => p.user.id !== session?.user?.id);
        // If other is undefined (maybe I'm chatting with myself or data issue), fallback
        return other?.user.name || 'ไม่ทราบชื่อ';
    };

    const getConversationRole = (conv: ChatConversation) => {
        if (conv.isGroup) return '';
        const other = conv.participants.find((p) => p.user.id !== session?.user?.id);
        return other?.user.role || '';
    }

    return (
        <div className="flex flex-col h-full border-r bg-gray-50/50 w-full md:w-80">
            <div className="p-4 border-b space-y-4">
                <h2 className="text-xl font-bold tracking-tight text-purple-900">ข้อความ</h2>
                <NewChatDialog users={users} />
            </div>

            <ScrollArea className="flex-1">
                <div className="flex flex-col p-2 gap-2">
                    {conversations.map((conv) => {
                        const isActive = selectedConversationId === conv.id;
                        const name = getConversationName(conv);
                        const role = getConversationRole(conv);
                        const lastMessage = conv.lastMessage?.content || 'ยังไม่มีข้อความ';

                        return (
                            <button
                                key={conv.id}
                                onClick={() => onSelectConversation(conv.id)}
                                className={cn(
                                    'flex items-start space-x-3 p-3 rounded-xl transition-all text-left group',
                                    isActive
                                        ? 'bg-purple-100 ring-1 ring-purple-200 shadow-sm'
                                        : 'hover:bg-gray-100'
                                )}
                            >
                                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                    <AvatarFallback className={cn(isActive ? "bg-purple-200 text-purple-700" : "bg-gray-200")}>
                                        {name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className={cn("font-semibold truncate text-sm", isActive ? "text-purple-900" : "text-gray-900")}>
                                            {name}
                                        </span>
                                        <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                                            {format(new Date(conv.updatedAt), 'HH:mm', { locale: th })}
                                        </span>
                                    </div>

                                    {role && !conv.isGroup && (
                                        <div className="text-[10px] text-gray-400 mb-1 font-medium">{role}</div>
                                    )}

                                    <div className="flex justify-between items-center">
                                        <p className={cn(
                                            "text-xs truncate max-w-[140px]",
                                            isActive ? "text-purple-700" : "text-gray-500"
                                        )}>
                                            {lastMessage}
                                        </p>
                                        {conv.unreadCount > 0 && (
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
                                                {conv.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
}
