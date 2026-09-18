package com.harsha.loanassistant.controller;

import com.harsha.loanassistant.service.ChatbotService;
import com.harsha.loanassistant.service.KycService;
import com.harsha.loanassistant.entity.ChatHistory;
import com.harsha.loanassistant.repository.ChatHistoryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    @Autowired
    private KycService kycService;

    @Autowired
    private ChatHistoryRepository chatHistoryRepository;

    @GetMapping("/ask")
    public String askQuestion(
            @RequestParam String question, 
            @RequestParam(required = false, defaultValue = "guest") String username, 
            HttpServletRequest request) {
        
        HttpSession session = request.getSession(true);
        String sessionId = session.getId();
        
        // Save User Message
        chatHistoryRepository.save(new ChatHistory(username, "user", question, "text", null));

        // Get AI Answer
        String answer = chatbotService.getAnswer(sessionId, question);

        // Save AI Answer
        chatHistoryRepository.save(new ChatHistory(username, "bot", answer, "text", null));

        return answer;
    }

    @PostMapping("/verifyKyc")
    public String verifyKyc(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(required = false, defaultValue = "guest") String username,
            HttpServletRequest request) {
        
        HttpSession session = request.getSession(true);
        String sessionId = session.getId();

        // Save File Upload Message
        chatHistoryRepository.save(new ChatHistory(username, "user", "Uploading secure document: " + file.getOriginalFilename(), "file", file.getOriginalFilename()));

        // Parse KYC XML
        String kycResult = kycService.processKyc(file, password);
        
        String answer;
        if (kycResult.startsWith("KYC Verified for ")) {
            String name = kycResult.replace("KYC Verified for ", "");
            answer = chatbotService.processKyc(sessionId, name);
        } else {
            answer = kycResult; 
        }

        // Save AI Answer
        chatHistoryRepository.save(new ChatHistory(username, "bot", answer, "text", null));
        return answer;
    }

    @GetMapping("/chat/history")
    public List<ChatHistory> getHistory(@RequestParam String username) {
        return chatHistoryRepository.findByUsernameOrderByTimestampAsc(username);
    }
}
