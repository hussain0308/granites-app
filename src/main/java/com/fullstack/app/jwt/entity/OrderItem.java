	package com.fullstack.app.jwt.entity;
	
	import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
	
	@Entity
	@Table(name = "order_items")
	public class OrderItem {

	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private Long productId;
	    private String productName;
	    private int quantity;
	    private BigDecimal price;

	    @ManyToOne
	    @JoinColumn(name = "order_id")
	    @JsonBackReference
	    private Order order;
	    // getters + setters ONLY
	
	   
	    public Long getId() {
	        return id;
	    }
	
	    public Long getProductId() {
	        return productId;
	    }
	
	    public String getProductName() {
	        return productName;
	    }
	
	    public int getQuantity() {
	        return quantity;
	    }
	
	    public BigDecimal getPrice() {
	        return price;
	    }
	
	    public Order getOrder() {
	        return order;
	    }
	    
	    public void setProductId(Long productId) {
	        this.productId = productId;
	    }

	    public void setProductName(String productName) {
	        this.productName = productName;
	    }

	    public void setQuantity(int quantity) {
	        this.quantity = quantity;
	    }

	    public void setPrice(BigDecimal price) {
	        this.price = price;
	    }

	    
	    public void setOrder(Order order) {
	        this.order = order;
	    }
	}