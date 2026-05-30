package com.fullstack.app.jwt.dto;

public record UsersUpdateRequestDto(
	    String name,
	    String email,
	    String address
	) {}