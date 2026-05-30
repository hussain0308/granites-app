package com.fullstack.app.jwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fullstack.app.jwt.entity.Order;

import jakarta.transaction.Transactional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // =========================
    // TOTAL REVENUE
    // =========================
    @Query("""
        SELECT COALESCE(SUM(o.totalAmount), 0)
        FROM Order o
    """)
    double getTotalRevenue();


    // =========================
    // MY ORDERS
    // =========================
    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items WHERE o.user.id = :userId")
    List<Order> findByUserId(@Param("userId") Long userId);


    // =========================
    // NEWEST ORDERS FIRST
    // =========================
    List<Order> findAllByOrderByOrderDateDesc();


    // =========================
    // DELETE USER ORDERS
    // =========================
    @Transactional
    @Modifying
    @Query("DELETE FROM Order o WHERE o.user.id = :userId")
    void deleteOrdersByUserId(@Param("userId") Long userId);
}