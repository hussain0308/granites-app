package com.fullstack.app.jwt.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fullstack.app.jwt.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findAllByOrderByCreatedAtDesc();


    long countByIsReadFalse();
    
    
}
