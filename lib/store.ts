import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  socketId: string;
}

export interface Message {
  id: string;
  from: string;
  fromId: string;
  text: string;
  timestamp: number;
  reactions: { [emoji: string]: string[] }; // emoji -> array of user IDs
  likes: string[]; // user IDs who liked
}

export interface PrivateChat {
  id: string;
  withUserId: string;
  withUserName: string;
  messages: Message[];
  unread: number;
}

export interface GroupChat {
  id: string;
  name: string;
  createdBy: string;
  members: User[];
  messages: Message[];
  createdAt: number;
}

export interface Notification {
  id: string;
  type: 'message' | 'group_invite' | 'reaction' | 'private_msg';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export interface GameScore {
  userId: string;
  userName: string;
  score: number;
  timestamp: number;
}

interface ChatStore {
  // User info
  userName: string;
  setUserName: (name: string) => void;
  
  // Global state
  users: User[];
  setUsers: (users: User[]) => void;
  
  // Global chat
  messages: Message[];
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  addReaction: (messageId: string, emoji: string, userId: string) => void;
  toggleLike: (messageId: string, userId: string) => void;
  
  // Private chats
  privateChats: Map<string, PrivateChat>;
  getOrCreatePrivateChat: (userId: string, userName: string) => void;
  addPrivateMessage: (withUserId: string, message: Message) => void;
  getPrivateMessages: (withUserId: string) => Message[];
  markPrivateChatAsRead: (withUserId: string) => void;
  
  // Group chats
  groupChats: Map<string, GroupChat>;
  createGroup: (groupName: string, members: User[]) => string;
  addGroupMessage: (groupId: string, message: Message) => void;
  getGroupMessages: (groupId: string) => Message[];
  joinGroup: (groupId: string, user: User) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  unreadCount: number;
  
  // Voice call
  onCall: boolean;
  setOnCall: (onCall: boolean) => void;
  callWith: string | null;
  setCallWith: (name: string | null) => void;
  
  // Game
  gameScores: GameScore[];
  addGameScore: (score: GameScore) => void;
  
  // UI state
  currentView: 'global' | 'private' | 'group';
  setCurrentView: (view: 'global' | 'private' | 'group') => void;
  selectedPrivateChatId: string | null;
  setSelectedPrivateChatId: (id: string | null) => void;
  selectedGroupId: string | null;
  setSelectedGroupId: (id: string | null) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  userName: '',
  setUserName: (name: string) => set({ userName: name }),
  
  users: [],
  setUsers: (users: User[]) => set({ users }),
  
  messages: [],
  addMessage: (message: Message) => set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages: Message[]) => set({ messages }),
  addReaction: (messageId: string, emoji: string, userId: string) => {
    set((state) => {
      const updatedMessages = state.messages.map((msg) => {
        if (msg.id === messageId) {
          const reactions = { ...msg.reactions };
          if (!reactions[emoji]) reactions[emoji] = [];
          if (!reactions[emoji].includes(userId)) {
            reactions[emoji].push(userId);
          }
          return { ...msg, reactions };
        }
        return msg;
      });
      return { messages: updatedMessages };
    });
  },
  toggleLike: (messageId: string, userId: string) => {
    set((state) => {
      const updatedMessages = state.messages.map((msg) => {
        if (msg.id === messageId) {
          const likes = msg.likes.includes(userId)
            ? msg.likes.filter((id) => id !== userId)
            : [...msg.likes, userId];
          return { ...msg, likes };
        }
        return msg;
      });
      return { messages: updatedMessages };
    });
  },
  
  privateChats: new Map(),
  getOrCreatePrivateChat: (userId: string, userName: string) => {
    set((state) => {
      const chats = new Map(state.privateChats);
      if (!chats.has(userId)) {
        chats.set(userId, {
          id: userId,
          withUserId: userId,
          withUserName: userName,
          messages: [],
          unread: 0,
        });
      }
      return { privateChats: chats };
    });
  },
  addPrivateMessage: (withUserId: string, message: Message) => {
    set((state) => {
      const chats = new Map(state.privateChats);
      const chat = chats.get(withUserId);
      if (chat) {
        chat.messages.push(message);
        if (message.fromId !== get().userName) {
          chat.unread++;
        }
      }
      return { privateChats: chats };
    });
  },
  getPrivateMessages: (withUserId: string) => {
    return get().privateChats.get(withUserId)?.messages || [];
  },
  markPrivateChatAsRead: (withUserId: string) => {
    set((state) => {
      const chats = new Map(state.privateChats);
      const chat = chats.get(withUserId);
      if (chat) {
        chat.unread = 0;
      }
      return { privateChats: chats };
    });
  },
  
  groupChats: new Map(),
  createGroup: (groupName: string, members: User[]) => {
    const groupId = `group_${Date.now()}`;
    set((state) => {
      const groups = new Map(state.groupChats);
      groups.set(groupId, {
        id: groupId,
        name: groupName,
        createdBy: get().userName,
        members,
        messages: [],
        createdAt: Date.now(),
      });
      return { groupChats: groups };
    });
    return groupId;
  },
  addGroupMessage: (groupId: string, message: Message) => {
    set((state) => {
      const groups = new Map(state.groupChats);
      const group = groups.get(groupId);
      if (group) {
        group.messages.push(message);
      }
      return { groupChats: groups };
    });
  },
  getGroupMessages: (groupId: string) => {
    return get().groupChats.get(groupId)?.messages || [];
  },
  joinGroup: (groupId: string, user: User) => {
    set((state) => {
      const groups = new Map(state.groupChats);
      const group = groups.get(groupId);
      if (group && !group.members.find((m) => m.id === user.id)) {
        group.members.push(user);
      }
      return { groupChats: groups };
    });
  },
  
  notifications: [],
  addNotification: (notif) => {
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          ...notif,
          id: `notif_${Date.now()}_${Math.random()}`,
          timestamp: Date.now(),
          read: false,
        },
      ],
      unreadCount: state.unreadCount + 1,
    }));
  },
  markNotificationAsRead: (notificationId: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },
  unreadCount: 0,
  
  onCall: false,
  setOnCall: (onCall: boolean) => set({ onCall }),
  callWith: null,
  setCallWith: (name: string | null) => set({ callWith: name }),
  
  gameScores: [],
  addGameScore: (score: GameScore) => {
    set((state) => {
      const scores = [...state.gameScores, score].sort((a, b) => b.score - a.score).slice(0, 10);
      return { gameScores: scores };
    });
  },
  
  currentView: 'global',
  setCurrentView: (view: 'global' | 'private' | 'group') => set({ currentView: view }),
  selectedPrivateChatId: null,
  setSelectedPrivateChatId: (id: string | null) => set({ selectedPrivateChatId: id }),
  selectedGroupId: null,
  setSelectedGroupId: (id: string | null) => set({ selectedGroupId: id }),
}));

