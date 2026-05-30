package com.fullstack.app.jwt.dto;

public record AuthResponse(
        String token,
        String tokenType,
        String username,
        String role
) {
}