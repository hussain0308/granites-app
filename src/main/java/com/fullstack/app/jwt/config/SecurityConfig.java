package com.fullstack.app.jwt.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fullstack.app.jwt.filter.JwtAuthenticationFilter;
import com.fullstack.app.jwt.service.CustomUserDetailsService;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            CustomUserDetailsService customUserDetailsService
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            AuthenticationProvider authenticationProvider
    ) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            .authorizeHttpRequests(auth -> auth

                    /* ================= PUBLIC FILES ================= */

                    .requestMatchers(
                            "/",
                            "/index.html",

                            "/signup.html",
                            "/login.html",
                            "/admin-login.html",

                            "/customer-home.html",
                            "/view-cart.html",
                            "/admin-home.html",
                            "/my-orders.html",

                            "/admin-users.html",
                            "/all-products-admin.html",
                            "/add-product.html",
                            "/edit-product.html",
                            "/view-product-admin.html",
                            "/admin-dashboard.html",
                            "/admin-orders.html",
                            
                            "/explore.html",
                            
                            "/css/**",
                            "/js/**",
                            "/images/**",

                            "/uploads/**"
                    ).permitAll()

                    /* ================= AUTH ================= */

                    .requestMatchers(
                            "/auth/**",
                            "/hello",
                            "/forgot-password.html",
                            "/auth/forgot-password",
                            "/auth/reset-password",
                            "/api/otp/**"
                    ).permitAll()

                    /* ================= PRODUCTS ================= */

                    .requestMatchers("/products/**").permitAll()

                    /* ================= CUSTOMER ================= */

                    .requestMatchers("/customer/cart/**").hasRole("USER")
                    .requestMatchers("/customer/**").hasRole("USER")

                    /* ================= ORDERS ================= */

                    .requestMatchers("/orders/place", "/orders/my").hasRole("USER")
                    .requestMatchers("/orders/update-status/**").hasRole("ADMIN")
                    .requestMatchers("/orders/cancel/**").hasRole("USER")
                    .requestMatchers("/orders/revenue", "/orders/count").hasRole("ADMIN")

                    /* ================= ADMIN ================= */

                    .requestMatchers("/admin/**").hasRole("ADMIN")
                    .requestMatchers("/admin/dashboard/**").hasRole("ADMIN")
                    .requestMatchers("/notifications/**").hasRole("ADMIN")

                    /* ================= USERS ================= */

                    .requestMatchers("/users/**").hasRole("ADMIN")

                    /* ================= DEFAULT ================= */

                    .anyRequest().authenticated()
            )

            .authenticationProvider(authenticationProvider)

            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
            )

            .formLogin(form -> form.disable())

            .httpBasic(basic -> basic.disable());

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(customUserDetailsService);

        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }
}