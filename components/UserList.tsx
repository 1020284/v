'use client';

import { useChatStore } from '@/lib/store';

interface UserListProps {
  onCallClick: () => void;
  onPrivateChat: (userId: string, userName: string) => void;
}

export default function UserList({ onCallClick, onPrivateChat }: UserListProps) {
  const users = useChatStore((state) => state.users);
  const userName = useChatStore((state) => state.userName);
  const setCallWith = useChatStore((state) => state.setCallWith);

  const handleCallClick = (name: string) => {
    setCallWith(name);
    onCallClick();
  };

  return (
    <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 h-[400px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white mb-2">👥 Users Online</h3>
        <p className="text-white/60 text-sm">{users.length} connected</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {users.length === 0 ? (
          <p className="text-white/40 text-sm">No other users yet</p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              <div className="flex-1">
                <p className="text-white font-medium text-sm">
                  {user.name}
                  {user.name === userName && (
                    <span className="text-xs ml-2 text-purple-400">(You)</span>
                  )}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <p className="text-xs text-white/40">Online</p>
                </div>
              </div>
              {user.name !== userName && (
                <div className="ml-2 flex gap-1">
                  <button
                    onClick={() => onPrivateChat(user.id, user.name)}
                    className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition"
                    title="Send message"
                  >
                    💬
                  </button>
                  <button
                    onClick={() => handleCallClick(user.name)}
                    className="px-2 py-1 text-xs bg-purple-500 hover:bg-purple-600 text-white rounded transition"
                    title="Voice call"
                  >
                    🎙️
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-white/10">
        <p className="text-white/70 text-xs">
          <strong>You:</strong> {userName}
        </p>
      </div>
    </div>
  );
}
