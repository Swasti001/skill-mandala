package com.example.demo.exchange;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(
        name = "skill_exchange_requests",
        indexes = {
                @Index(name = "idx_req_requester", columnList = "requester_id"),
                @Index(name = "idx_req_receiver", columnList = "receiver_id")
        }
)
public class SkillExchangeRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "requester_id", nullable = false)
    private Long requesterId;

    @Column(name = "receiver_id", nullable = false)
    private Long receiverId;

    @Column(name = "requester_teaches", nullable = false)
    private String requesterTeaches;

    @Column(name = "requester_learns", nullable = false)
    private String requesterLearns;

    @Column(name = "message", length = 500)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ExchangeRequestStatus status = ExchangeRequestStatus.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
        if (this.status == null) {
            this.status = ExchangeRequestStatus.PENDING;
        }
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public Long getId() { return id; }

    public Long getRequesterId() { return requesterId; }
    public void setRequesterId(Long requesterId) { this.requesterId = requesterId; }

    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }

    public String getRequesterTeaches() { return requesterTeaches; }
    public void setRequesterTeaches(String requesterTeaches) { this.requesterTeaches = requesterTeaches; }

    public String getRequesterLearns() { return requesterLearns; }
    public void setRequesterLearns(String requesterLearns) { this.requesterLearns = requesterLearns; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public ExchangeRequestStatus getStatus() { return status; }
    public void setStatus(ExchangeRequestStatus status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}