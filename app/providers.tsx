'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useChatStore } from '@/lib/store';

let socket: Socket | null = null;

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const setUsers = useChatStore((state) => state.setUsers);
  const setMessages = useChatStore((state) => state.setMessages);
  const userName = useChatStore((state) => state.userName);
  const addMessage = useChatStore((state) => state.addMessage);

  useEffect(() => {
    if (!userName || socket?.connected) return;

    // Initialize Socket.io connection
    socket = io(undefined, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('Connected to server');
      socket?.emit('join', { name: userName });
    });

    socket.on('userJoined', (data) => {
      setUsers(
        data.users.map((u: any) => ({
          id: u.socketId,
          name: u.name,
          socketId: u.socketId,
        }))
      );
      setMessages(data.messages || []);
    });

    socket.on('newMessage', (data) => {
      addMessage(data);
    });

    socket.on('userLeft', (data) => {
      setUsers(
        data.users.map((u: any) => ({
          id: u.socketId,
          name: u.name,
          socketId: u.socketId,
        }))
      );
    });

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [userName, setUsers, setMessages, addMessage]);

  return children;
}

export function getSocket(): Socket | null {
  return socket;
}
