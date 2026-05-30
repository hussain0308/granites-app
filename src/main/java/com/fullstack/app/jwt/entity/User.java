	package com.fullstack.app.jwt.entity;
	
	import jakarta.persistence.Column;
	
	import jakarta.persistence.Entity;
	import jakarta.persistence.GeneratedValue;
	import jakarta.persistence.GenerationType;
	import jakarta.persistence.Id;
	import jakarta.persistence.Table;
	
	@Entity
	@Table(name = "users")
	public class User {
		
		@Id
		@GeneratedValue(strategy = GenerationType.IDENTITY)
		private Long id;
		
		@Column(nullable = false)
		private String name;
		
		@Column(nullable = false, unique = true)
		private String username;
		
		@Column(nullable = false)
		private String password;
		
		@Column(nullable = false)
		private String role;
		
		
		@Column(nullable = false, unique = true)
		private String email;
		
		@Column(nullable = false)
		private String address;
		
		@Column(nullable = false, unique = true)
		private String phoneNumber;
	
		public User() {
			super();
			// TODO Auto-generated constructor stub
		}
	
		public User(String name,
	            String username,
	            String email,
	            String address,
	            String phoneNumber,
	            String password,
	            String role) {

	    this.name = name;
	    this.username = username;
	    this.email = email;
	    this.address = address;
	    this.phoneNumber = phoneNumber;
	    this.password = password;
	    this.role = role;
	}
		
		public Long getId() {
		    return id;
		}
	
		public String getName() {
			return name;
		}
	
		public void setName(String name) {
			this.name = name;
		}
	
		public String getUsername() {
			return username;
		}
	
		public void setUsername(String username) {
			this.username = username;
		}
	
		public String getPassword() {
			return password;
		}
	
		public void setPassword(String password) {
			this.password = password;
		}
	
		public String getRole() {
			return role;
		}
	
		public void setRole(String role) {
			this.role = role;
		}
	
		public String getEmail() {
			return email;
		}
	
		public void setEmail(String email) {
			this.email = email;
		}
	
		public String getAddress() {
			return address;
		}
	
		public void setAddress(String address) {
			this.address = address;
		}
		
		public String getPhoneNumber() {
		    return phoneNumber;
		}

		public void setPhoneNumber(String phoneNumber) {
		    this.phoneNumber = phoneNumber;
		}
	
			
	
	}