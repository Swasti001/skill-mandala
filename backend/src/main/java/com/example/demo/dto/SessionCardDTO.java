/*
 * Decompiled with CFR 0.152.
 */
package com.example.demo.dto;

import java.util.List;

public class SessionCardDTO {
    private Long sessionId;
    private Long otherUserId;
    private String otherUserName;
    private String otherUserProfilePictureUrl;
    private List<String> youLearn;
    private List<String> youTeach;
    private String dateTime;
    private String mode;
    private String status;
    private boolean incoming;
    private boolean hasZoomMeeting;
    private String zoomMeetingId;
    private boolean isHost;
    private String topic;
    private Integer duration;
    private boolean feedbackSubmitted;

    public boolean isFeedbackSubmitted() {
        return this.feedbackSubmitted;
    }

    public void setFeedbackSubmitted(boolean feedbackSubmitted) {
        this.feedbackSubmitted = feedbackSubmitted;
    }

    public boolean isIncoming() {
        return this.incoming;
    }

    public void setIncoming(boolean incoming) {
        this.incoming = incoming;
    }

    public Long getSessionId() {
        return this.sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public Long getOtherUserId() {
        return this.otherUserId;
    }

    public void setOtherUserId(Long otherUserId) {
        this.otherUserId = otherUserId;
    }

    public String getOtherUserName() {
        return this.otherUserName;
    }

    public void setOtherUserName(String otherUserName) {
        this.otherUserName = otherUserName;
    }

    public String getOtherUserProfilePictureUrl() {
        return this.otherUserProfilePictureUrl;
    }

    public void setOtherUserProfilePictureUrl(String otherUserProfilePictureUrl) {
        this.otherUserProfilePictureUrl = otherUserProfilePictureUrl;
    }

    public List<String> getYouLearn() {
        return this.youLearn;
    }

    public void setYouLearn(List<String> youLearn) {
        this.youLearn = youLearn;
    }

    public List<String> getYouTeach() {
        return this.youTeach;
    }

    public void setYouTeach(List<String> youTeach) {
        this.youTeach = youTeach;
    }

    public String getDateTime() {
        return this.dateTime;
    }

    public void setDateTime(String dateTime) {
        this.dateTime = dateTime;
    }

    public String getMode() {
        return this.mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isHasZoomMeeting() {
        return this.hasZoomMeeting;
    }

    public void setHasZoomMeeting(boolean hasZoomMeeting) {
        this.hasZoomMeeting = hasZoomMeeting;
    }

    public String getZoomMeetingId() {
        return this.zoomMeetingId;
    }

    public void setZoomMeetingId(String zoomMeetingId) {
        this.zoomMeetingId = zoomMeetingId;
    }

    public boolean isHost() {
        return this.isHost;
    }

    public void setHost(boolean isHost) {
        this.isHost = isHost;
    }

    public String getTopic() {
        return this.topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public Integer getDuration() {
        return this.duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }
}

