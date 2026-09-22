package com.voxa.provider;

/**
 * Strategy interface for translation services.
 *
 * WHY THIS EXISTS:
 * This uses the Strategy Pattern so we can swap between different translation
 * engines (Mock, Google, AWS Translate, etc.) without changing any other code.
 * Spring will automatically inject whichever @Component implements this interface.
 */
public interface TranslationProvider {

    /**
     * Translates text from a source language to a target language.
     *
     * @param text           The text to translate
     * @param sourceLanguage The source language code (e.g., "en")
     * @param targetLanguage The target language code (e.g., "te")
     * @return The translated string
     */
    String translate(String text, String sourceLanguage, String targetLanguage);
}
