package com.mzansi.builds.controller;

import com.mzansi.builds.dto.LoginRequest;
import com.mzansi.builds.dto.RegisterRequest;
import com.mzansi.builds.entity.User;
import com.mzansi.builds.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            Map<String, String> error = new LinkedHashMap<>();
            error.put("error", "Email already registered");
            return ResponseEntity.badRequest().body(error);
        }

        User user = new User();
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        user.setGithubUsername(normalizeGithubUsername(request.getGithubUsername()));

        userRepository.save(user);

        Map<String, String> response = new LinkedHashMap<>();
        response.put("message", "User registered successfully!");
        response.put("email", user.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(
        org.springframework.web.bind.MethodArgumentNotValidException exception
    ) {
        Map<String, String> errors = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors()
            .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errors);
    }

    private String normalizeGithubUsername(String githubUsername) {
        if (githubUsername == null) {
            return null;
        }

        String normalized = githubUsername.trim();
        return normalized.isEmpty() ? null : normalized;
    }
}
