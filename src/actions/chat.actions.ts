'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// Types
export type ChatUser = {
    id: string;
    name: string;
    image?: string | null;
    role: string;
};

export type ChatMessage = {
    id: string;
    content: string;
    senderId: string;
    createdAt: Date;
    sender: {
        name: string;
        image?: string | null;
    };
};

export type ChatConversation = {
    id: string;
    name: string | null;
    isGroup: boolean;
    updatedAt: Date;
    lastMessage?: {
        content: string;
        createdAt: Date;
    } | null;
    participants: {
        user: ChatUser;
        lastReadAt: Date;
    }[];
    unreadCount: number;
};

async function getSessionUser() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }
    return session.user;
}

export async function getConversations(): Promise<ChatConversation[]> {
    const user = await getSessionUser();

    const conversations = await prisma.conversation.findMany({
        where: {
            participants: {
                some: {
                    userId: user.id,
                },
            },
        },
        include: {
            participants: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            role: true,
                            // profilePhoto is not in User model based on schema review, checking...
                            // user model has no image field, checking schema...
                            // schema User: id, email, password, name, role, status, isActive...
                            // ElderlyProfile has profilePhoto. User does not.
                            // We will use name for avatar fallback.
                        },
                    },
                },
            },
            messages: {
                orderBy: {
                    createdAt: 'desc',
                },
                take: 1,
            },
        },
        orderBy: {
            updatedAt: 'desc',
        },
    });

    return conversations.map((conv) => {
        const userParticipant = conv.participants.find((p) => p.userId === user.id);
        const lastReadAt = userParticipant?.lastReadAt || new Date(0);

        // Count unread messages
        // This is an approximation as we don't fetch all messages here
        // Real implementation might need a separate count query if accuracy is critical
        // For now, we'll return 0 in list and let individual chat load exact count if needed
        // OR we can do a count query here if performance allows.
        // Let's keep it simple for now. 

        return {
            id: conv.id,
            name: conv.name,
            isGroup: conv.isGroup,
            updatedAt: conv.updatedAt,
            lastMessage: conv.messages[0]
                ? {
                    content: conv.messages[0].content,
                    createdAt: conv.messages[0].createdAt,
                }
                : null,
            participants: conv.participants.map((p) => ({
                user: {
                    id: p.user.id,
                    name: p.user.name,
                    role: p.user.role,
                },
                lastReadAt: p.lastReadAt,
            })),
            unreadCount: 0, // Placeholder, implemented in getUnreadCount separately or enhanced later
        };
    });
}

export async function getOrCreateDirectConversation(targetUserId: string) {
    const user = await getSessionUser();

    // Find existing 1:1 conversation
    const existingConv = await prisma.conversation.findFirst({
        where: {
            isGroup: false,
            participants: {
                every: {
                    userId: { in: [user.id, targetUserId] },
                },
            },
        },
    });

    if (existingConv) {
        return existingConv.id;
    }

    // Create new conversation
    const newConv = await prisma.conversation.create({
        data: {
            isGroup: false,
            participants: {
                create: [
                    { userId: user.id },
                    { userId: targetUserId },
                ],
            },
        },
    });

    revalidatePath('/dashboard/chat');
    return newConv.id;
}

export async function createGroupConversation(name: string, participantIds: string[]) {
    const user = await getSessionUser();

    const allParticipantIds = [...new Set([user.id, ...participantIds])];

    const newConv = await prisma.conversation.create({
        data: {
            name,
            isGroup: true,
            participants: {
                create: allParticipantIds.map((id) => ({ userId: id })),
            },
        },
    });

    revalidatePath('/dashboard/chat');
    return newConv.id;
}

export async function getMessages(conversationId: string, limit = 50) {
    await getSessionUser(); // Ensure auth

    const messages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
            sender: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    return messages.reverse().map((msg) => ({
        id: msg.id,
        content: msg.content,
        senderId: msg.senderId,
        createdAt: msg.createdAt,
        sender: {
            name: msg.sender.name,
        },
    }));
}

export async function sendMessage(conversationId: string, content: string) {
    const user = await getSessionUser();

    const message = await prisma.message.create({
        data: {
            conversationId,
            senderId: user.id,
            content,
        },
        include: {
            sender: {
                select: {
                    id: true,
                    name: true,
                }
            }
        }
    });

    // Update conversation timestamp
    await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
    });

    revalidatePath(`/dashboard/chat`);
    return {
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        createdAt: message.createdAt,
        sender: {
            name: message.sender.name
        }
    };
}

export async function markAsRead(conversationId: string) {
    const user = await getSessionUser();

    await prisma.conversationParticipant.update({
        where: {
            conversationId_userId: {
                conversationId,
                userId: user.id,
            },
        },
        data: {
            lastReadAt: new Date(),
        },
    });

    revalidatePath('/dashboard/chat');
}

export async function getUsers() {
    const user = await getSessionUser();

    return await prisma.user.findMany({
        where: {
            NOT: { id: user.id },
            isActive: true,
        },
        select: {
            id: true,
            name: true,
            role: true,
        },
        orderBy: { name: 'asc' },
    });
}

export async function getUnreadCount() {
    const user = await getSessionUser();

    // Get all conversations user is in
    const conversations = await prisma.conversation.findMany({
        where: {
            participants: {
                some: { userId: user.id }
            }
        },
        include: {
            participants: {
                where: { userId: user.id },
                select: { lastReadAt: true }
            },
            messages: {
                orderBy: { createdAt: 'desc' },
                take: 1,
                select: { createdAt: true }
            }
        }
    });

    let count = 0;
    for (const conv of conversations) {
        const participant = conv.participants[0];
        const lastMessage = conv.messages[0];

        if (participant && lastMessage && lastMessage.createdAt > participant.lastReadAt) {
            count++;
        }
    }

    return count;
}
