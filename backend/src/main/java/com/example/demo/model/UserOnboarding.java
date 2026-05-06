package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_onboarding")
public class UserOnboarding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link directly to User entity
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(name = "bio")
    private String bio;

    @Column(name = "location")
    private String location;

    @Column(name = "experience")
    private String experience;

    @Column(name = "mode")
    private String mode;

    @Column(name = "teach_skills", columnDefinition = "TEXT")
    private String teachSkills; // JSON string

    @Column(name = "learn_skills", columnDefinition = "TEXT")
    private String learnSkills; // JSON string

    // NEW separate availability fields
    @Column(name = "teach_availability", columnDefinition = "TEXT")
    private String teachAvailability;

    @Column(name = "learn_availability", columnDefinition = "TEXT")
    private String learnAvailability;

    @Column(name = "portfolio_images", columnDefinition = "TEXT")
    private String portfolioImages; // JSON string array

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public String getTeachSkills() {
        return teachSkills;
    }

    public void setTeachSkills(String teachSkills) {
        this.teachSkills = teachSkills;
    }

    public String getLearnSkills() {
        return learnSkills;
    }

    public void setLearnSkills(String learnSkills) {
        this.learnSkills = learnSkills;
    }

    public String getTeachAvailability() {
        return teachAvailability;
    }

    public void setTeachAvailability(String teachAvailability) {
        this.teachAvailability = teachAvailability;
    }

    public String getLearnAvailability() {
        return learnAvailability;
    }

    public void setLearnAvailability(String learnAvailability) {
        this.learnAvailability = learnAvailability;
    }

    public String getPortfolioImages() {
        return portfolioImages;
    }

    public void setPortfolioImages(String portfolioImages) {
        this.portfolioImages = portfolioImages;
    }
}