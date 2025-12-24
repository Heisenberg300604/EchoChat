"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  currentUserId?: string | null;
  selectedUser: { id: string; name: string } | null;
  messages: { id: string; content: string; senderId: string }[];
  text: string;
  setText: (v: string) => void;
  loadingMessages?: boolean;
  onSend: () => void;
};

export default function ChatArea({ currentUserId, selectedUser, messages, text, setText, loadingMessages, onSend }: Props) {
  return (
    <Card className="h-full">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="p-4 border-b">
          <div className="font-semibold">
            {selectedUser ? selectedUser.name : "Select a chat"}
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {loadingMessages && (
              <div className="text-sm text-muted-foreground">Loading messages...</div>
            )}
            {messages.map((m) => {
              const mine = m.senderId === currentUserId;
              return (
                <div
                  key={m.id}
                  className={`max-w-[70%] rounded-md px-3 py-2 text-sm ${
                    mine ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                  }`}
                >
                  {m.content}
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <div className="p-4 border-t flex gap-2">
          <Input
            placeholder={selectedUser ? "Type a message" : "Select a chat to start"}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={!selectedUser}
          />
          <Button onClick={onSend} disabled={!selectedUser || !text.trim()}>
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
