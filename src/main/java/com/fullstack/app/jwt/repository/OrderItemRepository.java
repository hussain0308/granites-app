package com.fullstack.app.jwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fullstack.app.jwt.entity.OrderItem;

import jakarta.transaction.Transactional;

public interface OrderItemRepository
        extends JpaRepository<OrderItem, Long> {

    // DELETE ORDER ITEMS USING USER ID
    @Modifying
    @Transactional
    @Query("""
        DELETE FROM OrderItem oi
        WHERE oi.order.user.id = :userId
    """)
    void deleteOrderItemsByUserId(@Param("userId") Long userId);
}