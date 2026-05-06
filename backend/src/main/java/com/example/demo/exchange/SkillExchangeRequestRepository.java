package com.example.demo.exchange;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SkillExchangeRequestRepository extends JpaRepository<SkillExchangeRequest, Long> {

    // Get requests received by a user
    List<SkillExchangeRequest> findByReceiverIdOrderByCreatedAtDesc(Long receiverId);

    // Dashboard metrics
    long countByStatus(ExchangeRequestStatus status);
    List<SkillExchangeRequest> findTop5ByOrderByCreatedAtDesc();

    // Get requests sent by a user
    List<SkillExchangeRequest> findByRequesterIdOrderByCreatedAtDesc(Long requesterId);

    // Prevent duplicate pending requests
    Optional<SkillExchangeRequest> findFirstByRequesterIdAndReceiverIdAndRequesterTeachesAndRequesterLearnsAndStatus(
            Long requesterId,
            Long receiverId,
            String requesterTeaches,
            String requesterLearns,
            ExchangeRequestStatus status
    );

    // Used when receiver accepts or rejects
    Optional<SkillExchangeRequest> findByIdAndReceiverId(Long id, Long receiverId);

    // Used when sender cancels
    Optional<SkillExchangeRequest> findByIdAndRequesterId(Long id, Long requesterId);
}