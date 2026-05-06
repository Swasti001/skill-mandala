package com.example.demo.controller;

import com.example.demo.dto.UserOnboardingDTO;
import com.example.demo.model.User;
import com.example.demo.model.UserOnboarding;
import com.example.demo.repository.UserOnboardingRepository;
import com.example.demo.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/user/onboarding")
@CrossOrigin(origins = "http://localhost:3000")
public class UserOnboardingController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserOnboardingRepository onboardingRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // NEW: Get onboarding data (used to decide whether to show onboarding again)
    @GetMapping("/{userId}")
    public ResponseEntity<?> getOnboarding(@PathVariable Long userId) {

        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = optionalUser.get();

        return onboardingRepository.findByUser(user)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Save or update onboarding data for a specific user.
     * Option A: JWT check temporarily disabled
     */
    @PostMapping("/{userId}")
    public ResponseEntity<?> saveOnboarding(
            @PathVariable Long userId,
            @RequestBody UserOnboardingDTO onboardingData
    ) {

        // Find user by ID
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = optionalUser.get();

        // Create or update onboarding record
        UserOnboarding onboarding = onboardingRepository
                .findByUser(user)
                .orElseGet(() -> {
                    UserOnboarding newOnboarding = new UserOnboarding();
                    newOnboarding.setUser(user);
                    return newOnboarding;
                });

        // Basic fields
        onboarding.setBio(onboardingData.getBio());
        onboarding.setLocation(onboardingData.getLocation());
        onboarding.setExperience(onboardingData.getExperience());
        onboarding.setMode(onboardingData.getMode());

        // Convert List/Map -> JSON string because entity stores TEXT
        try {
            onboarding.setTeachSkills(objectMapper.writeValueAsString(onboardingData.getTeachSkills()));
            onboarding.setLearnSkills(objectMapper.writeValueAsString(onboardingData.getLearnSkills()));

            onboarding.setTeachAvailability(objectMapper.writeValueAsString(onboardingData.getTeachAvailability()));
            onboarding.setLearnAvailability(objectMapper.writeValueAsString(onboardingData.getLearnAvailability()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid onboarding data: " + e.getMessage());
        }

        UserOnboarding saved = onboardingRepository.save(onboarding);

        return ResponseEntity.ok(saved);
    }
}