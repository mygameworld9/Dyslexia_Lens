import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeech = () => {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const synth = window.speechSynthesis;
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  const cancel = useCallback(() => {
    if (synth.speaking || synth.pending) {
      synth.cancel();
    }
    setSpeakingId(null);
    currentUtterance.current = null;
  }, [synth]);

  const speak = useCallback((text: string, id: string) => {
    // If clicking the same item, toggle off (stop speaking)
    if (speakingId === id) {
      cancel();
      return;
    }

    // Cancel any existing speech
    cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Dyslexia-friendly settings: slightly slower rate, clear pitch
    utterance.rate = 0.9; 
    utterance.pitch = 1;

    utterance.onend = () => {
      setSpeakingId(null);
      currentUtterance.current = null;
    };

    utterance.onerror = (e) => {
      console.error("Speech synthesis error:", e);
      setSpeakingId(null);
      currentUtterance.current = null;
    };

    currentUtterance.current = utterance;
    setSpeakingId(id);
    synth.speak(utterance);
  }, [speakingId, synth, cancel]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return { speak, cancel, speakingId };
};