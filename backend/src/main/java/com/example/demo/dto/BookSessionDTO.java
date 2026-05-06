package com.example.demo.dto;

public class BookSessionDTO {
    private Long teacherId;
    private String teacherName;
    private String dateTime;      // ISO format: "2026-04-25T14:30:00"
    private int duration;         // In minutes: 30, 60, 90
    private String topic;
    private Long conversationId;  // Optional: to send confirmation in chat

    public BookSessionDTO() {}

    public Long getTeacherId() { return teacherId; }
    public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }

    public String getTeacherName() { return teacherName; }
    public void setTeacherName(String teacherName) { this.teacherName = teacherName; }

    public String getDateTime() { return dateTime; }
    public void setDateTime(String dateTime) { this.dateTime = dateTime; }

    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public Long getConversationId() { return conversationId; }
    public void setConversationId(Long conversationId) { this.conversationId = conversationId; }
}
