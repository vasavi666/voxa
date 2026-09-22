package com.voxa.controller;

import com.voxa.dto.TranslateRequest;
import com.voxa.dto.TranslateResponse;
import com.voxa.service.TranslateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * REST controller for translation endpoints.
 *
 * Flow:
 *   POST /api/translate  →  TranslateController  →  TranslateService  →  TranslationProvider
 *
 * The controller's only job is to:
 * 1. Accept the HTTP request
 * 2. Call the service
 * 3. Return the HTTP response
 *
 * It does NOT contain business logic — that belongs in the service layer.
 */
@RestController
@RequestMapping("/api")
public class TranslateController {

    private final TranslateService translateService;

    @Autowired
    public TranslateController(TranslateService translateService) {
        this.translateService = translateService;
    }

    @PostMapping("/translate")
    public ResponseEntity<?> translate(@RequestBody TranslateRequest request) {
        try {
            TranslateResponse response = translateService.translate(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            // 400 Bad Request for validation errors (empty text, missing language, etc.)
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            // 500 Internal Server Error — never expose stack traces to the client
            return ResponseEntity.internalServerError().body(
                    Map.of("error", "An error occurred during translation. Please try again.")
            );
        }
    }
}
