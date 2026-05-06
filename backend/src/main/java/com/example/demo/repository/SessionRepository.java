/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.springframework.data.jpa.repository.JpaRepository
 *  org.springframework.data.jpa.repository.Query
 */
package com.example.demo.repository;

import com.example.demo.model.Session;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SessionRepository
extends JpaRepository<Session, Long> {
    @Query(value="SELECT s FROM Session s WHERE s.userA = :userId OR s.userB = :userId ORDER BY s.createdAt DESC")
    public List<Session> findByUserId(@Param("userId") Long userId);

    @Query(value="SELECT COUNT(s) > 0 FROM Session s WHERE (s.userA = :u1 AND s.userB = :u2) OR (s.userA = :u2 AND s.userB = :u1)")
    public boolean existsByUsers(@Param("u1") Long u1, @Param("u2") Long u2);
}

