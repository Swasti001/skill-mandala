/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.springframework.data.jpa.repository.JpaRepository
 *  org.springframework.data.jpa.repository.Query
 *  org.springframework.stereotype.Repository
 */
package com.example.demo.repository;

import com.example.demo.model.Match;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchRepository
extends JpaRepository<Match, Long> {
    @Query(value="SELECT m FROM Match m WHERE (m.user1Id = :u1 AND m.user2Id = :u2) OR (m.user1Id = :u2 AND m.user2Id = :u1)")
    public Optional<Match> findByUsers(@Param("u1") Long u1, @Param("u2") Long u2);

    @Query(value="SELECT COUNT(m) > 0 FROM Match m WHERE (m.user1Id = :u1 AND m.user2Id = :u2) OR (m.user1Id = :u2 AND m.user2Id = :u1)")
    public boolean existsByUsers(@Param("u1") Long u1, @Param("u2") Long u2);

    @Query(value="SELECT COUNT(m) FROM Match m WHERE m.user1Id = :userId OR m.user2Id = :userId")
    public long countByUser(@Param("userId") Long userId);

    @Query(value="SELECT m FROM Match m WHERE m.user1Id = :userId OR m.user2Id = :userId")
    public List<Match> findAllByUserId(@Param("userId") Long userId);
}

