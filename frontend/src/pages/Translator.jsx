import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ArrowLeftRight,
  Copy,
  Volume2,
  Mic,
  MicOff,
  Trash2,
  Loader2,
  Check,
  AlertCircle,
} from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';
import { translateText } from '../services/translationService';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';
import { getLanguageByCode } from '../config/languages';
import './Translator.css';

const MAX_CHARS = 5000;

const Translator = () => {
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('te');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Track whether we received voice input (to auto-translate only after voice)
  const hadVoiceInputRef = useRef(false);

  // Voice hooks
  const sourceLang = getLanguageByCode(sourceLanguage);
  const targetLang = getLanguageByCode(targetLanguage);
  const speechRecognition = useSpeechRecognition(sourceLang.speechCode);
  const speechSynthesis = useSpeechSynthesis();

  // When speech recognition gets a transcript, put it in the input
  useEffect(() => {
    if (speechRecognition.transcript?.text) {
      hadVoiceInputRef.current = true;
      setSourceText((prev) => {
        const newText = prev ? prev + ' ' + speechRecognition.transcript.text : speechRecognition.transcript.text;
        return newText.slice(0, MAX_CHARS);
      });
    }
  }, [speechRecognition.transcript]);

  // Show speech recognition errors
  useEffect(() => {
    if (speechRecognition.error) {
      setError(speechRecognition.error);
    }
  }, [speechRecognition.error]);

  const handleTranslate = useCallback(async (text, srcLang, tgtLang) => {
    if (!text || !text.trim()) return;
    setError(null);
    setIsTranslating(true);
    setTranslatedText('');

    try {
      const result = await translateText(text, srcLang, tgtLang);
      setTranslatedText(result.translatedText);
    } catch (err) {
      setError(err.message || 'Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  }, []);

  // Auto-translate when speech recognition STOPS and we had voice input
  useEffect(() => {
    if (!speechRecognition.isListening && hadVoiceInputRef.current) {
      hadVoiceInputRef.current = false;
      // Use a small delay to let the last transcript arrive
      const timer = setTimeout(() => {
        // Read current values directly
        if (sourceText.trim()) {
          handleTranslate(sourceText, sourceLanguage, targetLanguage);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [speechRecognition.isListening]); // Only depend on isListening

  const handleTranslateClick = () => {
    handleTranslate(sourceText, sourceLanguage, targetLanguage);
  };

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleClear = () => {
    setSourceText('');
    setTranslatedText('');
    setError(null);
  };

  const handleCopy = async () => {
    if (!translatedText) return;
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = translatedText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSpeak = () => {
    if (translatedText) {
      speechSynthesis.speak(translatedText, targetLang.speechCode);
    }
  };

  const handleMicToggle = () => {
    if (speechRecognition.isListening) {
      speechRecognition.stopListening();
    } else {
      speechRecognition.startListening();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleTranslateClick();
    }
  };

  return (
    <div className="translator">
      <div className="translator-container">
        <div className="translator-header">
          <h1 className="translator-title">Translator</h1>
          <p className="translator-subtitle">Translate text between languages instantly.</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="translator-error" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
            <button
              className="translator-error-close"
              onClick={() => setError(null)}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {/* Language Bar */}
        <div className="translator-language-bar">
          <LanguageSelector
            value={sourceLanguage}
            onChange={setSourceLanguage}
            label="From"
          />

          <button
            className="translator-swap-btn"
            onClick={handleSwapLanguages}
            aria-label="Swap languages"
            title="Swap languages"
          >
            <ArrowLeftRight size={20} />
          </button>

          <LanguageSelector
            value={targetLanguage}
            onChange={setTargetLanguage}
            label="To"
          />
        </div>

        {/* Translation Panels */}
        <div className="translator-panels">
          {/* Source Panel */}
          <div className="translator-panel translator-panel-source">
            <textarea
              className="translator-textarea"
              placeholder="Enter text or click 🎤 to speak..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value.slice(0, MAX_CHARS))}
              onKeyDown={handleKeyDown}
              aria-label="Source text input"
              rows={6}
            />
            <div className="translator-panel-footer">
              <div className="translator-panel-actions">
                {speechRecognition.isSupported && (
                  <button
                    className={`translator-icon-btn ${speechRecognition.isListening ? 'translator-icon-btn-recording' : ''}`}
                    onClick={handleMicToggle}
                    aria-label={speechRecognition.isListening ? 'Stop recording' : 'Start voice input'}
                    title={speechRecognition.isListening ? 'Stop recording' : 'Voice input'}
                  >
                    {speechRecognition.isListening ? (
                      <>
                        <MicOff size={18} />
                        <span className="translator-recording-indicator">Listening...</span>
                      </>
                    ) : (
                      <Mic size={18} />
                    )}
                  </button>
                )}
                {sourceText && (
                  <button
                    className="translator-icon-btn"
                    onClick={handleClear}
                    aria-label="Clear text"
                    title="Clear"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <span className="translator-char-count">
                {sourceText.length} / {MAX_CHARS}
              </span>
            </div>
          </div>

          {/* Target Panel */}
          <div className="translator-panel translator-panel-target">
            <div className="translator-output">
              {isTranslating ? (
                <div className="translator-loading">
                  <Loader2 size={24} className="translator-spinner" />
                  <span>Translating...</span>
                </div>
              ) : translatedText ? (
                <p className="translator-translated-text">{translatedText}</p>
              ) : (
                <p className="translator-placeholder">Translation will appear here...</p>
              )}
            </div>
            <div className="translator-panel-footer">
              <div className="translator-panel-actions">
                {translatedText && (
                  <>
                    {speechSynthesis.isSupported && (
                      <button
                        className={`translator-icon-btn ${speechSynthesis.isSpeaking ? 'translator-icon-btn-active' : ''}`}
                        onClick={handleSpeak}
                        aria-label="Listen to translation"
                        title="Listen"
                      >
                        <Volume2 size={18} />
                      </button>
                    )}
                    <button
                      className="translator-icon-btn"
                      onClick={handleCopy}
                      aria-label="Copy translation"
                      title="Copy"
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Translate Button */}
        <button
          className="btn btn-primary btn-lg translator-translate-btn"
          onClick={handleTranslateClick}
          disabled={!sourceText.trim() || isTranslating}
        >
          {isTranslating ? (
            <>
              <Loader2 size={18} className="translator-spinner" />
              Translating...
            </>
          ) : (
            'Translate'
          )}
        </button>
      </div>
    </div>
  );
};

export default Translator;
