package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "system_settings")
@Data
public class SystemSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Platform Identity
    private String platformName = "Skill Mandala";
    private String supportEmail = "ops@skillmandala.io";

    // Algorithm Parameters
    private int skillRelevanceWeight = 85;
    private int proximityBias = 40;
    private String matchingApiKey = "sk_live_1234567890abcdef";
    private String matchingAlgorithm = "Neural Collaborative Filtering v2.1";

    // Platform Rules Toggles
    private boolean publicDirectory = true;
    private boolean autoModeration = true;
    private boolean strictVerification = false;

    // Notifications
    private boolean dailyDigests = true;
    private boolean matchingAlerts = true;
    private boolean marketingUpdates = false;

    // UI and System
    private String announcementHtml = "Welcome to the <span class=\"text-[#c8a8ff] font-bold\">Q4 Upgrade</span> of Skill Mandala.";
}
