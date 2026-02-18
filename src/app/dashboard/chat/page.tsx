import { Suspense } from 'react';
import { getConversations, getUsers } from '@/actions/chat.actions';
import { ChatPage } from '@/components/chat/ChatPage';
import { Loader2 } from 'lucide-react';

export default async function ChatDashboardPage() {
    const [conversations, users] = await Promise.all([
        getConversations(),
        getUsers(),
    ]);

    return (
        <div className="container mx-auto p-4 h-[calc(100vh-8rem)]">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-white-800">สนทนา (Live Chat)</h1>
            </div>
            <Suspense fallback={<div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>}>
                <ChatPage initialConversations={conversations} users={users} />
            </Suspense>
        </div>
    );
}
