"use client";

import { useEffect, useRef, useState } from 'react';
import { socket } from '../socket';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

type CallState = 'idle' | 'calling' | 'ringing' | 'connected';

export function useWebRTC(currentUserId: string, remoteUserId: string) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callState, setCallState] = useState<CallState>('idle');
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const incomingOfferRef = useRef<RTCSessionDescriptionInit | null>(null);

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('call:ice-candidate', {
          to: remoteUserId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    return pc;
  };

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);

      peerConnection.current = createPeerConnection();
      stream.getTracks().forEach((track) => {
        peerConnection.current!.addTrack(track, stream);
      });

      const offer = await peerConnection.current!.createOffer();
      await peerConnection.current!.setLocalDescription(offer);

      socket.emit('call:initiate', {
        to: remoteUserId,
        from: currentUserId,
        offer,
      });

      setCallState('calling');
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  const answerCall = async (offer?: RTCSessionDescriptionInit) => {
    try {
      const effectiveOffer = offer ?? incomingOfferRef.current;
      if (!effectiveOffer) {
        console.warn('No incoming offer to answer.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);

      peerConnection.current = createPeerConnection();
      stream.getTracks().forEach((track) => {
        peerConnection.current!.addTrack(track, stream);
      });

      await peerConnection.current!.setRemoteDescription(effectiveOffer);
      const answer = await peerConnection.current!.createAnswer();
      await peerConnection.current!.setLocalDescription(answer);

      socket.emit('call:answer', {
        to: remoteUserId,
        answer,
      });

      setCallState('connected');
    } catch (error) {
      console.error('Error answering call:', error);
    }
  };

  const cleanupPeer = () => {
    try {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    } catch {}
    setLocalStream(null);
    setRemoteStream(null);
    peerConnection.current = null;
    incomingOfferRef.current = null;
  };

  const endCall = (silent = false) => {
    cleanupPeer();
    setCallState('idle');
    if (!silent) {
      socket.emit('call:end', { to: remoteUserId });
    }
  };

  const rejectCall = () => {
    cleanupPeer();
    setCallState('idle');
    socket.emit('call:reject', { to: remoteUserId });
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = !audioTrack.enabled;
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = !videoTrack.enabled;
    }
  };

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const onIncoming = ({ from, offer }: { from: string; offer: RTCSessionDescriptionInit }) => {
      incomingOfferRef.current = offer;
      setCallState('ringing');
    };

    const onAnswered = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(answer);
        setCallState('connected');
      }
    };

    const onIceCandidate = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      if (peerConnection.current) {
        try {
          await peerConnection.current.addIceCandidate(candidate);
        } catch (e) {
          console.error('Error adding ICE candidate', e);
        }
      }
    };

    const onEnded = () => {
      endCall(true); // silent to avoid ping-pong
    };

    const onRejected = () => {
      cleanupPeer();
      setCallState('idle');
    };

    socket.on('call:incoming', onIncoming);
    socket.on('call:answered', onAnswered);
    socket.on('call:ice-candidate', onIceCandidate);
    socket.on('call:ended', onEnded);
    socket.on('call:rejected', onRejected);

    return () => {
      socket.off('call:incoming', onIncoming);
      socket.off('call:answered', onAnswered);
      socket.off('call:ice-candidate', onIceCandidate);
      socket.off('call:ended', onEnded);
      socket.off('call:rejected', onRejected);
    };
  }, [remoteUserId]);

  return {
    localStream,
    remoteStream,
    callState,
    startCall,
    answerCall: () => answerCall(),
    endCall,
    rejectCall,
    toggleAudio,
    toggleVideo,
  };
}