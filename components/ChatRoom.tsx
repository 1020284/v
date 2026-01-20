'use client';

import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '@/lib/store';
import { getSocket } from '@/app/providers';

export default function ChatRoom() {
  const [messageText, setMessageText] = useState('');
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const messages = useChatStore((state) => state.messages);
  const userName = useChatStore((state) => state.userName);
  const addReaction = useChatStore((state) => state.addReaction);
  const toggleLike = useChatStore((state) => state.toggleLike);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const reactions = ['😂', '❤️', '🔥', '👍', '🎉', '😲'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = messageText.trim();
    if (!trimmed || trimmed.length > 1000) return; // Max 1000 chars
    const socket = getSocket();
    if (!socket) return;
    socket.emit('message', { text: trimmed, name: userName });
    setMessageText('');
  };

  const handleReaction = (emoji: string, messageId: string) => {
    const socket = getSocket();
    socket?.emit('addReaction', { messageId, emoji, userName });
    addReaction(messageId, emoji, userName);
  };

  const handleLike = (messageId: string) => {
    const socket = getSocket();
    socket?.emit('toggleLike', { messageId, userId: userName });
    toggleLike(messageId, userName);
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
        <h2 className="text-xl font-bold text-white">🌍 Global Chat</h2>
        <p className="text-white/60 text-sm">Everyone is here</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/40">
            <p>No messages yet. Be the first to say hello! 👋</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.from === userName ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs group px-4 py-2 rounded-lg ${
                  msg.from === userName
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/10 text-white/90 border border-white/20'
                }`}
              >
                {msg.from !== userName && (
                  <p className="text-xs font-semibold text-white/70 mb-1">{msg.from}</p>
                )}
                <p className="break-words">{msg.text}</p>
                
                {/* Reactions */}
                {Object.keys(msg.reactions).length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {Object.entries(msg.reactions).map(([emoji, users]) => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(emoji, msg.id)}
                        className="text-xs bg-white/20 hover:bg-white/30 rounded-full px-2 py-1 transition"
                        title={users.join(', ')}
                      >
                        {emoji} {users.length}
                      </button>
                    ))}
                  </div>
                )}

                <p className="text-xs mt-1 opacity-60">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>

              {/* Action buttons */}
              <div className="ml-2 opacity-0 group-hover:opacity-100 transition flex flex-col gap-1">
                <button
                  onClick={() => handleLike(msg.id)}
                  className={`text-lg ${
                    msg.likes.includes(userName) ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                  }`}
                  title={`Likes: ${msg.likes.length}`}
                >
                  ❤️ {msg.likes.length}
                </button>
                <div className="relative group/reactions">
                  <button className="text-lg opacity-60 hover:opacity-100">
                    😊
                  </button>
                  <div className="hidden group-hover/reactions:flex flex-col gap-1 absolute top-8 right-0 bg-gray-900 border border-white/20 rounded p-2 z-10">
                    {reactions.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(emoji, msg.id)}
                        className="text-lg hover:scale-125 transition"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/20 transition"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
