package com.mzansi.builds.controller;

import com.mzansi.builds.entity.User;
import com.mzansi.builds.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    
    private final UserRepository userRepository;
    
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("email") String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }
        
        Map<String, Object> profile = new HashMap<>();
        profile.put("email", user.getEmail());
        profile.put("fullName", user.getFullName());
        profile.put("githubUsername", user.getGithubUsername());
        profile.put("createdAt", user.getCreatedAt());
        
        return ResponseEntity.ok(profile);
    }
    
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestHeader("email") String userEmail,
                                           @RequestBody Map<String, String> updates) {
        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }
        
        if (updates.containsKey("fullName")) {
            user.setFullName(updates.get("fullName"));
        }
        if (updates.containsKey("githubUsername")) {
            user.setGithubUsername(updates.get("githubUsername"));
        }
        if (updates.containsKey("bio")) {
            // Bio would need a new column in User entity
            // For now, just acknowledge
        }
        
        userRepository.save(user);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Profile updated successfully");
        response.put("fullName", user.getFullName());
        response.put("githubUsername", user.getGithubUsername());
        
        return ResponseEntity.ok(response);
    }
}
