package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks")
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id", nullable = false)
    private Long sessionId;

    @Column(name = "from_user_id", nullable = false)
    private Long fromUserId;

    @Column(name = "to_user_id", nullable = false)
    private Long toUserId;

    // Role identifies if this is feedback FOR the teacher or FOR the learner
    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private FeedbackTargetRole targetRole;

    // Common Rating (Calculated Average)
    private double overallRating;
    
    @Column(length = 1000)
    private String comment;

    // Teacher-specific metrics (0-5)
    private int teachingQuality;
    private int clarity;
    private int punctuality;
    private int communication;
    private int helpfulness;

    // Learner-specific metrics (0-5)
    private int engagement;
    // punctuality shared
    private int preparedness;
    // communication shared
    private int seriousness;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum FeedbackTargetRole {
        TEACHER, // Learner is rating a Teacher
        LEARNER  // Teacher is rating a Learner
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }
    public Long getFromUserId() { return fromUserId; }
    public void setFromUserId(Long fromUserId) { this.fromUserId = fromUserId; }
    public Long getToUserId() { return toUserId; }
    public void setToUserId(Long toUserId) { this.toUserId = toUserId; }
    public FeedbackTargetRole getTargetRole() { return targetRole; }
    public void setTargetRole(FeedbackTargetRole targetRole) { this.targetRole = targetRole; }
    public double getOverallRating() { return overallRating; }
    public void setOverallRating(double overallRating) { this.overallRating = overallRating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public int getTeachingQuality() { return teachingQuality; }
    public void setTeachingQuality(int teachingQuality) { this.teachingQuality = teachingQuality; }
    public int getClarity() { return clarity; }
    public void setClarity(int clarity) { this.clarity = clarity; }
    public int getPunctuality() { return punctuality; }
    public void setPunctuality(int punctuality) { this.punctuality = punctuality; }
    public int getCommunication() { return communication; }
    public void setCommunication(int communication) { this.communication = communication; }
    public int getHelpfulness() { return helpfulness; }
    public void setHelpfulness(int helpfulness) { this.helpfulness = helpfulness; }
    public int getEngagement() { return engagement; }
    public void setEngagement(int engagement) { this.engagement = engagement; }
    public int getPreparedness() { return preparedness; }
    public void setPreparedness(int preparedness) { this.preparedness = preparedness; }
    public int getSeriousness() { return seriousness; }
    public void setSeriousness(int seriousness) { this.seriousness = seriousness; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
