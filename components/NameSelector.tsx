'use client';

import { useState } from 'react';
import { useChatStore } from '@/lib/store';

export default function NameSelector() {
  const [inputName, setInputName] = useState('');
  const setUserName = useChatStore((state) => state.setUserName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim().length > 0 && inputName.trim().length <= 50) {
      setUserName(inputName.trim());
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-gradient-to-br from-purple-900/40 via-black/40 to-pink-900/40 backdrop-blur-xl border border-white/20 p-8 shadow-2xl">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 mb-2 text-center">
            the chat
          </h1>
          <p className="text-white/60 text-center mb-8 text-sm font-medium">
            Real-time messaging • Voice calls • Gaming • Reactions
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Choose your name
              </label>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value.slice(0, 50))}
                placeholder="Enter your name..."
                maxLength={50}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/20 transition font-medium"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={!inputName.trim()}
              className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold rounded-lg hover:from-purple-600 hover:via-pink-600 hover:to-red-600 transition transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 active:scale-95"
            >
              Join The Chat
            </button>
          </form>

          <div className="mt-8 p-4 rounded-lg bg-white/5 border border-white/10 space-y-2">
            <p className="text-white/70 text-xs font-semibold">Features:</p>
            <div className="grid grid-cols-2 gap-2 text-white/60 text-xs">
              <div>💬 Global Chat</div>
              <div>👤 Private Messages</div>
              <div>👥 Group Chats</div>
              <div>🎙️ Voice Calls</div>
              <div>❤️ Reactions</div>
              <div>🦖 Mini Games</div>
            </div>
          </div>

          <p className="text-white/30 text-xs text-center mt-6">
            ✨ Join thousands of users chatting in real-time
          </p>
        </div>
      </div>
    </div>
  );
}
