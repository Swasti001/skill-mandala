package com.example.demo.dto;

public class CreateExchangeRequestDTO {

    private Long receiverId;
    private String requesterTeaches;
    private String requesterLearns;
    private String message;

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public String getRequesterTeaches() {
        return requesterTeaches;
    }

    public void setRequesterTeaches(String requesterTeaches) {
        this.requesterTeaches = requesterTeaches;
    }

    public String getRequesterLearns() {
        return requesterLearns;
    }

    public void setRequesterLearns(String requesterLearns) {
        this.requesterLearns = requesterLearns;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}