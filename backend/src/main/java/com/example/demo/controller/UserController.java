package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.model.UserOnboarding;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.UserOnboardingRepository;
import com.example.demo.repository.MatchRepository;
import com.example.demo.repository.MatchActionRepository;
import com.example.demo.service.UserService;
import com.example.demo.dto.UserProfileUpdateDTO;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.UUID;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping(value={"/api/user"})
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final UserOnboardingRepository onboardingRepository;
    private final MatchRepository matchRepository;
    private final MatchActionRepository actionRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Path avatarStorageLocation;
    private final Path portfolioStorageLocation;

    public UserController(UserService userService, UserRepository userRepository, 
                          UserOnboardingRepository onboardingRepository,
                          MatchRepository matchRepository,
                          MatchActionRepository actionRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.onboardingRepository = onboardingRepository;
        this.matchRepository = matchRepository;
        this.actionRepository = actionRepository;
        this.avatarStorageLocation = Paths.get("uploads/avatars").toAbsolutePath().normalize();
        this.portfolioStorageLocation = Paths.get("uploads/portfolio").toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.avatarStorageLocation);
            Files.createDirectories(this.portfolioStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the storage directories.", ex);
        }
    }

    @GetMapping(value={"/me"})
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "No token provided"));
        }
        User user = this.userService.getUserFromToken(authHeader);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid or expired token"));
        }
        Map<String, Object> onboardingStatus = this.userService.getOnboardingStatus(user);
        
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName() != null ? user.getName() : "");
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("phone", user.getPhone() != null ? user.getPhone() : "");
        response.put("dob", user.getDob() != null ? user.getDob().toString() : "");
        response.put("role", user.getRole());
        response.put("profilePictureUrl", user.getProfilePictureUrl() != null ? user.getProfilePictureUrl() : "");
        response.put("portfolioImages", onboardingStatus.get("portfolioImages") != null ? onboardingStatus.get("portfolioImages") : "[]");
        response.put("onboarding", onboardingStatus);
        response.put("credits", user.getCredits());
        response.put("xp", user.getXp());
        response.put("level", user.getLevel());
        response.put("streak", user.getStreak());
        response.put("teachingReputation", user.getTeachingReputation());
        response.put("learningReputation", user.getLearningReputation());
        response.put("totalTeachingSessions", user.getTotalTeachingSessions());
        response.put("totalLearningSessions", user.getTotalLearningSessions());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping(value={"/{id}"})
    public ResponseEntity<?> getUserProfile(HttpServletRequest request, @PathVariable(value="id") Long id) {
        User user = this.userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }
        
        UserOnboarding onboarding = this.onboardingRepository.findByUser(user).orElse(new UserOnboarding());
        
        String authHeader = request.getHeader("Authorization");
        String connectionStatus = "NONE";
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            User me = userService.getUserFromToken(authHeader);
            if (me != null && !me.getId().equals(id)) {
                if (matchRepository.existsByUsers(me.getId(), id)) {
                    connectionStatus = "MATCHED";
                } else if (actionRepository.findByFromUserIdAndToUserId(me.getId(), id).isPresent()) {
                    connectionStatus = "REQUEST_SENT";
                } else if (actionRepository.findByFromUserIdAndToUserId(id, me.getId()).isPresent()) {
                    connectionStatus = "REQUEST_RECEIVED";
                }
            }
        }

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName() != null ? user.getName() : "");
        response.put("username", user.getUsername());
        response.put("bio", onboarding.getBio() != null ? onboarding.getBio() : "");
        response.put("teachSkills", onboarding.getTeachSkills() != null ? onboarding.getTeachSkills() : "[]");
        response.put("learnSkills", onboarding.getLearnSkills() != null ? onboarding.getLearnSkills() : "[]");
        response.put("teachAvailability", onboarding.getTeachAvailability() != null ? onboarding.getTeachAvailability() : "{}");
        response.put("learnAvailability", onboarding.getLearnAvailability() != null ? onboarding.getLearnAvailability() : "{}");
        response.put("portfolioImages", onboarding.getPortfolioImages() != null ? onboarding.getPortfolioImages() : "[]");
        response.put("profilePictureUrl", user.getProfilePictureUrl() != null ? user.getProfilePictureUrl() : "");
        response.put("email", user.getEmail() != null ? user.getEmail() : "");
        response.put("phone", user.getPhone() != null ? user.getPhone() : "");
        response.put("connectionStatus", connectionStatus);

        return ResponseEntity.ok(response);
    }

    @PutMapping(value={"/me"})
    public ResponseEntity<?> updateProfile(HttpServletRequest request, @RequestBody UserProfileUpdateDTO dto) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "No token provided"));
            }
            User user = this.userService.getUserFromToken(authHeader);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid or expired token"));
            }
            
            user.setName(dto.getName());
            
            // Email parsing and validation
            String newEmail = dto.getEmail();
            if (newEmail != null && newEmail.trim().isEmpty()) {
                newEmail = null;
            }
            if (newEmail != null && !newEmail.equalsIgnoreCase(user.getEmail())) {
                User existingUser = userRepository.findByEmail(newEmail);
                if (existingUser != null && !existingUser.getId().equals(user.getId())) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "This email is already in use by another account."));
                }
            }
            user.setEmail(newEmail);
            
            user.setPhone(dto.getPhone());
            if (dto.getProfilePictureUrl() != null) {
                user.setProfilePictureUrl(dto.getProfilePictureUrl());
            }
            userRepository.save(user);

            UserOnboarding onboarding = onboardingRepository.findByUser(user).orElse(new UserOnboarding());
            if (onboarding.getUser() == null) onboarding.setUser(user);
            
            onboarding.setBio(dto.getBio());
            
            try {
                onboarding.setTeachSkills(objectMapper.writeValueAsString(dto.getTeachSkills()));
                onboarding.setLearnSkills(objectMapper.writeValueAsString(dto.getLearnSkills()));
                onboarding.setTeachAvailability(objectMapper.writeValueAsString(dto.getTeachAvailability()));
                onboarding.setLearnAvailability(objectMapper.writeValueAsString(dto.getLearnAvailability()));
                onboarding.setPortfolioImages(objectMapper.writeValueAsString(dto.getPortfolioImages()));
            } catch(Exception e) {
                return ResponseEntity.badRequest().body("Failed to parse identity nodes");
            }
            onboardingRepository.save(onboarding);

            return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Internal Server Error: " + ex.getMessage()));
        }
    }

    @PostMapping("/upload-avatar")
    public ResponseEntity<?> uploadAvatar(HttpServletRequest request, @RequestParam("file") MultipartFile file) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "No token provided"));
        }
        User user = this.userService.getUserFromToken(authHeader);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid or expired token"));
        }

        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        try {
            if (fileName.contains("..")) {
                throw new RuntimeException("Invalid path sequence " + fileName);
            }
            String fileExtension = "";
            int i = fileName.lastIndexOf('.');
            if (i > 0) {
                fileExtension = fileName.substring(i);
            }
            
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
            Path targetLocation = this.avatarStorageLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            String imageUrl = "http://localhost:8080/uploads/avatars/" + uniqueFileName;
            
            // We can either update the user immediately or just return the URL
            user.setProfilePictureUrl(imageUrl);
            userRepository.save(user);
            
            return ResponseEntity.ok(Map.of("url", imageUrl));
        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not store file: " + ex.getMessage());
        }
    }

    @PostMapping("/upload-portfolio")
    public ResponseEntity<?> uploadPortfolio(HttpServletRequest request, @RequestParam("file") MultipartFile file) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "No token provided"));
        }
        User user = this.userService.getUserFromToken(authHeader);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid or expired token"));
        }

        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        try {
            String fileExtension = "";
            int i = fileName.lastIndexOf('.');
            if (i > 0) fileExtension = fileName.substring(i);
            
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
            Path targetLocation = this.portfolioStorageLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            String imageUrl = "http://localhost:8080/uploads/portfolio/" + uniqueFileName;
            return ResponseEntity.ok(Map.of("url", imageUrl));
        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not store image: " + ex.getMessage());
        }
    }

    @GetMapping("/mandala")
    public ResponseEntity<?> getMandalaData(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            User user = this.userService.getUserFromToken(authHeader);
            if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            
            String data = user.getMandalaTrackerData();
            if (data == null || data.trim().isEmpty()) {
                return ResponseEntity.ok(Map.of());
            }
            return ResponseEntity.ok(objectMapper.readValue(data, Map.class));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/mandala")
    public ResponseEntity<?> updateMandalaData(HttpServletRequest request, @RequestBody Map<String, Object> body) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            User user = this.userService.getUserFromToken(authHeader);
            if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            
            String jsonData = objectMapper.writeValueAsString(body);
            user.setMandalaTrackerData(jsonData);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Mandala tracker updated"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", e.getMessage()));
        }
    }
}
