# ChatHub 🌍

A real-time chat application with voice calling capabilities. Chat with everyone on the site instantly and have voice conversations!

## Features

✨ **Core Features:**
- 💬 Real-time text messaging
- 🎙️ Voice chat with WebRTC
- 👥 Live user list
- 🎨 Beautiful gradient UI
- ⚡ Lightning-fast messaging

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Real-time Communication:** Socket.io
- **Voice Chat:** WebRTC with simple-peer
- **State Management:** Zustand
- **Deployment:** Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd v

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Building for Production

```bash
npm run build
npm run start
```

## Usage

1. **Join the Chat:** Enter your name on the home screen
2. **Send Messages:** Type and send messages to chat with everyone
3. **Start a Voice Call:** Click the 🎙️ button next to a user's name to initiate a voice call
4. **Hang Up:** Click "Hang Up" to end the voice call

## Deployment on Vercel

### Deploy with Vercel CLI

```bash
npm install -g vercel
vercel
```

### Deploy from GitHub

1. Push your code to GitHub
2. Go to [https://vercel.com/new](https://vercel.com/new)
3. Select your GitHub repository
4. Vercel will automatically detect it's a Next.js app
5. Click **Deploy**

## Architecture

### Components

- **NameSelector:** User name selection interface
- **ChatRoom:** Main messaging interface
- **UserList:** Live users display with voice call buttons
- **VoiceChat:** WebRTC voice call modal

### Server

The app uses Socket.io for real-time communication:
- User management (join/leave)
- Message broadcasting
- Voice call signaling (WebRTC offer/answer)
- ICE candidate handling

## Known Limitations

- Voice chat requires HTTPS in production (WebRTC requirement)
- Microphone access requires user permission
- Messages are stored in memory (not persisted to database)

## Future Enhancements

- [ ] Message persistence with database
- [ ] User authentication
- [ ] Private messaging
- [ ] Screen sharing
- [ ] Message search
- [ ] User profiles
- [ ] Typing indicators

## License

MIT

---

**Built with ❤️ using Next.js and Socket.io**
