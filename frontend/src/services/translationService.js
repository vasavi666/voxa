// Translation service — connects to the Spring Boot backend API
// React → Spring Boot → Translation Provider

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Translate text from one language to another using the Spring Boot backend.
 *
 * @param {string} text - The text to translate
 * @param {string} sourceLang - Source language code (e.g., 'en')
 * @param {string} targetLang - Target language code (e.g., 'te')
 * @returns {Promise<object>} Translation result
 */
export const translateText = async (text, sourceLang, targetLang) => {
  // Don't translate empty text
  if (!text || !text.trim()) {
    throw new Error('Please enter some text to translate.');
  }

  // Don't translate if source and target are the same
  if (sourceLang === targetLang) {
    return {
      originalText: text,
      translatedText: text,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
    };
  }

  try {
    const response = await fetch(`${API_URL}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text.trim(),
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to translate. Please try again.');
    }

    return data;
  } catch (error) {
    // If the backend is down, fetch throws a TypeError: Failed to fetch
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Could not connect to translation server. Please ensure backend is running.');
    }
    throw error;
  }
};

/**
 * Get translation history from the backend
 */
export const getHistory = async () => {
  try {
    const response = await fetch(`${API_URL}/history`);
    if (!response.ok) throw new Error('Failed to fetch history');
    return await response.json();
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
};

/**
 * Delete a single translation from history
 */
export const deleteFromHistory = async (id) => {
  try {
    const response = await fetch(`${API_URL}/history/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete history');
    // Return updated history
    return await getHistory();
  } catch (error) {
    console.error('Error deleting history:', error);
    throw error;
  }
};

/**
 * Clear all translation history
 */
export const clearHistory = async () => {
  try {
    const response = await fetch(`${API_URL}/history`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to clear history');
    return [];
  } catch (error) {
    console.error('Error clearing history:', error);
    throw error;
  }
};
