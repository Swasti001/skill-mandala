package com.example.demo.messaging;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    // ── GET all conversations for a user ──
    @GetMapping("/conversations/{userId}")
    public ResponseEntity<?> getConversations(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(messageService.getConversations(userId));
    }

    // ── GET messages in a conversation ──
    @GetMapping("/conversation/{conversationId}/{userId}")
    public ResponseEntity<?> getMessages(
            @PathVariable("conversationId") Long conversationId,
            @PathVariable("userId") Long userId
    ) {
        return ResponseEntity.ok(messageService.getMessages(conversationId, userId));
    }

    // ── SEND a message ──
    @PostMapping("/send/{senderId}")
    public ResponseEntity<?> sendMessage(
            @PathVariable("senderId") Long senderId,
            @RequestBody SendMessageDTO dto
    ) {
        try {
            Message sent = messageService.sendMessage(senderId, dto.getReceiverId(), dto.getContent());
            return ResponseEntity.ok(sent);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    // ── MARK conversation as read ──
    @PutMapping("/read/{conversationId}/{userId}")
    public ResponseEntity<?> markAsRead(
            @PathVariable("conversationId") Long conversationId,
            @PathVariable("userId") Long userId
    ) {
        messageService.markAsRead(conversationId, userId);
        return ResponseEntity.ok(Map.of("status", "read"));
    }

    @GetMapping("/unread-count/{userId}")
    public ResponseEntity<?> getUnreadCount(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(Map.of("unreadCount", messageService.getTotalUnreadCount(userId)));
    }
}
