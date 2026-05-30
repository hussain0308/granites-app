package com.fullstack.app.jwt.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.fullstack.app.jwt.dto.UsersResponseDto;
import com.fullstack.app.jwt.dto.UsersUpdateRequestDto;
import com.fullstack.app.jwt.service.UsersService;

@RestController
@RequestMapping("/users")
public class UsersController {

    private final UsersService service;

    public UsersController(UsersService service) {
        this.service = service;
    }

    // ✅ VIEW SINGLE USER
    @GetMapping("/{id}")
    public UsersResponseDto getUser(@PathVariable Long id) {
        return service.searchUser(id);
    }

    // ✅ VIEW ALL USERS
    @GetMapping
    public List<UsersResponseDto> getAllUsers() {
        return service.viewAllUsers();
    }

    // ✅ UPDATE USER
    @PutMapping("/{id}")
    public UsersResponseDto updateUser(
            @PathVariable Long id,
            @RequestBody UsersUpdateRequestDto userDto) {

        return service.updateUser(id, userDto);
    }

    // ✅ DELETE USER
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        return service.deleteUser(id);
    }
}