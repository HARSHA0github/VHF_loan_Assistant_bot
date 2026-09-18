package com.harsha.loanassistant.controller;

import com.harsha.loanassistant.entity.UserAccount;
import com.harsha.loanassistant.repository.UserAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    @Autowired
    private UserAccountRepository userAccountRepository;

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        Map<String, Object> response = new HashMap<>();

        if (username == null || password == null || username.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Username and password are required.");
            return response;
        }

        if (userAccountRepository.findByUsername(username).isPresent()) {
            response.put("success", false);
            response.put("message", "Username already exists.");
            return response;
        }

        UserAccount user = new UserAccount(username, password); // Note: Simple plaintext for local dev
        userAccountRepository.save(user);

        response.put("success", true);
        response.put("username", username);
        return response;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        Map<String, Object> response = new HashMap<>();

        Optional<UserAccount> userOpt = userAccountRepository.findByUsername(username);
        
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            response.put("success", true);
            response.put("username", username);
        } else {
            response.put("success", false);
            response.put("message", "Invalid username or password.");
        }
        return response;
    }
}
