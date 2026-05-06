package com.example.demo.service;

import com.example.demo.dto.CreateExchangeRequestDTO;
import com.example.demo.exchange.ExchangeRequestStatus;
import com.example.demo.exchange.SkillExchangeRequest;
import com.example.demo.exchange.SkillExchangeRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExchangeRequestService {

    private final SkillExchangeRequestRepository requestRepo;

    public ExchangeRequestService(SkillExchangeRequestRepository requestRepo) {
        this.requestRepo = requestRepo;
    }

    // ---------------------------------------------------
    // 1. Create new exchange request
    // ---------------------------------------------------
    public SkillExchangeRequest createPendingRequest(Long requesterId, CreateExchangeRequestDTO dto) {

        if (requesterId == null) {
            throw new IllegalArgumentException("requesterId is required");
        }

        if (dto == null) {
            throw new IllegalArgumentException("body is required");
        }

        if (dto.getReceiverId() == null) {
            throw new IllegalArgumentException("receiverId is required");
        }

        if (requesterId.equals(dto.getReceiverId())) {
            throw new IllegalArgumentException("You cannot connect with yourself");
        }

        if (dto.getRequesterTeaches() == null || dto.getRequesterTeaches().isBlank()) {
            throw new IllegalArgumentException("requesterTeaches is required");
        }

        if (dto.getRequesterLearns() == null || dto.getRequesterLearns().isBlank()) {
            throw new IllegalArgumentException("requesterLearns is required");
        }

        String teaches = dto.getRequesterTeaches().trim();
        String learns = dto.getRequesterLearns().trim();

        // Prevent duplicate PENDING requests
        return requestRepo
                .findFirstByRequesterIdAndReceiverIdAndRequesterTeachesAndRequesterLearnsAndStatus(
                        requesterId,
                        dto.getReceiverId(),
                        teaches,
                        learns,
                        ExchangeRequestStatus.PENDING
                )
                .orElseGet(() -> {

                    SkillExchangeRequest req = new SkillExchangeRequest();
                    req.setRequesterId(requesterId);
                    req.setReceiverId(dto.getReceiverId());
                    req.setRequesterTeaches(teaches);
                    req.setRequesterLearns(learns);
                    req.setMessage(dto.getMessage());
                    req.setStatus(ExchangeRequestStatus.PENDING);

                    return requestRepo.save(req);
                });
    }

    // ---------------------------------------------------
    // 2. Get received requests
    // ---------------------------------------------------
    public List<SkillExchangeRequest> getReceivedRequests(Long receiverId) {

        if (receiverId == null) {
            throw new IllegalArgumentException("receiverId is required");
        }

        return requestRepo.findByReceiverIdOrderByCreatedAtDesc(receiverId);
    }

    // ---------------------------------------------------
    // 3. Get sent requests
    // ---------------------------------------------------
    public List<SkillExchangeRequest> getSentRequests(Long requesterId) {

        if (requesterId == null) {
            throw new IllegalArgumentException("requesterId is required");
        }

        return requestRepo.findByRequesterIdOrderByCreatedAtDesc(requesterId);
    }

    // ---------------------------------------------------
    // 4. Accept request
    // ---------------------------------------------------
    public SkillExchangeRequest acceptRequest(Long requestId, Long receiverId) {

        if (requestId == null) {
            throw new IllegalArgumentException("requestId is required");
        }

        if (receiverId == null) {
            throw new IllegalArgumentException("receiverId is required");
        }

        SkillExchangeRequest req = requestRepo
                .findByIdAndReceiverId(requestId, receiverId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        if (req.getStatus() != ExchangeRequestStatus.PENDING) {
            throw new IllegalArgumentException("Request already processed");
        }

        req.setStatus(ExchangeRequestStatus.ACCEPTED);

        return requestRepo.save(req);
    }

    // ---------------------------------------------------
    // 5. Reject request
    // ---------------------------------------------------
    public SkillExchangeRequest rejectRequest(Long requestId, Long receiverId) {

        if (requestId == null) {
            throw new IllegalArgumentException("requestId is required");
        }

        if (receiverId == null) {
            throw new IllegalArgumentException("receiverId is required");
        }

        SkillExchangeRequest req = requestRepo
                .findByIdAndReceiverId(requestId, receiverId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        if (req.getStatus() != ExchangeRequestStatus.PENDING) {
            throw new IllegalArgumentException("Request already processed");
        }

        req.setStatus(ExchangeRequestStatus.REJECTED);

        return requestRepo.save(req);
    }

    // ---------------------------------------------------
    // 6. Cancel request
    // ---------------------------------------------------
    public SkillExchangeRequest cancelRequest(Long requestId, Long requesterId) {

        if (requestId == null) {
            throw new IllegalArgumentException("requestId is required");
        }

        if (requesterId == null) {
            throw new IllegalArgumentException("requesterId is required");
        }

        SkillExchangeRequest req = requestRepo
                .findByIdAndRequesterId(requestId, requesterId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        if (req.getStatus() != ExchangeRequestStatus.PENDING) {
            throw new IllegalArgumentException("Request already processed");
        }

        req.setStatus(ExchangeRequestStatus.CANCELLED);

        return requestRepo.save(req);
    }
}