# 🪨 Granites App

A full-stack granite and stone e-commerce web application built with **Spring Boot**, **Spring Security**, **JWT authentication**, **PostgreSQL**, and a responsive web interface.

The application provides separate experiences for **customers and administrators**, allowing customers to browse granite products, manage their cart, place and track orders, while administrators can manage products, users, and orders through an admin dashboard.

## 🚀 Features

### 👤 Customer Features

* User registration and login
* JWT-based authentication and authorization
* Secure customer authentication
* Browse available granite products
* View detailed product information
* Product image support
* Add products to cart
* Update cart items
* Remove products from cart
* Place orders
* View previous orders
* Track order information
* User account management
* OTP-based verification functionality
* Forgot-password functionality
* Email/notification support

### 🔐 Authentication & Security

* Spring Security integration
* JWT-based authentication
* Role-based access control
* Protected customer and admin functionality
* Custom user details service
* JWT request filtering
* Secure password handling
* OTP-based authentication/recovery functionality

### 🛠️ Admin Features

Administrators have a dedicated dashboard for managing the application.

* Admin login
* Admin dashboard
* Add new products
* Edit existing products
* Delete/manage products
* View all products
* Upload product images
* View customer orders
* Manage orders
* View registered users
* Manage application users
* Admin-specific product and order management

### 🛒 Shopping & Order Management

The application implements an e-commerce workflow:

```text
Customer
   ↓
Browse Products
   ↓
View Product
   ↓
Add to Cart
   ↓
Manage Cart
   ↓
Place Order
   ↓
View Orders
```

The backend contains dedicated entities and services for products, cart items, orders, and order items.

## 🏗️ Application Architecture

The project follows a layered Spring Boot architecture:

```text
                    ┌─────────────────────┐
                    │      Frontend       │
                    │ HTML / CSS / JS     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Controllers      │
                    │ Request Handling    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Services       │
                    │ Business Logic      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Repositories     │
                    │ Spring Data JPA     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    PostgreSQL       │
                    │      Database       │
                    └─────────────────────┘
```

Authentication is handled separately through the JWT security layer.

## 🧰 Technology Stack

### Backend

* **Java 17**
* **Spring Boot**
* Spring Web
* Spring Data JPA
* Spring Security
* Spring Validation
* Thymeleaf
* Lombok

### Authentication & Security

* JWT
* Spring Security
* Custom UserDetailsService
* Role-based authorization

### Database

* **PostgreSQL**
* Hibernate / JPA

### Frontend

* HTML5
* CSS3
* JavaScript
* Thymeleaf

### Image & Media Management

* Cloudinary
* Multipart file upload support

### Email & Notifications

* Spring Boot Mail
* OTP functionality
* Application notifications

### Deployment / DevOps

* Docker
* Maven
* Spring Boot executable JAR

## 📂 Project Structure

```text
granites-app/
│
├── .mvn/
│   └── wrapper/
│
├── app/
│   └── uploads/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── fullstack/
│   │   │           └── app/
│   │   │               │
│   │   │               ├── controllerendpoints/
│   │   │               │   └── PageController.java
│   │   │               │
│   │   │               ├── jwt/
│   │   │               │   ├── config/
│   │   │               │   ├── controller/
│   │   │               │   ├── dto/
│   │   │               │   ├── entity/
│   │   │               │   ├── filter/
│   │   │               │   ├── repository/
│   │   │               │   └── service/
│   │   │               │
│   │   │               └── AppApplication.java
│   │   │
│   │   └── resources/
│   │       ├── static/
│   │       │   ├── css/
│   │       │   ├── js/
│   │       │   ├── index.html
│   │       │   ├── login.html
│   │       │   ├── signup.html
│   │       │   ├── customer-home.html
│   │       │   ├── explore.html
│   │       │   ├── view-cart.html
│   │       │   ├── my-orders.html
│   │       │   ├── admin-login.html
│   │       │   ├── admin-home.html
│   │       │   ├── admin-dashboard.html
│   │       │   ├── add-product.html
│   │       │   ├── edit-product.html
│   │       │   ├── admin-orders.html
│   │       │   ├── admin-users.html
│   │       │   └── ...
│   │       │
│   │       └── application.properties
│   │
│   └── test/
│
├── Dockerfile
├── pom.xml
├── mvnw
├── mvnw.cmd
├── .gitignore
└── .gitattributes
```

