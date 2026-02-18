import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const userId = session.user.id;
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    let lastCheck = new Date();

    const interval = setInterval(async () => {
        try {
            // Fetch actual new messages with sender info
            const newMessages = await prisma.message.findMany({
                where: {
                    conversation: {
                        participants: {
                            some: { userId },
                        },
                    },
                    createdAt: { gt: lastCheck },
                    // Don't send back messages from self (sender already has them)
                    NOT: { senderId: userId },
                },
                include: {
                    sender: {
                        select: { id: true, name: true, role: true },
                    },
                },
                orderBy: { createdAt: 'asc' },
            });

            if (newMessages.length > 0) {
                const payload = newMessages.map((msg) => ({
                    id: msg.id,
                    conversationId: msg.conversationId,
                    content: msg.content,
                    type: msg.type,
                    createdAt: msg.createdAt.toISOString(),
                    sender: msg.sender,
                }));

                const data = `data: ${JSON.stringify({ type: 'new_messages', messages: payload })}\n\n`;
                await writer.write(encoder.encode(data));
                lastCheck = new Date();
            }

            // Heartbeat every cycle to keep connection alive
            await writer.write(encoder.encode(': heartbeat\n\n'));

        } catch (error) {
            console.error('SSE Error:', error);
            clearInterval(interval);
            try { writer.close(); } catch { /* already closed */ }
        }
    }, 2000);

    req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        try { writer.close(); } catch { /* already closed */ }
    });

    return new NextResponse(stream.readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no',
        },
    });
}
