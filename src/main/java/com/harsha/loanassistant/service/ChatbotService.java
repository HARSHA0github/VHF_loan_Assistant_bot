package com.harsha.loanassistant.service;

import com.harsha.loanassistant.entity.LoanQA;
import com.harsha.loanassistant.repository.LoanQARepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
public class ChatbotService {

    @Autowired
    private LlmService llmService;

    @Autowired
    private LoanQARepository repository;

    // Size-limited LRU Cache to handle multiple concurrent users and prevent OOM
    private final Map<String, List<Map<String, String>>> sessionHistories = Collections.synchronizedMap(
        new LinkedHashMap<String, List<Map<String, String>>>(100, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<String, List<Map<String, String>>> eldest) {
                return size() > 1000; // Evict oldest sessions when capacity exceeds 1000
            }
        }
    );

    private String cachedSystemPrompt = null;

    private String getSystemPrompt() {
        if (cachedSystemPrompt != null) {
            return cachedSystemPrompt;
        }

        StringBuilder prompt = new StringBuilder();
        prompt.append("You are LoanAssist AI, a helpful, fast, and dynamic loan advisor for VHF Bank. ");
        prompt.append("You guide users through the initial KYC process and answer any queries they have naturally.\n\n");
        prompt.append("The workflow steps are:\n");
        prompt.append("1. Acknowledge greetings and instruct the user to download their Offline eKYC ZIP from UIDAI, extract the XML using their share code, and upload the XML file here.\n");
        prompt.append("2. Once the system notifies you that KYC is verified, acknowledge their verified data (name, address). Then, explicitly state: 'Our team will contact you shortly.' Finally, ask if they have any other questions.\n\n");
        
        prompt.append("Guidelines:\n");
        prompt.append("- Be extremely clear, specific, and precise while answering queries.\n");
        prompt.append("- Be conversational, professional, and use emojis occasionally.\n");
        prompt.append("- Keep your responses concise and directly to the point.\n");
        prompt.append("- Answer general banking FAQs using the knowledge below.\n\n");
        
        prompt.append("Knowledge Base:\n");
        
        try {
            List<LoanQA> qas = repository.findAll();
            for (LoanQA qa : qas) {
                prompt.append("Q: ").append(qa.getQuestion()).append(" | A: ").append(qa.getAnswer()).append("\n");
            }
        } catch (Exception e) {
            // DB might be empty or not ready
        }
        
        cachedSystemPrompt = prompt.toString();
        return cachedSystemPrompt;
    }

    public String getAnswer(String sessionId, String userMessage) {
        // Initialize session history if it doesn't exist
        sessionHistories.putIfAbsent(sessionId, new ArrayList<>());
        List<Map<String, String>> history = sessionHistories.get(sessionId);

        // Add user message
        Map<String, String> userMsg = new HashMap<>();
        userMsg.put("role", "user");
        userMsg.put("content", userMessage);
        history.add(userMsg);

        // Call LLM
        String systemPrompt = getSystemPrompt();
        String botResponse = llmService.generateResponse(systemPrompt, history);

        // Add bot response to history
        Map<String, String> botMsg = new HashMap<>();
        botMsg.put("role", "assistant");
        botMsg.put("content", botResponse);
        history.add(botMsg);

        return botResponse;
    }

    public String processKyc(String sessionId, String name) {
        sessionHistories.putIfAbsent(sessionId, new ArrayList<>());
        List<Map<String, String>> history = sessionHistories.get(sessionId);
        
        Map<String, String> systemMsg = new HashMap<>();
        systemMsg.put("role", "system");
        systemMsg.put("content", "SYSTEM EVENT: The system has successfully verified the Aadhaar KYC for the user. Their name is " + name + ". Please acknowledge this verification to the user and immediately ask for their annual income.");
        history.add(systemMsg);

        String systemPrompt = getSystemPrompt();
        String botResponse = llmService.generateResponse(systemPrompt, history);
        
        Map<String, String> botMsg = new HashMap<>();
        botMsg.put("role", "assistant");
        botMsg.put("content", botResponse);
        history.add(botMsg);

        return botResponse;
    }
}
