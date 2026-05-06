package com.example.demo.service;

import com.example.demo.model.Notification;
import com.example.demo.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getNotifications(Long userId) {
        return notificationRepository.findByReceiverIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByReceiverIdAndIsReadStatusFalse(userId);
    }

    @Transactional
    public void markAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setReadStatus(true);
            notificationRepository.save(n);
        });
    }

    @Transactional
    public void createNotification(String message, String type, Long senderId, Long receiverId) {
        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setType(type);
        notification.setSenderId(senderId);
        notification.setReceiverId(receiverId);
        notificationRepository.save(notification);
    }

    // For backward compatibility (matching existing code)
    @Transactional
    public void createNotification(Long receiverId, String message, String type) {
        createNotification(message, type, null, receiverId);
    }

    // Mock/Stub for sendEmail used in SessionService
    public void sendEmail(String to, String subject, String body) {
        System.out.println("[EMAIL] To: " + to + ", Subject: " + subject);
    }
}
