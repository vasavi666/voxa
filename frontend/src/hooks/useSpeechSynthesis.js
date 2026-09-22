import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Custom hook for browser text-to-speech (SpeechSynthesis)
 *
 * @returns {object} { speak, stop, isSpeaking, isSupported }
 */
const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  // Check browser support
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  /**
   * Find the best matching voice for a given language code
   * @param {string} langCode - Language code like 'te-IN', 'en-US'
   * @returns {SpeechSynthesisVoice|null}
   */
  const findVoice = useCallback((langCode) => {
    if (!isSupported) return null;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;

    // Try exact match first (e.g., 'te-IN')
    let voice = voices.find((v) => v.lang === langCode);
    if (voice) return voice;

    // Try matching just the language part (e.g., 'te')
    const langPrefix = langCode.split('-')[0];
    voice = voices.find((v) => v.lang.startsWith(langPrefix));
    if (voice) return voice;

    // Fallback to default
    return null;
  }, [isSupported]);

  /**
   * Speak the given text in the specified language
   * @param {string} text - Text to speak
   * @param {string} langCode - Language code (e.g., 'te-IN', 'en-US')
   */
  const speak = useCallback((text, langCode = 'en-US') => {
    if (!isSupported || !text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;

    const voice = findVoice(langCode);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported, findVoice]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
  };
};

export default useSpeechSynthesis;
