import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  socketId: string;
}

interface Message {
  from: string;
  text: string;
  timestamp: number;
  fromId: string;
}

interface ChatStore {
  userName: string;
  setUserName: (name: string) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  messages: Message[];
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  onCall: boolean;
  setOnCall: (onCall: boolean) => void;
  callWith: string | null;
  setCallWith: (name: string | null) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  userName: '',
  setUserName: (name: string) => set({ userName: name }),
  users: [],
  setUsers: (users: User[]) => set({ users }),
  messages: [],
  addMessage: (message: Message) => set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages: Message[]) => set({ messages }),
  onCall: false,
  setOnCall: (onCall: boolean) => set({ onCall }),
  callWith: null,
  setCallWith: (name: string | null) => set({ callWith: name }),
}));
