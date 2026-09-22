import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  Loader2,
  Users,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';
import { translateText } from '../services/translationService';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';
import { getLanguageByCode } from '../config/languages';
import './Conversation.css';

const Conversation = () => {
  const [personALang, setPersonALang] = useState('en');
  const [personBLang, setPersonBLang] = useState('te');
  const [activeSpeaker, setActiveSpeaker] = useState('A');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const hadVoiceInputRef = useRef(false);

  // Get speech codes for active speaker
  const activeLangCode = activeSpeaker === 'A' ? personALang : personBLang;
  const activeLang = getLanguageByCode(activeLangCode);

  const speechRecognition = useSpeechRecognition(activeLang.speechCode);
  const speechSynthesis = useSpeechSynthesis();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // When speech recognition gets a transcript, put it in input
  useEffect(() => {
    if (speechRecognition.transcript?.text) {
      hadVoiceInputRef.current = true;
      setInputText((prev) => {
        const newText = prev
          ? prev + ' ' + speechRecognition.transcript.text
          : speechRecognition.transcript.text;
        return newText;
      });
    }
  }, [speechRecognition.transcript]);

  // Show speech recognition errors
  useEffect(() => {
    if (speechRecognition.error) {
      setError(speechRecognition.error);
    }
  }, [speechRecognition.error]);

  const handleSend = useCallback(async (textToSend) => {
    const text = (textToSend || '').trim();
    if (!text) return;

    const sourceLang = activeSpeaker === 'A' ? personALang : personBLang;
    const destLang = activeSpeaker === 'A' ? personBLang : personALang;

    setInputText('');
    setError(null);
    setIsTranslating(true);

    const messageId = Date.now().toString();
    const newMessage = {
      id: messageId,
      speaker: activeSpeaker,
      speakerLabel: activeSpeaker === 'A' ? 'Person A' : 'Person B',
      sourceLang,
      targetLang: destLang,
      originalText: text,
      translatedText: null,
      isTranslating: true,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    try {
      const result = await translateText(text, sourceLang, destLang);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, translatedText: result.translatedText, isTranslating: false }
            : msg
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, translatedText: 'Translation failed.', isTranslating: false }
            : msg
        )
      );
      setError(err.message || 'Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
      inputRef.current?.focus();
    }
  }, [activeSpeaker, personALang, personBLang]);

  // Auto-send when speech recognition STOPS and we had voice input
  useEffect(() => {
    if (!speechRecognition.isListening && hadVoiceInputRef.current) {
      hadVoiceInputRef.current = false;
      const timer = setTimeout(() => {
        // Read inputText at this point
        setInputText((currentText) => {
          if (currentText.trim()) {
            handleSend(currentText);
          }
          return currentText;
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [speechRecognition.isListening]); // Only depend on isListening

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputText);
    }
  };

  const handleMicToggle = () => {
    if (speechRecognition.isListening) {
      speechRecognition.stopListening();
    } else {
      setError(null);
      speechRecognition.startListening();
    }
  };

  const handleSpeak = (text, langCode) => {
    const lang = getLanguageByCode(langCode);
    speechSynthesis.speak(text, lang.speechCode);
  };

  const handleClearConversation = () => {
    setMessages([]);
    setInputText('');
    setError(null);
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="conversation">
      <div className="conversation-container">
        {/* Header */}
        <div className="conversation-header">
          <div className="conversation-header-text">
            <h1 className="conversation-title">
              <Users size={28} />
              VOXA Conversation
            </h1>
            <p className="conversation-subtitle">
              Communicate naturally across languages.
            </p>
          </div>
        </div>

        {/* Language Setup */}
        <div className="conversation-setup">
          <div className="conversation-person">
            <span className="conversation-person-label">Person A</span>
            <LanguageSelector
              value={personALang}
              onChange={setPersonALang}
            />
          </div>
          <div className="conversation-person-divider">
            <span>⇄</span>
          </div>
          <div className="conversation-person">
            <span className="conversation-person-label">Person B</span>
            <LanguageSelector
              value={personBLang}
              onChange={setPersonBLang}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="conversation-error" role="alert">
            <AlertCircle size={16} />
            <span>{error}</span>
            <button onClick={() => setError(null)} aria-label="Dismiss error">×</button>
          </div>
        )}

        {/* Messages Area */}
        <div className="conversation-messages">
          {messages.length === 0 ? (
            <div className="conversation-empty">
              <Users size={48} className="conversation-empty-icon" />
              <h3>Start a conversation</h3>
              <p>Select languages for each person and start communicating across languages.</p>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`conversation-message conversation-message-${msg.speaker.toLowerCase()}`}
                >
                  <div className="conversation-message-header">
                    <span className="conversation-message-speaker">{msg.speakerLabel}</span>
                    <span className="conversation-message-lang">
                      {getLanguageByCode(msg.sourceLang).flag} {getLanguageByCode(msg.sourceLang).name}
                    </span>
                    <span className="conversation-message-time">{formatTime(msg.timestamp)}</span>
                  </div>

                  {/* Original text */}
                  <div className="conversation-message-bubble">
                    <p>{msg.originalText}</p>
                    {speechSynthesis.isSupported && (
                      <button
                        className="conversation-speak-btn"
                        onClick={() => handleSpeak(msg.originalText, msg.sourceLang)}
                        aria-label={`Listen to original`}
                      >
                        <Volume2 size={14} />
                      </button>
                    )}
                  </div>

                  {/* Translated text */}
                  <div className="conversation-message-translation">
                    <span className="conversation-message-translation-label">
                      Translated to {getLanguageByCode(msg.targetLang).flag} {getLanguageByCode(msg.targetLang).name}
                    </span>
                    <div className="conversation-message-bubble conversation-message-bubble-translated">
                      {msg.isTranslating ? (
                        <span className="conversation-translating">
                          <Loader2 size={14} className="translator-spinner" />
                          Translating...
                        </span>
                      ) : (
                        <>
                          <p>{msg.translatedText}</p>
                          {speechSynthesis.isSupported && (
                            <button
                              className="conversation-speak-btn"
                              onClick={() => handleSpeak(msg.translatedText, msg.targetLang)}
                              aria-label={`Listen to translation`}
                            >
                              <Volume2 size={14} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="conversation-input-area">
          {/* Speaker Toggle */}
          <div className="conversation-speaker-toggle">
            <button
              className={`conversation-speaker-btn ${activeSpeaker === 'A' ? 'conversation-speaker-btn-active' : ''}`}
              onClick={() => setActiveSpeaker('A')}
            >
              Person A
              <span className="conversation-speaker-lang">
                {getLanguageByCode(personALang).flag}
              </span>
            </button>
            <button
              className={`conversation-speaker-btn ${activeSpeaker === 'B' ? 'conversation-speaker-btn-active' : ''}`}
              onClick={() => setActiveSpeaker('B')}
            >
              Person B
              <span className="conversation-speaker-lang">
                {getLanguageByCode(personBLang).flag}
              </span>
            </button>

            {messages.length > 0 && (
              <button
                className="conversation-clear-btn"
                onClick={handleClearConversation}
                aria-label="Clear conversation"
                title="Clear conversation"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          {/* Input */}
          <div className="conversation-input-wrapper">
            <textarea
              ref={inputRef}
              className="conversation-input"
              placeholder={`Type a message as ${activeSpeaker === 'A' ? 'Person A' : 'Person B'} in ${activeLang.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              aria-label="Message input"
            />
            <div className="conversation-input-actions">
              {speechRecognition.isSupported && (
                <button
                  className={`conversation-input-btn ${speechRecognition.isListening ? 'conversation-input-btn-recording' : ''}`}
                  onClick={handleMicToggle}
                  aria-label={speechRecognition.isListening ? 'Stop recording' : 'Start voice input'}
                  title={speechRecognition.isListening ? 'Stop recording' : 'Voice input'}
                >
                  {speechRecognition.isListening ? (
                    <MicOff size={18} />
                  ) : (
                    <Mic size={18} />
                  )}
                </button>
              )}
              <button
                className="conversation-send-btn"
                onClick={() => handleSend(inputText)}
                disabled={!inputText.trim() || isTranslating}
                aria-label="Send message"
              >
                {isTranslating ? (
                  <Loader2 size={18} className="translator-spinner" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </div>

          {speechRecognition.isListening && (
            <div className="conversation-listening-indicator">
              <span className="conversation-listening-dot" />
              Listening...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Conversation;
