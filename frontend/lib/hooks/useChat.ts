"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { socket } from "@/lib/socket";
import { setAuthToken, getMe, getUsers, getMessages } from "@/lib/api";

export type ChatUser = {
  id: string;
  name: string;
  email: string;
  isOnline?: boolean;
};

export type ChatMessage = {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt?: string;
  timestamp?: string;
  status?: "sending" | "sent" | "failed";
  clientId?: string;
};

export function useChat() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const selectedUserIdRef = useRef<string | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const peerTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const formatTime = (iso?: string) =>
    new Date(iso ?? Date.now()).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  // Initialize auth + socket + initial data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setAuthToken(token);
    (async () => {
      try {
        const meRes = await getMe();
        setCurrentUser(meRes.data);

        // Connect socket ONLY after auth
        socket.auth = { token };
        socket.connect();

        // Fetch users list
        setLoadingUsers(true);
        const usersRes = await getUsers();
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Init error:", err);
        router.push("/login");
      } finally {
        setLoadingUsers(false);
      }
    })();

    const onReceive = (message: ChatMessage) => {
      const currentSelectedId = selectedUserIdRef.current;
      if (currentSelectedId && message.senderId === currentSelectedId) {
        const timestamped = {
          ...message,
          status: "sent" as const,
          timestamp: formatTime(message.createdAt),
        };
        setMessages((prev) => [...prev, timestamped]);
      }

      if (message.senderId === selectedUserIdRef.current) {
        setIsPeerTyping(false);
        if (peerTypingTimeoutRef.current) clearTimeout(peerTypingTimeoutRef.current);
      }
    };
    socket.on("receive-message", onReceive);

    const onOnlineUsers = (userIds: string[]) => {
      setOnlineUserIds(userIds);
    };
    socket.on("online-users", onOnlineUsers);

    const onTyping = ({ from }: { from: string }) => {
      if (from !== selectedUserIdRef.current) return;
      setIsPeerTyping(true);
      if (peerTypingTimeoutRef.current) clearTimeout(peerTypingTimeoutRef.current);
      peerTypingTimeoutRef.current = setTimeout(() => setIsPeerTyping(false), 3000);
    };
    const onStopTyping = ({ from }: { from: string }) => {
      if (from !== selectedUserIdRef.current) return;
      setIsPeerTyping(false);
      if (peerTypingTimeoutRef.current) clearTimeout(peerTypingTimeoutRef.current);
    };
    socket.on("typing", onTyping);
    socket.on("stop-typing", onStopTyping);

    return () => {
      socket.off("receive-message", onReceive);
      socket.off("online-users", onOnlineUsers);
      socket.off("typing", onTyping);
      socket.off("stop-typing", onStopTyping);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectUser = async (user: ChatUser) => {
    const userWithOnlineStatus = {
      ...user,
      isOnline: onlineUserIds.includes(user.id),
    };
    setSelectedUser(userWithOnlineStatus);
    selectedUserIdRef.current = user.id;
    setIsPeerTyping(false);
    setLoadingMessages(true);
    try {
      const res = await getMessages(user.id);
      const messagesWithTimestamps = res.data.map((msg: ChatMessage) => ({
        ...msg,
        status: "sent" as const,
        timestamp: formatTime(msg.createdAt),
      }));
      setMessages(messagesWithTimestamps);
    } catch (err) {
      console.error("Fetch messages error:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Update selected user's online status when onlineUserIds change
  useEffect(() => {
    if (selectedUser) {
      setSelectedUser((prev) =>
        prev ? { ...prev, isOnline: onlineUserIds.includes(prev.id) } : null
      );
    }
  }, [onlineUserIds]);

  // Merge online status with users list
  const usersWithOnlineStatus = users.map((user) => ({
    ...user,
    isOnline: onlineUserIds.includes(user.id),
  }));

  const notifyTyping = () => {
    if (!selectedUser) return;
    socket.emit("typing", { to: selectedUser.id });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", { to: selectedUser.id });
    }, 1500);
  };

  const sendMessage = () => {
    if (!selectedUser || !text.trim() || !currentUser) return;

    const clientId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const content = text.trim();

    const optimistic: ChatMessage = {
      id: clientId,
      clientId,
      content,
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      status: "sending",
      timestamp: formatTime(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setText("");
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socket.emit("stop-typing", { to: selectedUser.id });

    socket.emit(
      "send-message",
      { to: selectedUser.id, content, clientId },
      (ack?: { message?: ChatMessage; clientId?: string; error?: string }) => {
        if (!ack || ack.error || !ack.message) {
          setMessages((prev) =>
            prev.map((m) => (m.clientId === clientId ? { ...m, status: "failed" } : m))
          );
          return;
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.clientId === clientId
              ? { ...ack.message!, status: "sent", timestamp: formatTime(ack.message!.createdAt) }
              : m
          )
        );
      }
    );
  };

  const retryMessage = (clientId: string) => {
    const failed = messages.find((m) => m.clientId === clientId);
    if (!failed || !selectedUser) return;
    setMessages((prev) =>
      prev.map((m) => (m.clientId === clientId ? { ...m, status: "sending" } : m))
    );
    socket.emit(
      "send-message",
      { to: selectedUser.id, content: failed.content, clientId },
      (ack?: { message?: ChatMessage; clientId?: string; error?: string }) => {
        if (!ack || ack.error || !ack.message) {
          setMessages((prev) =>
            prev.map((m) => (m.clientId === clientId ? { ...m, status: "failed" } : m))
          );
          return;
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.clientId === clientId
              ? { ...ack.message!, status: "sent", timestamp: formatTime(ack.message!.createdAt) }
              : m
          )
        );
      }
    );
  };

  return {
    currentUser,
    users: usersWithOnlineStatus,
    selectedUser,
    messages,
    text,
    setText,
    loadingUsers,
    loadingMessages,
    isPeerTyping,
    selectUser,
    sendMessage,
    retryMessage,
    notifyTyping,
  };
}
