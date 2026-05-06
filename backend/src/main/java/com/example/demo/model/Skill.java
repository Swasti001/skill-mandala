package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "skills_catalog")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @Column(length = 500)
    private String description;
    
    private String category;
    
    @Column(name = "icon_id")
    private int iconId; // For frontend mapping (0-4 etc)
    
    private String badge; // e.g. "HOT", "NEW", "TRENDING"
    private String badgeColor; // e.g. "bg-pink-500/10 text-pink-400"

    public Skill() {}

    public Skill(String title, String description, String category, int iconId, String badge, String badgeColor) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.iconId = iconId;
        this.badge = badge;
        this.badgeColor = badgeColor;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getIconId() { return iconId; }
    public void setIconId(int iconId) { this.iconId = iconId; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }

    public String getBadgeColor() { return badgeColor; }
    public void setBadgeColor(String badgeColor) { this.badgeColor = badgeColor; }
}
