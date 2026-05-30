package com.fullstack.app.jwt.config;

import org.springframework.boot.CommandLineRunner;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.fullstack.app.jwt.entity.User;
import com.fullstack.app.jwt.repository.UserRepository;

@Configuration
public class AdminSeeder {

    @Bean
    public CommandLineRunner seedAdmin(UserRepository userRepository,
                                       PasswordEncoder passwordEncoder) {
        return args -> {

            String adminUsername = "admin";

            if (!userRepository.existsByUsername(adminUsername)) {

            	User admin = new User(
            	        "Admin",
            	        adminUsername,
            	        "admin@gmail.com",
            	        "System",
            	        "9999999999",
            	        passwordEncoder.encode("abdul1251"),
            	        "ADMIN"
            	);

                userRepository.save(admin);

                System.out.println("Admin user created: admin / abdul1251");
            }
        };
    }
}