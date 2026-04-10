package com.mzansi.builds.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mzansi.builds.entity.User;
import com.mzansi.builds.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void registerCreatesUserWithNormalizedEmail() throws Exception {
        Map<String, String> request = new HashMap<>();
        request.put("email", "  TEST@Example.com ");
        request.put("password", "password123");
        request.put("fullName", " Test User ");
        request.put("githubUsername", " octocat ");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.email").value("test@example.com"))
            .andExpect(jsonPath("$.message").value("User registered successfully!"));

        User savedUser = userRepository.findByEmail("test@example.com").orElseThrow();
        Assertions.assertEquals("Test User", savedUser.getFullName());
        Assertions.assertEquals("octocat", savedUser.getGithubUsername());
        Assertions.assertNotEquals("password123", savedUser.getPassword());
    }

    @Test
    void registerRejectsInvalidPayload() throws Exception {
        Map<String, String> request = new HashMap<>();
        request.put("email", "invalid-email");
        request.put("password", "short");
        request.put("fullName", "");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.email").exists())
            .andExpect(jsonPath("$.password").exists())
            .andExpect(jsonPath("$.fullName").exists());
    }

    @Test
    void registerRejectsDuplicateEmailIgnoringCase() throws Exception {
        User existingUser = new User();
        existingUser.setEmail("person@example.com");
        existingUser.setPassword("encoded");
        existingUser.setFullName("Existing User");
        userRepository.save(existingUser);

        Map<String, String> request = new HashMap<>();
        request.put("email", "PERSON@example.com");
        request.put("password", "password123");
        request.put("fullName", "Another User");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("Email already registered"));
    }
}
