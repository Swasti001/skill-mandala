package com.example.demo.repository;

import com.example.demo.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByToUserIdAndTargetRole(Long toUserId, Feedback.FeedbackTargetRole targetRole);
    Optional<Feedback> findBySessionIdAndFromUserId(Long sessionId, Long fromUserId);
    boolean existsBySessionIdAndFromUserId(Long sessionId, Long fromUserId);
}
