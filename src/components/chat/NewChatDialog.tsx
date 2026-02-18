'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Search } from 'lucide-react';
import { ChatUser, createGroupConversation, getOrCreateDirectConversation } from '@/actions/chat.actions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';

interface NewChatDialogProps {
    users: ChatUser[];
}

export function NewChatDialog({ users }: NewChatDialogProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [groupName, setGroupName] = useState('');
    const [loading, setLoading] = useState(false);

    // Filter out current user is handled by props usually, but safety check
    // Filter by search
    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) && u.id !== session?.user?.id
    );

    const handleUserToggle = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleStartChat = async () => {
        if (selectedUsers.length === 0) return;

        setLoading(true);
        try {
            if (selectedUsers.length === 1 && !groupName) {
                await getOrCreateDirectConversation(selectedUsers[0]);
            } else {
                await createGroupConversation(
                    groupName || 'Group Chat',
                    selectedUsers
                );
            }

            setOpen(false);
            setSelectedUsers([]);
            setGroupName('');
            setSearch('');
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error('Failed to start chat');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-sm">
                    <Plus className="w-4 h-4 mr-2" /> แชทใหม่
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] p-0 gap-0 overflow-hidden bg-background border-border shadow-lg">
                <DialogHeader className="px-6 pt-6 pb-4">
                    <DialogTitle className="text-xl font-semibold tracking-tight">เริ่มการสนทนาใหม่</DialogTitle>
                </DialogHeader>

                <div className="px-4 pb-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="ค้นหาชื่อ..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 bg-muted/50 border-none ring-1 ring-border focus-visible:ring-purple-500 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-[300px] px-2 py-2">
                        {filteredUsers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-24 text-muted-foreground text-sm">
                                ไม่พบรายชื่อ
                            </div>
                        ) : (
                            <div className="space-y-1 px-2">
                                {filteredUsers.map((user) => {
                                    const isSelected = selectedUsers.includes(user.id);
                                    return (
                                        <div
                                            key={user.id}
                                            onClick={() => handleUserToggle(user.id)}
                                            className={cn(
                                                "flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border border-transparent",
                                                isSelected
                                                    ? "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
                                                    : "hover:bg-muted/60"
                                            )}
                                        >
                                            <div className="relative">
                                                <Avatar className="h-10 w-10 border border-border">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} />
                                                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                                        {user.name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {isSelected && (
                                                    <div className="absolute -bottom-1 -right-1 bg-purple-600 rounded-full p-[2px] border-2 border-background">
                                                        <div className="w-2 h-2 rounded-full bg-white" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className={cn(
                                                    "text-sm font-medium truncate",
                                                    isSelected ? "text-purple-700 dark:text-purple-300" : "text-foreground"
                                                )}>
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {user.role}
                                                </p>
                                            </div>

                                            <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={() => handleUserToggle(user.id)}
                                                className={cn(
                                                    "transition-opacity duration-200 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600",
                                                    isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                                )}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                {selectedUsers.length > 1 && (
                    <div className="px-6 pt-2 pb-4 bg-muted/20 border-t">
                        <Input
                            placeholder="ตั้งชื่อกลุ่ม (ไม่บังคับ)..."
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="bg-background border-input"
                        />
                    </div>
                )}

                <div className="p-4 border-t bg-background">
                    <Button
                        onClick={handleStartChat}
                        disabled={selectedUsers.length === 0 || loading}
                        className={cn(
                            "w-full font-medium transition-all",
                            loading || selectedUsers.length === 0
                                ? "bg-muted text-muted-foreground"
                                : "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg"
                        )}
                    >
                        {loading ? 'กำลังสร้าง...' : `เริ่มแชท ${selectedUsers.length > 0 ? `(${selectedUsers.length})` : ''}`}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
