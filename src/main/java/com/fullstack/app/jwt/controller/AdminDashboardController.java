package com.fullstack.app.jwt.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fullstack.app.jwt.dto.DashboardStats;
import com.fullstack.app.jwt.entity.Order;
import com.fullstack.app.jwt.repository.ProductRepository;
import com.fullstack.app.jwt.repository.UserRepository;
import com.fullstack.app.jwt.repository.OrderRepository;

@RestController
@RequestMapping("/admin/dashboard")
@CrossOrigin("*")
public class AdminDashboardController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public AdminDashboardController(
            UserRepository userRepository,
            ProductRepository productRepository,
            OrderRepository orderRepository
    ) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    
    // =========================
    // DASHBOARD STATS
    // =========================
    
    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getStats() {

        long users = userRepository.count();
        long products = productRepository.count();
        long orders = orderRepository.count();

        double revenue = orderRepository.getTotalRevenue();

        DashboardStats stats = new DashboardStats(
                users,
                products,
                orders,
                revenue
        );

        return ResponseEntity.ok(stats);
    }


    // =========================
    // GET ALL ORDERS
    // =========================
    
    @GetMapping("/orders")
    public List<Order> getAllOrders() {

        return orderRepository.findAll();
    }
}