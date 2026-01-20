# the chat 💬

A sleek, real-time chat platform with voice calling, group chats, message reactions, and an interactive mini-game. Connect with people worldwide instantly!

## ✨ Features

### Core Chat Features
- **Global Chat** - Real-time messaging with everyone on the platform
- **Private Messaging** - Direct messages between users with unread indicators
- **Group Chats** - Create and manage group conversations
- **Message Reactions** - React with emojis (😂, ❤️, 🔥, 👍, 🎉, 😲)
- **Like Messages** - Heart your favorite messages
- **Notifications** - Real-time alerts for new messages and events

### Advanced Features
- 🎙️ **Voice Calling** - WebRTC-powered voice chat with other users
- 🦖 **Dino Game** - Mini-game with leaderboard and score submission
- 🎨 **Sleek Design** - Modern gradient UI with smooth animations
- ✨ **Instant Updates** - Real-time synchronization across all clients

## 🛠 Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Real-time Communication:** Socket.io
- **Voice Chat:** WebRTC with simple-peer
- **State Management:** Zustand
- **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/1020284/v
cd v

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app in action!

### Building for Production

```bash
npm run build
npm run start
```

## 💬 How to Use

### Global Chat
1. Choose your name and join the chat
2. View all online users on the right sidebar
3. Send messages to everyone in real-time
4. React to messages with emojis or hearts

### Private Messaging
1. Click the 💬 button next to a user in the Global view
2. Switch to the **DMs** tab in the sidebar
3. Start a private conversation

### Group Chats
1. Switch to the **Groups** tab
2. Click ➕ to create a new group
3. Name your group and invite members
4. Chat with the entire group

### Voice Calls
1. Switch to Global Chat
2. Click 🎙️ next to a user to start a voice call
3. Allow microphone access when prompted
4. Enjoy clear, real-time audio communication

### Mini Game
1. Click 🦖 **Play Game** button in the sidebar
2. Press SPACE or click to make Dino jump
3. Avoid obstacles for as long as possible
4. Submit your final score to the leaderboard

## 🎮 Game Leaderboard

The Dino Runner game tracks scores across all players. Your best scores are displayed in the game's built-in leaderboard. Compete with other players and climb to the top!

## 📱 Features Breakdown

| Feature | Description |
|---------|-------------|
| 🌍 Global Chat | Real-time messaging for all users |
| 👤 DMs | Private one-on-one conversations |
| 👥 Groups | Create and manage group conversations |
| 🎙️ Voice Calls | WebRTC-powered voice communication |
| 😊 Reactions | React to messages with emoji |
| ❤️ Likes | Heart your favorite messages |
| 🔔 Notifications | Real-time notification system |
| 🦖 Dino Game | Interactive jumping game |
| 🏆 Leaderboard | Track top game scores |

## 🌐 Deployment on Vercel

### Option 1: Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option 2: GitHub Integration

1. Push code to your GitHub repository (already done!)
2. Visit [https://vercel.com/new](https://vercel.com/new)
3. Select your GitHub repository
4. Vercel auto-detects Next.js settings
5. Click **Deploy**

## 📊 Architecture

### Components

- **NameSelector** - Initial username selection
- **ChatRoom** - Global chat interface with reactions
- **PrivateChat** - Direct message interface
- **GroupChat** - Group conversation interface
- **UserList** - Online users directory
- **VoiceChat** - WebRTC voice call modal
- **DinoGame** - Mini-game component
- **Notifications** - Real-time notification center
- **AboutModal** - Credits and information

### Server (Socket.io)

The backend handles:
- User connection/disconnection
- Message broadcasting
- Private message routing
- Group chat management
- Voice call signaling
- Reaction tracking
- Game score submission

## ⚙️ Configuration

No configuration needed for basic setup. The app works out of the box!

For production:
- Ensure HTTPS is enabled (automatic on Vercel)
- Socket.io CORS is pre-configured
- Environment variables are optional

## 🎓 Credits

**Special thanks to John McComb** for the inspiration and ideas that shaped this project!

## 📝 Known Limitations

- Voice chat requires HTTPS in production (WebRTC requirement)
- Microphone access requires user permission
- Messages and game scores are stored in memory (not persisted)
- Game scores are reset on server restart

## 🔮 Future Enhancements

- [ ] Message persistence with database
- [ ] User authentication and profiles
- [ ] Screen sharing
- [ ] Message search and history
- [ ] Custom emojis
- [ ] Message threading
- [ ] Admin controls
- [ ] User roles and permissions
- [ ] Message encryption
- [ ] Mobile app

## 📄 License

MIT License - Feel free to use this project however you like!

## 🤝 Support

For issues, questions, or suggestions, please visit the [GitHub Issues](https://github.com/1020284/v/issues) page.

---

**Built with ❤️ using Next.js, Socket.io, and WebRTC**

🌟 If you love the chat, don't forget to star the repository!
