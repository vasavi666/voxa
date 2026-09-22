import { useState, useEffect } from 'react';
import {
  Search,
  Trash2,
  Clock,
  Filter,
  XCircle,
  Volume2,
  Loader2,
} from 'lucide-react';
import { getHistory, deleteFromHistory, clearHistory } from '../services/translationService';
import { getLanguageByCode } from '../config/languages';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';
import languages from '../config/languages';
import './History.css';

const History = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLang, setFilterLang] = useState('all');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const speechSynthesis = useSpeechSynthesis();

  // Load history on mount
  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      try {
        const data = await getHistory();
        setHistory(data || []);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadHistory();
  }, []);

  const handleDelete = async (id) => {
    try {
      const updated = await deleteFromHistory(id);
      setHistory(updated);
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearHistory();
      setHistory([]);
      setShowConfirmClear(false);
    } catch (error) {
      console.error("Failed to clear:", error);
    }
  };

  const handleSpeak = (text, langCode) => {
    const lang = getLanguageByCode(langCode);
    speechSynthesis.speak(text, lang.speechCode);
  };

  // Filter and search
  const filteredHistory = history.filter((item) => {
    const matchesSearch = !searchQuery ||
      item.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translatedText.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLang = filterLang === 'all' ||
      item.sourceLanguage === filterLang ||
      item.targetLanguage === filterLang;

    return matchesSearch && matchesLang;
  });

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }) + ', ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="history">
        <div className="history-container">
          <div className="history-empty">
            <Loader2 size={48} className="translator-spinner" />
            <h3>Loading history...</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="history">
      <div className="history-container">
        {/* Header */}
        <div className="history-header">
          <div>
            <h1 className="history-title">
              <Clock size={28} />
              Translation History
            </h1>
            <p className="history-subtitle">
              Review your previous translations.
            </p>
          </div>
          {history.length > 0 && (
            <div className="history-header-actions">
              {showConfirmClear ? (
                <div className="history-confirm-clear">
                  <span>Clear all translations?</span>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={handleClearAll}
                  >
                    Yes, clear all
                  </button>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => setShowConfirmClear(false)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-sm btn-outline btn-danger-outline"
                  onClick={() => setShowConfirmClear(true)}
                >
                  <Trash2 size={14} />
                  Clear All
                </button>
              )}
            </div>
          )}
        </div>

        {/* Filters */}
        {history.length > 0 && (
          <div className="history-filters">
            <div className="history-search">
              <Search size={18} className="history-search-icon" />
              <input
                type="text"
                className="history-search-input"
                placeholder="Search translations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search translations"
              />
              {searchQuery && (
                <button
                  className="history-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <XCircle size={16} />
                </button>
              )}
            </div>

            <div className="history-filter-lang">
              <Filter size={16} />
              <select
                className="history-filter-select"
                value={filterLang}
                onChange={(e) => setFilterLang(e.target.value)}
                aria-label="Filter by language"
              >
                <option value="all">All Languages</option>
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* History List */}
        {history.length === 0 ? (
          <div className="history-empty">
            <Clock size={56} className="history-empty-icon" />
            <h3>No translation history yet</h3>
            <p>Start your first conversation or translation to see your history here.</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="history-empty">
            <Search size={48} className="history-empty-icon" />
            <h3>No results found</h3>
            <p>Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="history-list">
            {filteredHistory.map((item) => {
              const sourceLang = getLanguageByCode(item.sourceLanguage);
              const targetLang = getLanguageByCode(item.targetLanguage);

              return (
                <div className="history-card" key={item.id}>
                  <div className="history-card-header">
                    <span className="history-card-langs">
                      {sourceLang.flag} {sourceLang.name}
                      <span className="history-card-arrow">→</span>
                      {targetLang.flag} {targetLang.name}
                    </span>
                    <span className="history-card-date">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <div className="history-card-body">
                    <div className="history-card-text">
                      <p className="history-card-original">{item.originalText}</p>
                      <p className="history-card-translated">{item.translatedText}</p>
                    </div>
                  </div>

                  <div className="history-card-actions">
                    {speechSynthesis.isSupported && (
                      <>
                        <button
                          className="history-action-btn"
                          onClick={() => handleSpeak(item.originalText, item.sourceLanguage)}
                          aria-label="Listen to original text"
                          title={`Listen in ${sourceLang.name}`}
                        >
                          <Volume2 size={14} />
                          Original
                        </button>
                        <button
                          className="history-action-btn"
                          onClick={() => handleSpeak(item.translatedText, item.targetLanguage)}
                          aria-label="Listen to translated text"
                          title={`Listen in ${targetLang.name}`}
                        >
                          <Volume2 size={14} />
                          Translation
                        </button>
                      </>
                    )}
                    <button
                      className="history-action-btn history-action-btn-delete"
                      onClick={() => handleDelete(item.id)}
                      aria-label="Delete translation"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Results count */}
        {filteredHistory.length > 0 && (
          <p className="history-count">
            Showing {filteredHistory.length} of {history.length} translations
          </p>
        )}
      </div>
    </div>
  );
};

export default History;
