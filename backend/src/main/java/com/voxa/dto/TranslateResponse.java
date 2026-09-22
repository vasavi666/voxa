package com.voxa.dto;

/**
 * DTO for translation responses sent back to the frontend.
 *
 * Example JSON:
 * {
 *   "originalText": "Where are you going?",
 *   "translatedText": "మీరు ఎక్కడికి వెళ్తున్నారు?",
 *   "sourceLanguage": "en",
 *   "targetLanguage": "te"
 * }
 */
public class TranslateResponse {
    private String originalText;
    private String translatedText;
    private String sourceLanguage;
    private String targetLanguage;

    public TranslateResponse() {
    }

    public TranslateResponse(String originalText, String translatedText, String sourceLanguage, String targetLanguage) {
        this.originalText = originalText;
        this.translatedText = translatedText;
        this.sourceLanguage = sourceLanguage;
        this.targetLanguage = targetLanguage;
    }

    public String getOriginalText() {
        return originalText;
    }

    public void setOriginalText(String originalText) {
        this.originalText = originalText;
    }

    public String getTranslatedText() {
        return translatedText;
    }

    public void setTranslatedText(String translatedText) {
        this.translatedText = translatedText;
    }

    public String getSourceLanguage() {
        return sourceLanguage;
    }

    public void setSourceLanguage(String sourceLanguage) {
        this.sourceLanguage = sourceLanguage;
    }

    public String getTargetLanguage() {
        return targetLanguage;
    }

    public void setTargetLanguage(String targetLanguage) {
        this.targetLanguage = targetLanguage;
    }
}
