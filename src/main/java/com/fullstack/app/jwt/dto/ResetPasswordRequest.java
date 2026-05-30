package com.fullstack.app.jwt.dto;

public record ResetPasswordRequest(

        String email,

        String newPassword

) {
}