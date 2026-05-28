package com.example.demo.controller;

import com.example.demo.dto.BookSessionDTO;
import com.example.demo.dto.BookSessionResponseDTO;
import com.example.demo.dto.MatchResponseDTO;
import com.example.demo.dto.SessionCardDTO;
import com.example.demo.model.User;
import com.example.demo.service.SessionService;
import com.example.demo.service.UserService;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value={"/api/user/sessions"})
public class SessionController {
    private final SessionService sessionService;
    private final UserService userService;

    public SessionController(SessionService sessionService, UserService userService) {
        this.sessionService = sessionService;
        this.userService = userService;
    }

    @GetMapping(value={"/{userId}"})
    public ResponseEntity<List<SessionCardDTO>> getSessions(@PathVariable(value="userId") Long userId) {
        return ResponseEntity.ok(this.sessionService.getUserSessions(userId));
    }

    @PostMapping(value={"/{sessionId}/accept"})
    public ResponseEntity<?> accept(@PathVariable(value="sessionId") Long sessionId) {
        MatchResponseDTO result = this.sessionService.acceptSession(sessionId);
        return ResponseEntity.ok((Object)result);
    }

    @PostMapping(value={"/{sessionId}/reject"})
    public ResponseEntity<?> reject(@PathVariable(value="sessionId") Long sessionId) {
        this.sessionService.rejectSession(sessionId);
        return ResponseEntity.ok().build();
    }

    @PostMapping(value={"/create"})
    public ResponseEntity<?> bookSession(@RequestBody BookSessionDTO dto,
                                          @RequestHeader(value="Authorization") String authHeader) {
        User user = this.userService.getUserFromToken(authHeader);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        BookSessionResponseDTO result = this.sessionService.bookSession(user.getId(), dto);
        if (result.isSuccess()) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    @PostMapping(value={"/{sessionId}/complete"})
    public ResponseEntity<?> completeSession(@PathVariable(value="sessionId") Long sessionId,
                                              @RequestHeader(value="Authorization") String authHeader) {
        User user = this.userService.getUserFromToken(authHeader);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        boolean success = this.sessionService.completeSession(sessionId, user.getId());
        if (success) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Session marked as completed"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Failed to complete session"));
        }
    }
}
