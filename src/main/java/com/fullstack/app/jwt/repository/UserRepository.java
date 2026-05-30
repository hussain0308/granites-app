package com.fullstack.app.jwt.repository;

import com.fullstack.app.jwt.entity.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;



public interface UserRepository  extends JpaRepository<User, Long>{

	
	Optional<User> findByUsername(String username);
	
	
	boolean existsByUsername(String username);
	
	
	boolean existsByEmail(String email);
	
	
	boolean existsById(Long id);

	Optional<User> findByEmail(String email);


}
