package com.example.demo.controller;

import com.example.demo.model.Report;
import com.example.demo.model.User;
import com.example.demo.repository.ReportRepository;
import com.example.demo.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportRepository reportRepository;
    private final UserService userService;

    public ReportController(ReportRepository reportRepository, UserService userService) {
        this.reportRepository = reportRepository;
        this.userService = userService;
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

            return ResponseEntity.ok(Map.of(
                "message", "Report submitted successfully. Our safety team will review it shortly.",
                "id", report.getId()
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to submit report. Please try again later."));
        }
    }
}
