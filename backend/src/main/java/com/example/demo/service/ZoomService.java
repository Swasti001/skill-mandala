package com.example.demo.service;

import com.example.demo.model.Session;
import com.example.demo.model.ZoomMeeting;
import com.example.demo.repository.SessionRepository;
import com.example.demo.repository.ZoomMeetingRepository;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class ZoomService {

    private final ZoomMeetingRepository zoomRepo;
    private final SessionRepository sessionRepo;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${zoom.client.id}")
    private String clientId;

    @Value("${zoom.client.secret}")
    private String clientSecret;

    @Value("${zoom.account.id}")
    private String accountId;

    private final String zoomApiUrl = "https://api.zoom.us/v2";

    public ZoomService(ZoomMeetingRepository zoomRepo, SessionRepository sessionRepo) {
        this.zoomRepo = zoomRepo;
        this.sessionRepo = sessionRepo;
    }

    // 🔥 CREATE ZOOM MEETING (Isolated per Session)
    public synchronized ZoomMeeting createMeeting(Long sessionId, Long userId) {
        // 1. Check if an active meeting already exists to prevent duplicate/conflicting creation
        return zoomRepo.findBySessionIdAndStatus(sessionId, ZoomMeeting.ZoomStatus.ACTIVE)
                .orElseGet(() -> {
                    try {
                        return createNewZoomMeetingInstance(sessionId, userId);
                    } catch (Exception e) {
                        throw new RuntimeException("Could not create Zoom instance", e);
                    }
                });
    }

    private ZoomMeeting createNewZoomMeetingInstance(Long sessionId, Long userId) {
        String token = getAccessToken();
        if (token == null) {
            throw new RuntimeException("Failed to authenticate with Zoom. Check your Server-to-Server credentials.");
        }

        String url = zoomApiUrl + "/users/np03cs4a230502@heraldcollege.edu.np/meetings";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // ✅ Robust ISO-8601 Formatting
        String startTime = java.time.ZonedDateTime.now().plusMinutes(2)
                                .format(java.time.format.DateTimeFormatter.ISO_INSTANT);

        Map<String, Object> body = new HashMap<>();
        body.put("topic", "Skill Mandala Session (ID: " + sessionId + ")");
        body.put("type", 2);
        body.put("start_time", startTime);
        body.put("duration", 60);

        body.put("settings", Map.of(
                "join_before_host", true,
                "jbh_time", 0,
                "waiting_room", false,
                "host_video", true,
                "participant_video", true
        ));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            System.out.println("🚀 CALLING ZOOM API FOR SESSION " + sessionId);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.CREATED && response.getBody() != null) {
                Map respBody = response.getBody();
                String meetingId = String.valueOf(respBody.get("id"));
                String joinUrl = (String) respBody.get("join_url");

                ZoomMeeting zoom = new ZoomMeeting();
                zoom.setSessionId(sessionId);
                zoom.setMeetingId(meetingId);
                zoom.setJoinUrl(joinUrl);
                zoom.setStartTime(java.time.LocalDateTime.now());
                zoom.setCreatedBy(userId);
                zoom.setStatus(ZoomMeeting.ZoomStatus.ACTIVE);

                ZoomMeeting saved = zoomRepo.save(zoom);
                
                // Update session state
                sessionRepo.findById(sessionId).ifPresent(s -> {
                    s.setStatus(Session.SessionStatus.ACTIVE);
                    sessionRepo.save(s);
                });
                
                return saved;
            } else {
                throw new RuntimeException("Zoom rejected meeting creation: " + response.getStatusCode());
            }
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            System.out.println("❌ ZOOM ERROR RESPONSE: " + e.getResponseBodyAsString());
            throw new RuntimeException("Zoom API Error: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            System.out.println("❌ INTERNAL ZOOM ERROR: " + e.getMessage());
            throw new RuntimeException("Internal Zoom Error", e);
        }
    }

    // 🔥 GET ACCESS TOKEN (Server-to-Server OAuth)
    private String getAccessToken() {
        try {
            if (clientId == null || clientSecret == null || accountId == null) {
                System.out.println("❌ ZOOM ERROR: Credentials missing in Environment Variables!");
                return null;
            }

            String url = "https://zoom.us/oauth/token?grant_type=account_credentials&account_id=" + accountId;

            HttpHeaders headers = new HttpHeaders();
            headers.setBasicAuth(clientId, clientSecret);
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return (String) response.getBody().get("access_token");
            } else {
                System.out.println("❌ ZOOM TOKEN REJECTED: " + response.getStatusCode());
                return null;
            }

        } catch (Exception e) {
            System.out.println("❌ ZOOM OAUTH EXCEPTION: " + e.getMessage());
            return null;
        }
    }

    public ZoomMeeting getMeetingBySessionId(Long sessionId) {
        return zoomRepo.findBySessionId(sessionId).orElse(null);
    }
}