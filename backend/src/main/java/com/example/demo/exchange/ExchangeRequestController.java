package com.example.demo.exchange;

import com.example.demo.dto.CreateExchangeRequestDTO;
import com.example.demo.service.ExchangeRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/exchange-requests")
@CrossOrigin(origins = "http://localhost:3000")
public class ExchangeRequestController {

    private final ExchangeRequestService exchangeRequestService;

    public ExchangeRequestController(ExchangeRequestService exchangeRequestService) {
        this.exchangeRequestService = exchangeRequestService;
    }

    @PostMapping("/{requesterId}")
    public ResponseEntity<?> sendConnectRequest(
            @PathVariable Long requesterId,
            @RequestBody CreateExchangeRequestDTO dto
    ) {
        try {
            SkillExchangeRequest created =
                    exchangeRequestService.createPendingRequest(requesterId, dto);

            return ResponseEntity.ok(created);

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/received/{receiverId}")
    public ResponseEntity<?> getReceivedRequests(@PathVariable Long receiverId) {
        return ResponseEntity.ok(
                exchangeRequestService.getReceivedRequests(receiverId)
        );
    }

    @GetMapping("/sent/{requesterId}")
    public ResponseEntity<?> getSentRequests(@PathVariable Long requesterId) {
        return ResponseEntity.ok(
                exchangeRequestService.getSentRequests(requesterId)
        );
    }

    @PutMapping("/{requestId}/accept/{receiverId}")
    public ResponseEntity<?> acceptRequest(
            @PathVariable Long requestId,
            @PathVariable Long receiverId
    ) {
        return ResponseEntity.ok(
                exchangeRequestService.acceptRequest(requestId, receiverId)
        );
    }

    @PutMapping("/{requestId}/reject/{receiverId}")
    public ResponseEntity<?> rejectRequest(
            @PathVariable Long requestId,
            @PathVariable Long receiverId
    ) {
        return ResponseEntity.ok(
                exchangeRequestService.rejectRequest(requestId, receiverId)
        );
    }

    @PutMapping("/{requestId}/cancel/{requesterId}")
    public ResponseEntity<?> cancelRequest(
            @PathVariable Long requestId,
            @PathVariable Long requesterId
    ) {
        return ResponseEntity.ok(
                exchangeRequestService.cancelRequest(requestId, requesterId)
        );
    }
}