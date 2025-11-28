/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  jakarta.persistence.Column
 *  jakarta.persistence.Entity
 *  jakarta.persistence.GeneratedValue
 *  jakarta.persistence.GenerationType
 *  jakarta.persistence.Id
 *  jakarta.persistence.PrePersist
 *  jakarta.persistence.Table
 */
package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name="matches")
public class Match {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false)
    private Long user1Id;
    @Column(nullable=false)
    private Long user2Id;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUser1Id() {
        return this.user1Id;
    }

    public void setUser1Id(Long user1Id) {
        this.user1Id = user1Id;
    }

    public Long getUser2Id() {
        return this.user2Id;
    }

    public void setUser2Id(Long user2Id) {
        this.user2Id = user2Id;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    private Integer user1TeachingGoal;
    private Integer user1TeachingCompleted = 0;
    
    private Integer user2TeachingGoal;
    private Integer user2TeachingCompleted = 0;

    public Integer getUser1TeachingGoal() {
        return user1TeachingGoal;
    }

    public void setUser1TeachingGoal(Integer user1TeachingGoal) {
        this.user1TeachingGoal = user1TeachingGoal;
    }

    public Integer getUser1TeachingCompleted() {
        return user1TeachingCompleted;
    }

    public void setUser1TeachingCompleted(Integer user1TeachingCompleted) {
        this.user1TeachingCompleted = user1TeachingCompleted;
    }

    public Integer getUser2TeachingGoal() {
        return user2TeachingGoal;
    }

    public void setUser2TeachingGoal(Integer user2TeachingGoal) {
        this.user2TeachingGoal = user2TeachingGoal;
    }

    public Integer getUser2TeachingCompleted() {
        return user2TeachingCompleted;
    }

    public void setUser2TeachingCompleted(Integer user2TeachingCompleted) {
        this.user2TeachingCompleted = user2TeachingCompleted;
    }

    private String user1TeachingSubject;
    private String user2TeachingSubject;

    public String getUser1TeachingSubject() {
        return user1TeachingSubject;
    }

    public void setUser1TeachingSubject(String user1TeachingSubject) {
        this.user1TeachingSubject = user1TeachingSubject;
    }

    public String getUser2TeachingSubject() {
        return user2TeachingSubject;
    }

    public void setUser2TeachingSubject(String user2TeachingSubject) {
        this.user2TeachingSubject = user2TeachingSubject;
    }
}

