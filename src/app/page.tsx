'use client';

import { useEffect, useState, useRef } from 'react';
import Image from "next/image";

export default function Home() {
  useEffect(() => {
    // Initialize Voiceflow widget
    window.VG_CONFIG = {
      ID: "mIzv9f5OJuaOzxq",
      region: 'na',
      render: 'bottom-right',
      stylesheets: [
        "https://vg-bunny-cdn.b-cdn.net/vg_live_build/styles.css"
      ]
    };

    const VG_SCRIPT = document.createElement("script");
    VG_SCRIPT.src = "https://vg-bunny-cdn.b-cdn.net/vg_live_build/vg_bundle.js";
    document.body.appendChild(VG_SCRIPT);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-gray-50">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          AI Voice Chat
        </h1>
        <VoiceControls />
      </div>
      <div id="VG_OVERLAY_CONTAINER" style={{ width: 0, height: 0 }} />
    </main>
  );
}

function VoiceControls() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const recognitionRef = useRef<any | null>(null);

  const requestPermissionAndListen = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      toggleListening();
    } catch (err) {
      console.error('Microphone permission error:', err);
      setError('Microphone permission denied. Please allow microphone access.');
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Your browser does not support speech recognition. Please try using Chrome!');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setStatus('Listening...');
      setError('');
    };

    recognition.onend = () => {
      setIsListening(false);
      setStatus('');
    };

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      sendMessageToVoiceflow(text);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const sendMessageToVoiceflow = (userInput: string) => {
    if (window.VG && window.VG.sendMessage) {
      window.VG.sendMessage(userInput);
    } else {
      setError('Chat widget not ready');
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isListening) {
        stopListening();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isListening]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={requestPermissionAndListen}
        className={`px-6 py-3 text-lg font-medium rounded-full transition-colors
          ${isListening 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-blue-500 hover:bg-blue-600'} 
          text-white focus:outline-none focus:ring-2 focus:ring-offset-2 
          ${isListening ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
      >
        {isListening ? 'Stop Listening' : 'Start Talking'}
      </button>
      
      {status && (
        <p className="text-sm text-gray-600">{status}</p>
      )}
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      
      {transcript && (
        <div className="w-full p-4 bg-white rounded-lg shadow-sm">
          <p className="font-semibold text-gray-700">You said:</p>
          <p className="text-gray-600">{transcript}</p>
        </div>
      )}
    </div>
  );
}

// Add TypeScript declarations for the Voiceflow widget
declare global {
  interface Window {
    VG_CONFIG?: {
      ID: string;
      region: string;
      render: string;
      stylesheets: string[];
    };
    VG?: {
      sendMessage: (message: string) => void;
    };
  }
}
