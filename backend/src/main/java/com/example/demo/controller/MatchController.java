package com.example.demo.controller;

import com.example.demo.dto.MatchActionRequest;
import com.example.demo.dto.MatchCardDTO;
import com.example.demo.dto.MatchResultDTO;
import com.example.demo.service.MatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/matches")
@CrossOrigin(originPatterns = "*")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<MatchCardDTO>> matches(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(matchService.findMatches(userId));
    }

    @GetMapping("/mutual/{userId}")
    public ResponseEntity<List<MatchCardDTO>> getMutualMatches(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(matchService.getMutualMatches(userId));
    }

    @PostMapping("/{actionType}")
    public ResponseEntity<MatchResultDTO> handleAction(
            @PathVariable("actionType") String actionType,
            @RequestBody MatchActionRequest request
    ) {
        return ResponseEntity.ok(matchService.handleMatchAction(
                actionType,
                request.getFromUser(),
                request.getToUser()
        ));
    }
    @PostMapping("/agreement")
    public ResponseEntity<?> setAgreement(@RequestBody com.example.demo.dto.MatchAgreementRequest request) {
        matchService.updateMatchAgreement(request.getTeacherId(), request.getLearnerId(), request.getGoal(), request.getSubject());
        return ResponseEntity.ok().build();
    }
}
