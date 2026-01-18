package com.example.demo.messaging;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("SELECT c FROM Conversation c WHERE c.user1Id = :userId OR c.user2Id = :userId ORDER BY c.lastMessageAt DESC NULLS LAST")
    List<Conversation> findAllByUserId(@Param("userId") Long userId);

    @Query("SELECT c FROM Conversation c WHERE (c.user1Id = :userA AND c.user2Id = :userB) OR (c.user1Id = :userB AND c.user2Id = :userA)")
    Optional<Conversation> findByUserPair(@Param("userA") Long userA, @Param("userB") Long userB);
}
