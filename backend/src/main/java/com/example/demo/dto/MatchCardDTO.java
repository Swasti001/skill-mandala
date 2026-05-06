package com.example.demo.dto;

import java.util.List;

public class MatchCardDTO {
    private Long userId;
    private String name;
    private String profilePictureUrl;
    private String location;
    private String mode;

    // A learns from B
    private List<String> theyTeachYou;

    // B learns from A
    private List<String> theyLearnFromYou;

    // e.g. ["Mon Evening", "Wed Morning"]
    private List<String> overlapSlots;

    private int score;
    private double teachingReputation;
    private double learningReputation;
    private int totalSessions;

    public double getTeachingReputation() { return teachingReputation; }
    public void setTeachingReputation(double teachingReputation) { this.teachingReputation = teachingReputation; }
    public double getLearningReputation() { return learningReputation; }
    public void setLearningReputation(double learningReputation) { this.learningReputation = learningReputation; }
    public int getTotalSessions() { return totalSessions; }
    public void setTotalSessions(int totalSessions) { this.totalSessions = totalSessions; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getProfilePictureUrl() { return profilePictureUrl; }
    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public List<String> getTheyTeachYou() { return theyTeachYou; }
    public void setTheyTeachYou(List<String> theyTeachYou) { this.theyTeachYou = theyTeachYou; }

    public List<String> getTheyLearnFromYou() { return theyLearnFromYou; }
    public void setTheyLearnFromYou(List<String> theyLearnFromYou) { this.theyLearnFromYou = theyLearnFromYou; }

    public List<String> getOverlapSlots() { return overlapSlots; }
    public void setOverlapSlots(List<String> overlapSlots) { this.overlapSlots = overlapSlots; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
}
