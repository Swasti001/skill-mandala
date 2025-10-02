package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private LocalDate dob;
    private String phone;
    private String username;
    private String email;

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "role", columnDefinition = "varchar(255) default 'USER'")
    private String role = "USER";

    @Column(name = "status", columnDefinition = "varchar(255) default 'ACTIVE'")
    private String status = "ACTIVE";

    @Column(name = "credits", columnDefinition = "integer default 0")
    private int credits = 0;

    @Column(name = "xp", columnDefinition = "integer default 0")
    private int xp = 0;

    @Column(name = "level", columnDefinition = "integer default 1")
    private int level = 1;

    @Column(name = "streak", columnDefinition = "integer default 0")
    private int streak = 0;

    // Reputation System
    @Column(name = "teaching_reputation", columnDefinition = "double precision default 5.0")
    private double teachingReputation = 5.0;

    @Column(name = "learning_reputation", columnDefinition = "double precision default 5.0")
    private double learningReputation = 5.0;

    @Column(name = "total_teaching_sessions", columnDefinition = "integer default 0")
    private int totalTeachingSessions = 0;

    @Column(name = "total_learning_sessions", columnDefinition = "integer default 0")
    private int totalLearningSessions = 0;

    @Column(name = "mandala_tracker_data", columnDefinition = "text")
    private String mandalaTrackerData;

    // 🔥 TEMPORARY FIELD (from frontend, NOT saved to DB)
    @Transient
    private String password;

    // Required by JPA
    public User() {}

    // ===== GETTERS & SETTERS =====

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }

    // 👇 THIS receives password from frontend
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // 👇 THIS is stored in DB
    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getCredits() {
        return credits;
    }

    public void setCredits(int credits) {
        this.credits = credits;
    }

    public int getXp() { return xp; }
    public void setXp(int xp) { this.xp = xp; }

    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }

    public int getStreak() { return streak; }
    public void setStreak(int streak) { this.streak = streak; }

    public double getTeachingReputation() { return teachingReputation; }
    public void setTeachingReputation(double teachingReputation) { this.teachingReputation = teachingReputation; }

    public double getLearningReputation() { return learningReputation; }
    public void setLearningReputation(double learningReputation) { this.learningReputation = learningReputation; }

    public int getTotalTeachingSessions() { return totalTeachingSessions; }
    public void setTotalTeachingSessions(int totalTeachingSessions) { this.totalTeachingSessions = totalTeachingSessions; }

    public int getTotalLearningSessions() { return totalLearningSessions; }
    public void setTotalLearningSessions(int totalLearningSessions) { this.totalLearningSessions = totalLearningSessions; }

    public String getMandalaTrackerData() { return mandalaTrackerData; }
    public void setMandalaTrackerData(String mandalaTrackerData) { this.mandalaTrackerData = mandalaTrackerData; }
}
