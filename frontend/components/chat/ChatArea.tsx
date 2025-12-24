"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  Image,
  ArrowLeft,
} from "lucide-react";
import { useRef, useEffect } from "react";

type Message = {
  id: string;
  content: string;
  senderId: string;
  timestamp?: string;
};

type Props = {
  currentUserId?: string | null;
  selectedUser: { id: string; name: string; email?: string; isOnline?: boolean } | null;
  messages: Message[];
  text: string;
  setText: (v: string) => void;
  loadingMessages?: boolean;
  onSend: () => void;
  onBack?: () => void;
};

export default function ChatArea({
  currentUserId,
  selectedUser,
  messages,
  text,
  setText,
  loadingMessages,
  onSend,
  onBack,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  // Temporary notifications for not-yet-implemented features
  const notifyComingSoon = (feature: string) => {
    if (typeof window !== "undefined") {
      window.alert(`${feature} is coming soon`);
    }
  };

  if (!selectedUser) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-background/50">
        <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center mb-6 animate-pulse">
          <Send className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Your Messages
        </h2>
        <p className="text-muted-foreground text-center max-w-sm">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 flex flex-col bg-background/50">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-card/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onBack}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
              {getInitials(selectedUser.name)}
            </div>
            {selectedUser.isOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-online rounded-full border-2 border-card" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{selectedUser.name}</h2>
            <p className="text-xs text-muted-foreground">
              {selectedUser.isOnline ? "Active now" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            title="Call"
            onClick={() => notifyComingSoon("Audio calling")}
          >
            <Phone className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            title="Video call"
            onClick={() => notifyComingSoon("Video calling")}
          >
            <Video className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            title="More options"
            onClick={() => notifyComingSoon("More actions")}
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0 scrollbar-thin" ref={scrollRef}>
        <div className="p-4 space-y-3">
          {loadingMessages ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`h-10 rounded-2xl animate-pulse ${
                      i % 2 === 0 ? "bg-primary/30 w-48" : "bg-secondary w-56"
                    }`}
                  />
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isMine = message.senderId === currentUserId;
              const showAvatar =
                !isMine &&
                (index === 0 || messages[index - 1].senderId === currentUserId);

              return (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${
                    isMine ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isMine && (
                    <div className="w-7 h-7">
                      {showAvatar && (
                        <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-secondary-foreground">
                          {getInitials(selectedUser.name)}
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] px-4 py-2.5 text-sm rounded-2xl ${
                      isMine
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-secondary-foreground rounded-bl-md"
                    }`}
                  >
                    {message.content}
                    {message.timestamp && (
                      <span className="block text-[10px] mt-1 opacity-60">
                        {message.timestamp}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card/30 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground shrink-0"
            title="Emoji"
            onClick={() => notifyComingSoon("Emoji picker")}
          >
            <Smile className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground shrink-0"
            title="Attach file"
            onClick={() => notifyComingSoon("File attachments")}
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground shrink-0"
            title="Send image"
            onClick={() => notifyComingSoon("Image sharing")}
          >
            <Image className="w-5 h-5" />
          </Button>

          <Input
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-input border-0 focus-visible:ring-1 focus-visible:ring-primary/50 placeholder:text-muted-foreground/60 text-foreground"
          />

          <Button
            onClick={onSend}
            disabled={!text.trim()}
            size="icon"
            className="shrink-0 bg-primary hover:bg-primary/90 disabled:opacity-50 transition-all duration-200"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
