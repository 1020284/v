'use client';

interface AboutModalProps {
  onClose: () => void;
}

export default function AboutModal({ onClose }: AboutModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-slate-900 to-black rounded-2xl p-8 w-full max-w-2xl border border-white/20 shadow-2xl max-h-96 overflow-y-auto">
        <h2 className="text-3xl font-bold text-white mb-6">About The Chat</h2>

        <div className="space-y-6 text-white/90">
          <div>
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
              🌟 Features
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Real-time global chat for everyone</li>
              <li>Private messaging between users</li>
              <li>Create and manage group chats</li>
              <li>Voice calls with WebRTC</li>
              <li>Message reactions and likes</li>
              <li>Dino jumping mini-game with leaderboard</li>
              <li>Instant notifications</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
              👨‍💻 Built By
            </h3>
            <p className="text-sm">
              Developed as a modern real-time chat platform featuring instant messaging, voice communication, and interactive gaming.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-2">
              ✨ Special Thanks
            </h3>
            <p className="text-sm mb-2">
              Big shout-out to <span className="font-bold text-cyan-300">John McComb</span> for the inspiration and ideas that made this project awesome!
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-2">
              🛠 Tech Stack
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Next.js 16 & React 19</li>
              <li>TypeScript for type safety</li>
              <li>Tailwind CSS for styling</li>
              <li>Socket.io for real-time communication</li>
              <li>WebRTC for voice calling</li>
              <li>Zustand for state management</li>
            </ul>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-xs text-white/60">
              The Chat © 2026 - A sleek, modern real-time communication platform with voice chat and gaming features.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition active:scale-95 hover:scale-102"
          aria-label="Close about modal"
        >
          Close
        </button>
      </div>
    </div>
  );
}
