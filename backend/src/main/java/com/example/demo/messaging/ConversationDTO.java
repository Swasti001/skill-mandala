package com.example.demo.messaging;

import java.time.Instant;

public class ConversationDTO {

    private Long id;
    private Long otherUserId;
    private String otherUserName;
    private String otherUserProfilePictureUrl;
    private String lastMessage;
    private Instant lastMessageAt;
    private long unreadCount;
    private boolean matched;
    private Long sessionId;

    public ConversationDTO() {}

    public ConversationDTO(Long id, Long otherUserId, String otherUserName, String otherUserProfilePictureUrl,
                           String lastMessage, Instant lastMessageAt, long unreadCount, 
                           boolean matched, Long sessionId) {
        this.id = id;
        this.otherUserId = otherUserId;
        this.otherUserName = otherUserName;
        this.otherUserProfilePictureUrl = otherUserProfilePictureUrl;
        this.lastMessage = lastMessage;
        this.lastMessageAt = lastMessageAt;
        this.unreadCount = unreadCount;
        this.matched = matched;
        this.sessionId = sessionId;
    }

    // ===== GETTERS & SETTERS =====

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOtherUserId() { return otherUserId; }
    public void setOtherUserId(Long otherUserId) { this.otherUserId = otherUserId; }

    public String getOtherUserName() { return otherUserName; }
    public void setOtherUserName(String otherUserName) { this.otherUserName = otherUserName; }

    public String getOtherUserProfilePictureUrl() { return otherUserProfilePictureUrl; }
    public void setOtherUserProfilePictureUrl(String otherUserProfilePictureUrl) { this.otherUserProfilePictureUrl = otherUserProfilePictureUrl; }

    public String getLastMessage() { return lastMessage; }
    public void setLastMessage(String lastMessage) { this.lastMessage = lastMessage; }

    public Instant getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(Instant lastMessageAt) { this.lastMessageAt = lastMessageAt; }

    public long getUnreadCount() { return unreadCount; }
    public void setUnreadCount(long unreadCount) { this.unreadCount = unreadCount; }

    public boolean isMatched() { return matched; }
    public void setMatched(boolean matched) { this.matched = matched; }

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    private Integer myTeachingGoal;
    private Integer myTeachingCompleted;
    private Integer myLearningGoal;
    private Integer myLearningCompleted;

    public Integer getMyTeachingGoal() { return myTeachingGoal; }
    public void setMyTeachingGoal(Integer myTeachingGoal) { this.myTeachingGoal = myTeachingGoal; }

    public Integer getMyTeachingCompleted() { return myTeachingCompleted; }
    public void setMyTeachingCompleted(Integer myTeachingCompleted) { this.myTeachingCompleted = myTeachingCompleted; }

    public Integer getMyLearningGoal() { return myLearningGoal; }
    public void setMyLearningGoal(Integer myLearningGoal) { this.myLearningGoal = myLearningGoal; }

    public Integer getMyLearningCompleted() { return myLearningCompleted; }
    public void setMyLearningCompleted(Integer myLearningCompleted) { this.myLearningCompleted = myLearningCompleted; }

    private String myTeachingSubject;
    private String myLearningSubject;

    public String getMyTeachingSubject() { return myTeachingSubject; }
    public void setMyTeachingSubject(String myTeachingSubject) { this.myTeachingSubject = myTeachingSubject; }

    public String getMyLearningSubject() { return myLearningSubject; }
    public void setMyLearningSubject(String myLearningSubject) { this.myLearningSubject = myLearningSubject; }
}
