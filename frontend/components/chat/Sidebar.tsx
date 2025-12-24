"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  currentUser?: { id: string; name: string } | null;
  users: { id: string; name: string; email: string }[];
  selectedUserId?: string | null;
  loadingUsers?: boolean;
  onSelectUser: (user: { id: string; name: string; email: string }) => void;
};

export default function Sidebar({ currentUser, users, selectedUserId, loadingUsers, onSelectUser }: Props) {
  return (
    <Card className="h-full">
      <CardContent className="p-0 h-full">
        <div className="p-4 border-b">
          <div className="font-semibold">Chats</div>
          {currentUser && (
            <div className="text-sm text-muted-foreground mt-1">
              Logged in as {currentUser.name}
            </div>
          )}
        </div>
        <ScrollArea className="h-[calc(100vh-180px)]">
          {loadingUsers ? (
            <div className="p-4 text-sm text-muted-foreground">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">No users found</div>
          ) : (
            <ul className="divide-y">
              {users.map((u) => (
                <li key={u.id}>
                  <button
                    className={`w-full text-left p-4 hover:bg-muted ${selectedUserId === u.id ? "bg-muted" : ""}`}
                    onClick={() => onSelectUser(u)}
                  >
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
