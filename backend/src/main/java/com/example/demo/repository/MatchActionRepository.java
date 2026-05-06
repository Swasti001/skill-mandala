/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.springframework.data.jpa.repository.JpaRepository
 */
package com.example.demo.repository;

import com.example.demo.model.MatchAction;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

public interface MatchActionRepository
extends JpaRepository<MatchAction, Long> {
    public List<MatchAction> findByFromUserId(@Param("fromUserId") Long fromUserId);

    public Optional<MatchAction> findByFromUserIdAndToUserId(@Param("fromUserId") Long fromUserId, @Param("toUserId") Long toUserId);
}

