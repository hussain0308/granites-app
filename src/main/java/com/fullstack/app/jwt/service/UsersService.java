package com.fullstack.app.jwt.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.fullstack.app.jwt.dto.UsersResponseDto;
import com.fullstack.app.jwt.dto.UsersUpdateRequestDto;
import com.fullstack.app.jwt.entity.User;
import com.fullstack.app.jwt.repository.OrderRepository;
import com.fullstack.app.jwt.repository.UserRepository;

import com.fullstack.app.jwt.repository.OrderItemRepository;

import jakarta.transaction.Transactional;

@Service
public class UsersService {

	private final UserRepository userRepository;
	private final OrderRepository orderRepository;
	private final OrderItemRepository orderItemRepository;

	public UsersService(
	        UserRepository userRepository,
	        OrderRepository orderRepository,
	        OrderItemRepository orderItemRepository) {

	    this.userRepository = userRepository;
	    this.orderRepository = orderRepository;
	    this.orderItemRepository = orderItemRepository;
	}
    // ✅ GET SINGLE USER
    public UsersResponseDto searchUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToDto(user);
    }

    // ✅ GET ALL USERS
    public List<UsersResponseDto> viewAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // ✅ UPDATE USER
    public UsersResponseDto updateUser(
            Long id,
            UsersUpdateRequestDto dto) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // update fields
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setAddress(dto.address());

        userRepository.save(user);

        return mapToDto(user);
    }

 
    @Transactional
 // ✅ DELETE USER
    public String deleteUser(Long id) {

        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }

        // 1. DELETE ORDER ITEMS FIRST
        orderItemRepository.deleteOrderItemsByUserId(id);

        // 2. DELETE ORDERS
        orderRepository.deleteOrdersByUserId(id);

        // 3. DELETE USER
        userRepository.deleteById(id);

        return "User deleted successfully";
    }
    
    // 🔁 COMMON MAPPING METHOD
    private UsersResponseDto mapToDto(User user) {

        return new UsersResponseDto(
                user.getId(),
                user.getName(),
                user.getUsername(),
                user.getRole(),
                user.getEmail(),
                user.getAddress()
        );
    }
}