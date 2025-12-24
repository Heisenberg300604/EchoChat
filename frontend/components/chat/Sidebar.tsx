"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, MessageCircle, User, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

type UserType = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline?: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
};

type Props = {
  currentUser?: { id: string; name: string } | null;
  users: UserType[];
  selectedUserId?: string | null;
  loadingUsers?: boolean;
  onSelectUser: (user: UserType) => void;
};

export default function Sidebar({
  currentUser,
  users,
  selectedUserId,
  loadingUsers,
  onSelectUser,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="h-full flex flex-col bg-card/50 backdrop-blur-sm border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Messages</h1>
              {currentUser && (
                <p className="text-xs text-muted-foreground">
                  {currentUser.name}
                </p>
              )}
            </div>
          </div>
          <Link
            href="/profile"
            className="w-9 h-9 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-0 focus-visible:ring-1 focus-visible:ring-primary/50 placeholder:text-muted-foreground/60 text-foreground"
          />
        </div>
      </div>

      {/* User List */}
      <ScrollArea className="flex-1 scrollbar-thin">
        {loadingUsers ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-secondary" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-secondary rounded w-3/4" />
                  <div className="h-3 bg-secondary rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "No users found" : "No conversations yet"}
            </p>
          </div>
        ) : (
          <div className="py-2">
            {filteredUsers.map((user, index) => (
              <button
                key={user.id}
                className={`w-full text-left p-4 flex items-center gap-3 transition-all duration-200 hover:bg-secondary/30 ${
                  selectedUserId === user.id
                    ? "bg-secondary/50 border-l-2 border-l-primary"
                    : ""
                }`}
                onClick={() => onSelectUser(user)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Avatar */}
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium ${
                      selectedUserId === user.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(user.name)
                    )}
                  </div>
                  {user.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-online rounded-full border-2 border-card" />
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground truncate">
                      {user.name}
                    </span>
                    {user.lastMessageTime && (
                      <span className="text-xs text-muted-foreground">
                        {user.lastMessageTime}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.lastMessage || user.email}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
