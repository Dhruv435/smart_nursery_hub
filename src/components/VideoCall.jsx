import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Phone, User, Maximize2, Minimize2 } from "lucide-react";

const VideoCall = ({ onClose, otherUserId, currentUserId, otherUserName }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [permissionError, setPermissionError] = useState(null);
  const [callState, setCallState] = useState("initializing"); // initializing, calling, connected, ended
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState("good"); // good, medium, poor
  
  const callStartTime = useRef(null);
  const durationInterval = useRef(null);

  // ICE servers configuration (STUN/TURN servers)
  const iceServers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
    ]
  };

  useEffect(() => {
    initializeCall();
    return () => cleanup();
  }, []);

  // Call Duration Timer
  useEffect(() => {
    if (callState === "connected") {
      callStartTime.current = Date.now();
      durationInterval.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - callStartTime.current) / 1000);
        setCallDuration(elapsed);
      }, 1000);
    }
    return () => {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    };
  }, [callState]);

  const initializeCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        }, 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      localStream.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // In a real app, you'd set up WebRTC peer connection here
      // For demo, we'll simulate a call
      setCallState("calling");
      
      // Simulate connection after 2 seconds
      setTimeout(() => {
        setCallState("connected");
        simulateRemoteStream();
      }, 2000);

    } catch (err) {
      console.error("Media Access Error:", err);
      if (err.name === "NotAllowedError") {
        setPermissionError("Camera/Microphone access denied. Please allow permissions in your browser settings.");
      } else if (err.name === "NotFoundError") {
        setPermissionError("No camera or microphone found. Please connect a device.");
      } else {
        setPermissionError("Unable to access media devices. Error: " + err.message);
      }
      setCallState("ended");
    }
  };

  // Simulate remote stream (In production, this would be the actual peer stream)
  const simulateRemoteStream = () => {
    // Clone local stream for demo purposes
    // In real implementation, this would be the remote peer's stream
    if (localStream.current && remoteVideoRef.current) {
      const clonedStream = localStream.current.clone();
      remoteVideoRef.current.srcObject = clonedStream;
    }
  };

  const cleanup = () => {
    // Stop all tracks
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
    }
    
    // Close peer connection
    if (peerConnection.current) {
      peerConnection.current.close();
    }

    // Clear intervals
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
    }
  };

  const toggleMic = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicOn(audioTrack.enabled);
      }
    }
  };

  const toggleCamera = () => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCameraOn(videoTrack.enabled);
      }
    }
  };

  const endCall = () => {
    setCallState("ended");
    cleanup();
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[200] bg-gradient-to-br from-stone-900 via-black to-stone-900 flex flex-col ${isFullscreen ? 'p-0' : 'p-4 md:p-8'}`}
    >
      
      {/* TOP BAR */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold border-2 border-white shadow-lg">
              {otherUserName?.[0] || "U"}
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{otherUserName || "User"}</h3>
              <div className="flex items-center gap-2">
                {callState === "connected" && (
                  <>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-400 text-sm font-medium">{formatDuration(callDuration)}</span>
                  </>
                )}
                {callState === "calling" && (
                  <>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-yellow-400 text-sm">Calling...</span>
                  </>
                )}
                {callState === "initializing" && (
                  <span className="text-gray-400 text-sm">Connecting...</span>
                )}
              </div>
            </div>
          </div>

          <button 
            onClick={toggleFullscreen}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>
      </div>

      {/* ERROR STATE */}
      {permissionError && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex-1 flex items-center justify-center"
        >
          <div className="bg-red-500/20 border border-red-500 rounded-2xl p-8 max-w-md text-center backdrop-blur-md">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <VideoOff size={32} className="text-white" />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">Access Denied</h3>
            <p className="text-red-200 text-sm mb-6">{permissionError}</p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white text-red-600 rounded-full font-bold hover:bg-red-50 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}

      {/* VIDEO GRID */}
      {!permissionError && (
        <div className="flex-1 flex items-center justify-center relative mt-20 mb-24">
          <div className={`grid ${callState === "connected" ? 'md:grid-cols-2' : 'grid-cols-1'} gap-4 w-full max-w-7xl`}>
            
            {/* REMOTE VIDEO (Main when connected) */}
            <AnimatePresence>
              {callState === "connected" && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative aspect-video bg-stone-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10"
                >
                  <video 
                    ref={remoteVideoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Remote User Overlay */}
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-2 rounded-full">
                    <span className="text-white text-sm font-medium">{otherUserName || "User"}</span>
                  </div>

                  {/* Connection Quality */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-2 rounded-full">
                    <div className={`w-2 h-2 rounded-full ${
                      connectionQuality === "good" ? "bg-emerald-400" :
                      connectionQuality === "medium" ? "bg-yellow-400" :
                      "bg-red-400"
                    }`}></div>
                    <span className="text-white text-xs font-medium capitalize">{connectionQuality}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* LOCAL VIDEO */}
            <div className={`relative aspect-video bg-stone-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-500/50 ${
              callState === "connected" ? '' : 'max-w-2xl mx-auto w-full'
            }`}>
              
              {cameraOn ? (
                <video 
                  ref={localVideoRef} 
                  autoPlay 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-stone-900">
                  <div className="w-24 h-24 rounded-full bg-stone-700 flex items-center justify-center text-white text-4xl border-4 border-stone-600">
                    <User size={48} />
                  </div>
                </div>
              )}

              {/* Local User Label */}
              <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-md px-3 py-2 rounded-full shadow-lg">
                <span className="text-white text-sm font-bold">You</span>
              </div>

              {/* Camera Off Indicator */}
              {!cameraOn && (
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3 py-2 rounded-full">
                  <span className="text-white text-xs font-medium">Camera Off</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONTROLS BAR */}
      {!permissionError && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 md:p-8"
        >
          <div className="max-w-2xl mx-auto flex justify-center items-center gap-4">
            
            {/* Microphone Toggle */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMic}
              disabled={callState === "ended"}
              className={`p-5 rounded-full shadow-2xl transition-all backdrop-blur-md border-2 ${
                micOn 
                ? 'bg-white/10 hover:bg-white/20 text-white border-white/20' 
                : 'bg-red-500 hover:bg-red-600 text-white border-red-400'
              }`}
            >
              {micOn ? <Mic size={24} /> : <MicOff size={24} />}
            </motion.button>

            {/* End Call Button */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={endCall}
              className="p-6 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-2xl transform transition-all border-2 border-red-500"
            >
              <PhoneOff size={32} />
            </motion.button>

            {/* Camera Toggle */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleCamera}
              disabled={callState === "ended"}
              className={`p-5 rounded-full shadow-2xl transition-all backdrop-blur-md border-2 ${
                cameraOn 
                ? 'bg-white/10 hover:bg-white/20 text-white border-white/20' 
                : 'bg-red-500 hover:bg-red-600 text-white border-red-400'
              }`}
            >
              {cameraOn ? <Video size={24} /> : <VideoOff size={24} />}
            </motion.button>
          </div>

          {/* Control Labels */}
          <div className="max-w-2xl mx-auto flex justify-center items-center gap-16 mt-4">
            <span className="text-white/60 text-xs font-medium">Microphone</span>
            <span className="text-white/60 text-xs font-medium">End Call</span>
            <span className="text-white/60 text-xs font-medium">Camera</span>
          </div>
        </motion.div>
      )}

      {/* CALL ENDED OVERLAY */}
      <AnimatePresence>
        {callState === "ended" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-20"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-500">
                <PhoneOff size={40} className="text-red-500" />
              </div>
              <h3 className="text-white text-2xl font-bold mb-2">Call Ended</h3>
              <p className="text-gray-400 mb-6">Duration: {formatDuration(callDuration)}</p>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-white text-stone-900 rounded-full font-bold hover:bg-stone-100 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VideoCall;