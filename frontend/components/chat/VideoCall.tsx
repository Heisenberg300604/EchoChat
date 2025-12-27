"use client";

import { useEffect, useRef } from 'react';
import { useWebRTC } from '@/hooks/useWebRTC';

type Props = {
  currentUserId: string;
  remoteUserId: string;
  onClose: () => void;
  autoStart?: boolean;
};

export default function VideoCall({ currentUserId, remoteUserId, onClose, autoStart }: Props) {
  const {
    localStream,
    remoteStream,
    callState,
    startCall,
    answerCall,
    endCall,
    rejectCall,
    toggleAudio,
    toggleVideo,
  } = useWebRTC(currentUserId, remoteUserId);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleEnd = () => {
    endCall();
    onClose();
  };

  // Auto-start call when opened by caller
  useEffect(() => {
    if (autoStart) {
      startCall();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Remote Video (main) */}
      <div className="flex-1 relative">
        {remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            {callState === 'calling' && <p>Calling...</p>}
            {callState === 'ringing' && <p>Incoming call...</p>}
            {callState === 'connected' && <p>Connecting...</p>}
          </div>
        )}

        {/* Local Video (small) */}
        {localStream && (
          <div className="absolute top-4 right-4 w-40 h-30 bg-gray-800 rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover mirror"
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 bg-gray-900 flex items-center justify-center gap-4">
        {callState === 'ringing' ? (
          <>
            <button
              onClick={answerCall}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full"
            >
              Accept
            </button>
            <button
              onClick={() => {
                rejectCall();
                onClose();
              }}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full"
            >
              Reject
            </button>
          </>
        ) : (
          <>
            <button
              onClick={startCall}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-full"
              style={{ display: callState === 'idle' ? 'inline-block' : 'none' }}
            >
              Start Call
            </button>
            <button
              onClick={toggleAudio}
              className="p-4 bg-gray-700 hover:bg-gray-600 text-white rounded-full"
            >
              🎤
            </button>
            <button
              onClick={toggleVideo}
              className="p-4 bg-gray-700 hover:bg-gray-600 text-white rounded-full"
            >
              📹
            </button>
            <button
              onClick={handleEnd}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full"
            >
              End Call
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
}
