package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String priority; // HIGH PRIORITY, MEDIUM PRIORITY, LOW PRIORITY

    @Column(nullable = false)
    private String category; // HARASSMENT, POTENTIAL SCAM, INAPPROPRIATE CONTENT

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Long reporterId; // The user who reported

    @Column(nullable = false)
    private Long reportedId; // The offending user

    @Column(nullable = false)
    private String color; // red, purple, gray

    @Column(nullable = false)
    private String status; // PENDING, RESOLVED

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Report() {}

    public Report(String priority, String category, String title, String description, Long reporterId, Long reportedId, String color, String status) {
        this.priority = priority;
        this.category = category;
        this.title = title;
        this.description = description;
        this.reporterId = reporterId;
        this.reportedId = reportedId;
        this.color = color;
        this.status = status;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getReporterId() { return reporterId; }
    public void setReporterId(Long reporterId) { this.reporterId = reporterId; }

    public Long getReportedId() { return reportedId; }
    public void setReportedId(Long reportedId) { this.reportedId = reportedId; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
