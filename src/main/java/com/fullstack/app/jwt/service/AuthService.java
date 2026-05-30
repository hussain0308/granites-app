package com.fullstack.app.jwt.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fullstack.app.jwt.dto.AuthResponse;
import com.fullstack.app.jwt.dto.LoginRequest;
import com.fullstack.app.jwt.dto.RegisterRequest;
import com.fullstack.app.jwt.entity.User;
import com.fullstack.app.jwt.repository.UserRepository;

@Service
public class AuthService {
	
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final JwtService jwtService;
	
	
	
	public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
			AuthenticationManager authenticationManager, JwtService jwtService) {
		super();
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.authenticationManager = authenticationManager;
		this.jwtService = jwtService;
	}
	
	
	public String register(RegisterRequest request) {

	    if (userRepository.existsByUsername(request.username())){
	        return "USER_ALREADY_EXISTS";
	    }
	    
	    if (userRepository.existsByEmail(request.email())) {
	        return "EMAIL_ALREADY_EXISTS";
	    }

	    User user = new User(
	            request.name(),
	            request.username(),
	            request.email(),
	            request.address(),
	            request.phoneNumber(),
	            passwordEncoder.encode(request.password()),
	            "USER"
	    );

	    userRepository.save(user);

	    return "REGISTER_SUCCESS";
	}
	
	
	public AuthResponse login(LoginRequest request) {
		
		authenticationManager.authenticate(
				
				new UsernamePasswordAuthenticationToken(
						request.username(),
						request.password()
						)
				
				);
		
			User user = userRepository.findByUsername(request.username())
					.orElseThrow(()-> new RuntimeException("User not found"));
			
			
			String token = jwtService.generateToken(
					
					org.springframework.security.core.userdetails.User.builder()
							.username(user.getUsername())
							.password(user.getPassword())
							.authorities("ROLE_" + user.getRole())
							.build()
					
					);
			return new AuthResponse(token, "Bearer", user.getUsername(), user.getRole());
	}
	
	
	public String resetPassword(
	        String email,
	        String newPassword
	) {

	    User user = userRepository
	            .findByEmail(email)
	            .orElseThrow(() ->
	                    new RuntimeException("User not found"));

	    user.setPassword(
	            passwordEncoder.encode(newPassword)
	    );

	    userRepository.save(user);

	    return "PASSWORD_RESET_SUCCESS";
	}
	
	

}
