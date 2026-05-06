package com.example.demo.dto;

import java.util.List;
import java.util.Map;

public class UserProfileUpdateDTO {
    private String name;
    private String bio;
    private String profilePictureUrl;
    private List<String> teachSkills;
    private List<String> learnSkills;
    private List<String> portfolioImages;
    private String email;
    private String phone;
    private Map<String, String> teachAvailability;
    private Map<String, String> learnAvailability;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    
    public String getProfilePictureUrl() { return profilePictureUrl; }
    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }
    
    public List<String> getTeachSkills() { return teachSkills; }
    public void setTeachSkills(List<String> teachSkills) { this.teachSkills = teachSkills; }
    
    public List<String> getLearnSkills() { return learnSkills; }
    public void setLearnSkills(List<String> learnSkills) { this.learnSkills = learnSkills; }

    public List<String> getPortfolioImages() { return portfolioImages; }
    public void setPortfolioImages(List<String> portfolioImages) { this.portfolioImages = portfolioImages; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Map<String, String> getTeachAvailability() { return teachAvailability; }
    public void setTeachAvailability(Map<String, String> teachAvailability) { this.teachAvailability = teachAvailability; }

    public Map<String, String> getLearnAvailability() { return learnAvailability; }
    public void setLearnAvailability(Map<String, String> learnAvailability) { this.learnAvailability = learnAvailability; }
}
