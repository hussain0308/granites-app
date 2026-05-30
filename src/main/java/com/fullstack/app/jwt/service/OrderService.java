package com.fullstack.app.jwt.service;

import java.time.LocalDateTime;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.fullstack.app.jwt.dto.OrderItemDto;
import com.fullstack.app.jwt.dto.OrderRequestDto;
import com.fullstack.app.jwt.dto.OrderResponseDto;
import com.fullstack.app.jwt.entity.Order;
import com.fullstack.app.jwt.entity.OrderItem;
import com.fullstack.app.jwt.entity.User;
import com.fullstack.app.jwt.repository.OrderRepository;
import com.fullstack.app.jwt.repository.UserRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final NotificationService notificationService;

    public OrderService(OrderRepository orderRepository,
            UserRepository userRepository,
            JwtService jwtService,
            NotificationService notificationService) {

this.orderRepository = orderRepository;
this.userRepository = userRepository;
this.jwtService = jwtService;
this.notificationService = notificationService;
}

    public OrderResponseDto placeOrder(OrderRequestDto request, String token) {

        token = token.substring(7);
        String username = jwtService.extractUsername(token);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setTotalAmount(request.getTotalAmount()); // BigDecimal FIX
        order.setStatus("PLACED");
        order.setOrderDate(LocalDateTime.now());

        List<OrderItem> items = request.getItems().stream().map(i -> {

            OrderItem item = new OrderItem();
            item.setProductId(i.getProductId());
            item.setProductName(i.getProductName());
            item.setQuantity(i.getQuantity());
            item.setPrice(i.getPrice()); // BigDecimal FIX
            item.setOrder(order);

            return item;

        }).toList();

        order.setItems(items);

        Order saved = orderRepository.save(order);
        
        notificationService.createNotification(
                "🛒 New Order #" + saved.getId()
                + " placed by " + username
                + " | Amount: ₹" + saved.getTotalAmount()
        );

        OrderResponseDto response = new OrderResponseDto();
        response.setId(saved.getId());
        response.setUserId(saved.getUser().getId());
        response.setTotalAmount(saved.getTotalAmount());
        response.setStatus(saved.getStatus());
        response.setOrderDate(saved.getOrderDate());

        response.setItems(saved.getItems().stream().map(i -> {

            OrderItemDto dto = new OrderItemDto();
            dto.setProductId(i.getProductId());
            dto.setProductName(i.getProductName());
            dto.setQuantity(i.getQuantity());
            dto.setPrice(i.getPrice());

            return dto;

        }).toList());

        return response;
    }

    // 📦 ALL ORDERS
    public List<OrderResponseDto> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc().stream().map(o -> {

            OrderResponseDto dto = new OrderResponseDto();
            dto.setId(o.getId());
            dto.setUserId(o.getUser().getId());
            dto.setTotalAmount(o.getTotalAmount());
            dto.setStatus(o.getStatus());
            dto.setOrderDate(o.getOrderDate());

            dto.setItems(
                    o.getItems().stream().map(i -> {
                        OrderItemDto item = new OrderItemDto();
                        item.setProductId(i.getProductId());
                        item.setProductName(i.getProductName());
                        item.setQuantity(i.getQuantity());
                        item.setPrice(i.getPrice());
                        return item;
                    }).collect(Collectors.toList())
            );

            return dto;

        }).collect(Collectors.toList());
    }

    // 💰 REVENUE
    public double getTotalRevenue() {
        return orderRepository.getTotalRevenue();
    }

    // 📊 COUNT
    public long countOrders() {
        return orderRepository.count();
    }

    // 👤 MY ORDERS
    public List<OrderResponseDto> getMyOrders(String token) {

        token = token.substring(7);
        String username = jwtService.extractUsername(token);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderRepository.findByUserId(user.getId())
                .stream()
                .map(order -> {

                    OrderResponseDto dto = new OrderResponseDto();
                    dto.setId(order.getId());
                    dto.setUserId(order.getUser().getId());
                    dto.setTotalAmount(order.getTotalAmount());
                    dto.setStatus(order.getStatus());
                    dto.setOrderDate(order.getOrderDate());

                    dto.setItems(
                            order.getItems().stream().map(i -> {
                                OrderItemDto item = new OrderItemDto();
                                item.setProductId(i.getProductId());
                                item.setProductName(i.getProductName());
                                item.setQuantity(i.getQuantity());
                                item.setPrice(i.getPrice());
                                return item;
                            }).collect(Collectors.toList())
                    );

                    return dto;
                })
                .collect(Collectors.toList());
    }
    
    
    public String cancelOrder(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if(!order.getStatus().equals("PLACED")) {
            return "Only PLACED orders can be cancelled";
        }

        order.setStatus("CANCELLED");

        orderRepository.save(order);

        return "Order Cancelled Successfully";
    }
    
    public String updateStatus(Long orderId, String status) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // prevent duplicate updates
        if (order.getStatus().equals(status)) {
            return "No change in status";
        }

        order.setStatus(status);
        orderRepository.save(order);

        // ❌ NO NOTIFICATION CREATED HERE

        return "Order status updated to " + status;
    }
}