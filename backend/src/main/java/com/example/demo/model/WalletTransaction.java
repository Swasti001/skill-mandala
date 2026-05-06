package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "wallet_transactions")
public class WalletTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "amount", nullable = false)
    private int amount; // positive for earn, negative for spend

    @Column(name = "type", nullable = false)
    private String type; // "EARN", "SPEND", "BONUS"

    @Column(name = "description")
    private String description;

    @Column(name = "other_user_name")
    private String otherUserName;

    @Column(name = "other_user_id")
    private Long otherUserId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public WalletTransaction() {}

    public WalletTransaction(Long userId, int amount, String type, String description, String otherUserName, Long otherUserId) {
        this.userId = userId;
        this.amount = amount;
        this.type = type;
        this.description = description;
        this.otherUserName = otherUserName;
        this.otherUserId = otherUserId;
        this.createdAt = LocalDateTime.now();
    }

    // ===== GETTERS & SETTERS =====
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public int getAmount() { return amount; }
    public void setAmount(int amount) { this.amount = amount; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getOtherUserName() { return otherUserName; }
    public void setOtherUserName(String otherUserName) { this.otherUserName = otherUserName; }
    public Long getOtherUserId() { return otherUserId; }
    public void setOtherUserId(Long otherUserId) { this.otherUserId = otherUserId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
