package com.example.demo.controller;

import com.example.demo.model.Report;
import com.example.demo.model.User;
import com.example.demo.repository.ReportRepository;
import com.example.demo.service.UserService;
import com.example.demo.service.NotificationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportRepository reportRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    public ReportController(ReportRepository reportRepository, UserService userService, NotificationService notificationService) {
        this.reportRepository = reportRepository;
        this.userService = userService;
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<?> submitReport(HttpServletRequest request, @RequestBody Map<String, Object> body) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Authentication required"));
            }

            User reporter = userService.getUserFromToken(authHeader);
            if (reporter == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid session"));
            }

            Long reportedId = Long.valueOf(body.get("reportedId").toString());
            String category = (String) body.get("category");
            String description = (String) body.get("description");
            String title = (String) body.getOrDefault("title", "User Report: " + category);
            String priority = (String) body.getOrDefault("priority", "MEDIUM PRIORITY");

            // Logic to determine color based on category/priority
            String color = "gray";
            if ("HIGH PRIORITY".equals(priority) || "HARASSMENT".equals(category)) {
                color = "red";
            } else if ("POTENTIAL SCAM".equals(category)) {
                color = "purple";
            }

            Report report = new Report(
                priority,
                category,
                title,
                description,
                reporter.getId(),
                reportedId,
                color,
                "PENDING"
            );

            if (body.containsKey("relatedEntity") && body.get("relatedEntity") != null) {
                report.setRelatedEntity((String) body.get("relatedEntity"));
            } else {
                report.setRelatedEntity("User Profile of Reported User");
            }

            if (body.containsKey("reporterEvidence") && body.get("reporterEvidence") != null) {
                report.setReporterEvidence((String) body.get("reporterEvidence"));
            }

            reportRepository.save(report);

            // Automatically notify the reported user of the claim anonymously
            String message = "A safety report (ID: #" + report.getId() + ") has been filed against you for: " + category + ". Please click here to submit your explanation.";
            notificationService.createNotification(
                message,
                "SAFETY_REPORT",
                null, // senderId is null to preserve reporter anonymity at all times
                reportedId
            );

            return ResponseEntity.ok(Map.of(
                "message", "Report submitted successfully. Our safety team will review it shortly.",
                "id", report.getId()
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to submit report. Please try again later."));
        }
    }

    @GetMapping("/{id}/dispute")
    public ResponseEntity<?> getDisputeDetails(HttpServletRequest request, @PathVariable("id") Long id) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Authentication required"));
            }

            User user = userService.getUserFromToken(authHeader);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid session"));
            }

            Report report = reportRepository.findById(id).orElse(null);
            if (report == null) {
                return ResponseEntity.notFound().build();
            }

            // Secure access: only the reported user can view this dispute details page!
            if (!report.getReportedId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Forbidden access"));
            }

            // Create a clean, anonymous map of the report to protect the reporter's identity entirely
            Map<String, Object> anonymousReport = Map.of(
                "id", report.getId(),
                "category", report.getCategory(),
                "title", report.getTitle(),
                "description", report.getDescription(),
                "relatedEntity", report.getRelatedEntity() != null ? report.getRelatedEntity() : "User Profile",
                "status", report.getStatus(),
                "createdAt", report.getCreatedAt().toString(),
                "reportedResponse", report.getReportedResponse() != null ? report.getReportedResponse() : "",
                "reportedEvidence", report.getReportedEvidence() != null ? report.getReportedEvidence() : ""
            );

            return ResponseEntity.ok(anonymousReport);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to retrieve dispute details"));
        }
    }

    @PutMapping("/{id}/respond")
    public ResponseEntity<?> submitDisputeResponse(HttpServletRequest request, @PathVariable("id") Long id, @RequestBody Map<String, Object> body) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Authentication required"));
            }

            User user = userService.getUserFromToken(authHeader);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid session"));
            }

            Report report = reportRepository.findById(id).orElse(null);
            if (report == null) {
                return ResponseEntity.notFound().build();
            }

            // Secure access: only the reported user can submit a response to this report!
            if (!report.getReportedId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Forbidden access"));
            }

            String response = (String) body.get("reportedResponse");
            String evidence = (String) body.get("reportedEvidence");

            if (response == null || response.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Response statement is required"));
            }

            report.setReportedResponse(response);
            if (evidence != null) {
                report.setReportedEvidence(evidence);
            }

            // Automatically transition status to UNDER_REVIEW so the admin moderation room shows it
            if ("PENDING".equals(report.getStatus())) {
                report.setStatus("UNDER_REVIEW");
            }

            reportRepository.save(report);

            return ResponseEntity.ok(Map.of(
                "message", "Your response has been securely submitted to the moderation team. Thank you for your cooperation.",
                "report", Map.of(
                    "id", report.getId(),
                    "status", report.getStatus(),
                    "reportedResponse", report.getReportedResponse(),
                    "reportedEvidence", report.getReportedEvidence() != null ? report.getReportedEvidence() : ""
                )
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to submit response"));
        }
    }
}
