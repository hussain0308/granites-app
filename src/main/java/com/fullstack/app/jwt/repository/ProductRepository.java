package com.fullstack.app.jwt.repository;


import org.springframework.data.jpa.repository.JpaRepository;


import com.fullstack.app.jwt.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long>{
	
	boolean existsByName(String name);
	
	
}