## 🔑 Main Backend Components

The application contains dedicated controllers for major business operations.

```text
controller/
│
├── AdminDashboardController
├── AdminProductController
├── AuthController
├── CartController
├── ImageUploadController
├── NotificationController
├── OrderController
├── OtpController
├── ProductController
└── UsersController
```

Business logic is separated into service classes such as:

```text
service/
│
├── AuthService
├── CartService
├── CustomUserDetailsService
├── JwtService
├── NotificationService
├── OrderService
├── OtpService
├── ProductService
└── UsersService
```

The application also uses entities representing the major business objects:

```text
entity/
│
├── User
├── Product
├── ProductImage
├── CartItem
├── Order
├── OrderItem
└── Notification
```

This separation helps keep request handling, business logic, authentication, and persistence responsibilities organized.

## 🔐 Authentication Flow

The application uses JWT authentication with Spring Security.

```text
User Login
    ↓
AuthController
    ↓
Authentication Service
    ↓
Credentials Validation
    ↓
JWT Token Generated
    ↓
Client Stores Token
    ↓
Authenticated Requests
    ↓
JWT Filter
    ↓
Security Context
    ↓
Protected Resource
```

The project contains dedicated JWT configuration, controller, DTO, entity, filter, repository, and service packages.

## 🗄️ Database

The application uses **PostgreSQL** with **Spring Data JPA/Hibernate**.

The main database entities include:

* Users
* Products
* Product Images
* Cart Items
* Orders
* Order Items
* Notifications

Configure your PostgreSQL database connection in:

```text
src/main/resources/application.properties
```

> **Important:** Never commit real database passwords, JWT secrets, Cloudinary credentials, email credentials, or other sensitive configuration values to GitHub.

Use environment variables or another secure configuration mechanism for production deployments.

## ☁️ Cloudinary

Product image management is integrated with **Cloudinary**.

The application includes:

* Product image upload functionality
* Product image handling
* Cloud-based image storage support

Cloudinary credentials should be supplied through environment variables or secure application configuration rather than being committed to the repository.

## 📧 Email & OTP

The application includes email-related functionality through Spring Boot Mail and provides OTP-related functionality for authentication/recovery workflows.

Typical flow:

```text
User Request
     ↓
OTP Generated
     ↓
OTP Sent
     ↓
User Enters OTP
     ↓
OTP Validated
     ↓
Requested Action Completed
```

## 🐳 Running with Docker

The repository includes a multi-stage Dockerfile.

The Docker build:

1. Uses Maven with Eclipse Temurin 21 to build the application.
2. Packages the Spring Boot application.
3. Creates a runtime image using Eclipse Temurin 21.
4. Exposes port `8080`.
5. Starts the generated Spring Boot JAR.

### Build the Docker image

```bash
docker build -t granites-app .
```

### Run the container

```bash
docker run -p 8080:8080 granites-app
```

The application will then be available at:

```text
http://localhost:8080
```

> The application also requires the appropriate PostgreSQL and external-service configuration to be available when running in Docker.

## 💻 Running Locally Without Docker

### 1. Clone the repository

```bash
git clone https://github.com/hussain0308/granites-app.git
```

### 2. Navigate to the project

```bash
cd granites-app
```

### 3. Configure PostgreSQL

Create a PostgreSQL database and update the database configuration in:

```text
src/main/resources/application.properties
```

Also configure the required JWT, Cloudinary, and email settings.

### 4. Build the application

