/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.springframework.http.ResponseEntity
 *  org.springframework.web.bind.annotation.CrossOrigin
 *  org.springframework.web.bind.annotation.GetMapping
 *  org.springframework.web.bind.annotation.PathVariable
 *  org.springframework.web.bind.annotation.RequestMapping
 *  org.springframework.web.bind.annotation.RestController
 */
package com.example.demo.controller;

import com.example.demo.dto.MatchCardDTO;
import com.example.demo.dto.SessionCardDTO;
import com.example.demo.dto.UserDashboardDTO;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.MatchRepository;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.service.MatchService;
import com.example.demo.service.SessionService;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value={"/api/user/dashboard"})
@CrossOrigin(origins={"http://localhost:3000"})
public class UserDashboardController {
    private final MatchService matchService;
    private final SessionService sessionService;
    private final UserRepository userRepository;
    private final MatchRepository matchRepository;
    private final NotificationRepository notificationRepository;

    public UserDashboardController(MatchService matchService, SessionService sessionService, UserRepository userRepository, MatchRepository matchRepository, NotificationRepository notificationRepository) {
        this.matchService = matchService;
        this.sessionService = sessionService;
        this.userRepository = userRepository;
        this.matchRepository = matchRepository;
        this.notificationRepository = notificationRepository;
    }

    @GetMapping(value={"/{userId}"})
    public ResponseEntity<UserDashboardDTO> getDashboard(@PathVariable(value="userId") Long userId) {
        User user = this.userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        UserDashboardDTO dashboard = new UserDashboardDTO();
        List<SessionCardDTO> allSessions = this.sessionService.getUserSessions(userId);
        long pending = allSessions.stream().filter(s -> "PENDING".equals(s.getStatus())).count();
        long active = allSessions.stream().filter(s -> "ACCEPTED".equals(s.getStatus())).count();
        long totalMatches = this.matchRepository.countByUser(userId);
        HashMap<String, Object> stats = new HashMap<String, Object>();
        stats.put("matchCount", totalMatches);
        stats.put("pendingRequests", pending);
        stats.put("activeSessions", active);
        stats.put("credits", user.getCredits());
        stats.put("xp", user.getXp());
        stats.put("level", user.getLevel());
        stats.put("streak", user.getStreak());
        stats.put("teachingReputation", user.getTeachingReputation());
        stats.put("learningReputation", user.getLearningReputation());
        stats.put("totalTeachingSessions", user.getTotalTeachingSessions());
        stats.put("totalLearningSessions", user.getTotalLearningSessions());
        
        dashboard.setStats(stats);

        // Fetch Notifications
        dashboard.setNotifications(notificationRepository.findByReceiverIdOrderByCreatedAtDesc(userId).stream().limit(5).collect(Collectors.toList()));

        // Generate Badges based on stats
        List<String> badges = new ArrayList<>();
        if (user.getTeachingReputation() >= 4.5 && user.getTotalTeachingSessions() > 5) badges.add("Master Guru");
        if (user.getTotalLearningSessions() > 5) badges.add("Knowledge Seeker");
        if (user.getStreak() >= 7) badges.add("Consistency King");
        if (user.getCredits() > 500) badges.add("Credit Whale");
        dashboard.setBadges(badges);

        List<MatchCardDTO> potentialMatches = this.matchService.findMatches(userId);
        dashboard.setRecentMatches(potentialMatches.stream().limit(5L).toList());

        // Fetch Today's Sessions vs Upcoming
        String todayStr = java.time.LocalDate.now().toString(); // YYYY-MM-DD
        List<SessionCardDTO> acceptedSessions = allSessions.stream()
            .filter(s -> "ACCEPTED".equals(s.getStatus()))
            .collect(Collectors.toList());

        List<SessionCardDTO> todaySessions = acceptedSessions.stream()
            .filter(s -> s.getDateTime() != null && s.getDateTime().startsWith(todayStr))
            .collect(Collectors.toList());

        List<SessionCardDTO> upcoming = acceptedSessions.stream()
            .filter(s -> s.getDateTime() != null && !s.getDateTime().startsWith(todayStr))
            .limit(5L)
            .toList();

        dashboard.setTodaySessions(todaySessions);
        dashboard.setUpcomingSessions(upcoming);

        List<SessionCardDTO> actionRequired = allSessions.stream().filter(s -> "PENDING".equals(s.getStatus()) && s.isIncoming()).limit(3L).toList();
        dashboard.setPendingIncomingSessions(actionRequired);
        return ResponseEntity.ok(dashboard);
    }
}

