package com.example.demo.controller;

import com.example.demo.exchange.ExchangeRequestStatus;
import com.example.demo.exchange.SkillExchangeRequest;
import com.example.demo.exchange.SkillExchangeRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/user")
public class UserDashboardStatsController {

    @Autowired
    private SkillExchangeRequestRepository exchangeRepo;

    @GetMapping("/{userId}/dashboard-stats")
    public ResponseEntity<?> getDashboardStats(@PathVariable Long userId) {
        try {
            List<SkillExchangeRequest> received = exchangeRepo.findByReceiverIdOrderByCreatedAtDesc(userId);
            long pendingRequests = received.stream()
                .filter(r -> r.getStatus() == ExchangeRequestStatus.PENDING)
                .count();

            List<SkillExchangeRequest> sent = exchangeRepo.findByRequesterIdOrderByCreatedAtDesc(userId);
            
            List<SkillExchangeRequest> allRequests = new ArrayList<>(received);
            allRequests.addAll(sent);

            long skillsTaughtCount = 0;
            long skillsLearnedCount = 0;
            
            List<Map<String, Object>> upcomingSessions = new ArrayList<>();

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE, MMM d").withZone(ZoneId.systemDefault());
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("h:mm a").withZone(ZoneId.systemDefault());

            for (SkillExchangeRequest req : allRequests) {
                boolean isRequester = req.getRequesterId().equals(userId);
                
                if (req.getStatus() == ExchangeRequestStatus.COMPLETED) {
                    skillsTaughtCount++; 
                    skillsLearnedCount++; 
                }

                if (req.getStatus() == ExchangeRequestStatus.ACCEPTED) {
                    Map<String, Object> session = new HashMap<>();
                    session.put("id", req.getId());
                    session.put("date", formatter.format(req.getCreatedAt()));
                    session.put("time", timeFormatter.format(req.getCreatedAt()));
                    
                    if (isRequester) {
                        session.put("role", "Learning");
                        session.put("skill", req.getRequesterLearns());
                    } else {
                        session.put("role", "Teaching");
                        session.put("skill", req.getRequesterLearns()); 
                    }
                    upcomingSessions.add(session);
                }
            }

            Map<String, Object> res = new HashMap<>();
            res.put("pendingRequests", pendingRequests);
            res.put("skillsTaughtCount", skillsTaughtCount);
            res.put("skillsLearnedCount", skillsLearnedCount);
            res.put("upcomingSessions", upcomingSessions.stream().limit(3).toList());

            return ResponseEntity.ok(res);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("message", "Error calculating user stats"));
        }
    }
}
