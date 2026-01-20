'use client';

import { useState } from 'react';
import { useChatStore } from '@/lib/store';

export default function NameSelector() {
  const [inputName, setInputName] = useState('');
  const setUserName = useChatStore((state) => state.setUserName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim()) {
      setUserName(inputName.trim());
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-white mb-2 text-center">ChatHub</h1>
          <p className="text-white/60 text-center mb-8">Chat with everyone in real-time</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Choose your name
              </label>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/20 transition"
                autoFocus
              />
            </div>
            
            <button
              type="submit"
              className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-105"
            >
              Enter Chat
            </button>
          </form>

          <p className="text-white/40 text-xs text-center mt-6">
            💬 Text chat • 🎙️ Voice chat • Real-time messaging
          </p>
        </div>
      </div>
    </div>
  );
}
