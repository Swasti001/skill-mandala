package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.model.UserOnboarding;
import com.example.demo.repository.UserOnboardingRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserOnboardingRepository onboardingRepo;

    @Value("${jwt.secret:SkillMandalaSuperSecretKeySkillMandalaSuperSecretKeySkillMandala123}")
    private String jwtSecret;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostConstruct
    public void initAdmin() {
        if (userRepository.findByEmail("admin@mandala.io") == null) {
            User admin = new User();
            admin.setName("System Administrator");
            admin.setEmail("admin@mandala.io");
            admin.setUsername("admin");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            admin.setDob(java.time.LocalDate.of(2000, 1, 1));
            admin.setPhone("0000000000");
            userRepository.save(admin);
        }
    }

    // -----------------------------
    // REGISTER USER
    // -----------------------------
    public User registerUser(User user) throws Exception {

        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new Exception("Email already exists");
        }

        if (userRepository.findFirstByUsername(user.getUsername()).isPresent()) {
            throw new Exception("Username already exists");
        }

        // 🔥 HASH THE *RAW* PASSWORD
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new Exception("Password is required");
        }

        String hashedPassword = passwordEncoder.encode(user.getPassword());

        user.setPasswordHash(hashedPassword);
        user.setPassword(null); // clear raw password

        // Save to DB
        return userRepository.save(user);
    }

    // -----------------------------
    // FIND USER BY EMAIL
    // -----------------------------
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // -----------------------------
    // CHECK PASSWORD
    // -----------------------------
    public boolean passwordMatches(String rawPassword, String hashedPassword) {
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }

    // -----------------------------
    // UPDATE PASSWORD
    // -----------------------------
    public void updatePassword(User user, String newRawPassword) {
        user.setPasswordHash(passwordEncoder.encode(newRawPassword));
        userRepository.save(user);
    }

    // -----------------------------
    // ROLE CHECK
    // -----------------------------
    public boolean isAdmin(User user) {
        return user != null && "ADMIN".equals(user.getRole());
    }

    // -----------------------------
    // TOKEN EXTRACTION (Helper for assumed extraction)
    // -----------------------------
    public User getUserFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        try {
            String token = authHeader.substring(7);
            String secret = jwtSecret;
            String username = Jwts.parserBuilder()
                    .setSigningKey(io.jsonwebtoken.security.Keys.hmacShaKeyFor(secret.getBytes()))
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
            if (username != null) {
                return userRepository.findFirstByUsername(username).orElse(null);
            }
            return null;
        } catch (Exception e) {
            System.err.println("[getUserFromToken] Token parse failed: " + e.getMessage());
            return null;
        }
    }
    
    // -----------------------------
    // ONBOARDING STATUS
    // -----------------------------
    public java.util.Map<String, Object> getOnboardingStatus(User user) {
        UserOnboarding onboarding = onboardingRepo.findByUser(user).orElse(null);
        
        int currentStep = 1;
        boolean isCompleted = false;
        
        if (onboarding != null) {
            // Logic to determine step
            if (onboarding.getBio() != null && !onboarding.getBio().isEmpty()) currentStep = 2;
            if (onboarding.getTeachSkills() != null && !onboarding.getTeachSkills().isEmpty()) currentStep = 3;
            if (onboarding.getLearnSkills() != null && !onboarding.getLearnSkills().isEmpty()) {
                currentStep = 4;
                isCompleted = true;
            }
        }
        
        return java.util.Map.of(
            "completed", isCompleted,
            "currentStep", currentStep,
            "bio", (onboarding != null && onboarding.getBio() != null) ? onboarding.getBio() : "",
            "teachSkills", (onboarding != null && onboarding.getTeachSkills() != null) ? onboarding.getTeachSkills() : "[]",
            "learnSkills", (onboarding != null && onboarding.getLearnSkills() != null) ? onboarding.getLearnSkills() : "[]",
            "portfolioImages", (onboarding != null && onboarding.getPortfolioImages() != null) ? onboarding.getPortfolioImages() : "[]"
        );
    }
}
