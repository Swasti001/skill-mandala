package com.example.demo.controller;

import com.example.demo.dto.FeedbackDTO;
import com.example.demo.model.User;
import com.example.demo.service.FeedbackService;
import com.example.demo.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {
    private final FeedbackService feedbackService;
    private final UserService userService;

    public FeedbackController(FeedbackService feedbackService, UserService userService) {
        this.feedbackService = feedbackService;
        this.userService = userService;
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitFeedback(@RequestBody FeedbackDTO dto,
                                            @RequestHeader("Authorization") String authHeader) {
        User user = userService.getUserFromToken(authHeader);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid token"));
        }

        Map<String, Object> result = feedbackService.submitFeedback(user.getId(), dto);
        if ((boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }
}
