package com.voxa.service;

import com.voxa.entity.TranslationHistory;
import com.voxa.repository.TranslationHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HistoryService {

    private final TranslationHistoryRepository repository;

    @Autowired
    public HistoryService(TranslationHistoryRepository repository) {
        this.repository = repository;
    }

    public TranslationHistory saveHistory(String sourceLanguage, String targetLanguage, String originalText, String translatedText) {
        TranslationHistory history = new TranslationHistory(sourceLanguage, targetLanguage, originalText, translatedText);
        return repository.save(history);
    }

    public List<TranslationHistory> getAllHistory() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public void deleteHistory(Long id) {
        repository.deleteById(id);
    }

    public void clearAllHistory() {
        repository.deleteAll();
    }
}
