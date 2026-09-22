package com.voxa.dto;

/**
 * DTO for translation requests from the frontend.
 *
 * Example JSON:
 * {
 *   "text": "Where are you going?",
 *   "sourceLanguage": "en",
 *   "targetLanguage": "te"
 * }
 */
public class TranslateRequest {
    private String text;
    private String sourceLanguage;
    private String targetLanguage;

    public TranslateRequest() {
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
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
