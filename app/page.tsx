'use client';

import { useState, useEffect } from 'react';
import { useChatStore } from '@/lib/store';
import NameSelector from '@/components/NameSelector';
import ChatRoom from '@/components/ChatRoom';
import UserList from '@/components/UserList';
import VoiceChat from '@/components/VoiceChat';

export default function Home() {
  const userName = useChatStore((state) => state.userName);
  const [showVoiceChat, setShowVoiceChat] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black">
      {!userName ? (
        <NameSelector />
      ) : (
        <div className="flex h-screen gap-4 p-4">
          <div className="flex-1 flex flex-col">
            <ChatRoom />
          </div>
          <div className="w-64 flex flex-col gap-4">
            <UserList onCallClick={() => setShowVoiceChat(true)} />
          </div>
          {showVoiceChat && <VoiceChat onClose={() => setShowVoiceChat(false)} />}
        </div>
      )}
    </main>
  );
}
