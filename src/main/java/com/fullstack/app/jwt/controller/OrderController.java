package com.fullstack.app.jwt.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fullstack.app.jwt.dto.OrderRequestDto;
import com.fullstack.app.jwt.dto.OrderResponseDto;
import com.fullstack.app.jwt.service.OrderService;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // 🛒 PLACE ORDER
    @PostMapping
    public ResponseEntity<OrderResponseDto> placeOrder(
            @RequestBody OrderRequestDto request,
            @RequestHeader("Authorization") String token) {

        return ResponseEntity.ok(orderService.placeOrder(request, token));
    }

    // 📦 GET ALL ORDERS (ADMIN)
    @GetMapping
    public ResponseEntity<List<OrderResponseDto>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // 👤 MY ORDERS
    @GetMapping("/my")
    public ResponseEntity<List<OrderResponseDto>> getMyOrders(
            @RequestHeader("Authorization") String token) {

        return ResponseEntity.ok(orderService.getMyOrders(token));
    }

    // 💰 REVENUE
    @GetMapping("/revenue")
    public ResponseEntity<Double> getRevenue() {
        return ResponseEntity.ok(orderService.getTotalRevenue());
    }

    // 📊 COUNT
    @GetMapping("/count")
    public ResponseEntity<Long> getCount() {
        return ResponseEntity.ok(orderService.countOrders());
    }
    
    @PutMapping("/cancel/{id}")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id) {

        return ResponseEntity.ok(orderService.cancelOrder(id));

    }
    
    @PutMapping("/update-status/{id}")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }
}