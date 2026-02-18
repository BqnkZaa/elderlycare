'use client';

import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { ChatMessage } from '@/actions/chat.actions';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface MessageBubbleProps {
    message: ChatMessage;
    showAvatar?: boolean;
}

export function MessageBubble({ message, showAvatar = true }: MessageBubbleProps) {
    const { data: session } = useSession();
    const isSelf = session?.user?.id === message.senderId;

    return (
        <div
            className={cn(
                'flex items-end gap-2 w-full',
                isSelf ? 'flex-row-reverse' : 'flex-row'
            )}
        >
            {/* Avatar — only for others */}
            {!isSelf && (
                <div className="w-7 h-7 flex-shrink-0 mb-1">
                    {showAvatar ? (
                        <Avatar className="w-7 h-7">
                            <AvatarFallback className="text-[10px] bg-purple-100 text-purple-700 font-semibold">
                                {message.sender.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    ) : (
                        <div className="w-7 h-7" />
                    )}
                </div>
            )}

            <div className={cn('flex flex-col max-w-[50%]', isSelf ? 'items-end' : 'items-start')}>
                {/* Sender name — only for others, only when avatar shown */}
                {!isSelf && showAvatar && (
                    <span className="text-[10px] text-muted-foreground font-medium mb-1 ml-1">
                        {message.sender.name}
                    </span>
                )}

                {/* Bubble */}
                <div
                    className={cn(
                        'px-3 py-1.5 text-[13px] leading-relaxed break-words',
                        isSelf
                            ? 'bg-purple-600 text-white rounded-2xl rounded-br-sm'
                            : 'bg-white text-gray-900 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100'
                    )}
                >
                    {message.content}
                </div>

                {/* Timestamp */}
                <span className={cn(
                    'text-[10px] mt-1 px-1',
                    isSelf ? 'text-gray-400' : 'text-gray-400'
                )}>
                    {format(new Date(message.createdAt), 'HH:mm', { locale: th })}
                </span>
            </div>
        </div>
    );
}
