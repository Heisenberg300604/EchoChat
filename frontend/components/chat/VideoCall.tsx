"use client";

import { useEffect, useRef, useState } from "react";
import { useWebRTC } from "@/hooks/useWebRTC";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  PhoneCall,
  X,
} from "lucide-react";

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
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

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

  // Sync UI toggles with actual track states when streams change
  useEffect(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      const videoTrack = localStream.getVideoTracks()[0];
      setIsAudioEnabled(audioTrack ? audioTrack.enabled : false);
      setIsVideoEnabled(videoTrack ? videoTrack.enabled : false);
    } else {
      setIsAudioEnabled(false);
      setIsVideoEnabled(false);
    }
  }, [localStream]);

  const handleEnd = () => {
    endCall();
    onClose();
  };

  const handleToggleAudio = () => {
    toggleAudio();
    setIsAudioEnabled((prev) => !prev);
  };

  const handleToggleVideo = () => {
    toggleVideo();
    setIsVideoEnabled((prev) => !prev);
  };

  // Auto-start call when opened by caller
  useEffect(() => {
    if (autoStart) {
      startCall();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950/90 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.12),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.12),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.12),transparent_30%)]" />

      <div className="relative h-full flex flex-col pb-28">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-semibold uppercase">
              {remoteUserId?.slice(0, 2) || "VU"}
            </span>
            <div className="flex flex-col">
              <span className="font-semibold text-white/90">Call with {remoteUserId}</span>
              <span className="text-xs text-white/60">{callState === "connected" ? "Connected" : callState === "ringing" ? "Incoming" : "Calling"}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/10 capitalize">
              {callState}
            </span>
            <button
              onClick={handleEnd}
              className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center"
              aria-label="Close call"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Video stage */}
        <div className="flex-1 grid lg:grid-cols-[1fr_320px] gap-6 p-6">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 backdrop-blur-xl min-h-[320px] max-h-[calc(100vh-220px)] flex items-center justify-center">
            {remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full max-h-full object-contain bg-black"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/70">
                {callState === "calling" && <p>Calling...</p>}
                {callState === "ringing" && <p>Incoming call...</p>}
                {callState === "connected" && <p>Connecting...</p>}
                {callState === "idle" && <p>Ready to call</p>}
              </div>
            )}

            {/* Local preview */}
            {localStream && (
              <div className="absolute bottom-4 right-4 w-44 h-32 rounded-2xl overflow-hidden border border-white/20 shadow-xl bg-black/60">
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

          {/* Sidebar status */}
          <div className="hidden lg:flex flex-col gap-4 p-5 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between">
              <div className="text-sm text-white/70">Mic</div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${isAudioEnabled ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" : "bg-rose-500/15 text-rose-200 border border-rose-500/30"}`}>
                {isAudioEnabled ? "On" : "Muted"}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-white/70">Camera</div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${isVideoEnabled ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" : "bg-rose-500/15 text-rose-200 border border-rose-500/30"}`}>
                {isVideoEnabled ? "On" : "Off"}
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm text-white/70">
              <span className="text-white/80 font-semibold">Status</span>
              <span className="px-3 py-2 rounded-2xl bg-white/5 border border-white/10 capitalize">
                {callState}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="fixed inset-x-0 bottom-0 pb-6 px-6 z-50 pointer-events-none">
          <div className="mx-auto max-w-3xl rounded-full bg-slate-900/90 border border-white/15 backdrop-blur-2xl shadow-[0_10px_50px_rgba(0,0,0,0.45)] flex items-center justify-center gap-4 px-5 py-4 pointer-events-auto">
            {callState === "ringing" ? (
              <>
                <button
                  onClick={answerCall}
                  className="h-12 px-5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold flex items-center gap-2 shadow-lg shadow-emerald-500/30"
                >
                  <PhoneCall className="h-5 w-5" /> Accept
                </button>
                <button
                  onClick={() => {
                    rejectCall();
                    onClose();
                  }}
                  className="h-12 px-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold flex items-center gap-2 shadow-lg shadow-rose-500/30"
                >
                  <PhoneOff className="h-5 w-5" /> Reject
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleToggleAudio}
                  className={`h-12 w-12 rounded-full flex items-center justify-center border transition ${isAudioEnabled ? "bg-white/10 border-white/20 hover:bg-white/20" : "bg-rose-500/25 border-rose-400/40 hover:bg-rose-500/35"}`}
                  aria-label="Toggle microphone"
                >
                  {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </button>
                <button
                  onClick={handleToggleVideo}
                  className={`h-12 w-12 rounded-full flex items-center justify-center border transition ${isVideoEnabled ? "bg-white/10 border-white/20 hover:bg-white/20" : "bg-amber-500/25 border-amber-400/40 hover:bg-amber-500/35"}`}
                  aria-label="Toggle camera"
                >
                  {isVideoEnabled ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </button>
                <button
                  onClick={handleEnd}
                  className="h-12 px-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold flex items-center gap-2 shadow-lg shadow-rose-500/40"
                >
                  <PhoneOff className="h-5 w-5" /> End
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
}
