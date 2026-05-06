package com.example.demo;

import com.example.demo.model.User;
import com.example.demo.model.LoginRequest;
import com.example.demo.service.UserService;
import com.example.demo.service.EmailService;
import com.example.demo.model.PasswordResetToken;
import com.example.demo.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private com.example.demo.repository.UserOnboardingRepository onboardingRepo;

    @Autowired
    private com.example.demo.security.JwtUtils jwtUtils;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    // =============================
    // REGISTER
    // =============================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            // Normalize email
            user.setEmail(user.getEmail().toLowerCase());

            // Hash password inside service
            User savedUser = userService.registerUser(user); // userService should hash password

            // Generate token
            String token = jwtUtils.generateToken(savedUser.getId(), savedUser.getUsername());

            // Return token + user info
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "user", Map.of(
                            "id", savedUser.getId(),
                            "username", savedUser.getUsername(),
                            "email", savedUser.getEmail()
                    ),
                    "onboarding", Map.of(
                            "completed", false,
                            "currentStep", 1
                    )
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Registration failed: " + e.getMessage()));
        }
    }

    // =============================
    // LOGIN
    // =============================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            String email = request.getEmail().toLowerCase();
            User existingUser = userService.findByEmail(email);

            if (existingUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "User not found"));
            }

            // Check password
            boolean passwordValid = userService.passwordMatches(
                    request.getPassword(), // plain password from frontend
                    existingUser.getPasswordHash() // hashed password from DB
            );

            if (!passwordValid) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid password"));
            }

            // check if user is banned
            if ("BANNED".equals(existingUser.getStatus())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Your account has been banned for community violations. Please contact support."));
            }

            // Generate JWT
            String token = jwtUtils.generateToken(existingUser.getId(), existingUser.getUsername());

            // Fetch Onboarding Status
            com.example.demo.model.UserOnboarding onboarding = onboardingRepo.findByUser(existingUser).orElse(null);
            
            int currentStep = 1;
            boolean isCompleted = false;
            
            if (onboarding != null) {
                if (onboarding.getBio() != null && !onboarding.getBio().isEmpty()) currentStep = 2;
                if (onboarding.getTeachSkills() != null && !onboarding.getTeachSkills().isEmpty()) currentStep = 3;
                if (onboarding.getLearnSkills() != null && !onboarding.getLearnSkills().isEmpty()) {
                    currentStep = 4;
                    isCompleted = true;
                }
            }

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "user", Map.of(
                            "id", existingUser.getId(),
                            "username", existingUser.getUsername(),
                            "email", existingUser.getEmail(),
                            "role", existingUser.getRole()
                    ),
                    "onboarding", Map.of(
                            "completed", isCompleted,
                            "currentStep", currentStep
                    )
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Login failed"));
        }
    }

    // =============================
    // ADMIN LOGIN
    // =============================
    @PostMapping("/admin-login")
    public ResponseEntity<?> adminLogin(@RequestBody LoginRequest request) {
        try {
            String email = request.getEmail().toLowerCase();
            User existingUser = userService.findByEmail(email);

            if (existingUser == null || !"ADMIN".equals(existingUser.getRole())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Unauthorized. Admin access only."));
            }

            boolean passwordValid = userService.passwordMatches(
                    request.getPassword(), 
                    existingUser.getPasswordHash()
            );

            if (!passwordValid) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid credentials."));
            }

            if ("BANNED".equals(existingUser.getStatus())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "This account has been banned."));
            }

            String token = jwtUtils.generateToken(existingUser.getId(), existingUser.getUsername());

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "user", Map.of(
                            "id", existingUser.getId(),
                            "username", existingUser.getUsername(),
                            "email", existingUser.getEmail(),
                            "role", existingUser.getRole()
                    )
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Admin login failed"));
        }
    }

    // =============================
    // FORGOT PASSWORD
    // =============================
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null) return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
            
            email = email.toLowerCase();
            User user = userService.findByEmail(email);
            if (user == null) {
                // Return success to avoid email enumeration
                return ResponseEntity.ok(Map.of("message", "If that email is registered, we have sent a reset link to it."));
            }

            tokenRepository.findByUser(user).ifPresent(tokenRepository::delete);

            String tokenStr = UUID.randomUUID().toString();
            PasswordResetToken token = new PasswordResetToken(tokenStr, user);
            tokenRepository.save(token);

            String resetUrl = "http://localhost:3000/reset-password?token=" + tokenStr;
            
            try {
                emailService.sendResetPasswordMail(email, resetUrl);
            } catch (Exception mailEx) {
                System.err.println("Failed to send real email: " + mailEx.getMessage());
                // Fallback to console printing if SMTP is not configured
                System.out.println("\n\n==================================================");
                System.out.println("SIMULATED EMAIL SENT TO: " + email);
                System.out.println("RESET LINK: " + resetUrl);
                System.out.println("==================================================\n\n");
            }

            return ResponseEntity.ok(Map.of("message", "If that email is registered, we have sent a reset link to it."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An error occurred while processing your request."));
        }
    }

    // =============================
    // RESET PASSWORD
    // =============================
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String tokenStr = request.get("token");
            String newPassword = request.get("newPassword");

            if (tokenStr == null || newPassword == null || newPassword.length() < 6) {
                return ResponseEntity.badRequest().body(Map.of("message", "Token and a valid new password (min 6 chars) are required."));
            }

            PasswordResetToken token = tokenRepository.findByToken(tokenStr).orElse(null);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid or expired reset token."));
            }

            if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
                tokenRepository.delete(token);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "This reset link has expired."));
            }

            User user = token.getUser();
            userService.updatePassword(user, newPassword);
            tokenRepository.delete(token);

            return ResponseEntity.ok(Map.of("message", "Your password has been successfully reset."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An error occurred while resetting the password."));
        }
    }
}
