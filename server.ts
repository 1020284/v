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
const messages: Array<{ from: string; text: string; timestamp: number; fromId: string }> = [];

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

      console.log(`${userData.name} joined. Total users: ${activeUsers.size}`);
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
      console.log(`Message from ${data.name}: ${data.text}`);
    });

    // Handle voice call initiation
    socket.on('initiateCall', (data: { to: string; offer: any }) => {
      io.to(data.to).emit('incomingCall', {
        from: socket.id,
        fromName: activeUsers.get(socket.id)?.name,
        offer: data.offer,
      });
      console.log(`Call from ${activeUsers.get(socket.id)?.name} to ${data.to}`);
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
      console.log(`${user?.name} disconnected. Total users: ${activeUsers.size}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
