package com.harsha.loanassistant.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class LlmService {

    @Value("${OPENROUTER_API_KEY:}")
    private String openRouterApiKey;

    @Value("${OPENROUTER_MODEL:poolside/laguna-s-2.1:free}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

    public String generateResponse(String systemPrompt, List<Map<String, String>> conversationHistory) {
        if (openRouterApiKey == null || openRouterApiKey.trim().isEmpty()) {
            return "Error: OPENROUTER_API_KEY is not set.";
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + openRouterApiKey.trim());
        headers.set("HTTP-Referer", "http://localhost:8080"); // Required by OpenRouter
        headers.set("X-Title", "LoanAssistantBot");

        List<Map<String, String>> messages = new ArrayList<>();
        
        // Add System Prompt
        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", systemPrompt);
        messages.add(systemMessage);
        
        // Add Conversation History
        messages.addAll(conversationHistory);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", messages);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(OPENROUTER_URL, entity, Map.class);
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    return (String) message.get("content");
                }
            }
        } catch (org.springframework.web.client.HttpClientErrorException | org.springframework.web.client.HttpServerErrorException httpEx) {
            System.err.println("OpenRouter API HTTP Error: " + httpEx.getStatusCode() + " - " + httpEx.getResponseBodyAsString());
            httpEx.printStackTrace();
            return "Sorry, I am facing some technical difficulties reaching the AI service. (HTTP " + httpEx.getStatusCode().value() + ")";
        } catch (Exception e) {
            System.err.println("OpenRouter API Error: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            e.printStackTrace();
            return "Sorry, I am facing some technical difficulties reaching the AI service.";
        }
        return "Sorry, I couldn't process that request.";
    }
}
