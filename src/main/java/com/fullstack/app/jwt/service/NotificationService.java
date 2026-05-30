package com.fullstack.app.jwt.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fullstack.app.jwt.entity.Notification;
import com.fullstack.app.jwt.repository.NotificationRepository;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public void createNotification(String message) {

        Notification notification = new Notification(message);

        notificationRepository.save(notification);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAllByOrderByCreatedAtDesc();
    }

    public long getUnreadCount() {
        return notificationRepository.countByIsReadFalse();
    }

    public void markAsRead(Long id) {

        Notification notification =
                notificationRepository.findById(id).orElseThrow();

        notification.setRead(true);

        notificationRepository.save(notification);
    }
    
    
}
