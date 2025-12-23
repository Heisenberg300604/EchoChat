export interface User {
  id: number;
  name: string;
  username: string;
  avatar?: string;
  lastMessage?: string;
  timestamp?: string;
  online?: boolean;
}

export interface Message {
  id: number;
  text: string;
  sender: "me" | "other";
  timestamp: string;
}