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
  Check,
  CheckCheck,
  RotateCw,
  AlertCircle,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import VideoCall from "./VideoCall";
import EmojiPicker from "./EmojiPicker";

type MessageStatus = "sending" | "sent" | "failed";

type Message = {
  id: string;
  content: string;
  senderId: string;
  timestamp?: string;
  createdAt?: string;
  status?: MessageStatus;
  clientId?: string;
};

type Props = {
  currentUserId?: string | null;
  selectedUser: { id: string; name: string; email?: string; isOnline?: boolean } | null;
  messages: Message[];
  text: string;
  setText: (v: string) => void;
  loadingMessages?: boolean;
  isPeerTyping?: boolean;
  onSend: () => void;
  onRetry?: (clientId: string) => void;
  onTyping?: () => void;
  onBack?: () => void;
};

function dayLabel(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(date, today)) return "Today";
  if (sameDay(date, yesterday)) return "Yesterday";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
}

export default function ChatArea({
  currentUserId,
  selectedUser,
  messages,
  text,
  setText,
  loadingMessages,
  isPeerTyping,
  onSend,
  onRetry,
  onTyping,
  onBack,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isCallActive, setIsCallActive] = useState(false);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "auto", block: "end" });
    } else if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isPeerTyping]);

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

  const notifyComingSoon = (feature: string) => {
    if (typeof window !== "undefined") {
      window.alert(`${feature} is coming soon`);
    }
  };

  if (!selectedUser) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-background/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center mb-6"
        >
          <Send className="w-10 h-10 text-primary" />
        </motion.div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Your Messages
        </h2>
        <p className="text-muted-foreground text-center max-w-sm">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    );
  }

  // Build render groups with date separators
  let lastDay = "";

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
            <p className="text-xs text-muted-foreground h-4">
              <AnimatePresence mode="wait">
                {isPeerTyping ? (
                  <motion.span
                    key="typing"
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-primary"
                  >
                    typing…
                  </motion.span>
                ) : (
                  <motion.span
                    key="status"
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {selectedUser.isOnline ? "Active now" : "Offline"}
                  </motion.span>
                )}
              </AnimatePresence>
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
            onClick={() => {
              if (!currentUserId || !selectedUser) {
                notifyComingSoon("Select a user to start a call");
                return;
              }
              setIsCallActive(true);
            }}
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
        <div className="p-4 space-y-1">
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
            <AnimatePresence initial={false}>
              {messages.map((message, index) => {
                const isMine = message.senderId === currentUserId;
                const showAvatar =
                  !isMine &&
                  (index === 0 || messages[index - 1].senderId === currentUserId);

                const label = dayLabel(message.createdAt);
                const showSeparator = label && label !== lastDay;
                if (label) lastDay = label;

                return (
                  <div key={message.id}>
                    {showSeparator && (
                      <div className="flex items-center justify-center my-4">
                        <span className="text-[11px] font-medium text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                          {label}
                        </span>
                      </div>
                    )}
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={`flex items-end gap-2 py-0.5 ${
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
                      <div className="flex flex-col items-end max-w-[70%]">
                        <div
                          className={`px-4 py-2.5 text-sm rounded-2xl break-words ${
                            isMine
                              ? `bg-primary text-primary-foreground rounded-br-md ${
                                  message.status === "failed" ? "opacity-60" : ""
                                }`
                              : "bg-secondary text-secondary-foreground rounded-bl-md"
                          }`}
                        >
                          {message.content}
                        </div>
                        {isMine && (
                          <div className="flex items-center gap-1 mt-1 px-1">
                            {message.timestamp && (
                              <span className="text-[10px] text-muted-foreground">
                                {message.timestamp}
                              </span>
                            )}
                            {message.status === "sending" && (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                              >
                                <RotateCw className="w-3 h-3 text-muted-foreground" />
                              </motion.div>
                            )}
                            {message.status === "sent" && (
                              <CheckCheck className="w-3.5 h-3.5 text-primary" />
                            )}
                            {message.status === "failed" && (
                              <button
                                onClick={() => message.clientId && onRetry?.(message.clientId)}
                                className="flex items-center gap-1 text-[10px] text-destructive hover:underline"
                                title="Retry sending"
                              >
                                <AlertCircle className="w-3 h-3" />
                                Retry
                              </button>
                            )}
                          </div>
                        )}
                        {!isMine && message.timestamp && (
                          <span className="text-[10px] text-muted-foreground mt-1 px-1">
                            {message.timestamp}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </AnimatePresence>
          )}

          {isPeerTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-end gap-2 py-1"
            >
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-secondary-foreground">
                {getInitials(selectedUser.name)}
              </div>
              <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.9,
                      delay: i * 0.15,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card/30 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <EmojiPicker
            onSelect={(emoji) => {
              setText(text + emoji);
              onTyping?.();
            }}
          />
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
            onChange={(e) => {
              setText(e.target.value);
              onTyping?.();
            }}
            onKeyDown={handleKeyPress}
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

      {/* Video Call Modal */}
      {isCallActive && selectedUser && currentUserId && (
        <VideoCall
          currentUserId={String(currentUserId)}
          remoteUserId={selectedUser.id}
          onClose={() => setIsCallActive(false)}
          autoStart
        />
      )}
    </div>
  );
}
