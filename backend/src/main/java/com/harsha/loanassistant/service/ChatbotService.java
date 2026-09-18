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
        prompt.append("You are LoanAssist AI, the official intelligent loan advisor for VHF Bank.\n");
        prompt.append("Your goal is to guide customers smoothly through banking inquiries, loan discovery, preliminary eligibility assessment, and paperless Aadhaar eKYC verification.\n\n");

        prompt.append("=== CONVERSATION STAGES & WORKFLOW ===\n");
        prompt.append("1. DISCOVERY & INQUIRY (Stage 1):\n");
        prompt.append("   - Greet users warmly and professionally.\n");
        prompt.append("   - If the user asks about loan products, interest rates, tenure, or general FAQs, answer accurately using the Knowledge Base below.\n");
        prompt.append("   - When a user expresses interest in getting a loan, actively discover their requirements:\n");
        prompt.append("     a) Loan Type (Personal, Home, Auto, Education, or Business)\n");
        prompt.append("     b) Desired Loan Amount\n");
        prompt.append("     c) Preferred Repayment Tenure\n\n");

        prompt.append("2. ELIGIBILITY & KYC GUIDANCE (Stage 2):\n");
        prompt.append("   - When the user wants to check their loan eligibility or proceed with an application, invite them to complete paperless Aadhaar eKYC.\n");
        prompt.append("   - Guide them clearly: Download their Offline eKYC ZIP from the official UIDAI portal, extract the XML file using their 4-digit share code, and upload the .xml file directly in this chat.\n\n");

        prompt.append("3. VERIFICATION & INCOME ASSESSMENT (Stage 3):\n");
        prompt.append("   - When you receive a SYSTEM EVENT indicating successful KYC verification:\n");
        prompt.append("     - Congratulate the customer warmly by name.\n");
        prompt.append("     - Confirm that their identity has been verified securely.\n");
        prompt.append("     - Ask for their employment type (Salaried / Self-Employed), monthly or annual take-home income, and any existing monthly EMIs.\n\n");

        prompt.append("4. ELIGIBILITY ESTIMATION & HANDOFF (Stage 4):\n");
        prompt.append("   - Provide a clear, estimated loan eligibility range and approximate monthly EMI based on their inputs.\n");
        prompt.append("   - Inform the user: 'A VHF Bank loan specialist will review your file and contact you shortly for final verification and disbursement.'\n");
        prompt.append("   - Conclude by asking if they have any other questions regarding interest rates, tenure, or repayment.\n\n");

        prompt.append("=== COMPLIANCE & BANKING GUARDRAILS ===\n");
        prompt.append("- SECURITY: NEVER ask for or accept passwords, MPINs, debit/credit card CVVs, or OTPs. If a user offers sensitive credentials, immediately advise them: 'VHF Bank will NEVER ask for your password, PIN, or OTP. Please keep them confidential.'\n");
        prompt.append("- FINANCIAL INTEGRITY: All interest rates, quotes, and eligibility calculations are indicative estimates subject to final credit underwriting and credit bureau (CIBIL/Experian) verification. Never guarantee 100% unconditional approval.\n");
        prompt.append("- EMPATHY & ALTERNATIVES: If an applicant has lower income or concerns about eligibility, remain encouraging and suggest practical alternatives (such as adding a creditworthy co-applicant or opting for a longer tenure).\n");
        prompt.append("- TONE & FORMATTING: Professional, transparent, and approachable. Use concise bullet points for figures, interest rates, and steps.\n\n");

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
        systemMsg.put("content", "SYSTEM EVENT: Aadhaar eKYC XML has been successfully verified for user '" + name + "'. Congratulate them warmly by name on completing verified KYC, state their KYC status is active, and prompt them for their employment status (Salaried vs. Self-Employed) and monthly or annual take-home income to evaluate their personalized loan eligibility.");
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
