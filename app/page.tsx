'use client';

import { useState, useEffect } from 'react';
import { useChatStore } from '@/lib/store';
import NameSelector from '@/components/NameSelector';
import ChatRoom from '@/components/ChatRoom';
import PrivateChat from '@/components/PrivateChat';
import GroupChatComponent from '@/components/GroupChat';
import UserList from '@/components/UserList';
import VoiceChat from '@/components/VoiceChat';
import Notifications from '@/components/Notifications';
import DinoGame from '@/components/DinoGame';
import AboutModal from '@/components/AboutModal';

export default function Home() {
  const userName = useChatStore((state) => state.userName);
  const currentView = useChatStore((state) => state.currentView);
  const selectedPrivateChatId = useChatStore((state) => state.selectedPrivateChatId);
  const selectedGroupId = useChatStore((state) => state.selectedGroupId);
  const groupChats = useChatStore((state) => state.groupChats);
  const privateChats = useChatStore((state) => state.privateChats);
  
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const [showDinoGame, setShowDinoGame] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showGroupCreator, setShowGroupCreator] = useState(false);
  const [groupName, setGroupName] = useState('');

  const setCurrentView = useChatStore((state) => state.setCurrentView);
  const createGroup = useChatStore((state) => state.createGroup);
  const users = useChatStore((state) => state.users);
  const getOrCreatePrivateChat = useChatStore((state) => state.getOrCreatePrivateChat);

  const handleCreateGroup = () => {
    const trimmedName = groupName.trim();
    if (!trimmedName || trimmedName.length > 50) return;
    createGroup(trimmedName, users);
    setGroupName('');
    setShowGroupCreator(false);
    setCurrentView('group');
  };

  const selectedGroup = selectedGroupId ? groupChats.get(selectedGroupId) : null;
  const selectedPrivateChat = selectedPrivateChatId ? privateChats.get(selectedPrivateChatId) : null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black">
      {!userName ? (
        <NameSelector />
      ) : (
        <div className="flex h-screen gap-4 p-4">
          {/* Sidebar */}
          <div className="w-72 flex flex-col gap-4">
            {/* Header */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                the chat
              </h1>
              <p className="text-white/60 text-xs mt-1">{userName}</p>
            </div>

            {/* Navigation */}
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentView('global')}
                className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition ${
                  currentView === 'global'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                }`}
              >
                🌍 Global
              </button>
              <button
                onClick={() => setCurrentView('private')}
                className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition ${
                  currentView === 'private'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                }`}
              >
                👤 DMs
              </button>
              <button
                onClick={() => setCurrentView('group')}
                className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition ${
                  currentView === 'group'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                }`}
              >
                👥 Groups
              </button>
            </div>

            {/* Private Chats List */}
            {currentView === 'private' && (
              <div className="flex-1 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 overflow-y-auto flex flex-col">
                <h3 className="text-sm font-bold text-white mb-3">Direct Messages</h3>
                <div className="flex-1 space-y-2 overflow-y-auto">
                  {privateChats.size === 0 ? (
                    <p className="text-white/40 text-xs">Start a DM with someone!</p>
                  ) : (
                    Array.from(privateChats.values()).map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => useChatStore.setState({ selectedPrivateChatId: chat.id })}
                        className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                          selectedPrivateChatId === chat.id
                            ? 'bg-blue-500/30 border border-blue-500/50'
                            : 'hover:bg-white/10'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium truncate">{chat.withUserName}</span>
                          {chat.unread > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2">
                              {chat.unread}
                            </span>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Groups List */}
            {currentView === 'group' && (
              <div className="flex-1 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 overflow-y-auto flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-white">Group Chats</h3>
                  <button
                    onClick={() => setShowGroupCreator(true)}
                    className="text-lg hover:scale-110 transition"
                  >
                    ➕
                  </button>
                </div>
                <div className="flex-1 space-y-2 overflow-y-auto">
                  {groupChats.size === 0 ? (
                    <p className="text-white/40 text-xs">Create or join a group!</p>
                  ) : (
                    Array.from(groupChats.values()).map((group) => (
                      <button
                        key={group.id}
                        onClick={() => useChatStore.setState({ selectedGroupId: group.id })}
                        className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                          selectedGroupId === group.id
                            ? 'bg-green-500/30 border border-green-500/50'
                            : 'hover:bg-white/10'
                        }`}
                      >
                        <div className="font-medium text-white truncate">{group.name}</div>
                        <div className="text-xs text-white/60">{group.members.length} members</div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowDinoGame(true)}
                className="px-3 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition text-sm font-semibold"
              >
                🦖 Play Game
              </button>
              <button
                onClick={() => setShowAbout(true)}
                className="px-3 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition text-sm font-semibold"
              >
                ℹ️ About
              </button>
            </div>

            {/* Notifications */}
            <Notifications />
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col gap-4">
            {currentView === 'global' && (
              <ChatRoom />
            )}
            {currentView === 'private' && selectedPrivateChat && (
              <PrivateChat
                withUserId={selectedPrivateChat.withUserId}
                withUserName={selectedPrivateChat.withUserName}
              />
            )}
            {currentView === 'group' && selectedGroup && (
              <GroupChatComponent group={selectedGroup} />
            )}
          </div>

          {/* Users List */}
          {currentView === 'global' && (
            <div className="w-64 flex flex-col gap-4">
              <UserList onCallClick={() => setShowVoiceChat(true)} onPrivateChat={getOrCreatePrivateChat} />
            </div>
          )}

          {/* Modals */}
          {showVoiceChat && <VoiceChat onClose={() => setShowVoiceChat(false)} />}
          {showDinoGame && <DinoGame onClose={() => setShowDinoGame(false)} />}
          {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}

          {/* Group Creator Modal */}
          {showGroupCreator && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 w-96 border border-white/20 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-4">Create Group</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Group name..."
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleCreateGroup}
                      className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => {
                        setShowGroupCreator(false);
                        setGroupName('');
                      }}
                      className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
