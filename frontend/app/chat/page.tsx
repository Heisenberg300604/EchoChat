"use client";

import Sidebar from "@/components/chat/Sidebar";
import ChatArea from "@/components/chat/ChatArea";
import { useChat } from "@/lib/hooks/useChat";

export default function ChatPage() {
  const {
    currentUser,
    users,
    selectedUser,
    messages,
    text,
    setText,
    loadingUsers,
    loadingMessages,
    selectUser,
    sendMessage,
  } = useChat();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-4 h-screen md:h-[calc(100vh-64px)]">
        <div className="md:col-span-1 h-full">
          <Sidebar
            currentUser={currentUser}
            users={users}
            selectedUserId={selectedUser?.id || null}
            loadingUsers={loadingUsers}
            onSelectUser={selectUser}
          />
        </div>
        <div className="md:col-span-2 h-full">
          <ChatArea
            currentUserId={currentUser?.id || null}
            selectedUser={selectedUser}
            messages={messages}
            text={text}
            setText={setText}
            loadingMessages={loadingMessages}
            onSend={sendMessage}
          />
        </div>
      </div>
    </div>
  );
}