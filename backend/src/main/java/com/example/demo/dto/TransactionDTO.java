package com.example.demo.dto;

import java.time.LocalDateTime;

public class TransactionDTO {
    private Long id;
    private int amount;
    private String type;
    private String description;
    private String otherUserName;
    private String otherUserProfilePicture;
    private LocalDateTime createdAt;

    public TransactionDTO(Long id, int amount, String type, String description, 
                          String otherUserName, String otherUserProfilePicture, LocalDateTime createdAt) {
        this.id = id;
        this.amount = amount;
        this.type = type;
        this.description = description;
        this.otherUserName = otherUserName;
        this.otherUserProfilePicture = otherUserProfilePicture;
        this.createdAt = createdAt;
    }

    // Getters
    public Long getId() { return id; }
    public int getAmount() { return amount; }
    public String getType() { return type; }
    public String getDescription() { return description; }
    public String getOtherUserName() { return otherUserName; }
    public String getOtherUserProfilePicture() { return otherUserProfilePicture; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
