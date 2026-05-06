package com.example.demo.dto;

public class BookSessionResponseDTO {
    private boolean success;
    private Long sessionId;
    private String message;
    private int remainingCredits;
    private String zoomJoinUrl;

    public BookSessionResponseDTO() {}

    public BookSessionResponseDTO(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public BookSessionResponseDTO(boolean success, Long sessionId, String message, int remainingCredits, String zoomJoinUrl) {
        this.success = success;
        this.sessionId = sessionId;
        this.message = message;
        this.remainingCredits = remainingCredits;
        this.zoomJoinUrl = zoomJoinUrl;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public int getRemainingCredits() { return remainingCredits; }
    public void setRemainingCredits(int remainingCredits) { this.remainingCredits = remainingCredits; }

    public String getZoomJoinUrl() { return zoomJoinUrl; }
    public void setZoomJoinUrl(String zoomJoinUrl) { this.zoomJoinUrl = zoomJoinUrl; }
}
