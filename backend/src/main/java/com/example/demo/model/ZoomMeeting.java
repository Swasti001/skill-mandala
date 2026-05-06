/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  jakarta.persistence.Column
 *  jakarta.persistence.Entity
 *  jakarta.persistence.EnumType
 *  jakarta.persistence.Enumerated
 *  jakarta.persistence.GeneratedValue
 *  jakarta.persistence.GenerationType
 *  jakarta.persistence.Id
 *  jakarta.persistence.PrePersist
 *  jakarta.persistence.Table
 */
package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name="zoom_meetings")
public class ZoomMeeting {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @Column(name="session_id", nullable=false)
    private Long sessionId;
    @Column(name="meeting_id", nullable=false)
    private String meetingId;
    @Column(name="join_url", length=1000)
    private String joinUrl;
    private LocalDateTime startTime;
    private Long createdBy;
    @Enumerated(value=EnumType.STRING)
    private ZoomStatus status;

    @PrePersist
    protected void onCreate() {
        if (this.status == null) {
            this.status = ZoomStatus.ACTIVE;
        }
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSessionId() {
        return this.sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public String getMeetingId() {
        return this.meetingId;
    }

    public void setMeetingId(String meetingId) {
        this.meetingId = meetingId;
    }

    public String getJoinUrl() {
        return this.joinUrl;
    }

    public void setJoinUrl(String joinUrl) {
        this.joinUrl = joinUrl;
    }

    public LocalDateTime getStartTime() {
        return this.startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public Long getCreatedBy() {
        return this.createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public ZoomStatus getStatus() {
        return this.status;
    }

    public void setStatus(ZoomStatus status) {
        this.status = status;
    }

    public static enum ZoomStatus {
        ACTIVE,
        ENDED;

    }
}

