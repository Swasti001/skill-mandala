package com.example.demo.controller;

import com.example.demo.messaging.Conversation;
import com.example.demo.messaging.ConversationRepository;
import com.example.demo.model.Session;
import com.example.demo.model.User;
import com.example.demo.model.ZoomMeeting;
import com.example.demo.repository.SessionRepository;
import com.example.demo.service.NotificationService;
import com.example.demo.service.UserService;
import com.example.demo.service.ZoomService;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
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
@RequestMapping(value = { "/api/zoom" })
public class ZoomController {
    private final ZoomService zoomService;
    private final UserService userService;
    private final ConversationRepository conversationRepository;
    private final SessionRepository sessionRepository;
    private final NotificationService notificationService;

    @Value(value = "${zoom.sdk.key}")
    private String sdkKey;

    public ZoomController(ZoomService zoomService, UserService userService,
            ConversationRepository conversationRepository, SessionRepository sessionRepository, NotificationService notificationService) {
        this.zoomService = zoomService;
        this.userService = userService;
        this.conversationRepository = conversationRepository;
        this.sessionRepository = sessionRepository;
        this.notificationService = notificationService;
    }

    @PostMapping(value = { "/create-meeting" })
    public ResponseEntity<?> createMeeting(@RequestBody Map<String, Long> body,
            @RequestHeader(value = "Authorization") String authHeader) {
        Conversation conv;
        User user = this.userService.getUserFromToken(authHeader);
        if (user == null) {
            return ResponseEntity.status((HttpStatusCode) HttpStatus.UNAUTHORIZED).build();
        }
        Long sessionId = body.get("sessionId");
        Long conversationId = body.get("conversationId");
        if (conversationId != null
                && (conv = (Conversation) this.conversationRepository.findById(conversationId).orElse(null)) != null
                && conv.getSessionId() != null) {
            sessionId = conv.getSessionId();
        }
        if (sessionId == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Session ID or Conversation ID required"));
        }
        ZoomMeeting meeting = this.zoomService.createMeeting(sessionId, user.getId());
        if (meeting != null) {
            // Notify other user
            try {
                Session session = (Session) this.sessionRepository.findById(sessionId).orElse(null);
                if (session != null) {
                    Long otherId = session.getUserA().equals(user.getId()) ? session.getUserB() : session.getUserA();
                    String hostName = user.getName() != null ? user.getName() : user.getUsername();
                    this.notificationService.createNotification(hostName + " started a live session. Click to join!", "SESSION", user.getId(), otherId);
                }
            } catch (Exception e) {}

            return ResponseEntity.ok(Map.of("meeting", meeting));
        }
        return ResponseEntity.status((HttpStatusCode) HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to create Zoom meeting"));
    }

    @GetMapping(value = { "/meeting/{sessionId}" })
    public ResponseEntity<?> getMeeting(@PathVariable("sessionId") Long sessionId,
            @RequestHeader(value = "Authorization") String authHeader) {
        User user = this.userService.getUserFromToken(authHeader);
        if (user == null) {
            return ResponseEntity.status((HttpStatusCode) HttpStatus.UNAUTHORIZED).build();
        }
        ZoomMeeting meeting = this.zoomService.getMeetingBySessionId(sessionId);
        if (meeting != null) {
            // ✅ Auto-activate session upon joining if it's not already completed
            this.sessionRepository.findById(sessionId).ifPresent(s -> {
                if (s.getStatus() != Session.SessionStatus.COMPLETED) {
                    s.setStatus(Session.SessionStatus.ACTIVE);
                    this.sessionRepository.save(s);
                }
            });
            return ResponseEntity.ok(Map.of("meeting", meeting));
        }
        return ResponseEntity.notFound().build();
    }
}