On Windows:

```bash
mvnw.cmd clean package
```

On Linux/macOS:

```bash
./mvnw clean package
```

### 5. Run the application

On Windows:

```bash
mvnw.cmd spring-boot:run
```

On Linux/macOS:

```bash
./mvnw spring-boot:run
```

Or run the generated JAR:

```bash
java -jar target/*.jar
```

### 6. Open the application

```text
http://localhost:8080
```

## 🧪 Testing

The project includes Spring Boot testing and Spring Security testing dependencies.

Run the test suite with:

```bash
mvnw.cmd test
```

or on Linux/macOS:

```bash
./mvnw test
```

## 📱 Application Pages

### Customer

* Home
* Login
* Signup
* Customer Home
* Explore Products
* Product Details
* Cart
* Orders
* Forgot Password

### Admin

* Admin Login
* Admin Home
* Admin Dashboard
* Add Product
* Edit Product
* All Products
* Product Management
* Orders Management
* User Management

## 🔄 Typical Customer Workflow

```text
                  ┌───────────────┐
                  │    Signup     │
                  └───────┬───────┘
                          ↓
                  ┌───────────────┐
                  │     Login     │
                  └───────┬───────┘
                          ↓
                  ┌───────────────┐
                  │Browse Products│
                  └───────┬───────┘
                          ↓
                  ┌───────────────┐
                  │ View Product  │
                  └───────┬───────┘
                          ↓
                  ┌───────────────┐
                  │  Add to Cart  │
                  └───────┬───────┘
                          ↓
                  ┌───────────────┐
                  │ View / Update │
                  │     Cart      │
                  └───────┬───────┘
                          ↓
                  ┌───────────────┐
                  │ Place Order   │
                  └───────┬───────┘
                          ↓
                  ┌───────────────┐
                  │ View Orders   │
                  └───────────────┘
```

## 🔄 Admin Workflow

```text
Admin Login
    ↓
Admin Dashboard
    ├── Product Management
    │      ├── Add Product
    │      ├── Edit Product
    │      ├── View Products
    │      └── Upload Images
    │
    ├── Order Management
    │      └── View / Manage Orders
    │
    └── User Management
           └── View / Manage Users
```

## 🎯 Project Goals

The main goals of this project are to:

* Build a practical full-stack e-commerce application
* Digitize granite product browsing and purchasing workflows
* Implement secure authentication and authorization
* Practice Spring Boot backend development
* Work with relational database persistence using JPA
* Implement shopping cart and order management
* Build separate customer and administrator workflows
* Implement product image management
* Containerize the application using Docker

## 📚 What This Project Demonstrates

This project demonstrates practical experience with:

* Java backend development
* Spring Boot application development
* REST/web controller design
* Spring Data JPA
* Hibernate
* PostgreSQL
* Spring Security
* JWT authentication
* Role-based authorization
* DTO-based application design
* Service/repository architecture
* File and image upload handling
* Cloudinary integration
* Email and OTP workflows
* HTML/CSS/JavaScript frontend development
* Docker containerization
* Maven project management

## 🔮 Future Enhancements

Potential improvements for future versions include:

* Online payment gateway integration
* Advanced product search and filtering
* Product categories and sorting
* Product reviews and ratings
* Real-time order status updates
* Inventory management
* Improved mobile responsiveness
* Production-ready cloud deployment
* Automated CI/CD pipeline
* Centralized logging and monitoring
* Automated API documentation using OpenAPI/Swagger

## 📌 Project Status

**Status:** Active development / portfolio project

The project is designed as a practical full-stack application demonstrating the development of an e-commerce platform using Java and Spring Boot.

## 👨‍💻 Author

**Hussain Basha Mulla**

GitHub: [@hussain0308](https://github.com/hussain0308)

## 📄 License

This project is intended primarily as a learning and portfolio project.

---

⭐ If you find this project useful or interesting, consider giving the repository a star!
