import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for browser speech recognition (Speech-to-Text)
 * Uses the Web Speech API (webkitSpeechRecognition / SpeechRecognition)
 *
 * @param {string} language - BCP 47 language code (e.g., 'en-US', 'te-IN')
 * @returns {object} { isListening, transcript, error, isSupported, startListening, stopListening }
 */
const useSpeechRecognition = (language = 'en-US') => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  // Check browser support
  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Initialize recognition instance
  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          currentTranscript += event.results[i][0].transcript;
        }
      }
      
      if (currentTranscript.trim()) {
         // Pass an object so the reference always changes and triggers useEffect in components
         setTranscript({ text: currentTranscript.trim(), id: Date.now() });
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      let errorMessage = 'Speech recognition error.';
      if (event.error === 'not-allowed') {
        errorMessage = 'Microphone permission is required for voice input.';
      } else if (event.error === 'no-speech') {
        // no-speech is common if it's quiet, don't show a hard error, just stop
        setIsListening(false);
        return;
      }
      setError(errorMessage);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [language, isSupported]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Voice input is not supported in this browser. Please type your message.');
      return;
    }

    setError(null);
    setTranscript(null);

    try {
      recognitionRef.current?.start();
    } catch (err) {
      // Handle case where recognition is already started
      setError('Could not start voice recognition. Please try again.');
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
  };
};

export default useSpeechRecognition;
