package com.voxa.provider;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * Translation provider using the free Google Translate web endpoint.
 * Uses raw HttpURLConnection (not RestTemplate) to have full control over
 * headers and avoid 429 rate-limiting.
 * Falls back to MyMemory API if Google blocks the request.
 */
@Component
@Primary
public class GoogleTranslationProvider implements TranslationProvider {

    private static final String GOOGLE_URL = "https://translate.googleapis.com/translate_a/single";
    private static final String MYMEMORY_URL = "https://api.mymemory.translated.net/get";
    private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

    private final ObjectMapper objectMapper;

    public GoogleTranslationProvider() {
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public String translate(String text, String sourceLanguage, String targetLanguage) {
        if (text == null || text.trim().isEmpty()) {
            return "";
        }
        if (sourceLanguage.equals(targetLanguage)) {
            return text;
        }

        // Try Google Translate first
        String result = translateWithGoogle(text, sourceLanguage, targetLanguage);
        if (result != null && !result.isEmpty()) {
            return result;
        }

        // Fallback to MyMemory
        result = translateWithMyMemory(text, sourceLanguage, targetLanguage);
        if (result != null && !result.isEmpty()) {
            return result;
        }

        return "[Translation unavailable]";
    }

    private String translateWithGoogle(String text, String sourceLang, String targetLang) {
        try {
            String encodedText = URLEncoder.encode(text, StandardCharsets.UTF_8);
            String urlStr = GOOGLE_URL
                    + "?client=gtx"
                    + "&sl=" + sourceLang
                    + "&tl=" + targetLang
                    + "&dt=t"
                    + "&q=" + encodedText;

            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("User-Agent", USER_AGENT);
            conn.setRequestProperty("Accept", "application/json");
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);

            int responseCode = conn.getResponseCode();
            if (responseCode != 200) {
                System.err.println("Google Translate returned HTTP " + responseCode);
                return null;
            }

            StringBuilder response = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
            }

            // Parse the nested JSON array response
            // Format: [[["translated text","source text",null,null,3]],null,"en"]
            JsonNode root = objectMapper.readTree(response.toString());
            if (root.isArray() && root.size() > 0) {
                JsonNode sentences = root.get(0);
                if (sentences != null && sentences.isArray()) {
                    StringBuilder translated = new StringBuilder();
                    for (JsonNode sentence : sentences) {
                        if (sentence.isArray() && sentence.size() > 0) {
                            translated.append(sentence.get(0).asText());
                        }
                    }
                    String result = translated.toString().trim();
                    if (!result.isEmpty()) {
                        return result;
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Google Translate failed: " + e.getMessage());
        }
        return null;
    }

    private String translateWithMyMemory(String text, String sourceLang, String targetLang) {
        try {
            String encodedText = URLEncoder.encode(text, StandardCharsets.UTF_8);
            String urlStr = MYMEMORY_URL
                    + "?q=" + encodedText
                    + "&langpair=" + sourceLang + "|" + targetLang;

            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("User-Agent", USER_AGENT);
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);

            int responseCode = conn.getResponseCode();
            if (responseCode != 200) {
                return null;
            }

            StringBuilder response = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
            }

            JsonNode root = objectMapper.readTree(response.toString());
            if (root.has("responseData")) {
                JsonNode data = root.get("responseData");
                if (data.has("translatedText")) {
                    String translated = data.get("translatedText").asText();
                    if (translated != null && !translated.trim().isEmpty()) {
                        return translated;
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("MyMemory fallback failed: " + e.getMessage());
        }
        return null;
    }
}
