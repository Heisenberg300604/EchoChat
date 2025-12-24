"use client";

import { useState } from "react";
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

  const [showSidebar, setShowSidebar] = useState(true);

  const handleSelectUser = (user: { isOnline?: boolean; id: string; name: string; email: string }) => {
    selectUser(user);
    // On mobile, hide sidebar when user is selected
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  const handleBack = () => {
    setShowSidebar(true);
  };

  return (
    <div className="h-screen bg-background overflow-hidden">
      <div className="h-full flex">
        {/* Sidebar */}
        <div
          className={`${
            showSidebar ? "flex" : "hidden"
          } md:flex w-full md:w-80 lg:w-96 shrink-0 border-r border-border`}
        >
          <div className="w-full">
            <Sidebar
              currentUser={currentUser}
              users={users}
              selectedUserId={selectedUser?.id || null}
              loadingUsers={loadingUsers}
              onSelectUser={handleSelectUser}
            />
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`${
            !showSidebar ? "flex" : "hidden"
          } md:flex flex-1 min-w-0`}
        >
          <div className="w-full">
            <ChatArea
              currentUserId={currentUser?.id || null}
              selectedUser={selectedUser}
              messages={messages}
              text={text}
              setText={setText}
              loadingMessages={loadingMessages}
              onSend={sendMessage}
              onBack={handleBack}
            />
          </div>
        </div>
      </div>
    </div>
  );
}