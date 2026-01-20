'use client';

import { useState, useEffect, useRef } from 'react';
import SimplePeer, { Instance } from 'simple-peer';
import { useChatStore } from '@/lib/store';
import { getSocket } from '@/app/providers';

interface VoiceChatProps {
  onClose: () => void;
}

export default function VoiceChat({ onClose }: VoiceChatProps) {
  const callWith = useChatStore((state) => state.callWith);
  const setCallWith = useChatStore((state) => state.setCallWith);
  const [callStatus, setCallStatus] = useState<'calling' | 'connected' | 'ended'>('calling');
  const [error, setError] = useState<string | null>(null);
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const peerRef = useRef<Instance | null>(null);
  const socketRef = useRef(getSocket());

  useEffect(() => {
    if (!callWith || !socketRef.current) return;

    const socket = socketRef.current;
    let peer: Instance | null = null;

    const setupPeer = async (initiator: boolean, offer?: any) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        if (localAudioRef.current) {
          localAudioRef.current.srcObject = stream;
        }

        peer = new SimplePeer({
          initiator,
          trickle: true,
          stream,
        });

        peer.on('signal', (signal) => {
          if (initiator) {
            socket.emit('initiateCall', { to: callWith, offer: signal });
          } else {
            socket.emit('answerCall', { to: callWith, answer: signal });
          }
        });

        peer.on('stream', (remoteStream) => {
          if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = remoteStream;
          }
          setCallStatus('connected');
        });

        peer.on('error', (err: any) => {
          console.error('Peer error:', err);
          setError(`Connection error: ${err.message || 'Unknown error'}`);
        });

        peer.on('close', () => {
          setCallStatus('ended');
        });

        if (offer) {
          peer.signal(offer);
        }

        peerRef.current = peer;
      } catch (err: any) {
        console.error('Media error:', err);
        setError(err.name === 'NotAllowedError' 
          ? 'Microphone permission denied' 
          : 'Cannot access microphone');
      }
    };

    // Check if this user should initiate or answer
    const handleIncomingCall = (data: any) => {
      setupPeer(false, data.offer);
    };

    const handleCallAnswered = (data: any) => {
      if (peerRef.current) {
        peerRef.current.signal(data.answer);
      }
    };

    const handleIceCandidate = (data: any) => {
      if (peerRef.current) {
        try {
          (peerRef.current as any).addIceCandidate(data.candidate);
        } catch (err) {
          console.log('Could not add ICE candidate', err);
        }
      }
    };

    socket.on('incomingCall', handleIncomingCall);
    socket.on('callAnswered', handleCallAnswered);
    socket.on('iceCandidate', handleIceCandidate);

    // Initiate call (this component is opened by the caller)
    setupPeer(true);

    return () => {
      socket.off('incomingCall', handleIncomingCall);
      socket.off('callAnswered', handleCallAnswered);
      socket.off('iceCandidate', handleIceCandidate);

      if (peer) {
        peer.destroy();
      }

      if (localAudioRef.current?.srcObject) {
        (localAudioRef.current.srcObject as MediaStream).getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [callWith]);

  const handleHangup = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    if (localAudioRef.current?.srcObject) {
      (localAudioRef.current.srcObject as MediaStream).getTracks().forEach((track) => {
        track.stop();
      });
    }
    setCallWith(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-purple-900 to-black rounded-2xl p-8 w-96 border border-white/20 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">🎙️ Voice Call</h2>
        <p className="text-white/60 mb-6">with {callWith}</p>

        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-white/60 text-sm mb-1">Local Audio</p>
            <audio ref={localAudioRef} autoPlay muted playsInline className="w-full" />
            <div className="text-white/40 text-xs mt-2">🎤 Microphone active</div>
          </div>

          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-white/60 text-sm mb-1">Remote Audio</p>
            <audio ref={remoteAudioRef} autoPlay playsInline className="w-full" />
            <div className="text-white/40 text-xs mt-2">
              {callStatus === 'connected' ? '🔊 Connected' : '📞 ' + callStatus}
            </div>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={handleHangup}
            className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition"
          >
            Hang Up
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition"
          >
            Minimize
          </button>
        </div>

        <p className="text-white/40 text-xs text-center mt-4">Call in progress...</p>
      </div>
    </div>
  );
}
