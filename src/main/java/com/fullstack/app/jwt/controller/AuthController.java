package com.fullstack.app.jwt.controller;

import jakarta.validation.Valid;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fullstack.app.jwt.dto.AuthResponse;
import com.fullstack.app.jwt.dto.LoginRequest;
import com.fullstack.app.jwt.dto.RegisterRequest;
import com.fullstack.app.jwt.dto.ResetPasswordRequest;
import com.fullstack.app.jwt.service.AuthService;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {

        String message = authService.register(request);

        // ❌ If user already exists
        if (message.equals("USER_ALREADY_EXISTS")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "User already exists"));
        }

        // ✅ Success
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Registration successful"));
    }
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
    
    @PutMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestBody ResetPasswordRequest request
    ) {

        authService.resetPassword(
                request.email(),
                request.newPassword()
        );

        return ResponseEntity.ok(
                "Password reset successful"
        );
    }
}
