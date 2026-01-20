import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Store active users and messages
const activeUsers = new Map<string, { name: string; socketId: string }>();
const messages: any[] = [];
const groupChats = new Map<string, any>();
const userSockets = new Map<string, string>();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request:', err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  });

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join', (userData: { name: string }) => {
      activeUsers.set(socket.id, { name: userData.name, socketId: socket.id });
      userSockets.set(socket.id, socket.id);

      io.emit('userJoined', {
        userId: socket.id,
        name: userData.name,
        users: Array.from(activeUsers.values()),
        messages: messages,
      });

      console.log(`${userData.name} joined. Total users: ${activeUsers.size}`);
    });

    socket.on('message', (data: { text: string; name: string }) => {
      const messageData = {
        id: `msg_${Date.now()}_${Math.random()}`,
        from: data.name,
        text: data.text,
        timestamp: Date.now(),
        fromId: socket.id,
        reactions: {},
        likes: [],
      };
      messages.push(messageData);
      io.emit('newMessage', messageData);
    });

    socket.on('addReaction', (data: { messageId: string; emoji: string; userName: string }) => {
      const msg = messages.find((m) => m.id === data.messageId);
      if (msg) {
        if (!msg.reactions[data.emoji]) msg.reactions[data.emoji] = [];
        if (!msg.reactions[data.emoji].includes(data.userName)) {
          msg.reactions[data.emoji].push(data.userName);
        }
        io.emit('reactionAdded', data);
      }
    });

    socket.on('toggleLike', (data: { messageId: string; userId: string }) => {
      const msg = messages.find((m) => m.id === data.messageId);
      if (msg) {
        const idx = msg.likes.indexOf(data.userId);
        if (idx > -1) {
          msg.likes.splice(idx, 1);
        } else {
          msg.likes.push(data.userId);
        }
        io.emit('likeToggled', data);
      }
    });

    socket.on('privateMessage', (data: { to: string; text: string; fromName: string }) => {
      const privateMsg = {
        id: `pmsg_${Date.now()}_${Math.random()}`,
        from: data.fromName,
        text: data.text,
        timestamp: Date.now(),
        fromId: socket.id,
        reactions: {},
        likes: [],
      };
      io.to(data.to).emit('privateMessageReceived', { ...privateMsg, from: socket.id });
      io.emit('privateMessageSent', privateMsg);
    });

    socket.on('createGroup', (data: { groupName: string; members: any[] }) => {
      const groupId = `group_${Date.now()}`;
      groupChats.set(groupId, {
        id: groupId,
        name: data.groupName,
        createdBy: socket.id,
        members: data.members,
        messages: [],
        createdAt: Date.now(),
      });
      io.emit('groupCreated', { groupId, name: data.groupName, members: data.members });
    });

    socket.on('groupMessage', (data: { groupId: string; text: string; fromName: string }) => {
      const group = groupChats.get(data.groupId);
      if (group) {
        const groupMsg = {
          id: `gmsg_${Date.now()}_${Math.random()}`,
          from: data.fromName,
          text: data.text,
          timestamp: Date.now(),
          fromId: socket.id,
          reactions: {},
          likes: [],
        };
        group.messages.push(groupMsg);
        io.emit('newGroupMessage', { groupId: data.groupId, message: groupMsg });
      }
    });

    socket.on('submitGameScore', (data: { score: number; userName: string }) => {
      const scoreData = {
        userId: socket.id,
        userName: data.userName,
        score: data.score,
        timestamp: Date.now(),
      };
      io.emit('newGameScore', scoreData);
    });

    socket.on('initiateCall', (data: { to: string; offer: any }) => {
      io.to(data.to).emit('incomingCall', {
        from: socket.id,
        fromName: activeUsers.get(socket.id)?.name,
        offer: data.offer,
      });
    });

    socket.on('answerCall', (data: { to: string; answer: any }) => {
      io.to(data.to).emit('callAnswered', {
        from: socket.id,
        answer: data.answer,
      });
    });

    socket.on('iceCandidate', (data: { to: string; candidate: any }) => {
      io.to(data.to).emit('iceCandidate', {
        from: socket.id,
        candidate: data.candidate,
      });
    });

    socket.on('disconnect', () => {
      const user = activeUsers.get(socket.id);
      activeUsers.delete(socket.id);
      userSockets.delete(socket.id);
      io.emit('userLeft', {
        userId: socket.id,
        name: user?.name,
        users: Array.from(activeUsers.values()),
      });
      console.log(`${user?.name} disconnected. Total users: ${activeUsers.size}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
