package com.example.demo.messaging;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByConversationIdOrderByCreatedAtAsc(Long conversationId);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.conversationId = :convId AND m.senderId <> :userId AND m.read = false")
    long countUnread(@Param("convId") Long conversationId, @Param("userId") Long userId);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.senderId <> :userId AND m.read = false AND m.conversationId IN (SELECT c.id FROM Conversation c WHERE c.user1Id = :userId OR c.user2Id = :userId)")
    long countTotalUnread(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE Message m SET m.read = true WHERE m.conversationId = :convId AND m.senderId <> :userId AND m.read = false")
    void markAllAsRead(@Param("convId") Long conversationId, @Param("userId") Long userId);
}
