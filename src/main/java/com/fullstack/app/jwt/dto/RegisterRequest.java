package com.fullstack.app.jwt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank String name,
        @NotBlank String username,
        
        @NotBlank
        @Pattern(
                regexp = "^[a-zA-Z0-9._%+-]+@gmail\\.com$",
                message = "Only Gmail addresses are allowed"
            )
        String email,
        
        @NotBlank String address,
        @NotBlank @Size(min = 10)String phoneNumber,
        @NotBlank @Size(min = 6) String password
        
) {
}
