package com.fullstack.app.jwt.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fullstack.app.jwt.service.OtpService;

@RestController
@RequestMapping("/api/otp")
public class OtpController {

    private final OtpService otpService;

    public OtpController(
            OtpService otpService
    ) {
        this.otpService = otpService;
    }

    // =========================
    // SEND OTP
    // =========================
 
    @PostMapping("/send")
    public ResponseEntity<String> sendOtp(@RequestParam String email) {

        try {
            otpService.sendOtp(email);
            return ResponseEntity.ok("OTP sent successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // =========================
    // VERIFY OTP
    // =========================
    @PostMapping("/verify")
    public ResponseEntity<String> verifyOtp(
            @RequestParam String email,
            @RequestParam String otp
    ) {

        boolean valid =
                otpService.verifyOtp(
                        email,
                        otp
                );

        if (valid) {

            return ResponseEntity.ok(
                    "OTP verified successfully"
            );
        }

        return ResponseEntity
                .badRequest()
                .body("Invalid or expired OTP");
    }
}