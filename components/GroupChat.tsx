'use client';

import { useState, useEffect, useRef } from 'react';
import { useChatStore, GroupChat } from '@/lib/store';
import { getSocket } from '@/app/providers';

interface GroupChatProps {
  group: GroupChat;
}

export default function GroupChatComponent({ group }: GroupChatProps) {
  const [messageText, setMessageText] = useState('');
  const userName = useChatStore((state) => state.userName);
  const messages = useChatStore((state) => state.getGroupMessages(group.id));
  const addGroupMessage = useChatStore((state) => state.addGroupMessage);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleGroupMessage = (data: any) => {
      if (data.groupId === group.id) {
        addGroupMessage(group.id, data.message);
      }
    };

    socket.on('newGroupMessage', handleGroupMessage);
    return () => {
      socket.off('newGroupMessage', handleGroupMessage);
    };
  }, [group.id, addGroupMessage]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = messageText.trim();
    if (!trimmed || trimmed.length > 1000) return; // Max 1000 chars
    const socket = getSocket();
    if (!socket) return;
    socket.emit('groupMessage', {
      groupId: group.id,
      text: trimmed,
      fromName: userName,
    });
    setMessageText('');
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
        <h2 className="text-xl font-bold text-white">👥 {group.name}</h2>
        <p className="text-white/60 text-sm">{group.members.length} members</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/40">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.from === userName ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.from === userName
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/10 text-white/90 border border-white/20'
                }`}
              >
                {msg.from !== userName && (
                  <p className="text-xs font-semibold text-white/70 mb-1">{msg.from}</p>
                )}
                <p className="break-words">{msg.text}</p>
                <p className="text-xs mt-1 opacity-60">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
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
