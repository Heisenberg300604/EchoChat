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
  const selectedUserIdRef = useRef<string | null>(null);

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
        setMessages((prev) => [...prev, message]);
      }
    };
    socket.on("receive-message", onReceive);

    const onOnlineUsers = (userIds: string[]) => {
      setOnlineUserIds(userIds);
    };
    socket.on("online-users", onOnlineUsers);

    return () => {
      socket.off("receive-message", onReceive);
      socket.off("online-users", onOnlineUsers);
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
    setLoadingMessages(true);
    try {
      const res = await getMessages(user.id);
      // Format timestamps from createdAt
      const messagesWithTimestamps = res.data.map((msg: any) => ({
        ...msg,
        timestamp: msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : undefined,
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

  const sendMessage = () => {
    if (!selectedUser || !text.trim() || !currentUser) return;

    const optimistic: ChatMessage = {
      id: `temp-${Date.now()}`,
      content: text,
      senderId: currentUser.id,
      receiverId: selectedUser.id,
    };
    setMessages((prev) => [...prev, optimistic]);

    socket.emit("send-message", {
      to: selectedUser.id,
      content: text,
    });

    setText("");
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
    selectUser,
    sendMessage,
  };
}
