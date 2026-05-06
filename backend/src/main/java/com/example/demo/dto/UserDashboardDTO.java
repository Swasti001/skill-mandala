/*
 * Decompiled with CFR 0.152.
 */
package com.example.demo.dto;

import com.example.demo.dto.MatchCardDTO;
import com.example.demo.dto.SessionCardDTO;
import java.util.List;
import java.util.Map;

public class UserDashboardDTO {
    private Map<String, Object> stats;
    private List<MatchCardDTO> recentMatches;
    private List<SessionCardDTO> upcomingSessions;
    private List<SessionCardDTO> todaySessions;
    private List<SessionCardDTO> pendingIncomingSessions;
    private List<Object> notifications;
    private List<String> badges;

    public List<SessionCardDTO> getTodaySessions() {
        return todaySessions;
    }

    public void setTodaySessions(List<SessionCardDTO> todaySessions) {
        this.todaySessions = todaySessions;
    }

    public List<SessionCardDTO> getPendingIncomingSessions() {
        return this.pendingIncomingSessions;
    }

    public void setPendingIncomingSessions(List<SessionCardDTO> pendingIncomingSessions) {
        this.pendingIncomingSessions = pendingIncomingSessions;
    }

    public Map<String, Object> getStats() {
        return this.stats;
    }

    public void setStats(Map<String, Object> stats) {
        this.stats = stats;
    }

    public List<MatchCardDTO> getRecentMatches() {
        return this.recentMatches;
    }

    public void setRecentMatches(List<MatchCardDTO> recentMatches) {
        this.recentMatches = recentMatches;
    }

    public List<SessionCardDTO> getUpcomingSessions() {
        return this.upcomingSessions;
    }

    public void setUpcomingSessions(List<SessionCardDTO> upcomingSessions) {
        this.upcomingSessions = upcomingSessions;
    }

    public List<Object> getNotifications() {
        return notifications;
    }

    public void setNotifications(List<Object> notifications) {
        this.notifications = notifications;
    }

    public List<String> getBadges() {
        return badges;
    }

    public void setBadges(List<String> badges) {
        this.badges = badges;
    }
}

