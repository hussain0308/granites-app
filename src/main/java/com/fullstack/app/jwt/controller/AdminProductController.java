package com.fullstack.app.jwt.controller;

import java.util.List;

import java.util.Map;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fullstack.app.jwt.dto.ProductRequest;
import com.fullstack.app.jwt.dto.ProductResponse;
import com.fullstack.app.jwt.service.ProductService;

@RestController
@RequestMapping("/admin/products")
public class AdminProductController {

    private final ProductService productService;

    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<?> addProduct(@Valid @RequestBody ProductRequest request) {
        try {
            ProductResponse response = productService.addProduct(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalStateException ex) {

            if (ex.getMessage().equals("PRODUCT_ALREADY_EXISTS")) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(Map.of("message", "Product already exists"));
            }

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Something went wrong"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {

        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Long id) {
        String message = productService.deleteProduct(id);
        return ResponseEntity.ok(Map.of("message", message));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // ✅ FIXED
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
}