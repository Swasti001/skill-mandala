package com.example.demo.messaging;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(
    name = "messages",
    indexes = {
        @Index(name = "idx_msg_conversation", columnList = "conversation_id"),
        @Index(name = "idx_msg_sender", columnList = "sender_id")
    }
)
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "conversation_id", nullable = false)
    private Long conversationId;

    @Column(name = "sender_id", nullable = false)
    private Long senderId;

    @Column(name = "content", nullable = false, length = 2000)
    private String content;

    @Column(name = "is_read", nullable = false)
    private boolean read = false;

    @Column(name = "is_system", nullable = false)
    private boolean system = false;

    @Column(name = "message_type", length = 20)
    private String messageType = "text"; // "text" or "file"

    @Column(name = "file_url", length = 1000)
    private String fileUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = Instant.now();
    }

    // ===== GETTERS & SETTERS =====

    public Long getId() { return id; }

    public Long getConversationId() { return conversationId; }
    public void setConversationId(Long conversationId) { this.conversationId = conversationId; }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }

    public boolean isSystem() { return system; }
    public void setSystem(boolean system) { this.system = system; }

    public String getMessageType() { return messageType; }
    public void setMessageType(String messageType) { this.messageType = messageType; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public Instant getCreatedAt() { return createdAt; }
}
