package com.example.demo.dto;

public class FeedbackDTO {
    private Long sessionId;
    private String comment;
    
    // Teacher specific (0-5)
    private Integer teachingQuality;
    private Integer clarity;
    private Integer helpfulness;
    
    // Learner specific (0-5)
    private Integer engagement;
    private Integer preparedness;
    private Integer seriousness;
    
    // Common
    private Integer punctuality;
    private Integer communication;

    // Getters and Setters
    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public Integer getTeachingQuality() { return teachingQuality; }
    public void setTeachingQuality(Integer teachingQuality) { this.teachingQuality = teachingQuality; }
    public Integer getClarity() { return clarity; }
    public void setClarity(Integer clarity) { this.clarity = clarity; }
    public Integer getHelpfulness() { return helpfulness; }
    public void setHelpfulness(Integer helpfulness) { this.helpfulness = helpfulness; }
    public Integer getEngagement() { return engagement; }
    public void setEngagement(Integer engagement) { this.engagement = engagement; }
    public Integer getPreparedness() { return preparedness; }
    public void setPreparedness(Integer preparedness) { this.preparedness = preparedness; }
    public Integer getSeriousness() { return seriousness; }
    public void setSeriousness(Integer seriousness) { this.seriousness = seriousness; }
    public Integer getPunctuality() { return punctuality; }
    public void setPunctuality(Integer punctuality) { this.punctuality = punctuality; }
    public Integer getCommunication() { return communication; }
    public void setCommunication(Integer communication) { this.communication = communication; }
}
