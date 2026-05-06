/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.springframework.data.jpa.repository.JpaRepository
 */
package com.example.demo.repository;

import com.example.demo.model.ZoomMeeting;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ZoomMeetingRepository
extends JpaRepository<ZoomMeeting, Long> {
    public Optional<ZoomMeeting> findBySessionId(Long var1);

    public Optional<ZoomMeeting> findBySessionIdAndStatus(Long var1, ZoomMeeting.ZoomStatus var2);
}

