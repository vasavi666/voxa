package com.voxa.service;

import com.voxa.dto.TranslateRequest;
import com.voxa.dto.TranslateResponse;
import com.voxa.provider.TranslationProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service layer for translation logic.
 */
@Service
public class TranslateService {

    private final TranslationProvider translationProvider;
    private final HistoryService historyService;

    @Autowired
    public TranslateService(TranslationProvider translationProvider, HistoryService historyService) {
        this.translationProvider = translationProvider;
        this.historyService = historyService;
    }

    public TranslateResponse translate(TranslateRequest request) {
        // 1. Validate
        if (request.getText() == null || request.getText().trim().isEmpty()) {
            throw new IllegalArgumentException("Text to translate cannot be empty.");
        }

        if (request.getSourceLanguage() == null || request.getSourceLanguage().trim().isEmpty()) {
            throw new IllegalArgumentException("Source language must be provided.");
        }

        if (request.getTargetLanguage() == null || request.getTargetLanguage().trim().isEmpty()) {
            throw new IllegalArgumentException("Target language must be provided.");
        }

        // 2. Translate via the injected provider
        String translatedText = translationProvider.translate(
                request.getText(),
                request.getSourceLanguage(),
                request.getTargetLanguage()
        );

        // 3. Save to History automatically
        historyService.saveHistory(
                request.getSourceLanguage(),
                request.getTargetLanguage(),
                request.getText(),
                translatedText
        );

        // 4. Build response
        return new TranslateResponse(
                request.getText(),
                translatedText,
                request.getSourceLanguage(),
                request.getTargetLanguage()
        );
    }
}
