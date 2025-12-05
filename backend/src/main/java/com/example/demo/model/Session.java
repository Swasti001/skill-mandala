/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
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
@Table(name="sessions")
public class Session {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private Long userA;
    private Long userB;
    private String skillsToLearn;
    private String skillsToTeach;
    private LocalDateTime sessionDate;
    private String mode;
    private String topic;
    private Integer duration;
    @Enumerated(value=EnumType.STRING)
    private SessionStatus status;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = SessionStatus.PENDING;
        }
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserA() {
        return this.userA;
    }

    public void setUserA(Long userA) {
        this.userA = userA;
    }

    public Long getUserB() {
        return this.userB;
    }

    public void setUserB(Long userB) {
        this.userB = userB;
    }

    public String getSkillsToLearn() {
        return this.skillsToLearn;
    }

    public void setSkillsToLearn(String skillsToLearn) {
        this.skillsToLearn = skillsToLearn;
    }

    public String getSkillsToTeach() {
        return this.skillsToTeach;
    }

    public void setSkillsToTeach(String skillsToTeach) {
        this.skillsToTeach = skillsToTeach;
    }

    public LocalDateTime getSessionDate() {
        return this.sessionDate;
    }

    public void setSessionDate(LocalDateTime sessionDate) {
        this.sessionDate = sessionDate;
    }

    public String getMode() {
        return this.mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public SessionStatus getStatus() {
        return this.status;
    }

    public void setStatus(SessionStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
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

    public static enum SessionStatus {
        PENDING,
        ACCEPTED,
        MATCHED,
        ACTIVE,
        COMPLETED,
        CANCELLED,
        DECLINED,
        BOOKED;
    }
}

