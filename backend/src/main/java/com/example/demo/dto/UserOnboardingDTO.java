// src/main/java/com/example/demo/dto/UserOnboardingDTO.java
package com.example.demo.dto;

import java.util.List;
import java.util.Map;

public class UserOnboardingDTO {

    private String bio;
    private String location;
    private String experience;
    private String mode;

    private List<String> teachSkills;
    private List<String> learnSkills;

    // Separate availability fields
    private Map<String, String> teachAvailability;
    private Map<String, String> learnAvailability;

    private String userId; // UUID as string

    // Getters and Setters

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

    public List<String> getTeachSkills() {
        return teachSkills;
    }

    public void setTeachSkills(List<String> teachSkills) {
        this.teachSkills = teachSkills;
    }

    public List<String> getLearnSkills() {
        return learnSkills;
    }

    public void setLearnSkills(List<String> learnSkills) {
        this.learnSkills = learnSkills;
    }

    public Map<String, String> getTeachAvailability() {
        return teachAvailability;
    }

    public void setTeachAvailability(Map<String, String> teachAvailability) {
        this.teachAvailability = teachAvailability;
    }

    public Map<String, String> getLearnAvailability() {
        return learnAvailability;
    }

    public void setLearnAvailability(Map<String, String> learnAvailability) {
        this.learnAvailability = learnAvailability;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}