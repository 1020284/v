import { NextRequest, NextResponse } from 'next/server';
import { Server as SocketIOServer } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { Socket as NetSocket } from 'net';

interface SocketServer extends HTTPServer {
  io?: SocketIOServer;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

// Store active users
const activeUsers = new Map<string, { name: string; socketId: string }>();
const messages: Array<{ from: string; text: string; timestamp: number; fromId: string }> = [];

export async function GET(req: NextRequest) {
  if ((req as any).socket.server.io) {
    return NextResponse.json({ success: true });
  }

  const io = new SocketIOServer((req as any).socket.server, {
    cors: { origin: '*' },
  });

  (req as any).socket.server.io = io;

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User joins with name
    socket.on('join', (userData: { name: string }) => {
      activeUsers.set(socket.id, { name: userData.name, socketId: socket.id });
      
      // Broadcast user joined
      io.emit('userJoined', {
        userId: socket.id,
        name: userData.name,
        users: Array.from(activeUsers.values()),
        messages: messages,
      });
    });

    // Handle messages
    socket.on('message', (data: { text: string; name: string }) => {
      const messageData = {
        from: data.name,
        text: data.text,
        timestamp: Date.now(),
        fromId: socket.id,
      };
      messages.push(messageData);
      io.emit('newMessage', messageData);
    });

    // Handle voice call initiation
    socket.on('initiateCall', (data: { to: string; offer: any }) => {
      io.to(data.to).emit('incomingCall', {
        from: socket.id,
        fromName: activeUsers.get(socket.id)?.name,
        offer: data.offer,
      });
    });

    // Handle call answer
    socket.on('answerCall', (data: { to: string; answer: any }) => {
      io.to(data.to).emit('callAnswered', {
        from: socket.id,
        answer: data.answer,
      });
    });

    // Handle ICE candidates
    socket.on('iceCandidate', (data: { to: string; candidate: any }) => {
      io.to(data.to).emit('iceCandidate', {
        from: socket.id,
        candidate: data.candidate,
      });
    });

    socket.on('disconnect', () => {
      const user = activeUsers.get(socket.id);
      activeUsers.delete(socket.id);
      io.emit('userLeft', {
        userId: socket.id,
        name: user?.name,
        users: Array.from(activeUsers.values()),
      });
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return NextResponse.json({ success: true });
}
